document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const body = document.body;
    const themeToggleButton = document.getElementById('theme-toggle');
    
    // Check if there's a saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.classList.add(`${savedTheme}-theme`);
    
    if (themeToggleButton) {
        themeToggleButton.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        
        themeToggleButton.addEventListener('click', () => {
            const isDark = body.classList.toggle('dark-theme');
            body.classList.toggle('light-theme', !isDark);
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            console.log(`Theme switched to: ${isDark ? 'dark' : 'light'}`);
            
            // Update header background based on theme
            updateHeaderBackground();
        });
    }

    // Navbar Scroll Effect with Theme Awareness
    const header = document.querySelector('header');
    
    function updateHeaderBackground() {
        const isDark = body.classList.contains('dark-theme');
        const isScrolled = window.scrollY > 50;
        
        if (isScrolled) {
            header.style.background = isDark ? 
                'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.9)';
            header.style.boxShadow = isDark ?
                '0 5px 15px rgba(0,0,0,0.3)' : '0 5px 15px rgba(0,0,0,0.1)';
        } else {
            header.style.background = isDark ? 
                'var(--netflix-black)' : 'var(--light-bg)';
            header.style.boxShadow = 'none';
        }
    }

    window.addEventListener('scroll', updateHeaderBackground);
    
    // Initial header update
    updateHeaderBackground();

    // Plan Selection
    const planCards = document.querySelectorAll('.plan-card');
    planCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove selected class from all cards
            planCards.forEach(c => c.classList.remove('selected'));
            // Add selected class to clicked card
            card.classList.add('selected');
        });
    });

    // Split Members Management
    const emptyMembers = document.querySelectorAll('.member.empty');
    emptyMembers.forEach(member => {
        member.addEventListener('click', () => {
            // Simulate adding a new member
            member.innerHTML = `<img src="img_vid/avatar${Math.floor(Math.random() * 4) + 2}.png" alt="New Member">`;
            member.classList.remove('empty');
            member.classList.add('active');
            
            // Check if all members are filled in this plan
            const planCard = member.closest('.plan-card');
            const emptyMembersInPlan = planCard.querySelectorAll('.member.empty');
            
            if (emptyMembersInPlan.length === 0) {
                // All members filled, show success message
                const splitBtn = planCard.querySelector('.split-btn');
                splitBtn.innerHTML = '<i class="fas fa-check"></i> Group Complete!';
                splitBtn.classList.add('success');
                
                // Add confetti effect
                createConfetti(planCard);
            }
        });
    });

    // Split Button Animation
    const splitButtons = document.querySelectorAll('.split-btn');
    splitButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const plan = btn.closest('.plan-card').dataset.plan;
            
            // Add loading state
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            btn.disabled = true;

            // Simulate processing
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-check"></i> Group Created!';
                
                // Reset after 2 seconds
                setTimeout(() => {
                    btn.innerHTML = 'Split & Save Now';
                    btn.disabled = false;
                }, 2000);
            }, 1500);
        });
    });

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Testimonial Slider
    const testimonials = document.querySelectorAll('.testimonial');
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.style.opacity = i === index ? '1' : '0.3';
            testimonial.style.transform = i === index ? 'scale(1.05)' : 'scale(1)';
        });
    }
    
    // Initialize testimonial slider
    if (testimonials.length > 0) {
        showTestimonial(currentTestimonial);
        
        // Auto rotate testimonials
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }, 5000);
    }

    // Smooth Scroll for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add hover effect for plan cards
    planCards.forEach(card => {
        card.addEventListener('mouseover', () => {
            if (!card.classList.contains('featured')) {
                card.style.transform = 'translateY(-10px)';
            }
        });

        card.addEventListener('mouseout', () => {
            if (!card.classList.contains('featured')) {
                card.style.transform = 'translateY(0)';
            }
        });
    });

    // Feature cards animation
    const animateOnScroll = (elements, options = {}) => {
        const observerOptions = {
            threshold: options.threshold || 0.2,
            rootMargin: options.rootMargin || '0px'
        };
    
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
    
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = options.transform || 'translateY(30px)';
            el.style.transition = `all ${options.duration || 0.5}s ease-out ${index * (options.delay || 0.1)}s`;
            observer.observe(el);
        });
    };
    
    // Apply animations to different sections
    const featureCards = document.querySelectorAll('.feature-card');
    const steps = document.querySelectorAll('.step');
    const testimonialItems = document.querySelectorAll('.testimonial');
    
    if (featureCards.length > 0) {
        animateOnScroll(featureCards);
    }
    
    if (steps.length > 0) {
        animateOnScroll(steps, { delay: 0.15, transform: 'translateX(-30px)' });
    }
    
    if (testimonialItems.length > 0) {
        animateOnScroll(testimonialItems, { delay: 0.2 });
    }

    // CTA Buttons
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const plansSection = document.getElementById('plans');
            if (plansSection) {
                window.scrollTo({
                    top: plansSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Confetti Effect
    function createConfetti(container) {
        const colors = ['#0071EB', '#8E44AD', '#2ECC71', '#FFFFFF', '#5A1FE0'];
        const numConfetti = 100;
        
        for (let i = 0; i < numConfetti; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = -10 + 'px';
            confetti.style.width = Math.random() * 8 + 5 + 'px';
            confetti.style.height = Math.random() * 4 + 3 + 'px';
            confetti.style.opacity = Math.random() + 0.5;
            confetti.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
            confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
            confetti.style.animationDelay = Math.random() * 5 + 's';
            
            container.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
    }

    // Add active class to current navigation link
    const navLinks = document.querySelectorAll('nav ul li a');
    
    // Add click event to each link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
        });
    });

    // Set active link based on current URL
    const currentLocation = window.location.hash || '#plans';
    const activeLink = document.querySelector(`nav ul li a[href="${currentLocation}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Add CSS for confetti animation
    const style = document.createElement('style');
    style.textContent = `
        .confetti {
            position: absolute;
            z-index: 1000;
            pointer-events: none;
            animation: confettiFall linear forwards;
        }
        
        @keyframes confettiFall {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(300px) rotate(720deg);
                opacity: 0;
            }
        }
        
        .animate {
            opacity: 1 !important;
            transform: translate(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Countdown Timer
    function startCountdown() {
        // Set the countdown date (7 days from now)
        const countdownDate = new Date();
        countdownDate.setDate(countdownDate.getDate() + 7);
        
        function updateCountdown() {
            const now = new Date().getTime();
            const distance = countdownDate.getTime() - now;
            
            // Calculate days, hours, minutes, seconds
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            // Display the countdown
            document.getElementById('days').textContent = days;
            document.getElementById('hours').textContent = hours;
            document.getElementById('minutes').textContent = minutes;
            document.getElementById('seconds').textContent = seconds;
            
            // If the countdown is finished, write some text
            if (distance < 0) {
                clearInterval(countdownTimer);
                document.getElementById('days').textContent = '00';
                document.getElementById('hours').textContent = '00';
                document.getElementById('minutes').textContent = '00';
                document.getElementById('seconds').textContent = '00';
            }
        }
        
        // Update the countdown every 1 second
        const countdownTimer = setInterval(updateCountdown, 1000);
    }
}); 