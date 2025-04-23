// DOM Elements
const authModal = document.getElementById('auth-modal');
const loginTab = document.getElementById('login-tab');
const signupTab = document.getElementById('signup-tab');
const loginContent = document.getElementById('login-content');
const signupContent = document.getElementById('signup-content');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loginButton = document.getElementById('login-button');
const signupButton = document.getElementById('signup-button');
const closeAuthModal = document.getElementById('close-auth-modal');
const userMenu = document.getElementById('user-menu');
const userName = document.getElementById('user-name');
const authErrorMessage = document.getElementById('auth-error-message');
const authModalMessage = document.getElementById('auth-modal-message');

// API URL - using port 5000 for backend
const API_URL = 'http://localhost:5000/api';

// Check if user is logged in
document.addEventListener('DOMContentLoaded', () => {
  checkAuthStatus();
});

// Show auth modal with login tab active
function showLoginModal(message = '') {
  loginTab.classList.add('active');
  signupTab.classList.remove('active');
  loginContent.style.display = 'block';
  signupContent.style.display = 'none';
  authModal.style.display = 'block';
  
  if (message && authModalMessage) {
    authModalMessage.textContent = message;
    authModalMessage.style.display = 'block';
  } else if (authModalMessage) {
    authModalMessage.style.display = 'none';
  }
  
  if (authErrorMessage) {
    authErrorMessage.textContent = '';
    authErrorMessage.style.display = 'none';
  }
}

// Show auth modal with signup tab active
function showSignupModal() {
  loginTab.classList.remove('active');
  signupTab.classList.add('active');
  loginContent.style.display = 'none';
  signupContent.style.display = 'block';
  authModal.style.display = 'block';
  
  if (authModalMessage) {
    authModalMessage.style.display = 'none';
  }
  
  if (authErrorMessage) {
    authErrorMessage.textContent = '';
    authErrorMessage.style.display = 'none';
  }
}

// Check if user is authenticated
function checkAuthStatus() {
  const token = localStorage.getItem('token');
  
  if (token) {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    
    if (userData) {
      // Update UI for logged in user
      if (loginButton) loginButton.style.display = 'none';
      if (signupButton) signupButton.style.display = 'none';
      if (userMenu) {
        userMenu.style.display = 'block';
        if (userName) {
          userName.textContent = userData.name;
        }
      }
      
      // Verify token is still valid by making a request to the server
      fetch(`${API_URL}/auth/user`, {
        headers: {
          'x-auth-token': token
        }
      })
        .then(res => {
          if (!res.ok) {
            // Token is invalid, log out user
            logout();
            throw new Error('Token is invalid');
          }
          return res.json();
        })
        .catch(err => {
          console.error('Error verifying auth token:', err);
        });
    } else {
      logout();
    }
  } else {
    // User is not logged in
    if (loginButton) loginButton.style.display = 'block';
    if (signupButton) signupButton.style.display = 'block';
    if (userMenu) userMenu.style.display = 'none';
  }
}

// Login user
async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.msg || 'Login failed');
    }
    
    // Save token and user data to localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    // Update UI
    authModal.style.display = 'none';
    checkAuthStatus();
    
    return true;
  } catch (error) {
    if (authErrorMessage) {
      authErrorMessage.textContent = error.message;
      authErrorMessage.style.display = 'block';
    }
    return false;
  }
}

// Register user
async function registerUser(name, email, password, phone = '') {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password, phone })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.msg || 'Registration failed');
    }
    
    // Save token and user data to localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    // Update UI
    authModal.style.display = 'none';
    checkAuthStatus();
    
    return true;
  } catch (error) {
    if (authErrorMessage) {
      authErrorMessage.textContent = error.message;
      authErrorMessage.style.display = 'block';
    }
    return false;
  }
}

// Logout user
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  checkAuthStatus();
  
  // Redirect to home page if on a protected page
  const currentPath = window.location.pathname;
  if (currentPath.includes('my-deals') || currentPath.includes('profile')) {
    window.location.href = '/';
  }
}

// Event Listeners
if (loginButton) {
  loginButton.addEventListener('click', () => {
    showLoginModal();
  });
}

if (signupButton) {
  signupButton.addEventListener('click', () => {
    showSignupModal();
  });
}

if (closeAuthModal) {
  closeAuthModal.addEventListener('click', () => {
    authModal.style.display = 'none';
  });
}

if (loginTab) {
  loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    loginContent.style.display = 'block';
    signupContent.style.display = 'none';
    if (authErrorMessage) {
      authErrorMessage.textContent = '';
      authErrorMessage.style.display = 'none';
    }
  });
}

if (signupTab) {
  signupTab.addEventListener('click', () => {
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
    signupContent.style.display = 'block';
    loginContent.style.display = 'none';
    if (authErrorMessage) {
      authErrorMessage.textContent = '';
      authErrorMessage.style.display = 'none';
    }
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
      if (authErrorMessage) {
        authErrorMessage.textContent = 'Please enter email and password';
        authErrorMessage.style.display = 'block';
      }
      return;
    }
    
    const success = await loginUser(email, password);
    
    if (success) {
      // Check if there's a callback function after login
      const afterLoginCallback = window.afterLoginCallback;
      if (typeof afterLoginCallback === 'function') {
        afterLoginCallback();
        window.afterLoginCallback = null;
      }
    }
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const phone = document.getElementById('signup-phone').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    
    if (!name || !email || !password) {
      if (authErrorMessage) {
        authErrorMessage.textContent = 'Please fill in all required fields';
        authErrorMessage.style.display = 'block';
      }
      return;
    }
    
    if (password !== confirmPassword) {
      if (authErrorMessage) {
        authErrorMessage.textContent = 'Passwords do not match';
        authErrorMessage.style.display = 'block';
      }
      return;
    }
    
    const success = await registerUser(name, email, password, phone);
    
    if (success) {
      // Check if there's a callback function after signup
      const afterLoginCallback = window.afterLoginCallback;
      if (typeof afterLoginCallback === 'function') {
        afterLoginCallback();
        window.afterLoginCallback = null;
      }
    }
  });
}

// Close modal when clicking outside of it
window.addEventListener('click', (e) => {
  if (e.target === authModal) {
    authModal.style.display = 'none';
  }
});

// Expose functions to global scope
window.showLoginModal = showLoginModal;
window.showSignupModal = showSignupModal;
window.logout = logout;
window.checkAuthStatus = checkAuthStatus; 