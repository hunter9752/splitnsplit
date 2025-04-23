// DOM Elements
const dealsContainer = document.getElementById('deals-container');
const searchInput = document.getElementById('search-deals');
const categoryFilter = document.getElementById('category-filter');
const sortSelect = document.getElementById('sort-deals');
const loadingSpinner = document.getElementById('loading-spinner');

// API URL
const API_URL = 'http://localhost:5001/api';

// Global variables
let allDeals = [];
let filteredDeals = [];

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadDeals();
    setupEventListeners();
});

// Load deals from API
async function loadDeals() {
    try {
        if (loadingSpinner) {
            loadingSpinner.style.display = 'block';
        }

        const response = await fetch(`${API_URL}/deals`);
        
        if (!response.ok) {
            throw new Error('Failed to load deals');
        }

        const data = await response.json();
        allDeals = data;
        filteredDeals = [...allDeals];

        // Update UI
        renderDeals(filteredDeals);
        updateCategoryFilter();

    } catch (error) {
        console.error('Error loading deals:', error);
        showError('Failed to load deals. Please try again.');
    } finally {
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }
    }
}

// Render deals in the UI
function renderDeals(deals) {
    if (!dealsContainer) return;

    if (deals.length === 0) {
        dealsContainer.innerHTML = `
            <div class="no-deals">
                <h3>No deals found</h3>
                <p>Try adjusting your filters or search terms</p>
            </div>
        `;
        return;
    }

    dealsContainer.innerHTML = deals.map(deal => `
        <div class="deal-card">
            <div class="deal-image">
                <img src="${deal.image}" alt="${deal.brand}">
            </div>
            <div class="deal-content">
                <div class="deal-header">
                    <h3>${deal.title}</h3>
                    <span class="category-badge">${deal.category}</span>
                </div>
                <p class="deal-description">${deal.description}</p>
                
                <div class="deal-stats">
                    <div class="stat">
                        <i class="fas fa-users"></i>
                        <span>${deal.stats.activeSplits} active splits</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-star"></i>
                        <span>${deal.stats.rating} rating</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-piggy-bank"></i>
                        <span>₹${deal.stats.totalSaved} saved</span>
                    </div>
                </div>

                ${renderPlans(deal.plans)}

                <div class="deal-actions">
                    <a href="join-deal.html?id=${deal._id}" class="btn btn-primary">Join Split</a>
                    <button class="btn btn-outline" onclick="showDealDetails('${deal._id}')">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Render plans section
function renderPlans(plans) {
    if (!plans || plans.length === 0) return '';

    return `
        <div class="deal-plans">
            ${plans.map(plan => `
                <div class="plan ${plan.status}">
                    <div class="plan-header">
                        <h4>${plan.name}</h4>
                        ${plan.badge ? `<span class="badge">${plan.badge}</span>` : ''}
                    </div>
                    <div class="plan-price">
                        <span class="original-price">₹${plan.originalPrice}</span>
                        <span class="split-price">₹${plan.price}</span>
                        <span class="savings">Save ₹${plan.savings}</span>
                    </div>
                    <div class="plan-members">
                        <div class="progress-bar">
                            <div class="progress" style="width: ${(plan.currentMembers / plan.maxMembers) * 100}%"></div>
                        </div>
                        <span>${plan.currentMembers}/${plan.maxMembers} members</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Update category filter options
function updateCategoryFilter() {
    if (!categoryFilter) return;

    // Get unique categories
    const categories = ['All', ...new Set(allDeals.map(deal => deal.category))];

    // Update dropdown options
    categoryFilter.innerHTML = categories.map(category => `
        <option value="${category === 'All' ? '' : category}">${category}</option>
    `).join('');
}

// Filter deals
function filterDeals() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const category = categoryFilter ? categoryFilter.value : '';
    const sortBy = sortSelect ? sortSelect.value : '';

    // Apply filters
    filteredDeals = allDeals.filter(deal => {
        const matchesSearch = deal.title.toLowerCase().includes(searchTerm) ||
                            deal.description.toLowerCase().includes(searchTerm) ||
                            deal.brand.toLowerCase().includes(searchTerm);
        
        const matchesCategory = !category || deal.category === category;

        return matchesSearch && matchesCategory;
    });

    // Apply sorting
    if (sortBy) {
        filteredDeals.sort((a, b) => {
            switch (sortBy) {
                case 'rating':
                    return b.stats.rating - a.stats.rating;
                case 'savings':
                    return b.stats.totalSaved - a.stats.totalSaved;
                case 'popularity':
                    return b.stats.activeSplits - a.stats.activeSplits;
                default:
                    return 0;
            }
        });
    }

    // Update UI
    renderDeals(filteredDeals);
}

// Show deal details
function showDealDetails(dealId) {
    window.location.href = `deal-details.html?id=${dealId}`;
}

// Setup event listeners
function setupEventListeners() {
    if (searchInput) {
        searchInput.addEventListener('input', filterDeals);
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterDeals);
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', filterDeals);
    }
}

// Show error message
function showError(message) {
    // Implement error notification
    console.error(message);
} 