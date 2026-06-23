// dark-mode.js - Dark Mode Manager
class DarkModeManager {
    constructor() {
        this.toggleButton = document.getElementById('darkModeToggle');
        this.icon = this.toggleButton?.querySelector('i');
        this.isDarkMode = false;
        
        if (this.toggleButton && this.icon) {
            this.init();
        }
    }
    
    init() {
        this.loadPreference();
        this.applyMode();
        this.setupEventListeners();
        this.setupSystemPreference();
        
        setTimeout(() => {
            if (this.toggleButton) {
                this.toggleButton.style.opacity = '1';
            }
        }, 1000);
    }
    
    loadPreference() {
        const savedMode = localStorage.getItem('darkMode');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedMode !== null) {
            this.isDarkMode = savedMode === 'true';
        } else {
            this.isDarkMode = systemPrefersDark;
        }
    }
    
    savePreference() {
        localStorage.setItem('darkMode', this.isDarkMode.toString());
    }
    
    applyMode() {
        if (this.isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            this.icon.className = 'fas fa-sun';
            this.toggleButton.setAttribute('aria-label', 'تفعيل الوضع الفاتح');
            this.toggleButton.title = 'تفعيل الوضع الفاتح';
        } else {
            document.documentElement.removeAttribute('data-theme');
            this.icon.className = 'fas fa-moon';
            this.toggleButton.setAttribute('aria-label', 'تفعيل الوضع الداكن');
            this.toggleButton.title = 'تفعيل الوضع الداكن';
        }
        
        this.savePreference();
    }
    
    toggleMode() {
        this.toggleButton.classList.add('animating');
        this.isDarkMode = !this.isDarkMode;
        this.applyMode();
        
        setTimeout(() => {
            this.toggleButton.classList.remove('animating');
        }, 500);
        
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { isDarkMode: this.isDarkMode }
        }));
        
        this.playToggleSound();
    }
    
    playToggleSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = this.isDarkMode ? 523.25 : 392.00;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            console.log('Web Audio API not supported');
        }
    }
    
    setupEventListeners() {
        this.toggleButton.addEventListener('click', () => {
            this.toggleMode();
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                this.toggleMode();
            }
        });
        
        this.toggleButton.addEventListener('mouseenter', () => {
            this.toggleButton.style.transform = 'scale(1.1)';
        });
        
        this.toggleButton.addEventListener('mouseleave', () => {
            if (!this.toggleButton.classList.contains('animating')) {
                this.toggleButton.style.transform = 'scale(1)';
            }
        });
    }
    
    setupSystemPreference() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleSystemChange = (e) => {
            if (!localStorage.getItem('darkMode')) {
                this.isDarkMode = e.matches;
                this.applyMode();
            }
        };
        
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleSystemChange);
        } else {
            mediaQuery.addListener(handleSystemChange);
        }
    }
    
    getCurrentMode() {
        return this.isDarkMode ? 'dark' : 'light';
    }
    
    setMode(mode) {
        if (mode === 'dark' && !this.isDarkMode) {
            this.isDarkMode = true;
            this.applyMode();
        } else if (mode === 'light' && this.isDarkMode) {
            this.isDarkMode = false;
            this.applyMode();
        }
    }
}

let darkModeManager;

document.addEventListener('DOMContentLoaded', () => {
    darkModeManager = new DarkModeManager();
});

window.toggleDarkMode = function() {
    if (darkModeManager) {
        darkModeManager.toggleMode();
    }
};

window.getCurrentTheme = function() {
    return darkModeManager ? darkModeManager.getCurrentMode() : 'light';
};


        // ===== GLOBAL VARIABLES =====
let typewriterTexts = [
    "⚡ مهندسة برمجيات متخصصة",
    "🚀 مطورة Full-Stack",
    "💡 مصممة أنظمة قابلة للتطوير",
    "🎯 باحثة عن حلول مبتكرة",
    "🔧 متخصصة في هندسة البرمجيات"
];

// ===== DOM ELEMENTS =====
const loadingScreen = document.querySelector('.loading-screen');
const typewriterElement = document.querySelector('.typewriter-text');
const cursorElement = document.querySelector('.cursor');
const statNumbers = document.querySelectorAll('.stat-number');
const fadeElements = document.querySelectorAll('.fade-in-up');
const navbar = document.querySelector('.navbar');


// dark-mode
// ===== DARK MODE SUPPORT =====
// دالة للتحقق من تأثيرات Dark Mode على الرسوم المتحركة
function updateAnimationsForDarkMode() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    // تحديث ألوان العناصر العائمة
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach(el => {
        if (isDark) {
            el.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
        } else {
            el.style.boxShadow = 'var(--shadow-md)';
        }
    });
    
    // تحديث ظلال الأزرار
    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach(btn => {
        if (isDark) {
            btn.style.boxShadow = '0 4px 15px rgba(37, 99, 235, 0.3)';
        } else {
            btn.style.boxShadow = 'var(--shadow-md)';
        }
    });
}

// استمع لتغيرات الثيم
document.addEventListener('themeChanged', function(e) {
    updateAnimationsForDarkMode();
    
    // تحديث عداد الإحصائيات إذا كانت تعمل
    if (e.detail.isDarkMode) {
        console.log('Dark mode activated');
    } else {
        console.log('Light mode activated');
    }
});


// ===== TYPEWRITER EFFECT =====
class Typewriter {
    constructor(element, texts, speed = 100, pause = 2000) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.pause = pause;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.isPaused = false;
        this.type();
    }

    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            // حذف النص
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
            
            if (this.charIndex === 0) {
                this.isDeleting = false;
                this.textIndex = (this.textIndex + 1) % this.texts.length;
                setTimeout(() => this.type(), 500);
                return;
            }
        } else {
            // كتابة النص
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
            
            if (this.charIndex === currentText.length) {
                this.isPaused = true;
                setTimeout(() => {
                    this.isPaused = false;
                    this.isDeleting = true;
                    this.type();
                }, this.pause);
                return;
            }
        }
        
        const speed = this.isDeleting ? this.speed / 2 : this.speed;
        setTimeout(() => this.type(), speed);
    }
}

// ===== ANIMATE COUNTERS =====
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target + (element.getAttribute('data-count') === '100' ? '%' : '+');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ===== FADE IN ANIMATIONS =====
function checkFadeIn() {
    fadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            const delay = element.getAttribute('data-delay') || 0;
            
            setTimeout(() => {
                element.classList.add('visible');
            }, delay * 1000);
        }
    });
}

// ===== SCROLL EFFECTS =====
function handleScroll() {
    // Navbar effect
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Check fade in elements
    checkFadeIn();
}

// ===== LOADING SCREEN =====
function hideLoadingScreen() {
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        
        // Start animations after loading
        setTimeout(() => {
            checkFadeIn();
            startCounters();
        }, 300);
    }, 1500); // 1.5 second loading time
}

function startCounters() {
    statNumbers.forEach(counter => {
        animateCounter(counter);
    });
}

// ===== INITIALIZE TYPEWRITER =====
function initTypewriter() {
    new Typewriter(typewriterElement, typewriterTexts, 100, 2000);
}

// ===== NAVBAR TOGGLE =====
function initNavbar() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Close navbar when clicking a link (mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const navbarCollapse = document.querySelector('.navbar-collapse.show');
            if (navbarCollapse) {
                navbarToggler.click(); // Close navbar
            }
        });
    });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== FLOATING ELEMENTS ANIMATION =====
function initFloatingElements() {
	const elements = document.querySelectorAll('.floating-element');
	const isMobile = window.innerWidth < 768;

	elements.forEach((element, index) => {
		if (isMobile) {
			// show only the first (lightweight) on small screens
			if (index === 0) {
				element.style.display = 'flex';
				element.style.width = '44px';
				element.style.height = '44px';
				element.style.fontSize = '18px';
				element.style.animationDuration = '8s';
				element.style.animationDelay = '0s';
				element.style.opacity = '0.95';
			} else {
				element.style.display = 'none';
			}
		} else {
			// full animations for larger screens
			element.style.display = 'flex';
			element.style.width = '';
			element.style.height = '';
			element.style.fontSize = '';
			element.style.opacity = '';
			const delay = index * 0.5;
			const duration = 6 + Math.random() * 2;
			element.style.animationDelay = `${delay}s`;
			element.style.animationDuration = `${duration}s`;
		}
	});
}

// Re-init floating elements on resize (debounced)
window.addEventListener('resize', debounce(() => {
	initFloatingElements();
	// re-evaluate fade-in visibility when layout changes
	checkFadeIn();
}, 150));

// Ensure initFloatingElements is idempotent and called early and after load
document.addEventListener('DOMContentLoaded', () => {
	// ...existing init calls...
	initFloatingElements();
});

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize everything
    hideLoadingScreen();
    initTypewriter();
    initNavbar();
    initSmoothScroll();
    initFloatingElements();
    
    // Initial check for fade in elements
    checkFadeIn();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Add resize event listener for responsive adjustments
    window.addEventListener('resize', checkFadeIn);
});

// ===== UTILITY FUNCTIONS =====
// Debounce function for performance
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

// ===== EXPORT FOR MODULES (if needed later) =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Typewriter,
        animateCounter,
        checkFadeIn
    };
}


// إضافة إلى script.js
function initAboutSection() {
    const aboutSection = document.getElementById('about');
    if (!aboutSection) return;

    // عناصر للتأخير
    const aboutElements = aboutSection.querySelectorAll('.fade-in-up');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = element.getAttribute('data-delay') || 0;
                
                setTimeout(() => {
                    element.classList.add('visible');
                    
                    // تأثير شريط التقدم
                    if (element.querySelector('.progress-fill')) {
                        const progressFill = element.querySelector('.progress-fill');
                        const width = progressFill.getAttribute('data-width') + '%';
                        setTimeout(() => {
                            progressFill.style.width = width;
                        }, 300);
                    }
                }, delay * 1000);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    aboutElements.forEach(element => {
        observer.observe(element);
    });
    
    // تأثير الزر
    const exploreBtn = aboutSection.querySelector('.explore-btn');
    if (exploreBtn) {
        exploreBtn.addEventListener('mouseenter', () => {
            exploreBtn.style.paddingLeft = '50px';
            exploreBtn.style.paddingRight = '50px';
        });
        
        exploreBtn.addEventListener('mouseleave', () => {
            exploreBtn.style.paddingLeft = '15px 40px';
            exploreBtn.style.paddingRight = '15px 40px';
        });
    }
}


// حل فوري لشريط التقدم
document.addEventListener('DOMContentLoaded', function() {
    // انتظار تحميل الصفحة
    setTimeout(function() {
        // التحقق من ظهور العنصر
        const track = document.querySelector('.learning-track');
        if (!track) return;
        
        // مشاهدة التمرير
        window.addEventListener('scroll', function() {
            const rect = track.getBoundingClientRect();
            
            // إذا ظهر العنصر في منتصف الشاشة
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                // تحريك الشريط مرة واحدة فقط
                if (!track.classList.contains('animated')) {
                    track.classList.add('animated');
                    
                    // تأخير ثم تحريك
                    setTimeout(function() {
                        const bar = document.querySelector('.progress-fill');
                        const percent = document.querySelector('.learning-progress');
                        
                        if (bar && percent) {
                            // تحريك الشريط
                            bar.style.width = '10%';
                            
                            // تحريك النسبة (من 10% إلى 10% - للاختبار)
                            percent.textContent = '10%';
                            
                            console.log('تم تحريك شريط التقدم!');
                        }
                    }, 500);
                }
            }
        });
        
        // تشغيل مباشر بعد 2 ثانية (كخيار احتياطي)
        setTimeout(function() {
            const bar = document.querySelector('.progress-fill');
            const percent = document.querySelector('.learning-progress');
            
            if (bar && percent) {
                bar.style.width = '10%';
                percent.textContent = '10%';
                console.log('تم تشغيل شريط التقدم تلقائياً');
            }
        }, 2000);
    }, 1000);
});


// projects.js - إدارة قسم المشاريع
class ProjectsManager {
    constructor() {
        this.projectsGrid = document.querySelector('.projects-grid');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.projectCards = document.querySelectorAll('.project-card');
        this.sliders = document.querySelectorAll('.gallery-slider');
        
        this.init();
    }
    
    init() {
        this.setupFiltering();
        this.setupImageSliders();
        this.setupAnimations();
        this.setupHoverEffects();
    }
    
    setupFiltering() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                const filterValue = button.getAttribute('data-filter');
                
                // Filter projects
                this.projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    
                    if (filterValue === 'all' || filterValue === category) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
    
    setupImageSliders() {
        this.sliders.forEach(slider => {
            const slides = slider.querySelectorAll('.slide');
            const dots = slider.querySelectorAll('.dot');
            const prevBtn = slider.querySelector('.prev-slide');
            const nextBtn = slider.querySelector('.next-slide');
            
            // Only setup if there are multiple slides
            if (slides.length > 1) {
                let currentSlide = 0;
                
                const showSlide = (index) => {
                    // Hide all slides
                    slides.forEach(slide => slide.classList.remove('active'));
                    dots.forEach(dot => dot.classList.remove('active'));
                    
                    // Show current slide
                    slides[index].classList.add('active');
                    if (dots[index]) dots[index].classList.add('active');
                    
                    currentSlide = index;
                };
                
                // Next slide
                if (nextBtn) {
                    nextBtn.addEventListener('click', () => {
                        let nextIndex = currentSlide + 1;
                        if (nextIndex >= slides.length) nextIndex = 0;
                        showSlide(nextIndex);
                    });
                }
                
                // Previous slide
                if (prevBtn) {
                    prevBtn.addEventListener('click', () => {
                        let prevIndex = currentSlide - 1;
                        if (prevIndex < 0) prevIndex = slides.length - 1;
                        showSlide(prevIndex);
                    });
                }
                
                // Dots navigation
                dots.forEach((dot, index) => {
                    dot.addEventListener('click', () => {
                        showSlide(index);
                    });
                });
                
                // Auto slide every 5 seconds
                setInterval(() => {
                    let nextIndex = currentSlide + 1;
                    if (nextIndex >= slides.length) nextIndex = 0;
                    showSlide(nextIndex);
                }, 5000);
            } else {
                // Hide navigation for single image projects
                const navButtons = slider.querySelectorAll('.slide-nav');
                const dotsContainer = slider.querySelector('.slider-dots');
                
                if (navButtons.length > 0) {
                    navButtons.forEach(btn => btn.style.display = 'none');
                }
                if (dotsContainer) {
                    dotsContainer.style.display = 'none';
                }
            }
        });
    }
    
    setupAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const delay = element.getAttribute('data-delay') || 0;
                    
                    setTimeout(() => {
                        element.classList.add('visible');
                    }, delay * 1000);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        document.querySelectorAll('.fade-in-up').forEach(element => {
            observer.observe(element);
        });
    }
    
    setupHoverEffects() {
        // Add hover effect to project cards
        this.projectCards.forEach(card => {
            const links = card.querySelectorAll('.project-link');
            const image = card.querySelector('.project-image');
            
            card.addEventListener('mouseenter', () => {
                if (image) {
                    image.style.transform = 'scale(1.05)';
                }
                
                links.forEach(link => {
                    link.style.transform = 'translateY(-2px)';
                });
            });
            
            card.addEventListener('mouseleave', () => {
                if (image) {
                    image.style.transform = 'scale(1)';
                }
                
                links.forEach(link => {
                    link.style.transform = 'translateY(0)';
                });
            });
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const projectsManager = new ProjectsManager();
    
    // Add to existing initialization
    setTimeout(() => {
        if (typeof initAboutSection === 'function') {
            initAboutSection();
        }
    }, 1000);
});

// For console testing
window.testSlider = function(projectIndex = 0) {
    const slider = document.querySelectorAll('.gallery-slider')[projectIndex];
    if (slider) {
        const slides = slider.querySelectorAll('.slide');
        let current = 0;
        
        setInterval(() => {
            slides[current].classList.remove('active');
            current = (current + 1) % slides.length;
            slides[current].classList.add('active');
        }, 2000);
    }
};


// إضافة إلى projects.js
function fixStatsDisplay() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        // التأكد من أن النص يظهر بشكل صحيح
        const text = stat.textContent.trim();
        
        // إذا كان هناك مشكلة، إعادة تعيين النص
        if (text === 'NaN' || text === 'undefined' || text === 'null') {
            const parentStat = stat.closest('.stat-item');
            if (parentStat) {
                const originalNumber = stat.getAttribute('data-original') || '150+';
                stat.textContent = originalNumber;
            }
        } else {
            // حفظ القيمة الأصلية
            stat.setAttribute('data-original', text);
        }
    });
}

// استدعاء الدالة بعد تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(fixStatsDisplay, 100);
    
    // إعادة التحقق بعد تحميل المشاريع
    if (typeof ProjectsManager !== 'undefined') {
        const projectsManager = new ProjectsManager();
        setTimeout(fixStatsDisplay, 500);
    }
});

// تحديث الدالة initAboutSection
function initAboutSection() {
    // ... الكود السابق ...
    
    // إصلاح الإحصائيات
    setTimeout(fixStatsDisplay, 300);
}


// skills.js - إدارة قسم المهارات
class SkillsManager {
    constructor() {
        this.skillCards = document.querySelectorAll('.skill-card');
        this.progressBars = document.querySelectorAll('.progress-bar');
        this.softSkillItems = document.querySelectorAll('.soft-skill-item');
        this.methodologyCards = document.querySelectorAll('.methodology-card');
        
        this.init();
    }
    
    init() {
        this.setupAnimations();
        this.setupProgressBars();
        this.setupHoverEffects();
        this.setupScrollAnimations();
    }
    
    setupProgressBars() {
        this.progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            
            // تأخير ظهور شريط التقدم
            setTimeout(() => {
                bar.style.width = width;
                
                // إضافة تأثير عند اكتمال الشريط
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const percentage = parseInt(width);
                            if (percentage >= 80) {
                                bar.style.boxShadow = '0 0 15px rgba(37, 99, 235, 0.3)';
                            }
                        }
                    });
                }, { threshold: 0.5 });
                
                observer.observe(bar);
            }, 500);
        });
    }
    
    setupAnimations() {
        // تأثيرات للمهارات عند الظهور
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillCard = entry.target;
                    
                    // تأخير مختلف لكل بطاقة
                    const index = Array.from(this.skillCards).indexOf(skillCard);
                    setTimeout(() => {
                        skillCard.style.transform = 'translateY(0)';
                        skillCard.style.opacity = '1';
                    }, index * 100);
                }
            });
        }, { threshold: 0.1 });
        
        this.skillCards.forEach(card => {
            card.style.transform = 'translateY(20px)';
            card.style.opacity = '0.7';
            card.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
            skillObserver.observe(card);
        });
    }
    
    setupHoverEffects() {
        // تأثيرات hover للمهارات
        this.skillCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const icon = card.querySelector('.skill-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                    icon.style.transition = 'transform 0.3s ease';
                }
                
                const progressBar = card.querySelector('.progress-bar');
                if (progressBar) {
                    progressBar.style.transform = 'scaleY(1.2)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                const icon = card.querySelector('.skill-icon');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
                
                const progressBar = card.querySelector('.progress-bar');
                if (progressBar) {
                    progressBar.style.transform = 'scaleY(1)';
                }
            });
        });
        
        // تأثيرات hover للمهارات الناعمة
        this.softSkillItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const icon = item.querySelector('.soft-skill-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.2)';
                    icon.style.boxShadow = '0 0 10px rgba(16, 185, 129, 0.3)';
                }
            });
            
            item.addEventListener('mouseleave', () => {
                const icon = item.querySelector('.soft-skill-icon');
                if (icon) {
                    icon.style.transform = 'scale(1)';
                    icon.style.boxShadow = 'none';
                }
            });
        });
        
        // تأثيرات hover للمنهجيات
        this.methodologyCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const icon = card.querySelector('.methodology-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1) translateY(-5px)';
                    icon.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                const icon = card.querySelector('.methodology-icon');
                if (icon) {
                    icon.style.transform = 'scale(1) translateY(0)';
                    icon.style.boxShadow = 'none';
                }
            });
        });
    }
    
    setupScrollAnimations() {
        // تأثيرات الظهور عند التمرير
        const fadeElements = document.querySelectorAll('.fade-in-up');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const delay = element.getAttribute('data-delay') || 0;
                    
                    setTimeout(() => {
                        element.classList.add('visible');
                        
                        // تأثير خاص للشريط CTA
                        if (element.querySelector('.skills-cta-btn')) {
                            const btn = element.querySelector('.skills-cta-btn');
                            setTimeout(() => {
                                btn.style.animation = 'pulse 2s infinite';
                            }, 1000);
                        }
                    }, delay * 1000);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        fadeElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // دالة لاختبار مستوى المهارات
    testSkillLevel(skillName) {
        const skillCard = Array.from(this.skillCards).find(card => 
            card.querySelector('.skill-name').textContent.includes(skillName)
        );
        
        if (skillCard) {
            skillCard.style.animation = 'highlightSkill 1s ease';
            setTimeout(() => {
                skillCard.style.animation = '';
            }, 1000);
            return true;
        }
        return false;
    }
}

// تهيئة قسم المهارات
document.addEventListener('DOMContentLoaded', function() {
    const skillsManager = new SkillsManager();
    
    // إضافة أنيميشن للشريط CTA
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: translateY(-3px) scale(1); box-shadow: var(--shadow-lg); }
            50% { transform: translateY(-3px) scale(1.02); box-shadow: 0 15px 30px rgba(37, 99, 235, 0.3); }
            100% { transform: translateY(-3px) scale(1); box-shadow: var(--shadow-lg); }
        }
        
        @keyframes highlightSkill {
            0% { box-shadow: var(--shadow-md); }
            50% { box-shadow: 0 0 30px rgba(37, 99, 235, 0.5); transform: translateY(-5px); }
            100% { box-shadow: var(--shadow-md); }
        }
    `;
    document.head.appendChild(style);
    
    // تأخير ظهور العناصر
    setTimeout(() => {
        const skillsSection = document.getElementById('skills');
        if (skillsSection) {
            skillsSection.style.opacity = '1';
        }
    }, 300);
});

// للاستخدام من الكونسول
window.testSkill = function(skillName) {
    const skillsManager = new SkillsManager();
    return skillsManager.testSkillLevel(skillName);
};

window.showSkillsStats = function() {
    const stats = {
        totalSkills: document.querySelectorAll('.skill-card').length,
        totalSoftSkills: document.querySelectorAll('.soft-skill-item').length,
        expertSkills: document.querySelectorAll('.skill-card.expert').length,
        learningSkills: document.querySelectorAll('.skill-card.learning').length
    };
    
    console.log('📊 إحصائيات المهارات:', stats);
    return stats;
};
// contact.js - يتم التعامل مع نموذج التواصل عبر mailto في أسفل الملف
// ===== GLOBAL TECH ICONS INTERACTIVITY =====
function initGlobalTechIcons() {
    const globalIcons = document.querySelectorAll('.global-tech-icon');
    const sections = document.querySelectorAll('section, .main-footer');
    
    if (!globalIcons.length || !sections.length) return;
    
    // تأثير عند التمرير
    function updateIconsOnScroll() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        globalIcons.forEach(icon => {
            const speed = 0.1 + Math.random() * 0.2;
            const yOffset = Math.sin((scrollY / 500) * speed) * 50;
            icon.style.transform = `translateY(${yOffset}px) rotate(${scrollY * 0.01}deg)`;
        });
    }
    
    // إظهار/إخفاء الأيقونات حسب القسم
    function updateIconsVisibility() {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                const sectionId = section.id || section.classList[0];
                const sectionIcons = document.querySelectorAll(`.global-tech-icon[data-section="${sectionId}"]`);
                
                sectionIcons.forEach(icon => {
                    icon.style.opacity = '0.08';
                    icon.classList.add('active');
                });
            }
        });
    }
    
    // تأثير عند تحريك الماوس
    function setupMouseInteraction() {
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            globalIcons.forEach((icon, index) => {
                const distance = Math.sqrt(
                    Math.pow(mouseX - (icon.offsetLeft / window.innerWidth), 2) +
                    Math.pow(mouseY - (icon.offsetTop / window.innerHeight), 2)
                );
                
                if (distance < 0.1) {
                    const scale = 1 + (0.2 * (1 - distance / 0.1));
                    const opacity = 0.08 + (0.07 * (1 - distance / 0.1));
                    
                    icon.style.transform = `scale(${scale})`;
                    icon.style.opacity = opacity.toString();
                }
            });
        });
    }
    
    // تفعيل الأيقونات عند تحميل كل قسم
    function activateSectionIcons() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const section = entry.target;
                    const sectionId = section.id || section.classList[0];
                    const icons = document.querySelectorAll(`.global-tech-icon[data-section="${sectionId}"]`);
                    
                    icons.forEach((icon, index) => {
                        setTimeout(() => {
                            icon.style.animationDelay = `${index * 0.5}s`;
                            icon.style.opacity = '0.08';
                            icon.classList.add('animate-in');
                        }, index * 100);
                    });
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        
        sections.forEach(section => observer.observe(section));
    }
    
    // تهيئة
    window.addEventListener('scroll', updateIconsOnScroll);
    window.addEventListener('scroll', updateIconsVisibility);
    setupMouseInteraction();
    activateSectionIcons();
    
    // تحديث أولي
    updateIconsVisibility();
}

// في دالة التهيئة الرئيسية
document.addEventListener('DOMContentLoaded', () => {
    // ... الكود السابق ...
    
    // تهيئة الأيقونات التقنية العالمية
    setTimeout(() => {
        initGlobalTechIcons();
    }, 1500);
});


// في نهاية الملف
// Responsive Adjustments
function handleResponsive() {
    const width = window.innerWidth;
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    
    if (width < 768) {
        // Adjust font sizes for mobile
        if (heroTitle) heroTitle.style.fontSize = '2.2rem';
        if (heroSubtitle) heroSubtitle.style.fontSize = '1.3rem';
        
        // Adjust floating elements
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach(el => {
            el.style.width = '45px';
            el.style.height = '45px';
            el.style.fontSize = '20px';
        });
    } else {
        // Reset for desktop
        if (heroTitle) heroTitle.style.fontSize = '';
        if (heroSubtitle) heroSubtitle.style.fontSize = '';
        
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach(el => {
            el.style.width = '';
            el.style.height = '';
            el.style.fontSize = '';
        });
    }
}

// استدعاء الدالة عند تحميل الصفحة وعند تغيير حجم النافذة
window.addEventListener('load', handleResponsive);
window.addEventListener('resize', handleResponsive);


// Contact form mailto fallback - opens the visitor's email app with the message content
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const name = formData.get('name') || '';
        const email = formData.get('email') || '';
        const subject = formData.get('subject') || 'Portfolio Contact';
        const message = formData.get('message') || '';

        const body = `Name: ${name}%0AEmail: ${email}%0A%0AMessage:%0A${encodeURIComponent(message)}`;
        window.location.href = `mailto:hibareman3@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
    });
});

/* ===== NEXT INLINE SCRIPT ===== */

/* ===== LANGUAGE SWITCHER ===== */
const portfolioTranslations = {"text":{"t1":{"ar":"جاري التحميل...","en":"Loading..."},"t2":{"ar":"الرئيسية","en":"Home"},"t3":{"ar":"عنّي","en":"About"},"t4":{"ar":"عني","en":"About"},"t5":{"ar":"المشاريع","en":"Projects"},"t6":{"ar":"المهارات","en":"Skills"},"t7":{"ar":"التواصل","en":"Contact"},"t8":{"ar":"تحميل CV","en":"Download CV"},"t9":{"ar":"مرحباً بك في معرض أعمال المهندسة","en":"Welcome to the portfolio of"},"t10":{"ar":"أنا","en":"I am"},"t11":{"ar":"هبا علاء ريمان","en":"Hiba Alaa Reman"},"t12":{"ar":"⚡ مهندسة برمجيات متخصصة في بناء حلول تقنية مبتكرة تجمع بين الدقة الهندسية والإبداع التقني. أحول الأفكار المعقدة إلى تطبيقات وأنظمة فعالة وقابلة للتطوير.","en":"⚡ Software engineer focused on building innovative technical solutions that combine engineering precision with creative problem solving. I turn complex ideas into efficient, scalable applications and systems."},"t13":{"ar":"سنوات تعلم وتطبيق","en":"Years of Learning & Practice"},"t14":{"ar":"مشاريع أكاديمية وشخصية","en":"Academic & Personal Projects"},"t15":{"ar":"المركز الجامعي","en":"University Ranking"},"t16":{"ar":"عرض المشاريع","en":"View Projects"},"t17":{"ar":"تواصل معي","en":"Contact Me"},"t18":{"ar":"سنوات","en":"Years"},"t19":{"ar":"تعلم وتطبيق","en":"Learning & Practice"},"t20":{"ar":"تابع الاستكشاف","en":"Keep Exploring"},"t21":{"ar":"مـن أنـا؟","en":"About Me"},"t22":{"ar":"التعرف على المهندسة خلف الشاشة","en":"Get to know the engineer behind the screen"},"t23":{"ar":"مهندسة برمجيات","en":"Software Engineer"},"t24":{"ar":"التخصص","en":"Major"},"t25":{"ar":"هندسة برمجيات","en":"Software Engineering"},"t26":{"ar":"مكان الدراسة","en":"University"},"t27":{"ar":"مكان الإقامة","en":"Location"},"t28":{"ar":"ريف دمشق، سوريا","en":"Rif Dimashq, Syria"},"t29":{"ar":"البريد الإلكتروني","en":"Email"},"t30":{"ar":"رقم الهاتف","en":"Phone"},"t31":{"ar":"المركز الثاني على مستوى الجامعة","en":"Ranked 2nd University-Wide"},"t32":{"ar":"الفصل الأول 2022 - هندسة البرمجيات","en":"First Semester 2022 — Software Engineering"},"t33":{"ar":"رحلتي البرمجية","en":"My Programming Journey"},"t34":{"ar":"من البدايات إلى الإنجازات","en":"From beginnings to achievements"},"t35":{"ar":"بدأت رحلتي في عالم البرمجة خلال دراستي الجامعية، حيث واجهت تحديًا كبيرًا بسبب عدم امتلاكي لابتوب في البداية. هذا لم يوقفني، بل زاد من تصميمي حيث بدأت التعلم والتدرب على تطبيقات الجوال، لأكتشف شغفي الحقيقي بالتفكير المنطقي وحل المشكلات المعقدة.","en":"My programming journey started during my university studies, where I faced a major challenge because I did not have a laptop at the beginning. That did not stop me; it made me more determined. I started learning and practicing through mobile applications, and that is when I discovered my passion for logical thinking and solving complex problems."},"t36":{"ar":"تفوقي الأكاديمي (المركز الثاني على جامعتي في السنة الثانية) كان بداية لرحلة من الإنجازات والتعلم المستمر التي مازلت أسير فيها بكل حماس.","en":"My academic achievement, ranking second at my university during my second year, became the beginning of a journey of continuous learning and growth that I continue with passion."},"t37":{"ar":"التحدي الأول","en":"First Challenge"},"t38":{"ar":"تعلم البرمجة بدون امتلاك لابتوب، باستخدام تطبيقات الجوال فقط","en":"Learning programming without owning a laptop, using only mobile applications."},"t39":{"ar":"شغفي ومجالات اهتمامي","en":"My Passions & Interests"},"t40":{"ar":"ما يحفزني ويشعل إبداعي","en":"What motivates me and sparks my creativity"},"t41":{"ar":"تطوير الويب","en":"Web Development"},"t42":{"ar":"أستمتع بتحويل الأفكار إلى تطبيقات ويب تفاعلية وحديثة","en":"I enjoy turning ideas into modern, interactive web applications."},"t43":{"ar":"التدريب والتعليم","en":"Teaching & Training"},"t44":{"ar":"أحب مشاركة المعرفة ومساعدة الآخرين في رحلتهم التقنية","en":"I enjoy sharing knowledge and helping others in their technical journey."},"t45":{"ar":"الذكاء الاصطناعي","en":"Artificial Intelligence"},"t46":{"ar":"متابعة أحدث التطورات في هذا المجال المثير","en":"Following the latest developments in this exciting field."},"t47":{"ar":"تطبيقات الموبايل","en":"Mobile Applications"},"t48":{"ar":"تطوير حلول مبتكرة للمستخدمين على الهواتف","en":"Building innovative solutions for mobile users."},"t49":{"ar":"فلسفتي في البرمجة والعمل","en":"My Programming & Work Philosophy"},"t50":{"ar":"المبادئ التي أؤمن بها وأطبقها","en":"The principles I believe in and apply"},"t51":{"ar":"كتابة كود نظيف","en":"Clean Code"},"t52":{"ar":"أكتب كودًا قابلًا للقراءة والصيانة والتوسيع، مع الاهتمام بتسمية المتغيرات والدوال بشكل واضح","en":"I write readable, maintainable, and extendable code, with clear naming for variables and functions."},"t53":{"ar":"العمل الجماعي","en":"Teamwork"},"t54":{"ar":"أمتلك مهارات تواصل اجتماعية ممتازة وأستمتع بالعمل ضمن فريق والتعاون لتحقيق الأهداف المشتركة","en":"I have strong communication skills and enjoy working with teams to achieve shared goals."},"t55":{"ar":"منهجية Agile","en":"Agile Methodology"},"t56":{"ar":"أتّبع منهجيات التطوير التزايدي مثل Scrum، مع تقسيم المشاريع إلى sprints صغيرة وقابلة للإدارة","en":"I follow iterative development methods such as Scrum, dividing projects into small, manageable sprints."},"t57":{"ar":"تصميم الأنظمة","en":"System Design"},"t58":{"ar":"أهتم بتصميم معماري قوي وأنماط تصميم فعالة لبناء أنظمة قابلة للتطوير والصيانة","en":"I care about strong architecture and effective design patterns for scalable, maintainable systems."},"t59":{"ar":"التطوير المستمر","en":"Continuous Development"},"t60":{"ar":"ما أتعلمه وأطوره حالياً","en":"What I am currently learning and improving"},"t61":{"ar":"أعمل حالياً على تعميق مهاراتي في بناء REST APIs باستخدام Django REST Framework، مع تطوير مهاراتي في React لبناء واجهات أكثر تفاعلية.","en":"I am currently deepening my skills in building REST APIs with Django REST Framework while improving my React skills to build more interactive interfaces."},"t62":{"ar":"تابع الاكتشاف","en":"Continue Exploring"},"t63":{"ar":"مشـاريعي","en":"My Projects"},"t64":{"ar":"إبداعات برمجية تترجم الأفكار إلى واقع","en":"Software work that turns ideas into reality"},"t65":{"ar":"نظام يساعد أصحاب المتاجر على إنشاء بيانات متجر أولية بمساعدة الذكاء الاصطناعي، مع التركيز على بنية SaaS، عزل بيانات المستأجرين، وتوثيق تدفقات النظام.","en":"A system that helps store owners generate initial store data with AI assistance, focusing on SaaS architecture, tenant data isolation, and system flow documentation."},"t66":{"ar":"المميزات الرئيسية","en":"Key Features"},"t67":{"ar":"التقنيات المستخدمة","en":"Technologies Used"},"t68":{"ar":"القيمة المضافة","en":"Added Value"},"t69":{"ar":"يعكس المشروع قدرتي على فهم الأنظمة القابلة للتوسع، تصميم التدفقات، وتوثيق القرارات المعمارية بشكل منظم.","en":"This project reflects my ability to understand scalable systems, design flows, and document architectural decisions in an organized way."},"t70":{"ar":"Backend-focused e-commerce API لإدارة المستخدمين، المنتجات، الطلبات، المصادقة، وتتبع الدفع بطريقة منظمة وقابلة للتوسيع.","en":"A backend-focused e-commerce API for managing users, products, orders, authentication, and payment tracking in an organized and scalable way."},"t71":{"ar":"يوضح هذا المشروع تركيزي القوي على تطوير الـ Backend، تصميم REST APIs، وتنظيم سير العمل داخل النظام.","en":"This project shows my strong focus on backend development, REST API design, and structured system workflows."},"t72":{"ar":"منصة Full-Stack لإدارة الفرق، الأدوار، الدعوات، والتعاون على المهام من خلال لوحة تحكم متجاوبة وواجهات API منظمة.","en":"A full-stack platform for managing teams, roles, invitations, and task collaboration through a responsive dashboard and organized APIs."},"t73":{"ar":"يبرز قدرتي على بناء تطبيقات ويب كاملة تجمع بين الواجهات، قواعد البيانات، وإدارة صلاحيات المستخدمين.","en":"This project highlights my ability to build complete web applications that combine interfaces, databases, and user permission management."},"t74":{"ar":"عرض المزيد من المشاريع","en":"View More Projects"},"t75":{"ar":"يمكنك الاطلاع على المزيد من المشاريع والمستودعات عبر GitHub","en":"You can explore more projects and repositories on GitHub."},"t76":{"ar":"مـهـاراتـي","en":"My Skills"},"t77":{"ar":"أدواتي ومعارفي التي أبني بها المستقبل الرقمي","en":"The tools and knowledge I use to build digital solutions"},"t78":{"ar":"نظرة عامة على مهاراتي","en":"Skills Overview"},"t79":{"ar":"أمتلك مجموعة عملية من المهارات التقنية والمهارات الناعمة، مما يساعدني على بناء حلول برمجية منظمة والتعاون بفعالية ضمن فرق العمل.","en":"I have a practical mix of technical and soft skills that helps me build organized software solutions and collaborate effectively within teams."},"t80":{"ar":"مهارة تقنية","en":"Technical Skills"},"t81":{"ar":"مهارة ناعمة","en":"Soft Skills"},"t82":{"ar":"مستمر","en":"Continuous"},"t83":{"ar":"التعلم","en":"Learning"},"t84":{"ar":"المهارات التقنية","en":"Technical Skills"},"t85":{"ar":"الأدوات واللغات التي أتقنها","en":"Tools and languages I work with"},"t86":{"ar":"مستوى متقدم","en":"Advanced Level"},"t87":{"ar":"مستوى متوسط","en":"Intermediate Level"},"t88":{"ar":"قيد التعلم","en":"Learning"},"t89":{"ar":"قواعد البيانات والأدوات","en":"Databases & Tools"},"t90":{"ar":"المهارات الناعمة والقيادية","en":"Soft & Leadership Skills"},"t91":{"ar":"قدراتي في التواصل والعمل الجماعي","en":"My communication and teamwork abilities"},"t92":{"ar":"مهارات التواصل","en":"Communication Skills"},"t93":{"ar":"التواصل التقني مع غير التقنيين","en":"Technical communication with non-technical people"},"t94":{"ar":"شرح المفاهيم التقنية المعقدة بطريقة بسيطة","en":"Explaining complex technical concepts in a simple way."},"t95":{"ar":"كتابة التقارير والعروض","en":"Reports & Presentations"},"t96":{"ar":"عرض المعلومات بشكل منظم واحترافي","en":"Presenting information clearly and professionally."},"t97":{"ar":"مهارات العرض والتقديم","en":"Presentation Skills"},"t98":{"ar":"تقديم الأفكار بوضوح وثقة","en":"Presenting ideas clearly and confidently."},"t99":{"ar":"التواصل الكتابي","en":"Written Communication"},"t100":{"ar":"الإيميلات، التوثيق، الرسائل المهنية","en":"Emails, documentation, and professional messages."},"t101":{"ar":"العمل الجماعي والقيادة","en":"Teamwork & Leadership"},"t102":{"ar":"العمل ضمن فريق","en":"Working in a Team"},"t103":{"ar":"مهارات ممتازة في التعاون مع الزملاء","en":"Strong collaboration skills with colleagues."},"t104":{"ar":"تقديم المساعدة للزملاء","en":"Supporting Colleagues"},"t105":{"ar":"شرح الأفكار بشكل ممتاز ودعم فريق العمل","en":"Explaining ideas clearly and supporting the team."},"t106":{"ar":"قبول النقد البناء","en":"Accepting Constructive Feedback"},"t107":{"ar":"التعلم من الملاحظات وتحسين الأداء","en":"Learning from feedback and improving performance."},"t108":{"ar":"قيادة المشاريع الصغيرة","en":"Leading Small Projects"},"t109":{"ar":"توجيه الفريق واتخاذ القرارات","en":"Guiding the team and making decisions."},"t110":{"ar":"حل المشكلات والإبداع","en":"Problem Solving & Creativity"},"t111":{"ar":"تحليل المشكلات المعقدة","en":"Analyzing Complex Problems"},"t112":{"ar":"تفكيك المشكلات الكبيرة إلى أجزاء قابلة للحل","en":"Breaking large problems into solvable parts."},"t113":{"ar":"البحث عن حلول","en":"Searching for Solutions"},"t114":{"ar":"الاستقصاء وإيجاد الحلول المناسبة","en":"Researching and finding suitable solutions."},"t115":{"ar":"التفكير النقدي","en":"Critical Thinking"},"t116":{"ar":"تحليل المعلومات واتخاذ قرارات مدروسة","en":"Analyzing information and making thoughtful decisions."},"t117":{"ar":"التفكير خارج الصندوق","en":"Thinking Outside the Box"},"t118":{"ar":"إيجاد حلول إبداعية غير تقليدية","en":"Finding creative and non-traditional solutions."},"t119":{"ar":"التطور المهني","en":"Professional Development"},"t120":{"ar":"متابعة التقنيات الجديدة","en":"Following New Technologies"},"t121":{"ar":"المواكبة المستمرة للتطورات التقنية","en":"Continuously keeping up with technical developments."},"t122":{"ar":"التعلم الذاتي والممارسة","en":"Self-Learning & Practice"},"t123":{"ar":"متابعة المصادر التقنية وتطبيق ما أتعلمه عملياً","en":"Following technical resources and applying what I learn."},"t124":{"ar":"التعلم من الفشل","en":"Learning from Failure"},"t125":{"ar":"تحويل التحديات إلى فرص للتعلم","en":"Turning challenges into learning opportunities."},"t126":{"ar":"إدارة الوقت وتحديد الأولويات","en":"Time Management & Prioritization"},"t127":{"ar":"تحقيق التوازن بين العمل والحياة","en":"Balancing work, study, and life priorities."},"t128":{"ar":"المنهجيات وأنماط التصميم","en":"Methodologies & Design Patterns"},"t129":{"ar":"أطر العمل والممارسات المهنية","en":"Frameworks and professional practices"},"t130":{"ar":"أنماط التصميم","en":"Design Patterns"},"t131":{"ar":"الأمان والمصادقة","en":"Security & Authentication"},"t132":{"ar":"إدارة المشاريع","en":"Project Management"},"t133":{"ar":"مبادئ التصميم","en":"Design Principles"},"t134":{"ar":"اللغات","en":"Languages"},"t135":{"ar":"العربية","en":"Arabic"},"t136":{"ar":"اللغة الأم - إجادة تامة في الكتابة والتواصل","en":"Native language - excellent writing and communication."},"t137":{"ar":"الإنجليزية","en":"English"},"t138":{"ar":"مستوى جيد في القراءة والكتابة والمحادثة","en":"Good level in reading, writing, and conversation."},"t139":{"ar":"مسار التطور المستمر","en":"Continuous Learning Path"},"t140":{"ar":"المرحلة الحالية","en":"Current Stage"},"t141":{"ar":"التخرج وتطوير مهارات React وBackend Development","en":"Graduation and improving React and backend development skills."},"t142":{"ar":"الأهداف القريبة","en":"Near-Term Goals"},"t143":{"ar":"تحسين React وتعميق مهارات Django REST Framework","en":"Improving React and deepening Django REST Framework skills."},"t144":{"ar":"التطلعات المستقبلية","en":"Future Goals"},"t145":{"ar":"التخصص في Full-Stack Development","en":"Specializing in Full-Stack Development."},"t146":{"ar":"لنتعاون معاً على مشروعك القادم","en":"Let's collaborate on your next project"},"t147":{"ar":"تواصـل معي","en":"Contact Me"},"t148":{"ar":"لنتحدث عن مشروعك القادم","en":"Let's talk about your next project"},"t149":{"ar":"متاحة للتواصل","en":"Available to connect"},"t150":{"ar":"العنوان","en":"Address"},"t151":{"ar":"أوقات التواصل","en":"Availability"},"t152":{"ar":"جميع الأوقات مناسبة","en":"Available at flexible times"},"t153":{"ar":"تواصل معي على واتساب","en":"Contact me on WhatsApp"},"t154":{"ar":"اضغط هنا للتواصل المباشر على واتساب","en":"Click here to contact me directly on WhatsApp."},"t155":{"ar":"أرسل لي رسالة","en":"Send Me a Message"},"t156":{"ar":"اكتبي رسالتك وسيتم فتحها عبر البريد الإلكتروني مباشرة","en":"Write your message and it will open directly in your email app."},"t157":{"ar":"الاسم الكامل","en":"Full Name"},"t158":{"ar":"موضوع الرسالة","en":"Message Subject"},"t159":{"ar":"الرسالة","en":"Message"},"t160":{"ar":"إرسال الرسالة","en":"Send Message"},"t161":{"ar":"يمكنك أيضاً التواصل مباشرة عبر واتساب أو LinkedIn","en":"You can also contact me directly through WhatsApp or LinkedIn."},"t162":{"ar":"تابعني على","en":"Follow Me On"},"t163":{"ar":"تواصل معي على منصات التواصل الاجتماعي","en":"Connect with me on social platforms."},"t164":{"ar":"البريد","en":"Email"},"t165":{"ar":"مهندسة برمجيات شغوفة بتحويل الأفكار إلى واقع رقمي. أؤمن بأن كل سطر كود فرصة لخلق تأثير إيجابي في العالم التقني.","en":"A software engineer passionate about turning ideas into digital reality. I believe every line of code is an opportunity to create a positive impact in technology."},"t166":{"ar":"\"هذا أنا، هبا\"","en":"\"This is me, Hiba\""},"t167":{"ar":"مستعدة لتعلم وبناء حلول برمجية أفضل","en":"Ready to learn and build better software solutions."},"t168":{"ar":"روابط سريعة","en":"Quick Links"},"t169":{"ar":"هبا علاء. جميع الحقوق محفوظة.","en":"Hiba Alaa. All rights reserved."},"t170":{"ar":"صنعت ب ❤️ وبالكثير من الكود","en":"Made with ❤️ and a lot of code"},"t171":{"ar":"العودة للأعلى","en":"Back to Top"},"t172":{"ar":"تابعني على منصات التواصل الاجتماعي","en":"Connect with me on social platforms."},"t173":{"ar":"Authorization Methods","en":"Authorization Methods"},"t174":{"ar":"github.com/hibareman","en":"github.com/hibareman"},"t175":{"ar":"©","en":"©"},"t176":{"ar":"API Design Principles","en":"API Design Principles"},"t177":{"ar":"+963 943 829 269","en":"+963 943 829 269"},"t178":{"ar":"MVC Architecture","en":"MVC Architecture"},"t179":{"ar":"Repository Pattern","en":"Repository Pattern"},"t180":{"ar":"Django REST Framework","en":"Django REST Framework"},"t181":{"ar":"PostgreSQL","en":"PostgreSQL"},"t182":{"ar":"AI-assisted store data generation","en":"AI-assisted store data generation"},"t183":{"ar":"Database relationships and clean API structure","en":"Database relationships and clean API structure"},"t184":{"ar":"creativity + precision; }","en":"creativity + precision; }"},"t185":{"ar":"Database Design","en":"Database Design"},"t186":{"ar":"html","en":"html"},"t187":{"ar":"React","en":"React"},"t188":{"ar":"Clean Code Practices","en":"Clean Code Practices"},"t189":{"ar":"40%","en":"40%"},"t190":{"ar":"// Hiba's Code Philosophy","en":"// Hiba's Code Philosophy"},"t191":{"ar":"90%","en":"90%"},"t192":{"ar":"engineer","en":"engineer"},"t193":{"ar":"🇺🇸","en":"🇺🇸"},"t194":{"ar":"3+","en":"3+"},"t195":{"ar":"Software Engineer | Full-Stack Developer","en":"Software Engineer | Full-Stack Developer"},"t196":{"ar":"80%","en":"80%"},"t197":{"ar":"User Stories","en":"User Stories"},"t198":{"ar":"REST endpoints for products, orders, users, and payments","en":"REST endpoints for products, orders, users, and payments"},"t199":{"ar":"Bootstrap","en":"Bootstrap"},"t200":{"ar":"(problem) {","en":"(problem) {"},"t201":{"ar":"System Architecture","en":"System Architecture"},"t202":{"ar":"REST APIs","en":"REST APIs"},"t203":{"ar":"AI-Assisted SaaS Store Creation Platform","en":"AI-Assisted SaaS Store Creation Platform"},"t204":{"ar":"Team Collaboration Platform","en":"Team Collaboration Platform"},"t205":{"ar":"SaaS","en":"SaaS"},"t206":{"ar":"SaaS Architecture","en":"SaaS Architecture"},"t207":{"ar":"precision =","en":"precision ="},"t208":{"ar":"|","en":"|"},"t209":{"ar":"Models, Views, Templates, REST Framework, Authentication","en":"Models, Views, Templates, REST Framework, Authentication"},"t210":{"ar":"Performance Optimization","en":"Performance Optimization"},"t211":{"ar":"LinkedIn","en":"LinkedIn"},"t212":{"ar":"WhatsApp","en":"WhatsApp"},"t213":{"ar":"Software Engineer","en":"Software Engineer"},"t214":{"ar":"API Security","en":"API Security"},"t215":{"ar":"Use cases, test cases, and architecture documentation","en":"Use cases, test cases, and architecture documentation"},"t216":{"ar":"Backend Development","en":"Backend Development"},"t217":{"ar":"ES6+, DOM Manipulation, Async Programming","en":"ES6+, DOM Manipulation, Async Programming"},"t218":{"ar":"API Security Principles","en":"API Security Principles"},"t219":{"ar":"HTML5","en":"HTML5"},"t220":{"ar":"Observer Pattern","en":"Observer Pattern"},"t221":{"ar":"Sprint Planning","en":"Sprint Planning"},"t222":{"ar":"Multi-Tenant Systems, Data Isolation, Architecture Planning","en":"Multi-Tenant Systems, Data Isolation, Architecture Planning"},"t223":{"ar":"Basic productivity analytics","en":"Basic productivity analytics"},"t224":{"ar":"Git & GitHub","en":"Git & GitHub"},"t225":{"ar":"Extensions, Debugging, Integrated Terminal","en":"Extensions, Debugging, Integrated Terminal"},"t226":{"ar":"function","en":"function"},"t227":{"ar":"Python","en":"Python"},"t228":{"ar":"Frontend Development","en":"Frontend Development"},"t229":{"ar":"2026","en":"2026"},"t230":{"ar":"Scrum Methodology","en":"Scrum Methodology"},"t231":{"ar":"🇸🇾","en":"🇸🇾"},"t232":{"ar":"Django REST Framework & React","en":"Django REST Framework & React"},"t233":{"ar":"HIBA","en":"HIBA"},"t234":{"ar":"Hiba Reman","en":"Hiba Reman"},"t235":{"ar":"Acceptance Criteria","en":"Acceptance Criteria"},"t236":{"ar":"createSolution","en":"createSolution"},"t237":{"ar":"JavaScript","en":"JavaScript"},"t238":{"ar":"VS Code","en":"VS Code"},"t239":{"ar":"Factory Pattern","en":"Factory Pattern"},"t240":{"ar":"Authentication Systems","en":"Authentication Systems"},"t241":{"ar":"Graduation Project","en":"Graduation Project"},"t242":{"ar":"95%","en":"95%"},"t243":{"ar":"OOP, Data Structures, Algorithms, Libraries","en":"OOP, Data Structures, Algorithms, Libraries"},"t244":{"ar":"Database Design, SQL Queries, Relationships, PostgreSQL Basics","en":"Database Design, SQL Queries, Relationships, PostgreSQL Basics"},"t245":{"ar":"React Hooks, Components, State Management","en":"React Hooks, Components, State Management"},"t246":{"ar":"85%","en":"85%"},"t247":{"ar":"Team, roles, invitations, and task collaboration","en":"Team, roles, invitations, and task collaboration"},"t248":{"ar":"return","en":"return"},"t249":{"ar":"hibareman","en":"hibareman"},"t250":{"ar":"0","en":"0"},"t251":{"ar":"<>","en":"<>"},"t252":{"ar":"REST APIs for core platform features","en":"REST APIs for core platform features"},"t253":{"ar":"Ongoing","en":"Ongoing"},"t254":{"ar":"hibareman3@gmail.com","en":"hibareman3@gmail.com"},"t255":{"ar":"SQLite","en":"SQLite"},"t256":{"ar":"const","en":"const"},"t257":{"ar":"Semantic HTML, Accessibility, SEO, Performance Optimization","en":"Semantic HTML, Accessibility, SEO, Performance Optimization"},"t258":{"ar":"15+","en":"15+"},"t259":{"ar":"GitHub","en":"GitHub"},"t260":{"ar":"10+","en":"10+"},"t261":{"ar":"Product filtering and structured order workflow","en":"Product filtering and structured order workflow"},"t262":{"ar":"JWT","en":"JWT"},"t263":{"ar":"Syrian Private University","en":"Syrian Private University"},"t264":{"ar":"Django","en":"Django"},"t265":{"ar":"75%","en":"75%"},"t266":{"ar":"Data Protection","en":"Data Protection"},"t267":{"ar":"PostgreSQL / SQL","en":"PostgreSQL / SQL"},"t268":{"ar":"CSS3","en":"CSS3"},"t269":{"ar":"API Design, Documentation, Django REST Framework","en":"API Design, Documentation, Django REST Framework"},"t270":{"ar":"Version Control, Branching, Pull Requests, Collaboration","en":"Version Control, Branching, Pull Requests, Collaboration"},"t271":{"ar":"Tenant data isolation and validation flows","en":"Tenant data isolation and validation flows"},"t272":{"ar":"creativity =","en":"creativity ="},"t273":{"ar":"innovate","en":"innovate"},"t274":{"ar":"E-Commerce REST API","en":"E-Commerce REST API"},"t275":{"ar":"Jira & YouTrack","en":"Jira & YouTrack"},"t276":{"ar":"Serializers, ViewSets, Permissions, JWT Authentication","en":"Serializers, ViewSets, Permissions, JWT Authentication"},"t277":{"ar":"Singleton Pattern","en":"Singleton Pattern"},"t278":{"ar":"linkedin.com/in/heba-reman-8b2363390","en":"linkedin.com/in/heba-reman-8b2363390"},"t279":{"ar":"2025","en":"2025"},"t280":{"ar":"();","en":"();"},"t281":{"ar":"Completed","en":"Completed"},"t282":{"ar":"JWT authentication and role-based access control","en":"JWT authentication and role-based access control"},"t283":{"ar":"{ }","en":"{ }"},"t284":{"ar":"Multi-tenant architecture concepts","en":"Multi-tenant architecture concepts"},"t285":{"ar":"Responsive dashboard interface","en":"Responsive dashboard interface"},"t286":{"ar":"Flexbox/Grid, Responsive Design, CSS Animations, Bootstrap","en":"Flexbox/Grid, Responsive Design, CSS Animations, Bootstrap"},"t287":{"ar":"</>","en":"</>"},"t288":{"ar":"2","en":"2nd"},"t289":{"ar":"إنجاز أكاديمي","en":"Academic Achievement"}},"placeholder":{"ph1":{"ar":"أدخل اسمك الكامل","en":"Enter your full name"},"ph2":{"ar":"example@email.com","en":"example@email.com"},"ph3":{"ar":"ماذا تريد مناقشته؟","en":"What would you like to discuss?"},"ph4":{"ar":"اكتب رسالتك هنا...","en":"Write your message here..."}},"alt":{"alt1":{"ar":"Hiba Alaa - Software Engineer","en":"Hiba Alaa - Software Engineer"},"alt2":{"ar":"Hiba Alaa","en":"Hiba Alaa"},"alt3":{"ar":"Hiba Alaa","en":"Hiba Alaa"},"alt4":{"ar":"هبا علاء - مهندسة برمجيات","en":"Hiba Alaa - Software Engineer"}},"typewriter":{"ar":["⚡ مهندسة برمجيات متخصصة","🚀 مطورة Full-Stack","💡 مصممة أنظمة قابلة للتطوير","🎯 باحثة عن حلول مبتكرة","🔧 متخصصة في هندسة البرمجيات"],"en":["⚡ Software Engineering Student","🚀 Full-Stack Developer","💡 Scalable Systems Designer","🎯 Creative Problem Solver","🔧 Backend & REST API Developer"]},"title":{"ar":"Hiba Alaa | مهندسة برمجيات","en":"Hiba Alaa Reman | Software Engineer"}};

function applyPortfolioLanguage(lang) {
    const safeLang = lang === 'en' ? 'en' : 'ar';
    const root = document.documentElement;

    root.setAttribute('lang', safeLang);
    root.setAttribute('dir', safeLang === 'ar' ? 'rtl' : 'ltr');
    document.body.setAttribute('data-lang', safeLang);

    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        const item = portfolioTranslations.text[key];
        if (item && item[safeLang] !== undefined) {
            el.textContent = item[safeLang];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
        const key = el.getAttribute('data-i18n-placeholder');
        const item = portfolioTranslations.placeholder[key];
        if (item && item[safeLang] !== undefined) {
            el.setAttribute('placeholder', item[safeLang]);
        }
    });

    document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
        const key = el.getAttribute('data-i18n-alt');
        const item = portfolioTranslations.alt[key];
        if (item && item[safeLang] !== undefined) {
            el.setAttribute('alt', item[safeLang]);
        }
    });

    document.title = portfolioTranslations.title[safeLang];

    const langButton = document.getElementById('languageToggle');
    if (langButton) {
        langButton.textContent = safeLang === 'ar' ? 'EN' : 'عربي';
        langButton.setAttribute('aria-label', safeLang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية');
        langButton.setAttribute('title', safeLang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية');
    }

    try {
        if (typeof typewriterTexts !== 'undefined' && Array.isArray(typewriterTexts)) {
            typewriterTexts.splice(0, typewriterTexts.length, ...portfolioTranslations.typewriter[safeLang]);
        }
        const typewriterEl = document.querySelector('.typewriter-text');
        if (typewriterEl) {
            typewriterEl.textContent = '';
        }
    } catch (error) {
        console.warn('Typewriter language update skipped:', error);
    }

    localStorage.setItem('portfolioLanguage', safeLang);
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLanguage = localStorage.getItem('portfolioLanguage') || 'ar';
    applyPortfolioLanguage(savedLanguage);

    const langButton = document.getElementById('languageToggle');
    if (langButton) {
        langButton.addEventListener('click', () => {
            const currentLang = document.documentElement.getAttribute('lang') === 'en' ? 'en' : 'ar';
            applyPortfolioLanguage(currentLang === 'ar' ? 'en' : 'ar');
        });
    }
});
