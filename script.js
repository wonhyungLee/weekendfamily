// WeekendFamily - JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    initMobileMenu();
    
    // Category Navigation
    initCategoryTabs();
    
    // Video Player (if exists)
    initVideoPlayer();
    
    // Smooth Scrolling for anchor links
    initSmoothScrolling();
    
    // Lazy Loading for images
    initLazyLoading();
});

// Mobile Menu Toggle Functionality
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navigation = document.querySelector('.main-navigation');
    const body = document.body;
    
    if (menuToggle && navigation) {
        menuToggle.addEventListener('click', function() {
            navigation.classList.toggle('active');
            body.classList.toggle('mobile-menu-open');
            
            // Toggle hamburger menu animation
            this.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navigation.contains(event.target) && !menuToggle.contains(event.target)) {
                navigation.classList.remove('active');
                body.classList.remove('mobile-menu-open');
                menuToggle.classList.remove('active');
            }
        });
        
        // Close menu when clicking on menu links
        const menuLinks = navigation.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                navigation.classList.remove('active');
                body.classList.remove('mobile-menu-open');
                menuToggle.classList.remove('active');
            });
        });
    }
}

// Category Tabs Functionality
function initCategoryTabs() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    const postsGrid = document.getElementById('posts-grid');
    
    if (categoryTabs.length === 0) return;
    
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all tabs
            categoryTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            filterPosts(category);
        });
    });
}

// Filter Posts by Category
function filterPosts(category) {
    const posts = document.querySelectorAll('.post-card, .post-large');
    
    posts.forEach(post => {
        const postCategory = post.querySelector('.post-category')?.textContent.toLowerCase();
        
        if (category === 'all' || postCategory === getCategoryName(category)) {
            post.style.display = 'block';
            fadeIn(post);
        } else {
            fadeOut(post);
        }
    });
}

// Get Korean category name
function getCategoryName(category) {
    const categoryMap = {
        'parenting': '육아',
        'health': '건강',
        'activity': '활동',
        'education': '교육',
        'safety': '안전',
        'travel': '여행',
        'video': '비디오'
    };
    
    return categoryMap[category] || category;
}

// Video Player Functionality (for video-player.html page)
function initVideoPlayer() {
    const thumbnails = document.querySelectorAll('.thumbnail-item');
    const mainPlayer = document.getElementById('mainPlayer');
    
    if (thumbnails.length === 0 || !mainPlayer) return;
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const videoId = this.getAttribute('data-video-id');
            
            // Remove active class from all thumbnails
            thumbnails.forEach(item => item.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // Update main player source
            mainPlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`;
        });
    });
}

// Smooth Scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Lazy Loading for Images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if (images.length === 0) return;
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Utility Functions

// Fade In Animation
function fadeIn(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, 10);
}

// Fade Out Animation
function fadeOut(element) {
    element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    element.style.opacity = '0';
    element.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        element.style.display = 'none';
    }, 300);
}

// Debounce Function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle Function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Scroll to Top Button (if needed)
function initScrollToTop() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '↑';
    scrollButton.className = 'scroll-to-top';
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--accent-color);
        color: white;
        border: none;
        font-size: 18px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(scrollButton);
    
    const toggleScrollButton = throttle(() => {
        if (window.pageYOffset > 300) {
            scrollButton.style.opacity = '1';
            scrollButton.style.visibility = 'visible';
        } else {
            scrollButton.style.opacity = '0';
            scrollButton.style.visibility = 'hidden';
        }
    }, 100);
    
    window.addEventListener('scroll', toggleScrollButton);
    
    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize Scroll to Top Button
// initScrollToTop();

// Form Validation (if needed)
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                    showError(input, '이 필드는 필수입니다.');
                } else {
                    input.classList.remove('error');
                    hideError(input);
                }
            });
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    });
}

function showError(input, message) {
    const errorElement = input.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = message;
    } else {
        const error = document.createElement('span');
        error.className = 'error-message';
        error.textContent = message;
        error.style.color = 'var(--accent-color)';
        error.style.fontSize = '0.8rem';
        error.style.display = 'block';
        error.style.marginTop = '0.25rem';
        input.parentNode.appendChild(error);
    }
}

function hideError(input) {
    const errorElement = input.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

// Performance Monitoring
function initPerformanceMonitoring() {
    // Monitor Core Web Vitals if available
    if ('web-vitals' in window) {
        // This would require importing web-vitals library
        // For now, just basic performance logging
    }
    
    // Basic performance logging
    window.addEventListener('load', () => {
        if (performance.mark) {
            performance.mark('page-loaded');
            
            // Log basic performance metrics
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                console.log('Page Load Time:', navigation.loadEventEnd - navigation.fetchStart, 'ms');
            }
        }
    });
}