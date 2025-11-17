// Smooth scroll for on-page anchors
document.addEventListener('click', function (e) {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id) || document.querySelector(`[name="${id}"]`);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Improve Divi mobile menu closing after click
document.addEventListener('click', function (e) {
    const isMenuLink = e.target.closest('#mobile_menu li a');
    if (!isMenuLink) return;
    const menuToggle = document.querySelector('.mobile_menu_bar');
    if (menuToggle) menuToggle.click();
});

// Animated counters for statistics section
function animateCounters() {
    const counters = document.querySelectorAll('.c-stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target') || counter.textContent.replace(/\D/g, ''));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    counter.textContent = Math.floor(current).toLocaleString();
                }, 16);
                
                observer.unobserve(counter);
            }
        });
    });
    
    counters.forEach(counter => observer.observe(counter));
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    animateCounters();
    
    // Add hover effects to project cards
    const projectCards = document.querySelectorAll('.c-project-card, .c-news-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Parallax effect for hero section
    const hero = document.querySelector('.c-hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }
});

// Reduce CLS on hero images (ensure intrinsic ratio)
document.querySelectorAll('img').forEach(function(img){
    if (!img.getAttribute('width') || !img.getAttribute('height')) return;
    img.style.aspectRatio = `${img.getAttribute('width')} / ${img.getAttribute('height')}`;
});



