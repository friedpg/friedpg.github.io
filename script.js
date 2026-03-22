/* ============================================
   PORTFOLIO JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // 동적으로 섹션을 로드한 후, 애니메이션 초기화
    loadAllSections().then(() => {
        initTypingAnimation();
        initScrollReveal();
        initNavbar();
        initHamburger();
        initSkillBars();
        initContactForm();
    });
});

/* ============================================
   SECTION LOADER
   ============================================ */
async function loadSection(containerId, filePath) {
    const container = document.getElementById(containerId);
    if (!container) return;
    try {
        const response = await fetch(filePath);
        if (response.ok) {
            container.innerHTML = await response.text();
        } else {
            console.error(`섹션 로드 실패: ${filePath} (상태: ${response.status})`);
        }
    } catch (e) {
        console.error(`섹션 로드 에러: ${filePath}`, e);
        container.innerHTML = `<p style="color:red; text-align:center; padding: 20px;">[오류] 로컬 file:// 에서는 fetch()가 작용하지 않습니다. VS Code Live Server 등을 이용해주세요.</p>`;
    }
}

async function loadAllSections() {
    const sections = [
        ['section-hero', 'sections/hero.html'],
        ['section-about', 'sections/about.html'],
        ['section-skills', 'sections/skills.html'],
        ['section-projects', 'sections/projects.html'],
        ['section-timeline', 'sections/timeline.html'],
        ['section-contact', 'sections/contact.html']
    ];
    await Promise.all(sections.map(([id, path]) => loadSection(id, path)));
}

/* ============================================
   TYPING ANIMATION
   ============================================ */
function initTypingAnimation() {
    const typingEl = document.getElementById('typingText');
    if (!typingEl) return;

    const phrases = [
        'AWS Cloud Security',
        '침투 테스트 전문가',
        'LLM Security',
        '보안 취약점 연구원',
        'WEB vulnerable analysis'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typingEl.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            typingEl.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 80;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }

    setTimeout(type, 1000);
}

/* ============================================
   SCROLL REVEAL (Intersection Observer)
   ============================================ */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    if (revealElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach((el) => observer.observe(el));
}

/* ============================================
   NAVBAR SCROLL EFFECT
   ============================================ */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        let current = '';
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
            const navMenu = document.getElementById('navMenu');
            const hamburger = document.getElementById('hamburger');
            if (navMenu && hamburger) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });
}

/* ============================================
   HAMBURGER MENU
   ============================================ */
function initHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

/* ============================================
   SKILL BARS ANIMATION
   ============================================ */
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    if (skillBars.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const progress = entry.target.getAttribute('data-progress');
                entry.target.style.width = `${progress}%`;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    skillBars.forEach((bar) => observer.observe(bar));
}

/* ============================================
   CONTACT FORM (Static - no backend)
   ============================================ */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('.btn');
        const originalText = btn.innerHTML;

        btn.innerHTML = '<span class="btn-icon">✓</span> 전송 완료!';
        btn.style.background = 'rgba(0, 255, 157, 0.2)';
        btn.style.color = '#00ff9d';
        btn.style.border = '1px solid #00ff9d';

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.style.color = '';
            btn.style.border = '';
            form.reset();
        }, 3000);
    });
}
