// Dot & Key Specific JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Debug log to check if script is running
    console.log('Script loaded');
    
    // Check if product cards exist
    const productCards = document.querySelectorAll('.product-card');
    console.log('Found product cards:', productCards.length);
    
    // Add hover effect manually if needed
    productCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.querySelector('.card-inner').style.transform = 'rotateY(180deg)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.querySelector('.card-inner').style.transform = 'rotateY(0)';
        });
    });

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            themeToggle.querySelector('i').className = `fas fa-${isDark ? 'moon' : 'sun'}`;
            updateThemeStyles();
        });
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.add(savedTheme + '-theme');
        updateThemeStyles();
    }

    updateFlashTimers();

    // Add click handlers for split buttons
    document.querySelectorAll('.split-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const dealId = e.target.closest('.split-deal').id;
            handleSplitDealJoin(dealId);
        });
    });
});

// Countdown Timer
function updateCountdown() {
    const endDate = new Date('2024-12-31T23:59:59').getTime();
    const now = new Date().getTime();
    const timeLeft = endDate - now;

    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

setInterval(updateCountdown, 1000);

// Color changing animation for hero text
function applyColorAnimation() {
    const colors = ['#ffb83d', '#ff00ff', '#00f32bf', '#0ff2bf', '#ffffff'];
    let currentIndex = 0;
    const heading = document.getElementById('color-changing-heading');
    const text = document.getElementById('color-changing-text');

    function changeColor() {
        heading.style.color = colors[currentIndex];
        text.style.color = colors[currentIndex] + 'cc'; // Adds transparency
        currentIndex = (currentIndex + 1) % colors.length;
    }

    // Initial color set
    changeColor();
    // Change color every 2 seconds
    setInterval(changeColor, 2000);
}

window.addEventListener('load', applyColorAnimation);

// Copy Functionality
document.querySelectorAll('.hd-copy').forEach(btn => {
    btn.addEventListener('click', function() {
        const code = this.parentElement.querySelector('span').textContent;
        navigator.clipboard.writeText(code).then(() => {
            this.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                this.innerHTML = '<i class="far fa-copy"></i>';
            }, 2000);
        });
    });
});

// Group Join Functionality (Updated)
let headerJoinedUsers = 5;
const headerJoinBtn = document.querySelector('.hd-join');
const headerProgressFill = document.querySelector('.hd-progress-fill');
const userAvatars = document.querySelector('.hd-users');

headerJoinBtn.addEventListener('click', () => {
    if(headerJoinedUsers < 5) {
        headerJoinedUsers++;
        headerProgressFill.style.width = `${(headerJoinedUsers/5)*100}%`;
        
        // Add new user avatar
        const newUser = document.createElement('div');
        newUser.className = 'hd-avatar';
        newUser.innerHTML = `
            <img src="img_vid/user${headerJoinedUsers}.jpg" alt="User">
        `;
        userAvatars.insertBefore(newUser, userAvatars.lastElementChild);
        
        // Update more count
        document.querySelector('.hd-more').textContent = `+${5 - headerJoinedUsers}`;
        
        if(headerJoinedUsers === 5) {
            headerJoinBtn.innerHTML = '<i class="fas fa-check"></i> Deal Activated!';
            headerJoinBtn.disabled = true;
            triggerConfetti();
        }
    }
});

// Confetti Effect
function triggerConfetti() {
    const confettiSettings = {
        target: 'confetti-canvas',
        max: 200,
        size: 1.5,
        animate: true,
        colors: ['#ff6b6b', '#3b82f6', '#43e97b', '#ffd700'],
        clock: 25
    };
    const confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();
    
    setTimeout(() => confetti.clear(), 3000);
}

// Floating Animation Manager
const floatingElements = document.querySelectorAll('.floating');
floatingElements.forEach(el => {
    el.style.animationDelay = `${Math.random() * 2}s`;
});

// Dynamic Progress Ring
const progressCircle = document.querySelector('.progress-circle');
const updateProgress = (percentage) => {
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (percentage/100) * circumference;
    progressCircle.style.strokeDashoffset = offset;
}

// Initialize with 60%
updateProgress(60);

// GSAP Animations
gsap.from('.glass-card', {
    duration: 1,
    y: 50,
    opacity: 0,
    stagger: 0.2,
    ease: 'power3.out'
});

// Initialize Tilt Effect
VanillaTilt.init(document.querySelectorAll('.hd-card'), {
    max: 8,
    speed: 300,
    glare: true,
    "max-glare": 0.1
});

// Interactive Elements
document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const code = e.currentTarget.parentElement.querySelector('span').textContent;
        navigator.clipboard.writeText(code).then(() => {
            btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                btn.innerHTML = '<i class="far fa-copy"></i> Copy';
            }, 2000);
        });
    });
});

// Group Join Simulation
let mainJoinedUsers = 3;
const mainJoinButton = document.querySelector('.cta-button');
const mainProgressFill = document.querySelector('.progress-fill');

mainJoinButton.addEventListener('click', () => {
    if(mainJoinedUsers < 5) {
        mainJoinedUsers++;
        mainProgressFill.style.width = `${(mainJoinedUsers/5)*100}%`;
        document.querySelector('.more-users').textContent = `+${5 - mainJoinedUsers}`;
        
        if(mainJoinedUsers === 5) {
            mainJoinButton.disabled = true;
            mainJoinButton.innerHTML = '<i class="fas fa-check"></i> Group Activated!';
            startConfetti();
            setTimeout(stopConfetti, 3000);
        }
    }
});

// Confetti Effect
function startConfetti() {
    const confettiSettings = { 
        target: 'confetti-canvas',
        max: 200,
        size: 1.5,
        animate: true,
        colors: ['#ff6b6b', '#4facfe', '#43e97b', '#ffd700'],
        clock: 25
    };
    const confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();
}

function stopConfetti() {
    const confettiCanvas = document.getElementById('confetti-canvas');
    if(confettiCanvas) confettiCanvas.remove();
}

// Theme Toggle Function
function updateThemeStyles() {
    const isDark = document.body.classList.contains('dark-theme');
    const splitDeals = document.querySelectorAll('.split-deal');
    
    splitDeals.forEach(deal => {
        // Update deal styles based on theme
        if (isDark) {
            deal.style.transition = 'all 0.3s ease';
        }
    });
}

// Update Flash Timer Display
function updateFlashTimers() {
    const flashTimers = document.querySelectorAll('.flash-timer');
    
    flashTimers.forEach(timer => {
        const endTime = new Date().getTime() + 5400000; // 1.5 hours from now
        
        function updateTimer() {
            const now = new Date().getTime();
            const timeLeft = endTime - now;
            
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            timer.innerHTML = `
                <i class="fas fa-bolt"></i>
                <span>Ends in ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}</span>
            `;
        }
        
        updateTimer();
        setInterval(updateTimer, 1000);
    });
}

// Split Deal Management System
class SplitDealManager {
    constructor(dealId, totalSpots, pricePerPerson) {
        this.dealId = dealId;
        this.totalSpots = totalSpots;
        this.currentSpots = 1; // User who initiates is first
        this.pricePerPerson = pricePerPerson;
        this.participants = [{
            id: 'user-1',
            name: 'You',
            avatar: 'img_vid/USER-removebg-preview.png'
        }];
    }

    addParticipant(participant) {
        if (this.currentSpots < this.totalSpots) {
            this.participants.push(participant);
            this.currentSpots++;
            return true;
        }
        return false;
    }

    isDealComplete() {
        return this.currentSpots === this.totalSpots;
    }

    getRemainingSpots() {
        return this.totalSpots - this.currentSpots;
    }
}

// Initialize Split Deals
const splitDeals = {
    'buy2get2': new SplitDealManager('buy2get2', 4, 499),
    'buy1get1': new SplitDealManager('buy1get1', 2, 799)
};

// Handle Split Deal Join
function handleSplitDealJoin(dealId) {
    const deal = splitDeals[dealId];
    if (!deal) return;

    // Simulate new participant joining
    const newParticipant = {
        id: `user-${deal.currentSpots + 1}`,
        name: `Friend ${deal.currentSpots}`,
        avatar: `img_vid/user${deal.currentSpots + 1}.jpg`
    };

    if (deal.addParticipant(newParticipant)) {
        // Update UI
        updateSplitDealUI(dealId);
        
        if (deal.isDealComplete()) {
            // Deal is complete - show success message and trigger confetti
            showDealSuccess(dealId);
            triggerConfetti();
        }
    }
}

// Update Split Deal UI
function updateSplitDealUI(dealId) {
    const deal = splitDeals[dealId];
    const dealElement = document.querySelector(`#${dealId}`);
    if (!dealElement) return;

    // Update participants display
    const participantsContainer = dealElement.querySelector('.split-members');
    participantsContainer.innerHTML = deal.participants.map(participant => `
        <div class="member active">
            <img src="${participant.avatar}" alt="${participant.name}">
            <span>${participant.name}</span>
            <div class="status-dot"></div>
        </div>
    `).join('');

    // Add empty slots if any
    for (let i = 0; i < deal.getRemainingSpots(); i++) {
        participantsContainer.innerHTML += `
            <div class="member empty">
                <div class="add-friend">
                    <i class="fas fa-user-plus"></i>
                </div>
                <span>Join</span>
            </div>
        `;
    }

    // Update progress bar
    const progressBar = dealElement.querySelector('.progress-fill');
    if (progressBar) {
        progressBar.style.width = `${(deal.currentSpots / deal.totalSpots) * 100}%`;
    }

    // Update status text
    const statusText = dealElement.querySelector('.split-status');
    if (statusText) {
        if (deal.getRemainingSpots() > 0) {
            statusText.textContent = `Need ${deal.getRemainingSpots()} more to unlock deal`;
        } else {
            statusText.textContent = 'Deal Unlocked! 🎉';
        }
    }
}

// Show Deal Success
function showDealSuccess(dealId) {
    const dealElement = document.querySelector(`#${dealId}`);
    if (!dealElement) return;

    const button = dealElement.querySelector('.split-btn');
    if (button) {
        button.innerHTML = '<i class="fas fa-check"></i> Deal Activated!';
        button.classList.add('success');
        button.disabled = true;
    }
}

// Handle Buy Now and Add to Cart actions
document.querySelectorAll('.buy-now').forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent card flip
        // Add your buy now logic here
        alert('Proceeding to checkout...');
    });
});

document.querySelectorAll('.add-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent card flip
        // Add your cart logic here
        alert('Product added to cart!');
    });
});

// Optional: Add touch support for mobile
document.querySelectorAll('.product-card').forEach(card => {
    let touchStart = 0;
    let touchEnd = 0;

    card.addEventListener('touchstart', (e) => {
        touchStart = e.changedTouches[0].screenX;
    });

    card.addEventListener('touchend', (e) => {
        touchEnd = e.changedTouches[0].screenX;
        if (touchStart > touchEnd) {
            card.querySelector('.card-inner').style.transform = 'rotateY(180deg)';
        } else {
            card.querySelector('.card-inner').style.transform = 'rotateY(0)';
        }
    });
});
