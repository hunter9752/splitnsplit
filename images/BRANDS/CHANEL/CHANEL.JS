'use strict';  // Strict mode enable karo

// Home page ke sab functionality inherit karo
import '../../1.js';

// Chanel-specific JS add karo
document.addEventListener('DOMContentLoaded', () => {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const contentCard = document.querySelector('.content-card');

    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const videoHeight = window.innerHeight;

        // Hide scroll indicator when content card is in view
        if (scrollPosition > videoHeight * 0.5) {
            scrollIndicator.classList.add('scroll-hidden');
        } else {
            scrollIndicator.classList.remove('scroll-hidden');
        }
    });
    // Check karo ki previously selected theme hai
    const theme = localStorage.getItem('theme');
    if (theme) {
        document.body.classList.add(theme);
    }

    // Product sections ke liye dynamic content loading
    const loadProducts = (category) => {
        const productSection = document.querySelector(`#${category}`);
        if (productSection) {
            // Yahan pe products load honge based on category
            // Example: perfumes, makeup, skincare
        }
    };

    // Initialize all product sections
    ['perfumes', 'makeup', 'skincare'].forEach(category => loadProducts(category));

    // Product filter logic
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            // Filter logic here
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Intersection Observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    });

    // Observe all sections
    document.querySelectorAll('section').forEach((section) => {
        observer.observe(section);
    });

    // Sirf yeh video playback optimization rakho
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.muted = true; // Default muted
        new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                entry.isIntersecting ? video.play() : video.pause();
            });
        }).observe(video);
    });

    // Theme toggle logic
    const themeToggle = document.getElementById('theme-toggle');
    if(themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            localStorage.setItem('theme', 
                document.body.classList.contains('dark-theme') 
                    ? 'dark-theme' 
                    : 'light-theme'
            );
            
            // Update icon
            themeToggle.querySelector('i').className = 
                `fas fa-${document.body.classList.contains('dark-theme') ? 'moon' : 'sun'}`;
        });
    }
    
    // Active nav link functionality
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Hero video initialization
    const heroVideo = document.getElementById('hero-video');

    if(heroVideo) {
        // Autoplay ensure karne ka best practice
        const playVideo = () => {
            heroVideo.play().catch(error => {
                // Agar autoplay block hua toh
                console.log('Autoplay blocked, showing fallback');
                const playButton = document.createElement('button');
                playButton.textContent = 'Play Video';
                playButton.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%,-50%);
                    z-index: 1000;
                    padding: 1rem 2rem;
                    background: #000;
                    color: #fff;
                    border: 2px solid #fff;
                    cursor: pointer;
                `;
                playButton.onclick = () => {
                    heroVideo.play();
                    playButton.remove();
                };
                document.body.appendChild(playButton);
            });
        };
        
        // Page load pe play attempt
        playVideo();
        
        // Visibility change pe retry
        document.addEventListener('visibilitychange', () => {
            if(document.visibilityState === 'visible') {
                playVideo();
            }
        });
    }

    // Other videos ko muted rakho
    document.querySelectorAll('video:not(#hero-video)').forEach(video => {
        video.muted = true;
    });

    // Speaker buttons ki initial state update
    document.querySelectorAll('.speaker-btn i').forEach(icon => {
        icon.classList.remove('fa-volume-mute');
        icon.classList.add('fa-volume-up');
    });

    // Speaker Button Toggle Logic
    document.querySelectorAll('.speaker-btn').forEach(button => {
        // Video element ko sahi tarike se select karo
        const video = button.closest('.sound-control').previousElementSibling;
        const icon = button.querySelector('i');
        
        // Initial state set karo
        icon.classList.toggle('fa-volume-mute', video.muted);
        icon.classList.toggle('fa-volume-up', !video.muted);

        button.addEventListener('click', function() {
            video.muted = !video.muted;
            icon.classList.toggle('fa-volume-up');
            icon.classList.toggle('fa-volume-mute');
        });
    });

    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'light-theme';
    document.body.classList.add(savedTheme);
});
