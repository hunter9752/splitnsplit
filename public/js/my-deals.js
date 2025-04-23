// DOM Elements
const dealsContainer = document.getElementById('my-deals-container');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('deal-search');
const noDealsMessage = document.getElementById('no-deals-message');
const loadingSpinner = document.getElementById('loading-spinner');
const errorMessage = document.getElementById('error-message');
const userStats = document.getElementById('user-stats');

// API URL
const API_URL = 'http://localhost:5000/api';

// Global variables
let userDeals = [];
let filteredDeals = [];
let currentFilter = 'all';

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  // Check if user is logged in
  const token = localStorage.getItem('token');
  if (!token) {
    // Set callback to return to this page after login
    window.afterLoginCallback = () => {
      window.location.reload();
    };
    
    // Show login modal with message
    window.showLoginModal('Please log in to view your deals');
    
    // Hide loading spinner
    if (loadingSpinner) {
      loadingSpinner.style.display = 'none';
    }
    
    // Show message
    if (noDealsMessage) {
      noDealsMessage.textContent = 'Please log in to view your deals';
      noDealsMessage.style.display = 'block';
    }
    
    return;
  }
  
  // Load user's deals
  loadUserDeals();
  
  // Set up event listeners
  setupEventListeners();
});

// Load user's deals from API
async function loadUserDeals() {
  try {
    // Show loading spinner
    if (loadingSpinner) {
      loadingSpinner.style.display = 'block';
    }
    
    // Hide no deals message
    if (noDealsMessage) {
      noDealsMessage.style.display = 'none';
    }
    
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/deals/user/joined`, {
      headers: {
        'x-auth-token': token
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to load deals');
    }
    
    const data = await response.json();
    userDeals = data.deals || [];
    
    // Update stats
    updateUserStats(userDeals);
    
    // Apply current filter and render
    applyFilter(currentFilter);
    
  } catch (error) {
    console.error('Error loading deals:', error);
    
    // Show error message
    if (errorMessage) {
      errorMessage.textContent = 'Error loading your deals. Please try again.';
      errorMessage.style.display = 'block';
    }
    
    // Hide loading spinner
    if (loadingSpinner) {
      loadingSpinner.style.display = 'none';
    }
  }
}

// Update user stats
function updateUserStats(deals) {
  if (!userStats) return;
  
  // Calculate stats
  const totalDeals = deals.length;
  const activeDeals = deals.filter(deal => new Date(deal.expiryDate) > new Date()).length;
  const expiredDeals = totalDeals - activeDeals;
  const totalSavings = deals.reduce((total, deal) => {
    return total + (deal.originalPrice - deal.splitPrice);
  }, 0);
  
  // Update stats display
  userStats.innerHTML = `
    <div class="stat-item">
      <span class="stat-value">${totalDeals}</span>
      <span class="stat-label">Total Deals</span>
    </div>
    <div class="stat-item">
      <span class="stat-value">${activeDeals}</span>
      <span class="stat-label">Active</span>
    </div>
    <div class="stat-item">
      <span class="stat-value">${expiredDeals}</span>
      <span class="stat-label">Expired</span>
    </div>
    <div class="stat-item">
      <span class="stat-value">₹${totalSavings.toFixed(2)}</span>
      <span class="stat-label">Total Savings</span>
    </div>
  `;
}

// Apply filter to deals
function applyFilter(filter) {
  currentFilter = filter;
  const now = new Date();
  
  // Apply filter
  switch (filter) {
    case 'active':
      filteredDeals = userDeals.filter(deal => new Date(deal.expiryDate) > now);
      break;
    case 'expiring':
      // Deals expiring in the next 30 days
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      filteredDeals = userDeals.filter(deal => {
        const expiryDate = new Date(deal.expiryDate);
        return expiryDate > now && expiryDate <= thirtyDaysFromNow;
      });
      break;
    case 'expired':
      filteredDeals = userDeals.filter(deal => new Date(deal.expiryDate) <= now);
      break;
    default:
      filteredDeals = [...userDeals];
  }
  
  // Apply search filter if any
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
  if (searchTerm) {
    filteredDeals = filteredDeals.filter(deal => 
      deal.name.toLowerCase().includes(searchTerm) ||
      deal.brand.toLowerCase().includes(searchTerm) ||
      deal.category.toLowerCase().includes(searchTerm)
    );
  }
  
  // Sort deals: active first, then by expiry date (closest to expiry first)
  filteredDeals.sort((a, b) => {
    const aExpired = new Date(a.expiryDate) <= now;
    const bExpired = new Date(b.expiryDate) <= now;
    
    // If one is active and one is expired, active comes first
    if (aExpired && !bExpired) return 1;
    if (!aExpired && bExpired) return -1;
    
    // If both are active or both are expired, sort by expiry date
    return new Date(a.expiryDate) - new Date(b.expiryDate);
  });
  
  // Render filtered deals
  renderDeals(filteredDeals);
  
  // Update active filter button
  if (filterButtons) {
    filterButtons.forEach(button => {
      if (button.dataset.filter === filter) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }
}

// Render deals to the container
function renderDeals(deals) {
  // Hide loading spinner
  if (loadingSpinner) {
    loadingSpinner.style.display = 'none';
  }
  
  // Check if there are deals to display
  if (!deals.length) {
    if (noDealsMessage) {
      // Show appropriate message based on the current filter
      switch (currentFilter) {
        case 'active':
          noDealsMessage.textContent = 'You have no active deals';
          break;
        case 'expiring':
          noDealsMessage.textContent = 'You have no deals expiring soon';
          break;
        case 'expired':
          noDealsMessage.textContent = 'You have no expired deals';
          break;
        default:
          noDealsMessage.textContent = 'You have not joined any deals yet';
      }
      
      noDealsMessage.style.display = 'block';
    }
    
    if (dealsContainer) {
      dealsContainer.innerHTML = '';
    }
    
    return;
  }
  
  // Hide no deals message
  if (noDealsMessage) {
    noDealsMessage.style.display = 'none';
  }
  
  // Render deals
  if (dealsContainer) {
    dealsContainer.innerHTML = deals.map(deal => createDealCard(deal)).join('');
    
    // Add event listeners to deal cards
    const extendButtons = document.querySelectorAll('.extend-deal-btn');
    const renewButtons = document.querySelectorAll('.renew-deal-btn');
    
    extendButtons.forEach(button => {
      button.addEventListener('click', () => {
        const dealId = button.dataset.dealId;
        handleExtendDeal(dealId);
      });
    });
    
    renewButtons.forEach(button => {
      button.addEventListener('click', () => {
        const dealId = button.dataset.dealId;
        handleRenewDeal(dealId);
      });
    });
  }
}

// Create HTML for a deal card
function createDealCard(deal) {
  const now = new Date();
  const expiryDate = new Date(deal.expiryDate);
  const isExpired = expiryDate <= now;
  
  // Calculate days remaining
  const daysRemaining = isExpired ? 0 : Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
  
  // Format expiry date
  const formattedExpiryDate = expiryDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  
  // Calculate savings
  const savings = deal.originalPrice - deal.splitPrice;
  const savingsPercentage = Math.round((savings / deal.originalPrice) * 100);
  
  return `
    <div class="deal-card ${isExpired ? 'expired' : ''}">
      <div class="deal-card-header">
        <div class="brand-logo">
          <img src="${deal.brandLogo || `/images/brands/${deal.brand.toLowerCase()}.png`}" alt="${deal.brand}">
        </div>
        <div class="deal-status">
          ${isExpired 
            ? '<span class="status expired">Expired</span>' 
            : daysRemaining <= 30 
              ? `<span class="status expiring">Expiring in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}</span>` 
              : '<span class="status active">Active</span>'
          }
        </div>
      </div>
      
      <div class="deal-card-body">
        <h3 class="deal-name">${deal.name}</h3>
        <div class="deal-metadata">
          <span class="category">${deal.category}</span>
          <span class="separator">•</span>
          <span class="members">${deal.filledSlots}/${deal.totalSlots} members</span>
        </div>
        
        <div class="deal-pricing">
          <div class="original-price">
            <span class="label">Original</span>
            <span class="price">₹${deal.originalPrice}</span>
          </div>
          <div class="split-price">
            <span class="label">You Pay</span>
            <span class="price">₹${deal.splitPrice}</span>
          </div>
          <div class="savings">
            <span class="label">Savings</span>
            <span class="price">₹${savings} (${savingsPercentage}%)</span>
          </div>
        </div>
        
        <div class="deal-expiry">
          <span class="expiry-label">Expires on:</span>
          <span class="expiry-date">${formattedExpiryDate}</span>
        </div>
        
        <div class="deal-actions">
          ${!isExpired 
            ? `<button class="btn btn-outline extend-deal-btn" data-deal-id="${deal._id}">Extend</button>` 
            : `<button class="btn btn-primary renew-deal-btn" data-deal-id="${deal._id}">Renew Now</button>`
          }
          <a href="deal-details.html?id=${deal._id}" class="btn btn-link">View Details</a>
        </div>
      </div>
    </div>
  `;
}

// Handle extend deal
function handleExtendDeal(dealId) {
  // Find the deal
  const deal = userDeals.find(d => d._id === dealId);
  if (!deal) return;
  
  // Show modal with extension options
  const modalHTML = `
    <div class="modal-header">
      <h3>Extend Subscription</h3>
      <button class="close-modal">&times;</button>
    </div>
    <div class="modal-body">
      <p>You are extending <strong>${deal.brand} - ${deal.name}</strong></p>
      <p>Current expiry: ${new Date(deal.expiryDate).toLocaleDateString()}</p>
      
      <div class="extension-options">
        <div class="option">
          <input type="radio" name="extension" id="extend-3" value="3" checked>
          <label for="extend-3">
            <span class="duration">3 Months</span>
            <span class="price">₹${(deal.splitPrice * 3).toFixed(2)}</span>
          </label>
        </div>
        <div class="option">
          <input type="radio" name="extension" id="extend-6" value="6">
          <label for="extend-6">
            <span class="duration">6 Months</span>
            <span class="price">₹${(deal.splitPrice * 6 * 0.95).toFixed(2)}</span>
            <span class="discount">5% Off</span>
          </label>
        </div>
        <div class="option">
          <input type="radio" name="extension" id="extend-12" value="12">
          <label for="extend-12">
            <span class="duration">12 Months</span>
            <span class="price">₹${(deal.splitPrice * 12 * 0.9).toFixed(2)}</span>
            <span class="discount">10% Off</span>
          </label>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button id="confirm-extension" class="btn btn-primary">Proceed to Payment</button>
    </div>
  `;
  
  // Create and show modal
  const modal = document.createElement('div');
  modal.className = 'modal extension-modal';
  modal.innerHTML = modalHTML;
  document.body.appendChild(modal);
  modal.style.display = 'block';
  
  // Handle close button
  const closeBtn = modal.querySelector('.close-modal');
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  // Handle confirm button
  const confirmBtn = modal.querySelector('#confirm-extension');
  confirmBtn.addEventListener('click', () => {
    const duration = document.querySelector('input[name="extension"]:checked').value;
    document.body.removeChild(modal);
    
    // Redirect to payment page with deal ID and extension duration
    window.location.href = `join-deal.html?id=${dealId}&extend=${duration}`;
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

// Handle renew deal
function handleRenewDeal(dealId) {
  // Directly redirect to the join deal page for this deal
  window.location.href = `join-deal.html?id=${dealId}&renew=true`;
}

// Set up event listeners
function setupEventListeners() {
  // Filter buttons
  if (filterButtons) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        applyFilter(filter);
      });
    });
  }
  
  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      applyFilter(currentFilter);
    });
  }
}

// Helper function to handle API errors
function handleApiError(error) {
  console.error('API Error:', error);
  
  if (errorMessage) {
    errorMessage.textContent = 'Error: ' + (error.message || 'Something went wrong');
    errorMessage.style.display = 'block';
    
    // Hide after 5 seconds
    setTimeout(() => {
      errorMessage.style.display = 'none';
    }, 5000);
  }
} 