// Join Deal Flow Script

document.addEventListener('DOMContentLoaded', function() {
    // Get all join buttons
    const joinButtons = document.querySelectorAll('.btn-primary');
    
    joinButtons.forEach(button => {
        if (button.textContent.includes('Join This Group')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get deal data from parent card
                const card = this.closest('.group-card');
                const dealTitle = card.querySelector('h3').textContent;
                const dealImage = card.querySelector('img').src;
                const dealCategory = card.querySelector('.group-tag').textContent;
                const capacityText = card.querySelector('.capacity span').textContent;
                const dealPriceText = card.querySelector('.fa-rupee-sign').parentNode.textContent;
                const dealClosingDate = card.querySelector('.fa-clock').parentNode.textContent;
                const dealDescription = card.querySelector('.group-description').textContent;
                
                // Store deal data in sessionStorage
                const dealData = {
                    title: dealTitle,
                    image: dealImage,
                    category: dealCategory,
                    capacity: capacityText,
                    price: dealPriceText,
                    closingDate: dealClosingDate,
                    description: dealDescription
                };
                
                sessionStorage.setItem('selectedDeal', JSON.stringify(dealData));
                
                // Show login popup
                showLoginPopup();
            });
        }
    });
    
    // Login/Signup Popup
    function showLoginPopup() {
        // Create the popup
        const popup = document.createElement('div');
        popup.className = 'popup-overlay';
        popup.innerHTML = `
            <div class="popup-container">
                <div class="popup-header">
                    <h2>Login or Sign Up</h2>
                    <button class="close-popup">&times;</button>
                </div>
                <div class="popup-body">
                    <form id="login-form">
                        <div class="form-group">
                            <label for="email">Email Address*</label>
                            <input type="email" id="email" required>
                        </div>
                        <div class="form-group">
                            <label for="name">Full Name*</label>
                            <input type="text" id="name" required>
                        </div>
                        <div class="form-group">
                            <label for="address">Address</label>
                            <textarea id="address" rows="3"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="phone">Phone Number</label>
                            <input type="tel" id="phone">
                        </div>
                        <button type="submit" class="btn btn-primary">Continue</button>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Close popup event
        popup.querySelector('.close-popup').addEventListener('click', function() {
            document.body.removeChild(popup);
        });
        
        // Form submission
        popup.querySelector('#login-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect form data
            const userData = {
                email: document.getElementById('email').value,
                name: document.getElementById('name').value,
                address: document.getElementById('address').value,
                phone: document.getElementById('phone').value
            };
            
            // Store user data
            sessionStorage.setItem('userData', JSON.stringify(userData));
            
            // Remove login popup
            document.body.removeChild(popup);
            
            // Show deal details popup
            showDealDetailsPopup();
        });
    }
    
    // Deal Details Popup
    function showDealDetailsPopup() {
        // Get stored deal data
        const dealData = JSON.parse(sessionStorage.getItem('selectedDeal'));
        
        // Create the popup
        const popup = document.createElement('div');
        popup.className = 'popup-overlay';
        popup.innerHTML = `
            <div class="popup-container">
                <div class="popup-header">
                    <h2>Deal Details</h2>
                    <button class="close-popup">&times;</button>
                </div>
                <div class="popup-body">
                    <div class="deal-summary">
                        <img src="${dealData.image}" alt="${dealData.title}">
                        <h3>${dealData.title}</h3>
                        <div class="group-tag ${dealData.category.toLowerCase()}">${dealData.category}</div>
                        
                        <div class="deal-info">
                            <p><strong>Members:</strong> ${dealData.capacity}</p>
                            <p><strong>Your Cost:</strong> ${dealData.price}</p>
                            <p><strong>Closing Date:</strong> ${dealData.closingDate}</p>
                        </div>
                        
                        <div class="deal-description">
                            <p>${dealData.description}</p>
                        </div>
                        
                        <div class="deal-benefits">
                            <h4>Benefits</h4>
                            <ul>
                                <li>Lower cost through group sharing</li>
                                <li>Premium access to services</li>
                                <li>Easy management through our platform</li>
                                <li>Cancel anytime (subject to group policy)</li>
                            </ul>
                        </div>
                    </div>
                    <button class="btn btn-primary" id="continue-to-payment">Continue to Payment</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Close popup event
        popup.querySelector('.close-popup').addEventListener('click', function() {
            document.body.removeChild(popup);
        });
        
        // Continue to payment
        popup.querySelector('#continue-to-payment').addEventListener('click', function() {
            document.body.removeChild(popup);
            showPaymentPopup();
        });
    }
    
    // Payment Popup
    function showPaymentPopup() {
        // Get stored deal and user data
        const dealData = JSON.parse(sessionStorage.getItem('selectedDeal'));
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        
        // Extract price value from text
        const priceText = dealData.price;
        const priceMatch = priceText.match(/₹(\d+)/);
        const price = priceMatch ? priceMatch[1] : '0';
        
        // Create the popup
        const popup = document.createElement('div');
        popup.className = 'popup-overlay';
        popup.innerHTML = `
            <div class="popup-container">
                <div class="popup-header">
                    <h2>Payment</h2>
                    <button class="close-popup">&times;</button>
                </div>
                <div class="popup-body">
                    <div class="payment-summary">
                        <h3>Payment Summary</h3>
                        <div class="payment-details">
                            <div class="payment-row">
                                <span>Deal Amount</span>
                                <span>₹${price}</span>
                            </div>
                            <div class="payment-row">
                                <span>Platform Fee</span>
                                <span>₹49</span>
                            </div>
                            <div class="payment-row total">
                                <span>Total Amount</span>
                                <span>₹${parseInt(price) + 49}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="payment-methods">
                        <h3>Select Payment Method</h3>
                        <form id="payment-form">
                            <div class="payment-option">
                                <input type="radio" id="upi" name="payment-method" value="upi" checked>
                                <label for="upi">UPI</label>
                            </div>
                            <div class="payment-option">
                                <input type="radio" id="card" name="payment-method" value="card">
                                <label for="card">Credit/Debit Card</label>
                            </div>
                            <div class="payment-option">
                                <input type="radio" id="netbanking" name="payment-method" value="netbanking">
                                <label for="netbanking">Net Banking</label>
                            </div>
                            <div class="payment-option">
                                <input type="radio" id="wallet" name="payment-method" value="wallet">
                                <label for="wallet">Wallet</label>
                            </div>
                            
                            <button type="submit" class="btn btn-primary">Pay Now</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Close popup event
        popup.querySelector('.close-popup').addEventListener('click', function() {
            document.body.removeChild(popup);
        });
        
        // Payment form submission
        popup.querySelector('#payment-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get selected payment method
            const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
            
            // Store payment data
            const paymentData = {
                method: paymentMethod,
                amount: parseInt(price) + 49,
                timestamp: new Date().toISOString()
            };
            
            sessionStorage.setItem('paymentData', JSON.stringify(paymentData));
            
            // Simulate payment processing
            const processingOverlay = document.createElement('div');
            processingOverlay.className = 'processing-overlay';
            processingOverlay.innerHTML = `
                <div class="processing-container">
                    <div class="spinner"></div>
                    <p>Processing your payment...</p>
                </div>
            `;
            
            document.body.appendChild(processingOverlay);
            
            // Simulate payment processing for 3 seconds
            setTimeout(function() {
                document.body.removeChild(processingOverlay);
                document.body.removeChild(popup);
                showSuccessPopup();
            }, 3000);
        });
    }
    
    // Success Popup
    function showSuccessPopup() {
        // Get stored data
        const dealData = JSON.parse(sessionStorage.getItem('selectedDeal'));
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        const paymentData = JSON.parse(sessionStorage.getItem('paymentData'));
        
        // Create transaction ID
        const transactionId = 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase();
        
        // Create the popup
        const popup = document.createElement('div');
        popup.className = 'popup-overlay success-popup';
        popup.innerHTML = `
            <div class="popup-container">
                <div class="popup-header success">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h2>Success!</h2>
                    <button class="close-popup">&times;</button>
                </div>
                <div class="popup-body">
                    <div class="success-message">
                        <p>Your request has been accepted. You have successfully joined the group!</p>
                    </div>
                    
                    <div class="confirmation-details">
                        <h3>Confirmation Details</h3>
                        
                        <div class="confirmation-row">
                            <span>Transaction ID:</span>
                            <span>${transactionId}</span>
                        </div>
                        <div class="confirmation-row">
                            <span>Deal:</span>
                            <span>${dealData.title}</span>
                        </div>
                        <div class="confirmation-row">
                            <span>Amount Paid:</span>
                            <span>₹${paymentData.amount}</span>
                        </div>
                        <div class="confirmation-row">
                            <span>Payment Method:</span>
                            <span>${paymentData.method.toUpperCase()}</span>
                        </div>
                        <div class="confirmation-row">
                            <span>Date:</span>
                            <span>${new Date().toLocaleDateString('en-IN')}</span>
                        </div>
                    </div>
                    
                    <div class="next-steps">
                        <h3>What's Next?</h3>
                        <p>You will receive a confirmation email with all the details. Once the group is filled, you will get another email with instructions to redeem your subscription.</p>
                    </div>
                    
                    <button class="btn btn-primary" id="done-button">Done</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Close popup event
        popup.querySelector('.close-popup').addEventListener('click', function() {
            document.body.removeChild(popup);
            
            // Could redirect to dashboard or refresh page
            window.location.href = 'index.html';
        });
        
        // Done button
        popup.querySelector('#done-button').addEventListener('click', function() {
            document.body.removeChild(popup);
            
            // Could redirect to dashboard or refresh page
            window.location.href = 'index.html';
        });
        
        // Save data to backend
        saveToBackend(userData, dealData, paymentData, transactionId);
    }
    
    // Function to simulate saving data to backend
    function saveToBackend(userData, dealData, paymentData, transactionId) {
        console.log('Saving to backend:', {
            user: userData,
            deal: dealData,
            payment: paymentData,
            transactionId: transactionId
        });
        
        // Extract plan name and brand from deal title
        const planName = dealData.title;
        const brandMatch = planName.match(/(.*?)\s+(Premium|Family|Basic|Standard)/);
        const brand = brandMatch ? brandMatch[1] : 'Unknown';
        
        // Extract price from deal
        const priceMatch = dealData.price.match(/₹(\d+)/);
        const price = priceMatch ? `₹${priceMatch[1]}` : '₹0';
        
        // Create API request payload
        const payload = {
            username: userData.name,
            email: userData.email,
            phone: userData.phone,
            address: userData.address,
            plan: {
                name: planName,
                brand: brand,
                price: price
            }
        };
        
        // Send data to backend API
        fetch('/api/deals/join-split', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            if (data.success) {
                // Store order ID for payment completion
                sessionStorage.setItem('orderId', data.payment.orderId);
            } else {
                alert('Error: ' + data.message || 'Failed to join the split group');
            }
        })
        .catch(error => {
            console.error('Error saving join data:', error);
            alert('Failed to connect to server. Please try again later.');
        });
    }

    // Host Split Form Submission
    const hostSplitForm = document.getElementById('hostSplitForm');
    if (hostSplitForm) {
        // Handle deal type selection visibility
        const dealTypeSelect = document.getElementById('deal-type');
        const existingDealSection = document.getElementById('existing-deal');
        const customDealSection = document.getElementById('custom-deal');
        
        if (dealTypeSelect && existingDealSection && customDealSection) {
            dealTypeSelect.addEventListener('change', function() {
                if (this.value === 'existing') {
                    existingDealSection.classList.remove('hidden');
                    customDealSection.classList.add('hidden');
                    
                    // Update required attributes
                    document.getElementById('existing-deal-select').setAttribute('required', '');
                    document.getElementById('deal-name')?.removeAttribute('required');
                    document.getElementById('deal-category')?.removeAttribute('required');
                    document.getElementById('deal-price')?.removeAttribute('required');
                    document.getElementById('deal-description')?.removeAttribute('required');
                    
                } else if (this.value === 'custom') {
                    existingDealSection.classList.add('hidden');
                    customDealSection.classList.remove('hidden');
                    
                    // Update required attributes
                    document.getElementById('existing-deal-select')?.removeAttribute('required');
                    document.getElementById('deal-name').setAttribute('required', '');
                    document.getElementById('deal-category').setAttribute('required', '');
                    document.getElementById('deal-price').setAttribute('required', '');
                    document.getElementById('deal-description').setAttribute('required', '');
                    
                } else {
                    existingDealSection.classList.add('hidden');
                    customDealSection.classList.add('hidden');
                    
                    // Remove required attributes
                    document.getElementById('existing-deal-select')?.removeAttribute('required');
                    document.getElementById('deal-name')?.removeAttribute('required');
                    document.getElementById('deal-category')?.removeAttribute('required');
                    document.getElementById('deal-price')?.removeAttribute('required');
                    document.getElementById('deal-description')?.removeAttribute('required');
                }
            });
        }
        
        hostSplitForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form fields - we'll send exactly what user typed, even if empty
            const hostName = document.getElementById('host-name').value;
            const hostEmail = document.getElementById('host-email').value;
            const hostPhone = document.getElementById('host-phone').value;
            const hostAddress = document.getElementById('host-address').value;
            
            // Get deal type
            const dealType = document.getElementById('deal-type').value;
            
            // Get deal details based on type
            let dealName, dealCategory, dealPrice, dealCycle, dealDescription;
            
            if (dealType === 'existing') {
                const selectedDeal = document.getElementById('existing-deal-select').value;
                const dealMap = {
                    'netflix': { name: 'Netflix Premium', category: 'streaming', price: '649', cycle: 'monthly' },
                    'spotify': { name: 'Spotify Family', category: 'music', price: '179', cycle: 'monthly' },
                    'dotkey': { name: 'Dot & Key Skincare', category: 'beauty', price: '1299', cycle: 'monthly' },
                    'goldsgym': { name: 'Gold\'s Gym', category: 'fitness', price: '2499', cycle: 'monthly' },
                    'prime': { name: 'Amazon Prime', category: 'shopping', price: '1499', cycle: 'yearly' },
                    'hbo': { name: 'HBO Max', category: 'streaming', price: '299', cycle: 'monthly' }
                };
                
                dealName = dealMap[selectedDeal]?.name || 'Custom Plan';
                dealCategory = dealMap[selectedDeal]?.category || 'other';
                dealPrice = dealMap[selectedDeal]?.price || '100';
                dealCycle = dealMap[selectedDeal]?.cycle || 'monthly';
                dealDescription = 'Premium subscription with all features';
            } else {
                dealName = document.getElementById('deal-name').value;
                dealCategory = document.getElementById('deal-category').value;
                dealPrice = document.getElementById('deal-price').value;
                dealCycle = document.getElementById('deal-cycle').value;
                dealDescription = document.getElementById('deal-description').value;
            }
            
            // Get group details
            const groupName = document.getElementById('group-name').value;
            const groupSize = document.getElementById('group-size').value;
            const groupDescription = document.getElementById('group-description').value;
            const closingDate = document.getElementById('closing-date').value;
            
            // Get payment details
            const paymentMethod = document.getElementById('payment-method').value;
            const paymentCycle = document.getElementById('payment-cycle').value;
            const additionalInfo = document.getElementById('additional-info').value;
            
            // Create payload - send exactly what user entered, don't trim
            const payload = {
                dealType,
                dealName,
                dealCategory,
                dealPrice,
                dealCycle,
                dealDescription,
                groupName,
                groupSize,
                groupDescription,
                closingDate,
                paymentMethod,
                paymentCycle,
                additionalInfo,
                hostInfo: {
                    username: hostName,
                    email: hostEmail,
                    phone: hostPhone,
                    address: hostAddress
                }
            };
            
            console.log('Submitting host data:', payload);
            
            // Display processing overlay
            const processingOverlay = document.createElement('div');
            processingOverlay.className = 'processing-overlay';
            processingOverlay.innerHTML = `
                <div class="processing-container">
                    <div class="spinner"></div>
                    <p>Creating your split group...</p>
                </div>
            `;
            document.body.appendChild(processingOverlay);
            
            // Submit to backend
            fetch('/api/deals/host-split', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(response => {
                // Check if response is ok, otherwise throw an error
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.message || 'Error creating split group');
                    });
                }
                return response.json();
            })
            .then(data => {
                document.body.removeChild(processingOverlay);
                
                if (data.success) {
                    // Show success popup
                    const successPopup = document.createElement('div');
                    successPopup.className = 'popup-overlay success-popup';
                    successPopup.innerHTML = `
                        <div class="popup-container">
                            <div class="popup-header success">
                                <div class="success-icon">
                                    <i class="fas fa-check-circle"></i>
                                </div>
                                <h2>Success!</h2>
                                <button class="close-popup">&times;</button>
                            </div>
                            <div class="popup-body">
                                <div class="success-message">
                                    <p>Your split group has been created successfully!</p>
                                </div>
                                
                                <div class="confirmation-details">
                                    <h3>Group Details</h3>
                                    
                                    <div class="confirmation-row">
                                        <span>Group Name:</span>
                                        <span>${groupName || 'Custom Group'}</span>
                                    </div>
                                    <div class="confirmation-row">
                                        <span>Deal:</span>
                                        <span>${dealName || 'Custom Subscription'}</span>
                                    </div>
                                    <div class="confirmation-row">
                                        <span>Category:</span>
                                        <span>${dealCategory || 'Other'}</span>
                                    </div>
                                    <div class="confirmation-row">
                                        <span>Price:</span>
                                        <span>₹${dealPrice || '100'}</span>
                                    </div>
                                    <div class="confirmation-row">
                                        <span>Maximum Members:</span>
                                        <span>${groupSize || '2'}</span>
                                    </div>
                                </div>
                                
                                <div class="next-steps">
                                    <h3>What's Next?</h3>
                                    <p>Your group is now live! Share your group with friends or wait for others to join. You'll receive notifications when someone joins your group.</p>
                                </div>
                                
                                <button class="btn btn-primary" id="done-button">Done</button>
                            </div>
                        </div>
                    `;
                    
                    document.body.appendChild(successPopup);
                    
                    // Close popup event
                    successPopup.querySelector('.close-popup').addEventListener('click', function() {
                        document.body.removeChild(successPopup);
                        window.location.href = 'index.html';
                    });
                    
                    // Done button
                    successPopup.querySelector('#done-button').addEventListener('click', function() {
                        document.body.removeChild(successPopup);
                        window.location.href = 'index.html';
                    });
                    
                    // Reset form
                    hostSplitForm.reset();
                    
                } else {
                    // Show error message
                    alert(`Failed to create group: ${data.message || 'Unknown error'}`);
                }
            })
            .catch(error => {
                document.body.removeChild(processingOverlay);
                console.error('Error hosting split:', error);
                alert('Error creating split group: ' + error.message);
            });
        });
    }
}); 