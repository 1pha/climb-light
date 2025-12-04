// Main utilities and general functionality for Climb Light

// Initialize Google Ads (if enabled)
function initGoogleAds() {
    if (typeof CONFIG === 'undefined') {
        console.warn('CONFIG not loaded yet');
        return;
    }
    if (CONFIG.ads.enabled && CONFIG.ads.publisherId !== 'ca-pub-XXXXXXXXXX') {
        // Google Ads script is loaded in HTML head
        // Individual ad units should be initialized in their respective HTML files
        console.log('Google Ads enabled');
    }
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Show notification toast
function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: ${type === 'error' ? '#f56565' : type === 'success' ? '#48bb78' : '#667eea'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
    max-width: 300px;
  `;
    toast.textContent = message;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
    document.head.appendChild(style);

    document.body.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(toast);
            document.head.removeChild(style);
        }, 300);
    }, 3000);
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Check if device is mobile
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Analytics tracking (placeholder)
function trackEvent(category, action, label) {
    // Add your analytics tracking here (Google Analytics, etc.)
    console.log('Event:', category, action, label);
}

// Add animation observer for elements
function observeAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all cards
    document.querySelectorAll('.card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Google Ads
    initGoogleAds();

    // Add animation observers
    observeAnimations();

    // Track page view
    trackEvent('PageView', window.location.pathname, document.title);

    // Add mobile class to body if on mobile
    if (isMobile()) {
        document.body.classList.add('mobile');
    }

    // Demo mode notification
    if (typeof CONFIG !== 'undefined' && CONFIG.app.demoMode) {
        console.log('%c🍌 Climb Light 데모 모드', 'font-size: 16px; color: #667eea; font-weight: bold;');
        console.log('%c실제 AI 분석을 사용하려면 js/config.js에 API 키를 추가하고 demoMode를 false로 설정하세요.', 'color: #718096;');
    }
});

// Handle errors gracefully
window.addEventListener('error', (event) => {
    console.error('Error:', event.error);
    // Could send to error tracking service here
});

// Prevent drag and drop on whole page (except designated areas)
window.addEventListener('dragover', (e) => {
    e.preventDefault();
}, false);

window.addEventListener('drop', (e) => {
    e.preventDefault();
}, false);
