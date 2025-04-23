// DOM Elements
const dealDetails = document.getElementById('deal-details');
const addressModal = document.getElementById('address-modal');
const addressForm = document.getElementById('address-form');
const paymentModal = document.getElementById('payment-modal');
const paymentForm = document.getElementById('payment-form');
const paymentDealName = document.getElementById('payment-deal-name');
const paymentAmount = document.getElementById('payment-amount');
const paymentAddress = document.getElementById('payment-address');
const successNotification = document.getElementById('success-notification');
const successMessage = document.getElementById('success-message');
const errorMessage = document.getElementById('error-message').querySelector('span');
const brandLink = document.getElementById('brand-link');
const dealNameElement = document.getElementById('deal-name');

// API URL
const API_URL = 'http://localhost:5001/api';

// Global variables
let dealId = null;
let dealData = null;
let userAddress = null;

// Parse URL params to get deal ID
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  dealId = urlParams.get('id');
  
  if (dealId) {
    loadDealDetails(dealId);
  } else {
    // No deal ID provided, redirect to brands page
    window.location.href = 'brands.html';
  }
  
  // Set up form event listeners
  setupEventListeners();
});

// Load deal details from API
async function loadDealDetails(dealId) {
  try {
    showLoading(dealDetails);
    
    const response = await fetch(`${API_URL}/deals/${dealId}`);
    
    if (!response.ok) {
      throw new Error('Deal not found');
    }
    
    dealData = await response.json();
    
    // Update breadcrumb
    if (brandLink) {
      brandLink.textContent = dealData.brand;
      brandLink.href = `brand-details.html?id=${dealData.brand}`;
    }
    
    if (dealNameElement) {
      dealNameElement.textContent = dealData.name;
      dealNameElement.href = `brand-details.html?id=${dealData.brand}&deal=${dealId}`;
    }
    
    // Render deal details
    renderDealDetails(dealData);
  } catch (error) {
    console.error('Error loading deal details:', error);
    showError('Error loading deal details. Please try again.');
  }
}

// Render deal details in the UI
function renderDealDetails(deal) {
  if (!dealDetails) return;
  
  // Calculate savings
  const savingsAmount = deal.originalPrice - deal.splitPrice;
  const savingsPercentage = Math.round((savingsAmount / deal.originalPrice) * 100);
  
  // Format date
  const formattedDate = deal.endDate ? new Date(deal.endDate).toLocaleDateString() : 'TBD';
  
  dealDetails.innerHTML = `
    <div class="deal-image">
      <img src="${deal.image || `/images/BRANDS/${deal.brand.toUpperCase()}/logo.png`}" alt="${deal.brand}">
    </div>
    <div class="deal-info">
      <h2>${deal.name}</h2>
      <p class="deal-description">${deal.description}</p>
      
      <div class="deal-pricing">
        <div class="price-item">
          <span class="label">Regular Price</span>
          <span class="value original-price">₹${deal.originalPrice}</span>
        </div>
        <div class="price-item highlight">
          <span class="label">Split Price</span>
          <span class="value split-price">₹${deal.splitPrice}</span>
        </div>
        <div class="price-item">
          <span class="label">Your Savings</span>
          <span class="value savings">₹${savingsAmount} (${savingsPercentage}%)</span>
        </div>
      </div>
      
      <div class="deal-meta">
        <div class="meta-item">
          <i class="fas fa-users"></i>
          <span>${deal.filledSlots}/${deal.totalSlots} slots filled</span>
        </div>
        <div class="meta-item">
          <i class="fas fa-calendar-alt"></i>
          <span>${deal.duration} months subscription</span>
        </div>
        <div class="meta-item">
          <i class="fas fa-clock"></i>
          <span>Ends on: ${formattedDate}</span>
        </div>
      </div>
      
      <div class="deal-features">
        <h3>Features</h3>
        <ul>
          ${deal.features ? deal.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('') : ''}
        </ul>
      </div>
      
      <button id="join-deal-btn" class="btn btn-primary">Join Split Plan</button>
    </div>
  `;
  
  // Add event listener to join button
  const joinDealBtn = document.getElementById('join-deal-btn');
  if (joinDealBtn) {
    joinDealBtn.addEventListener('click', handleJoinDealClick);
  }
}

// Handle join deal button click
function handleJoinDealClick() {
  // Check if user is logged in
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Set callback function to continue after login
    window.afterLoginCallback = () => {
      showAddressModal();
    };
    
    // Show login modal
    window.showLoginModal('Please log in or sign up to join this deal');
    return;
  }
  
  // User is logged in, show address modal
  showAddressModal();
}

// Show address modal
function showAddressModal() {
  if (addressModal) {
    addressModal.style.display = 'block';
  }
}

// Show payment modal
function showPaymentModal() {
  if (paymentModal) {
    paymentModal.style.display = 'block';
    
    // Update payment details
    if (paymentDealName) {
      paymentDealName.textContent = dealData.name;
    }
    
    if (paymentAmount) {
      const serviceTax = dealData.splitPrice * 0.18;
      const totalAmount = dealData.splitPrice + serviceTax;
      
      paymentAmount.innerHTML = `
        <div class="payment-item">
          <span class="label">Split Price:</span>
          <span class="value">₹${dealData.splitPrice.toFixed(2)}</span>
        </div>
        <div class="payment-item">
          <span class="label">GST (18%):</span>
          <span class="value">₹${serviceTax.toFixed(2)}</span>
        </div>
        <div class="payment-item total">
          <span class="label">Total:</span>
          <span class="value">₹${totalAmount.toFixed(2)}</span>
        </div>
      `;
    }
    
    if (paymentAddress) {
      paymentAddress.innerHTML = `${userAddress.street}, ${userAddress.city}, ${userAddress.state}, ${userAddress.pincode}`;
    }
  }
}

// Show loading state
function showLoading(element) {
  if (element) {
    element.innerHTML = '<div class="loading-spinner"></div>';
  }
}

// Show error message
function showError(message) {
  if (errorMessage) {
    errorMessage.textContent = message;
    errorMessage.parentElement.parentElement.style.display = 'block';
    
    // Hide after 5 seconds
    setTimeout(() => {
      errorMessage.parentElement.parentElement.style.display = 'none';
    }, 5000);
  }
}

// Show success notification
function showSuccess(message) {
  if (successMessage && successNotification) {
    successMessage.innerHTML = message;
    successNotification.style.display = 'block';
    
    // Hide after 5 seconds
    setTimeout(() => {
      successNotification.style.display = 'none';
    }, 5000);
  }
}

// Setup event listeners
function setupEventListeners() {
  // Address form submission
  if (addressForm) {
    addressForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Get address data
      userAddress = {
        street: document.getElementById('street').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        pincode: document.getElementById('pincode').value
      };
      
      // Close address modal
      addressModal.style.display = 'none';
      
      // Show payment modal
      showPaymentModal();
    });
  }
  
  // Payment form submission
  if (paymentForm) {
    paymentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Get payment method
      const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
      const transactionId = document.getElementById('transaction-id').value;
      
      // Validate transaction ID for online payments
      if (paymentMethod !== 'cod' && !transactionId) {
        showError('Please enter transaction ID for online payments');
        return;
      }
      
      // Process payment
      await processPayment(paymentMethod, transactionId);
    });
  }
  
  // Payment method change
  const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
  const onlinePaymentFields = document.getElementById('online-payment-fields');
  
  if (paymentMethods && onlinePaymentFields) {
    paymentMethods.forEach(method => {
      method.addEventListener('change', () => {
        if (method.value === 'cod') {
          onlinePaymentFields.style.display = 'none';
        } else {
          onlinePaymentFields.style.display = 'block';
        }
      });
    });
  }
  
  // Close modals when clicking on X
  const closeButtons = document.querySelectorAll('.close-modal');
  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal');
      if (modal) {
        modal.style.display = 'none';
      }
    });
  });
  
  // Close modals when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      e.target.style.display = 'none';
    }
  });
}

// Process payment
async function processPayment(paymentMethod, transactionId) {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      showError('You need to be logged in to complete this action');
      return;
    }
    
    // First join the deal
    const joinResponse = await fetch(`${API_URL}/deals/join/${dealId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      }
    });
    
    if (!joinResponse.ok) {
      const joinError = await joinResponse.json();
      throw new Error(joinError.msg || 'Error joining deal');
    }
    
    // Then process payment
    const paymentResponse = await fetch(`${API_URL}/payments/${dealId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify({
        paymentMethod,
        transactionId,
        address: userAddress
      })
    });
    
    if (!paymentResponse.ok) {
      const paymentError = await paymentResponse.json();
      throw new Error(paymentError.msg || 'Error processing payment');
    }
    
    const paymentData = await paymentResponse.json();
    
    // Close payment modal
    paymentModal.style.display = 'none';
    
    // Show success message
    const successHtml = `
      <h3>Payment Successful!</h3>
      <p>Your subscription split for <strong>${dealData.brand} - ${dealData.name}</strong> has been confirmed.</p>
      <p>Invoice Number: <strong>${paymentData.payment.invoiceNumber}</strong></p>
      <p>An email with details has been sent to your registered email address.</p>
      <div class="success-actions">
        <a href="my-deals.html" class="btn btn-primary">View My Deals</a>
      </div>
    `;
    
    showSuccess(successHtml);
    
    // Redirect to my deals page after 5 seconds
    setTimeout(() => {
      window.location.href = 'my-deals.html';
    }, 5000);
  } catch (error) {
    console.error('Payment error:', error);
    showError(error.message || 'Error processing payment. Please try again.');
  }
} 