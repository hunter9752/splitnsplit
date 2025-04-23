// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navWrapper = document.querySelector('.nav-wrapper');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navWrapper.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a nav link
    const navItems = document.querySelectorAll('.nav-links a');
    if (navItems.length > 0) {
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                if (hamburger.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navWrapper.classList.remove('active');
                    navLinks.classList.remove('active');
                }
            });
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.navbar') && hamburger.classList.contains('active')) {
            hamburger.classList.remove('active');
            navWrapper.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    // Tab functionality for Join/Host split page
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabButtons.length > 0 && tabContents.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to current button and content
                this.classList.add('active');
                document.getElementById(`${tabId}-tab`).classList.add('active');
            });
        });
    }

    // Deal type selection in host form
    const dealTypeSelect = document.getElementById('deal-type');
    const existingDealSection = document.getElementById('existing-deal');
    const customDealSection = document.getElementById('custom-deal');

    if (dealTypeSelect && existingDealSection && customDealSection) {
        dealTypeSelect.addEventListener('change', function() {
            if (this.value === 'existing') {
                existingDealSection.classList.remove('hidden');
                customDealSection.classList.add('hidden');
            } else if (this.value === 'custom') {
                existingDealSection.classList.add('hidden');
                customDealSection.classList.remove('hidden');
            } else {
                existingDealSection.classList.add('hidden');
                customDealSection.classList.add('hidden');
            }
        });
    }

    // Filter tag removal
    const filterTags = document.querySelectorAll('.filter-tag i');
    if (filterTags.length > 0) {
        filterTags.forEach(tag => {
            tag.addEventListener('click', function() {
                this.parentElement.remove();
            });
        });
    }

    // Clear all filters
    const clearFiltersBtn = document.querySelector('.clear-filters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            const filterTags = document.querySelectorAll('.filter-tag');
            filterTags.forEach(tag => tag.remove());
        });
    }

    // FAQ Accordion Functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.toggle-icon i');
        
        question.addEventListener('click', () => {
            // Toggle current item
            item.classList.toggle('active');
            
            // Update icon
            if (item.classList.contains('active')) {
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-minus');
            } else {
                icon.classList.remove('fa-minus');
                icon.classList.add('fa-plus');
            }
        });
    });

    // Brand Filtering Functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const brandBoxes = document.querySelectorAll('.brand-box');
    const searchInput = document.querySelector('.search-brands input');
    
    if (filterButtons.length && brandBoxes.length) {
        // Filter by category button click
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                const filterValue = button.getAttribute('data-filter');
                
                // Show all brands if 'all' is selected, otherwise filter
                if (filterValue === 'all') {
                    brandBoxes.forEach(box => {
                        box.style.display = 'block';
                    });
                } else {
                    brandBoxes.forEach(box => {
                        const categories = box.getAttribute('data-category').split(' ');
                        if (categories.includes(filterValue)) {
                            box.style.display = 'block';
                        } else {
                            box.style.display = 'none';
                        }
                    });
                }
            });
        });
        
        // Search functionality
        if (searchInput) {
            searchInput.addEventListener('keyup', () => {
                const searchValue = searchInput.value.toLowerCase();
                
                brandBoxes.forEach(box => {
                    const brandName = box.querySelector('h2').textContent.toLowerCase();
                    const brandDescription = box.querySelector('p').textContent.toLowerCase();
                    
                    if (brandName.includes(searchValue) || brandDescription.includes(searchValue)) {
                        box.style.display = 'block';
                    } else {
                        box.style.display = 'none';
                    }
                });
            });
        }
    }

    // Banner slider animation pause on hover
    const heroSlider = document.querySelector('.banner-slider');
    if (heroSlider) {
        heroSlider.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
        });
        
        heroSlider.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
        });
    }

    // Animated entrance for How It Works steps
    const steps = document.querySelectorAll('.step');
    if (steps.length > 0) {
        function checkIfInView() {
            steps.forEach((step, index) => {
                const rect = step.getBoundingClientRect();
                const isInViewport = (
                    rect.top >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
                );
                
                if (isInViewport) {
                    step.style.animation = `fadeIn 0.6s ease-in-out ${index * 0.2}s forwards`;
                }
            });
        }
        
        // Check when scrolling
        window.addEventListener('scroll', checkIfInView);
        // Check on page load
        checkIfInView();
    }

    // Form validation for host form
    const hostForm = document.querySelector('.host-form');
    if (hostForm) {
        hostForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const requiredFields = hostForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (isValid) {
                // Show success message or redirect
                alert('Your split has been created successfully!');
                hostForm.reset();
            } else {
                alert('Please fill in all required fields.');
            }
        });
    }

    // Contact form validation
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = contactForm.querySelector('input[type="email"]');
            const message = contactForm.querySelector('textarea');
            
            if (!email.value.trim() || !message.value.trim()) {
                alert('Please fill in all fields.');
                return;
            }
            
            // Show success message
            alert('Your message has been sent successfully!');
            contactForm.reset();
        });
    }

    // Deal cards hover effect enhancement
    const dealCards = document.querySelectorAll('.deal-card');
    if (dealCards.length > 0) {
        dealCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
                this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.1)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
            });
        });
    }

    // Smooth scroll for internal links
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    if (internalLinks.length > 0) {
        internalLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Adjust for fixed header
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Search functionality for deals/groups
    const searchInputs = document.querySelectorAll('.search-bar input');
    if (searchInputs.length > 0) {
        searchInputs.forEach(input => {
            input.addEventListener('keyup', function(e) {
                if (e.key === 'Enter') {
                    const searchTerm = this.value.toLowerCase().trim();
                    if (!searchTerm) return;
                    
                    // Perform search (in a real app this would filter results)
                    alert(`Searching for: ${searchTerm}`);
                }
            });
        });
    }

    // Theme Toggle Functionality - Updated for floating button
    const themeToggle = document.querySelector('#theme-toggle');
    const themeIcon = document.querySelector('.theme-icon i');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Check for saved theme preference or use the system preference
    const getCurrentTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        return prefersDarkScheme.matches ? 'dark' : 'light';
    };

    // Apply the current theme
    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        if (themeToggle) {
            themeToggle.checked = theme === 'dark';
            
            // Update the icon
            if (themeIcon) {
                if (theme === 'dark') {
                    themeIcon.className = 'fas fa-sun';
                } else {
                    themeIcon.className = 'fas fa-moon';
                }
            }
        }
    };

    // Initialize theme
    const currentTheme = getCurrentTheme();
    applyTheme(currentTheme);

    // Handle theme toggle changes
    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            const theme = this.checked ? 'dark' : 'light';
            applyTheme(theme);
            localStorage.setItem('theme', theme);
        });
    }

    // Add animation to the theme toggle
    const themeSwitch = document.querySelector('.theme-switch-wrapper');
    if (themeSwitch) {
        themeSwitch.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        themeSwitch.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
        
        // Add a small bounce animation on page load
        setTimeout(() => {
            themeSwitch.style.animation = 'bounce 0.5s ease';
            setTimeout(() => {
                themeSwitch.style.animation = '';
            }, 500);
        }, 1000);
    }

    // Add keyframe for bounce animation
    const style = document.createElement('style');
    style.innerHTML = `
    @keyframes bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }`;
    document.head.appendChild(style);

    // Global Search Functionality
    const globalSearchInput = document.querySelector('.global-search input');
    const searchResults = document.querySelector('.search-results');

    if (globalSearchInput) {
        globalSearchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter' || this.value.length > 2) {
                performSearch(this.value);
            }
            
            if (this.value.length === 0) {
                searchResults.classList.remove('active');
            }
        });
        
        // Close search results when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.global-search') && !e.target.closest('.search-results')) {
                searchResults.classList.remove('active');
            }
        });
    }

    function performSearch(query) {
        // Demo search data - in a real app, this would come from an API
        const searchData = [
            { id: 1, title: 'Netflix Premium', category: 'Streaming', description: '4K Ultra HD streaming with 4 screens', url: 'deals.html#netflix' },
            { id: 2, title: 'Spotify Family', category: 'Music', description: 'Music streaming for up to 6 accounts', url: 'deals.html#spotify' },
            { id: 3, title: 'Adobe Creative Cloud', category: 'Software', description: 'Complete creative suite for designers', url: 'deals.html#adobe' },
            { id: 4, title: 'Gold\'s Gym Membership', category: 'Fitness', description: 'Annual gym membership with all facilities', url: 'deals.html#golds' },
            { id: 5, title: 'Chanel Beauty Box', category: 'Shopping', description: 'Monthly beauty products subscription', url: 'deals.html#chanel' },
            { id: 6, title: 'Game Nation Pass', category: 'Gaming', description: 'Access to exclusive game releases', url: 'deals.html#gaming' },
            { id: 7, title: 'HBO Max', category: 'Streaming', description: 'Premium streaming with exclusive shows', url: 'deals.html#hbo' },
            { id: 8, title: 'YouTube Premium', category: 'Streaming', description: 'Ad-free viewing and music streaming', url: 'deals.html#youtube' }
        ];
        
        // Filter results based on query
        const results = searchData.filter(item => {
            return item.title.toLowerCase().includes(query.toLowerCase()) || 
                   item.description.toLowerCase().includes(query.toLowerCase()) ||
                   item.category.toLowerCase().includes(query.toLowerCase());
        });
        
        // Display results
        if (results.length > 0) {
            let html = '';
            results.forEach(item => {
                html += `
                    <div class="search-result-item">
                        <span class="search-result-category">${item.category}</span>
                        <h4><a href="${item.url}">${item.title}</a></h4>
                        <p>${item.description}</p>
                    </div>
                `;
            });
            
            searchResults.innerHTML = html;
            searchResults.classList.add('active');
        } else {
            searchResults.innerHTML = '<div class="search-result-item"><p>No results found for "' + query + '"</p></div>';
            searchResults.classList.add('active');
        }
    }

    // Gallery Functionality
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryModal = document.querySelector('.gallery-modal');
    let currentGalleryIndex = 0;

    if (galleryItems.length > 0) {
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                openGalleryModal(index);
            });
        });
        
        // Modal navigation
        const prevBtn = document.querySelector('.modal-prev');
        const nextBtn = document.querySelector('.modal-next');
        const closeBtn = document.querySelector('.modal-close');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                navigateGallery(-1);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                navigateGallery(1);
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', closeGalleryModal);
        }
        
        // Close on outside click
        galleryModal.addEventListener('click', (e) => {
            if (e.target === galleryModal) {
                closeGalleryModal();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!galleryModal.classList.contains('open')) return;
            
            if (e.key === 'ArrowLeft') {
                navigateGallery(-1);
            } else if (e.key === 'ArrowRight') {
                navigateGallery(1);
            } else if (e.key === 'Escape') {
                closeGalleryModal();
            }
        });
    }

    function openGalleryModal(index) {
        currentGalleryIndex = index;
        updateGalleryModal();
        galleryModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeGalleryModal() {
        galleryModal.classList.remove('open');
        document.body.style.overflow = '';
    }

    function navigateGallery(direction) {
        currentGalleryIndex += direction;
        
        // Loop around if at the end
        if (currentGalleryIndex < 0) {
            currentGalleryIndex = galleryItems.length - 1;
        } else if (currentGalleryIndex >= galleryItems.length) {
            currentGalleryIndex = 0;
        }
        
        updateGalleryModal();
    }

    function updateGalleryModal() {
        const item = galleryItems[currentGalleryIndex];
        const modalContent = document.querySelector('.modal-content');
        const modalCaption = document.querySelector('.modal-caption');
        
        const imgSrc = item.querySelector('img').getAttribute('src');
        const title = item.querySelector('.gallery-caption h3').textContent;
        const desc = item.querySelector('.gallery-caption p').textContent;
        
        modalContent.innerHTML = `<img src="${imgSrc}" alt="${title}">`;
        modalCaption.innerHTML = `<h3>${title}</h3><p>${desc}</p>`;
    }

    // Video lazy loading
    const videos = document.querySelectorAll('.video-container');
    if (videos.length > 0) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const iframe = entry.target.querySelector('iframe');
                    const src = iframe.getAttribute('data-src');
                    iframe.setAttribute('src', src);
                    videoObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        videos.forEach(video => {
            videoObserver.observe(video);
        });
    }

    // Plan Availability Status Indicator Function
    function updateAvailabilityStatus() {
        const availabilityIndicators = document.querySelectorAll('.availability-indicator');
        
        availabilityIndicators.forEach(indicator => {
            const statusText = indicator.querySelector('span').textContent.toLowerCase();
            
            // Remove all status classes first
            indicator.classList.remove('available', 'limited', 'filling', 'sold-out');
            
            // Add appropriate class based on status text
            if (statusText.includes('available')) {
                indicator.classList.add('available');
            } else if (statusText.includes('limited')) {
                indicator.classList.add('limited');
            } else if (statusText.includes('filling')) {
                indicator.classList.add('filling');
            } else if (statusText.includes('full') || statusText.includes('sold out')) {
                indicator.classList.add('sold-out');
            }
        });
    }

    // Call this function when page loads to set initial statuses
    if (document.querySelector('.availability-indicator')) {
        updateAvailabilityStatus();
    }

    // Join Split Modal Functionality
    const joinSplitModal = document.getElementById('joinSplitModal');
    const successModal = document.getElementById('successModal');
    const closeButtons = document.getElementsByClassName('close');

    // Close modal when clicking on X
    Array.from(closeButtons).forEach(button => {
        button.onclick = function() {
            joinSplitModal.style.display = "none";
            successModal.style.display = "none";
        }
    });

    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target == joinSplitModal) {
            joinSplitModal.style.display = "none";
        }
        if (event.target == successModal) {
            successModal.style.display = "none";
        }
    }

    function openJoinSplitModal(dealId) {
        const dealInfo = getDealInfo(dealId);
        document.getElementById('selectedDealInfo').innerHTML = `
            <h3>${dealInfo.name}</h3>
            <p>Plan: ${dealInfo.plan}</p>
            <p>Price: ${dealInfo.price}</p>
            <p>Members: ${dealInfo.currentMembers}/${dealInfo.maxMembers}</p>
        `;
        joinSplitModal.style.display = "block";
    }

    function closeSuccessModal() {
        successModal.style.display = "none";
    }

    // Handle form submission
    const joinSplitForm = document.getElementById('joinSplitForm');
    if (joinSplitForm) {
        joinSplitForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const address = document.getElementById('address').value;
            
            // Get selected plan details
            const selectedPlan = document.querySelector('.selected-plan-details');
            const planName = selectedPlan.querySelector('h3').textContent;
            const planPrice = selectedPlan.querySelector('.price').textContent;
            const brandName = window.location.hash.slice(1);
            
            console.log('Sending data:', { 
                username, 
                email, 
                phone, 
                address,
                plan: {
                    name: planName,
                    price: planPrice,
                    brand: brandName
                }
            });
            
            try {
                const response = await fetch('http://localhost:5000/api/deals/join-split', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ 
                        username, 
                        email, 
                        phone, 
                        address,
                        plan: {
                            name: planName,
                            price: planPrice,
                            brand: brandName
                        }
                    })
                });
                
                // Check if the response is ok
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to join split');
                }
                
                const responseData = await response.json();
                console.log('Join split response:', responseData);

                // Show success message
                const modal = document.getElementById('successModal');
                const successMessage = document.getElementById('successMessage');
                successMessage.innerHTML = `
                    <h3>Welcome to ${brandName} Split!</h3>
                    <p>Aapka split join request successful raha hai! Hum jald hi aapse contact karenge.</p>
                    <div class="plan-summary">
                        <p><strong>Plan:</strong> ${planName}</p>
                        <p><strong>Price:</strong> ${planPrice}</p>
                    </div>
                `;
                modal.style.display = "block";
                
                // Close button handler
                const closeBtn = document.getElementsByClassName("close")[0];
                closeBtn.onclick = function() {
                    modal.style.display = "none";
                }
                
                // Click outside modal to close
                window.onclick = function(event) {
                    if (event.target == modal) {
                        modal.style.display = "none";
                    }
                }
                
            } catch (error) {
                console.log('Error:', error);
            }
        });
    }

    // Close modals when clicking on X
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });

    // Handle Join Split button clicks
    document.querySelectorAll('.btn-elegant').forEach(button => {
        if (button.textContent === 'Join This Split') {
            button.addEventListener('click', handleJoinSplitClick);
        }
    });

    // Handle payment
    const paymentButton = document.getElementById('paymentButton');
    if (paymentButton) {
        paymentButton.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/deals/join-split', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });

                // Show success message regardless of response status
                document.getElementById('joinSplitModal').style.display = 'none';
                
                // Show success message
                document.getElementById('successMessage').innerHTML = `
                    <h3>Welcome to ${userData.plan.brand} Split!</h3>
                    <p>Aapka payment process ho raha hai. Hum jald hi aapse contact karenge.</p>
                    <div class="plan-summary">
                        <p><strong>Plan:</strong> ${userData.plan.name}</p>
                        <p><strong>Price:</strong> ${userData.plan.price}</p>
                    </div>
                `;
                document.getElementById('successModal').style.display = 'block';
                
                // Reset user data
                userData = {
                    username: '',
                    email: '',
                    phone: '',
                    address: '',
                    plan: {
                        name: '',
                        price: '',
                        brand: ''
                    }
                };

            } catch (error) {
                console.log('Error:', error);
                // Still show success message even if there's an error
                document.getElementById('joinSplitModal').style.display = 'none';
                document.getElementById('successMessage').innerHTML = `
                    <h3>Welcome to ${userData.plan.brand} Split!</h3>
                    <p>Aapka payment process ho raha hai. Hum jald hi aapse contact karenge.</p>
                    <div class="plan-summary">
                        <p><strong>Plan:</strong> ${userData.plan.name}</p>
                        <p><strong>Price:</strong> ${userData.plan.price}</p>
                    </div>
                `;
                document.getElementById('successModal').style.display = 'block';
            }
        });
    }

    // Handle user details form submission
    const userDetailsForm = document.getElementById('userDetailsForm');
    if (userDetailsForm) {
        userDetailsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Store user data
            userData.username = document.getElementById('username').value;
            userData.email = document.getElementById('email').value;
            userData.phone = document.getElementById('phone').value;
            userData.address = document.getElementById('address').value;
            
            // Update plan details display
            updatePlanDetails();
            
            // Go to next step
            goToStep(2);
        });
    }
});

async function handleFormSubmission(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const selectedPlan = document.querySelector('.selected-plan-details');
    const planName = selectedPlan.querySelector('h3').textContent;
    const planPrice = selectedPlan.querySelector('.price').textContent;
    const brandName = window.location.hash.slice(1); // Get brand name from URL hash

    // Show loading state
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Processing...';
    submitButton.disabled = true;
    
    try {
        const response = await fetch('/api/deals/join-split', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                username,
                email,
                planName,
                planPrice,
                brandName
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response:', data);

        if (data.success) {
            // Hide join form modal
            document.getElementById('joinSplitModal').style.display = 'none';

            // Show success message
            document.getElementById('successMessage').innerHTML = `
                <h3>Almost there!</h3>
                <p>Please complete the payment to join the split group.</p>
                <p>A confirmation email has been sent to ${email}.</p>
            `;
            document.getElementById('successModal').style.display = 'block';

            // Initialize Razorpay if payment data is available
            if (data.payment) {
                const options = {
                    key: 'YOUR_RAZORPAY_KEY_ID',
                    amount: data.payment.amount * 100,
                    currency: data.payment.currency,
                    name: 'Split N Split',
                    description: `${brandName} - ${planName}`,
                    order_id: data.payment.orderId,
                    handler: function (response) {
                        verifyPayment(response);
                    },
                    prefill: {
                        name: username,
                        email: email
                    },
                    theme: {
                        color: '#007bff'
                    }
                };

                const rzp = new Razorpay(options);
                rzp.open();
            }
        } else {
            throw new Error(data.message || 'Failed to join split group');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error joining split group: ' + error.message);
    } finally {
        // Reset button state
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    }
}

let userData = {
    username: '',
    email: '',
    phone: '',
    address: '',
    plan: {
        name: '',
        price: '',
        brand: ''
    }
};

function handleJoinSplitClick(e) {
    e.preventDefault();
    const planCard = e.target.closest('.plan-card');
    
    // Get plan details
    const planName = planCard.querySelector('.plan-header h3').textContent;
    const planPrice = planCard.querySelector('.price-amount').textContent;
    const planFeatures = Array.from(planCard.querySelectorAll('.plan-features li'))
        .map(li => li.textContent.trim())
        .join('\n');
    
    // Store plan info
    userData.plan = {
        name: planName,
        price: planPrice,
        brand: window.location.hash.slice(1),
        features: planFeatures
    };
    
    // Show first step of modal
    const modal = document.getElementById('joinSplitModal');
    modal.style.display = 'block';
    goToStep(1);
}

function updatePlanDetails() {
    // Update selected deal info
    document.getElementById('selectedDealInfo').innerHTML = `
        <div class="plan-info">
            <h4>${userData.plan.name}</h4>
            <p class="price">${userData.plan.price}</p>
            <div class="features">${userData.plan.features}</div>
        </div>
        <div class="user-info">
            <p><strong>Name:</strong> ${userData.username}</p>
            <p><strong>Email:</strong> ${userData.email}</p>
            <p><strong>Phone:</strong> ${userData.phone}</p>
            <p><strong>Address:</strong> ${userData.address}</p>
        </div>
    `;

    // Fetch and update current members count
    fetchMembersCount(userData.plan.name);
}

async function fetchMembersCount(planName) {
    try {
        const response = await fetch(`/api/deals/members-count/${planName}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch members count: ${response.status}`);
        }
        
        const data = await response.json();
        
        const currentMembersElement = document.getElementById('currentMembersCount');
        const maxMembersElement = document.getElementById('maxMembersCount');
        const membersProgressElement = document.getElementById('membersProgress');
        
        if (currentMembersElement && maxMembersElement && membersProgressElement) {
            currentMembersElement.textContent = data.currentMembers;
            maxMembersElement.textContent = data.maxMembers;
            
            // Update progress bar
            const progress = (data.currentMembers / data.maxMembers) * 100;
            membersProgressElement.style.width = `${progress}%`;
        }

        // Check if group is full and reset if needed
        if (data.currentMembers >= data.maxMembers) {
            console.log('Group is full, resetting members...');
            try {
                const resetResponse = await fetch(`/api/deals/reset-members/${planName}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (resetResponse.ok) {
                    console.log('Group members reset successfully');
                    // Refresh the members count after reset
                    fetchMembersCount(planName);
                }
            } catch (error) {
                console.error('Error resetting group members:', error);
            }
        }
    } catch (error) {
        console.error('Error fetching members count:', error);
    }
}

function goToStep(step) {
    // Hide all steps
    document.querySelectorAll('.modal-step').forEach(el => el.style.display = 'none');
    
    // Show selected step
    document.getElementById(`step${step}`).style.display = 'block';
    
    if (step === 3) {
        // Update payment details
        document.getElementById('paymentDetails').innerHTML = `
            <div class="payment-info">
                <p><strong>Plan:</strong> ${userData.plan.name}</p>
                <p><strong>Price:</strong> ${userData.plan.price}</p>
                <p><strong>Brand:</strong> ${userData.plan.brand}</p>
            </div>
        `;
    }
}

async function verifyPayment(response) {
    try {
        const result = await fetch('/api/deals/payment-webhook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                userData: userData
            })
        });

        const data = await result.json();
        if (data.success) {
            // Hide join modal
            document.getElementById('joinSplitModal').style.display = 'none';
            
            // Show success message
            document.getElementById('successMessage').innerHTML = `
                <h3>Welcome to ${userData.plan.brand} Split!</h3>
                <p>Aapka payment process ho raha hai. Hum jald hi aapse contact karenge.</p>
                <div class="plan-summary">
                    <p><strong>Plan:</strong> ${userData.plan.name}</p>
                    <p><strong>Price:</strong> ${userData.plan.price}</p>
                </div>
            `;
            document.getElementById('successModal').style.display = 'block';
        } else {
            throw new Error(data.message || 'Failed to verify payment');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error verifying payment: ' + error.message);
    }
}

// Brand Details Page - Join Split Form
document.addEventListener('DOMContentLoaded', function() {
    // Get all "Join This Split" buttons on the brand details page
    const joinButtons = document.querySelectorAll('.plan-card .btn-elegant');
    const joinSplitModal = document.getElementById('joinSplitModal');
    const successModal = document.getElementById('successModal');
    
    // Modal step functions
    window.goToStep = function(stepNumber) {
        document.querySelectorAll('.modal-step').forEach(step => {
            step.style.display = 'none';
        });
        document.getElementById('step' + stepNumber).style.display = 'block';
    };
    
    // Store selected plan data
    let selectedPlan = {
        name: '',
        price: '',
        badge: '',
        features: []
    };
    
    // Handle join button clicks
    joinButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get plan details from the card
            const planCard = this.closest('.plan-card');
            const planName = planCard.querySelector('.plan-header h3').textContent;
            const planBadge = planCard.querySelector('.plan-badge').textContent;
            const planPrice = planCard.querySelector('.price-amount').textContent;
            const planFeatures = Array.from(planCard.querySelectorAll('.plan-features li'))
                .map(li => li.textContent.trim());
            
            // Store selected plan data
            selectedPlan = {
                name: planName,
                badge: planBadge,
                price: planPrice,
                features: planFeatures,
                brand: 'Netflix' // Get from page title or URL
            };
            
            // Display the modal
            joinSplitModal.style.display = 'block';
            goToStep(1);
        });
    });
    
    // Close modal when clicking X or outside
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            joinSplitModal.style.display = 'none';
            successModal.style.display = 'none';
        });
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === joinSplitModal) {
            joinSplitModal.style.display = 'none';
        }
        if (e.target === successModal) {
            successModal.style.display = 'none';
        }
    });
    
    // Handle form submission
    const userDetailsForm = document.getElementById('userDetailsForm');
    if (userDetailsForm) {
        userDetailsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect user data
            const userData = {
                username: document.getElementById('username').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value
            };
            
            // Update plan details in step 2
            document.getElementById('selectedDealInfo').innerHTML = `
                <div class="selected-plan">
                    <h4>${selectedPlan.name} - ${selectedPlan.badge}</h4>
                    <p class="plan-price">${selectedPlan.price}</p>
                    <ul class="features-list">
                        ${selectedPlan.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
            `;
            
            // Set members count (could be fetched from server)
            document.getElementById('currentMembersCount').textContent = '3';
            document.getElementById('maxMembersCount').textContent = selectedPlan.name.includes('4-Person') ? '4' : 
                selectedPlan.name.includes('6-Person') ? '6' : 
                selectedPlan.name.includes('8-Person') ? '8' : '2';
            
            // Update progress bar
            const currentMembers = parseInt(document.getElementById('currentMembersCount').textContent);
            const maxMembers = parseInt(document.getElementById('maxMembersCount').textContent);
            const progress = (currentMembers / maxMembers) * 100;
            document.getElementById('membersProgress').style.width = `${progress}%`;
            
            // Save user data to session storage
            sessionStorage.setItem('userData', JSON.stringify(userData));
            sessionStorage.setItem('selectedPlan', JSON.stringify(selectedPlan));
            
            // Go to step 2
            goToStep(2);
        });
    }
    
    // Handle payment step
    const paymentButton = document.getElementById('paymentButton');
    if (paymentButton) {
        paymentButton.addEventListener('click', function() {
            // Get stored data
            const userData = JSON.parse(sessionStorage.getItem('userData'));
            const selectedPlan = JSON.parse(sessionStorage.getItem('selectedPlan'));
            
            // Extract price value (remove ₹ and /month)
            const priceMatch = selectedPlan.price.match(/₹(\d+)/);
            const price = priceMatch ? priceMatch[1] : '100';
            
            // Show processing overlay
            const processingOverlay = document.createElement('div');
            processingOverlay.className = 'processing-overlay';
            processingOverlay.innerHTML = `
                <div class="processing-container">
                    <div class="spinner"></div>
                    <p>Processing your request...</p>
                </div>
            `;
            document.body.appendChild(processingOverlay);
            
            // Create payload for backend
            const payload = {
                username: userData.username,
                email: userData.email,
                phone: userData.phone,
                address: userData.address,
                plan: {
                    name: selectedPlan.name,
                    brand: selectedPlan.brand,
                    price: `₹${price}`
                }
            };
            
            // Save user data to backend
            fetch('/api/deals/join-split', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(response => response.json())
            .then(data => {
                // Remove processing overlay
                document.body.removeChild(processingOverlay);
                
                if (data.success) {
                    // Close join modal
                    joinSplitModal.style.display = 'none';
                    
                    // Show success message
                    document.getElementById('successMessage').innerHTML = `
                        <p>You have successfully joined the ${selectedPlan.name} group!</p>
                        <p>Your confirmed monthly payment: <strong>${selectedPlan.price}</strong></p>
                        <p>We've sent an email to <strong>${userData.email}</strong> with all the details.</p>
                        <p>You'll be notified when the group is complete and the subscription is activated.</p>
                    `;
                    
                    // Show success modal
                    successModal.style.display = 'block';
                    
                    // Clear stored data
                    sessionStorage.removeItem('userData');
                    sessionStorage.removeItem('selectedPlan');
                } else {
                    alert('Error: ' + (data.message || 'Failed to join the split group'));
                }
            })
            .catch(error => {
                // Remove processing overlay
                document.body.removeChild(processingOverlay);
                console.error('Error joining split:', error);
                alert('Failed to connect to server. Please try again later.');
            });
        });
    }
    
    // Close success modal
    window.closeSuccessModal = function() {
        successModal.style.display = 'none';
        window.location.reload(); // Refresh the page
    };
});