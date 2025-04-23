// DOM Elements
const brandContainer = document.getElementById('brand-details');
const dealsContainer = document.getElementById('brand-deals');
const sortSelect = document.getElementById('sort-deals');
const errorMessage = document.getElementById('error-message');
const loadingSpinner = document.getElementById('loading-spinner');

// API URL
const API_URL = 'http://localhost:5000/api';

// Global variables
let brandData = null;
let brandDeals = [];
let currentSortMethod = 'popularity';

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  // Parse URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const brandId = urlParams.get('id');
  
  if (!brandId) {
    // No brand ID provided, redirect to brands page
    window.location.href = 'brands.html';
    return;
  }
  
  // Load brand details
  loadBrandDetails(brandId);
  
  // Set up event listeners
  setupEventListeners();
});

// Load brand details from API
async function loadBrandDetails(brandId) {
  try {
    // Show loading spinner
    showLoading(brandContainer);
    
    const response = await fetch(`${API_URL}/brands/${brandId}`);
    
    if (!response.ok) {
      throw new Error('Failed to load brand details');
    }
    
    brandData = await response.json();
    
    // Update page title
    document.title = `${brandData.name} - SplitNSplit`;
    
    // Render brand details
    renderBrandDetails();
    
    // Load brand deals
    loadBrandDeals(brandId);
  } catch (error) {
    console.error('Error loading brand details:', error);
    showError('Error loading brand details. Please try again.');
    hideLoading();
  }
}

// Load brand deals from API
async function loadBrandDeals(brandId) {
  try {
    // Show loading spinner
    showLoading(dealsContainer);
    
    const response = await fetch(`${API_URL}/deals?brand=${brandId}`);
    
    if (!response.ok) {
      throw new Error('Failed to load brand deals');
    }
    
    const data = await response.json();
    brandDeals = data.deals || [];
    
    // Sort and render deals
    sortAndRenderDeals();
  } catch (error) {
    console.error('Error loading brand deals:', error);
    showError('Error loading deals. Please try again.');
    hideLoading();
  }
}

// Render brand details
function renderBrandDetails() {
  if (!brandContainer || !brandData) return;
  
  const features = brandData.features || [];
  const heroImage = brandData.heroImage || `/images/brands/${brandData.name.toLowerCase()}-hero.jpg`;
  
  const html = `
    <div class="brand-hero">
      <img src="${heroImage}" alt="${brandData.name} banner">
      <div class="brand-overlay">
        <div class="brand-logo">
          <img src="${brandData.logo || `/images/brands/${brandData.name.toLowerCase()}-logo.png`}" alt="${brandData.name} logo">
        </div>
      </div>
    </div>
    
    <div class="brand-info">
      <div class="brand-header">
        <h1>${brandData.name}</h1>
        <div class="brand-rating">
          ${getRatingStars(brandData.rating || 4.5)}
          <span class="rating-count">(${brandData.reviewCount || 0} reviews)</span>
        </div>
      </div>
      
      <div class="brand-description">
        <p>${brandData.description}</p>
      </div>
      
      <div class="brand-features">
        <h3>Features</h3>
        <ul>
          ${features.map(feature => `<li><i class="fas fa-check-circle"></i> ${feature}</li>`).join('')}
        </ul>
      </div>
      
      <div class="brand-meta">
        <div class="meta-item">
          <i class="fas fa-tag"></i>
          <span>${brandData.category}</span>
        </div>
        <div class="meta-item">
          <i class="fas fa-users"></i>
          <span>${formatNumber(brandData.subscribers || 0)} subscribers</span>
        </div>
        <div class="meta-item">
          <i class="fas fa-globe"></i>
          <a href="${brandData.website}" target="_blank">Visit website</a>
        </div>
      </div>
    </div>
  `;
  
  brandContainer.innerHTML = html;
  hideLoading(brandContainer);
}

// Sort and render deals
function sortAndRenderDeals() {
  if (!brandDeals.length) {
    if (dealsContainer) {
      dealsContainer.innerHTML = `
        <div class="no-deals-message">
          <i class="fas fa-info-circle"></i>
          <p>No active deals found for this brand. Check back later!</p>
        </div>
      `;
      hideLoading(dealsContainer);
    }
    return;
  }
  
  // Sort deals based on current method
  const sortedDeals = [...brandDeals];
  
  switch (currentSortMethod) {
    case 'price-low':
      sortedDeals.sort((a, b) => a.splitPrice - b.splitPrice);
      break;
    case 'price-high':
      sortedDeals.sort((a, b) => b.splitPrice - a.splitPrice);
      break;
    case 'savings':
      sortedDeals.sort((a, b) => {
        const savingsA = a.originalPrice - a.splitPrice;
        const savingsB = b.originalPrice - b.splitPrice;
        return savingsB - savingsA;
      });
      break;
    case 'duration':
      sortedDeals.sort((a, b) => b.duration - a.duration);
      break;
    default: // popularity or filled slots
      sortedDeals.sort((a, b) => {
        // Sort by percentage filled first (more filled = more popular)
        const filledPercentA = a.filledSlots / a.totalSlots;
        const filledPercentB = b.filledSlots / b.totalSlots;
        return filledPercentB - filledPercentA;
      });
  }
  
  // Render the sorted deals
  renderDeals(sortedDeals);
}

// Render deals
function renderDeals(deals) {
  if (!dealsContainer) return;
  
  const dealsHTML = deals.map(deal => {
    // Calculate savings
    const savings = deal.originalPrice - deal.splitPrice;
    const savingsPercentage = Math.round((savings / deal.originalPrice) * 100);
    
    // Calculate progress
    const progressPercent = Math.min(100, Math.round((deal.filledSlots / deal.totalSlots) * 100));
    const slotsRemaining = deal.totalSlots - deal.filledSlots;
    
    return `
      <div class="deal-card">
        <div class="deal-header">
          <h3>${deal.name}</h3>
          <span class="deal-category">${deal.category}</span>
        </div>
        
        <div class="deal-body">
          <div class="deal-price">
            <div class="price-item original">
              <span class="label">Original Price</span>
              <span class="value">₹${deal.originalPrice}</span>
            </div>
            <div class="price-item split">
              <span class="label">Split Price</span>
              <span class="value">₹${deal.splitPrice}</span>
            </div>
            <div class="price-item savings">
              <span class="label">You Save</span>
              <span class="value">₹${savings} (${savingsPercentage}%)</span>
            </div>
          </div>
          
          <div class="deal-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progressPercent}%"></div>
            </div>
            <div class="progress-text">
              <span class="filled">${deal.filledSlots}/${deal.totalSlots} slots filled</span>
              <span class="remaining">${slotsRemaining} slots remaining</span>
            </div>
          </div>
          
          <div class="deal-details">
            <div class="detail-item">
              <i class="fas fa-calendar-alt"></i>
              <span>${deal.duration} months</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-users"></i>
              <span>${deal.totalSlots} members max</span>
            </div>
            ${deal.expiryDate ? `
              <div class="detail-item">
                <i class="fas fa-clock"></i>
                <span>Ends on: ${new Date(deal.expiryDate).toLocaleDateString()}</span>
              </div>
            ` : ''}
          </div>
        </div>
        
        <div class="deal-footer">
          <button class="btn btn-primary join-deal-btn" data-deal-id="${deal._id}">Join Deal</button>
          <a href="join-deal.html?id=${deal._id}" class="btn btn-outline-primary">View Details</a>
        </div>
      </div>
    `;
  }).join('');
  
  dealsContainer.innerHTML = `
    <div class="deals-header">
      <h2>Available Deals</h2>
      <div class="deals-sort">
        <label for="sort-deals">Sort by:</label>
        <select id="sort-deals">
          <option value="popularity" ${currentSortMethod === 'popularity' ? 'selected' : ''}>Popularity</option>
          <option value="price-low" ${currentSortMethod === 'price-low' ? 'selected' : ''}>Price: Low to High</option>
          <option value="price-high" ${currentSortMethod === 'price-high' ? 'selected' : ''}>Price: High to Low</option>
          <option value="savings" ${currentSortMethod === 'savings' ? 'selected' : ''}>Highest Savings</option>
          <option value="duration" ${currentSortMethod === 'duration' ? 'selected' : ''}>Duration</option>
        </select>
      </div>
    </div>
    <div class="deals-grid">
      ${dealsHTML}
    </div>
  `;
  
  hideLoading(dealsContainer);
  
  // Re-attach event listeners
  const sortSelect = document.getElementById('sort-deals');
  if (sortSelect) {
    sortSelect.addEventListener('change', handleSortChange);
  }
  
  const joinButtons = document.querySelectorAll('.join-deal-btn');
  joinButtons.forEach(button => {
    button.addEventListener('click', handleJoinDealClick);
  });
}

// Handle join deal button click
function handleJoinDealClick(e) {
  const dealId = e.target.dataset.dealId;
  
  // Check if user is logged in
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Set callback to return to this page after login
    window.afterLoginCallback = () => {
      window.location.href = `join-deal.html?id=${dealId}`;
    };
    
    // Show login modal
    window.showLoginModal('Please log in or sign up to join this deal');
    return;
  }
  
  // User is logged in, redirect to join deal page
  window.location.href = `join-deal.html?id=${dealId}`;
}

// Handle sort change
function handleSortChange(e) {
  currentSortMethod = e.target.value;
  sortAndRenderDeals();
}

// Setup event listeners
function setupEventListeners() {
  // Sort select
  if (sortSelect) {
    sortSelect.addEventListener('change', handleSortChange);
  }
}

// Helper function to show loading spinner
function showLoading(element) {
  if (element) {
    element.innerHTML = '<div class="loading-spinner"></div>';
  }
  
  if (loadingSpinner) {
    loadingSpinner.style.display = 'block';
  }
}

// Helper function to hide loading spinner
function hideLoading(element) {
  if (loadingSpinner) {
    loadingSpinner.style.display = 'none';
  }
}

// Helper function to show error message
function showError(message) {
  if (errorMessage) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    
    // Hide after 5 seconds
    setTimeout(() => {
      errorMessage.style.display = 'none';
    }, 5000);
  }
}

// Helper function to generate star rating HTML
function getRatingStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
  let starsHTML = '';
  
  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="fas fa-star"></i>';
  }
  
  // Add half star if needed
  if (halfStar) {
    starsHTML += '<i class="fas fa-star-half-alt"></i>';
  }
  
  // Add empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<i class="far fa-star"></i>';
  }
  
  return starsHTML;
}

// Helper function to format numbers (e.g., 1000 -> 1k)
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num;
} 