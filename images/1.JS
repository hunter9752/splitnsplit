document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    const themeToggleButton = document.getElementById('theme-toggle');
    
    // Check if there's a saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light-theme';
    body.classList.add(savedTheme);
    themeToggleButton.textContent = savedTheme === 'dark-theme' ? '☀️' : '🌙';

    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    const searchBar = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.display = i === index ? 'block' : 'none';
        });
    }

    function changeSlide(direction) {
        currentSlide = (currentSlide + direction + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    // Initialize the slider
    showSlide(currentSlide);

    // Change slide every 3 seconds
    setInterval(() => changeSlide(1), 3000);

    themeToggleButton.addEventListener('click', () => {
        if (body.classList.contains('light-theme')) {
            body.classList.replace('light-theme', 'dark-theme');
            themeToggleButton.textContent = '☀️';
            localStorage.setItem('theme', 'dark-theme');
        } else {
            body.classList.replace('dark-theme', 'light-theme');
            themeToggleButton.textContent = '🌙';
            localStorage.setItem('theme', 'light-theme');
        }
    });

    // Search functionality
    searchButton.addEventListener('click', function() {
        const query = searchBar.value.trim();
        if (query) {
            alert(`Searching for: ${query}`);
        } else {
            alert('Please enter a search term.');
        }
    });

    // Timer Popup functionality
    function createTimerPopup() {
        const popup = document.createElement('div');
        popup.className = 'timer-popup';
        
        popup.innerHTML = `
            <div class="timer-popup-content">
                <div class="close-timer">×</div>
                <div class="timer-header">
                    <span class="offer-badge">Limited Time</span>
                    <h3>🔥 Mega Sale Alert! 🔥</h3>
                    <p>Hurry! Offer ends in:</p>
                </div>
                <div class="timer-display">
                    <div class="timer-unit">
                        <div class="timer-value" id="days">00</div>
                        <div class="timer-label">Days</div>
                    </div>
                    <div class="timer-unit">
                        <div class="timer-value" id="hours">00</div>
                        <div class="timer-label">Hours</div>
                    </div>
                    <div class="timer-unit">
                        <div class="timer-value" id="minutes">00</div>
                        <div class="timer-label">Minutes</div>
                    </div>
                    <div class="timer-unit">
                        <div class="timer-value" id="seconds">00</div>
                        <div class="timer-label">Seconds</div>
                    </div>
                </div>
                <div class="timer-footer">
                    <button class="claim-btn">Claim Offer Now!</button>
                </div>
            </div>
        `;

        document.body.appendChild(popup);

        // Close button functionality
        const closeBtn = popup.querySelector('.close-timer');
        closeBtn.onclick = () => {
            popup.style.animation = 'slideOut 0.5s ease forwards';
            setTimeout(() => popup.remove(), 500);
            localStorage.setItem('timerPopupClosed', 'true');
        };

        // Claim button functionality
        const claimBtn = popup.querySelector('.claim-btn');
        claimBtn.onclick = () => {
            window.location.href = '#deals';
            popup.remove();
        };

        // Show popup after 2 seconds
        setTimeout(() => {
            popup.style.animation = 'slideIn 0.5s ease forwards';
        }, 2000);
    }

    // Timer countdown functionality
    function startTimer() {
        const endDate = new Date();
        endDate.setHours(endDate.getHours() + 24); // 24 hours from now

        function updateTimer() {
            const now = new Date().getTime();
            const distance = endDate.getTime() - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('days').textContent = String(days).padStart(2, '0');
            document.getElementById('hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

            if (distance < 0) {
                clearInterval(timerInterval);
                document.querySelector('.timer-popup').remove();
            }
        }

        const timerInterval = setInterval(updateTimer, 1000);
        updateTimer();
    }

    // Show popup only if not closed before
    document.addEventListener('DOMContentLoaded', () => {
        if (!localStorage.getItem('timerPopupClosed')) {
            createTimerPopup();
            startTimer();
        }
    });

    const couponTimer = document.getElementById('coupon-timer');
    if(couponTimer) {
        let timerVisible = false;
        let scrollTimeout;

        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);

            if (!timerVisible) {
                couponTimer.style.opacity = '1';
                couponTimer.style.transform = 'translateX(-50%) translateY(0)';
                timerVisible = true;
            }

            scrollTimeout = setTimeout(function() {
                couponTimer.style.opacity = '0';
                couponTimer.style.transform = 'translateX(-50%) translateY(100px)';
                timerVisible = false;
            }, 1000); // Adjust the delay as needed (1000ms = 1 second)
        });
    }

    // Slider functionality
    function initSlider() {
        let slideIndex = 0;
        const slides = document.querySelectorAll('.slide');
        
        if (slides.length === 0) return;
        
        // Hide all slides initially
        slides.forEach(slide => slide.style.display = 'none');
        // Show first slide
        slides[0].style.display = 'block';
        
        function changeSlide(n) {
            slideIndex += n;
            
            // Loop back to start/end
            if (slideIndex >= slides.length) slideIndex = 0;
            if (slideIndex < 0) slideIndex = slides.length - 1;
            
            // Hide all slides
            slides.forEach(slide => slide.style.display = 'none');
            // Show current slide
            slides[slideIndex].style.display = 'block';
        }
        
        // Add event listeners to buttons
        document.querySelector('.prev').addEventListener('click', () => changeSlide(-1));
        document.querySelector('.next').addEventListener('click', () => changeSlide(1));
        
        // Auto slide every 5 seconds
        setInterval(() => changeSlide(1), 5000);
    }

    document.addEventListener('DOMContentLoaded', initSlider);

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
    const currentLocation = window.location.hash || '#deals';
    const activeLink = document.querySelector(`nav ul li a[href="${currentLocation}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
});
