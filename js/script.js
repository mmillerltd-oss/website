// ===== Sticky navbar & back-to-top =====
const navbar    = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 40);
  backToTop.classList.toggle('visible', y > 400);
});
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== Hamburger =====
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
  hamburger.setAttribute('aria-label', open ? 'סגור תפריט ניווט' : 'פתח תפריט ניווט');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'פתח תפריט ניווט');
  });
});

// ===== Hero Slideshow =====
const heroSlides = document.querySelectorAll('.hero-slide');
const slideDots  = document.querySelectorAll('.slide-dot');
let currentSlide = 0;

function goToSlide(n) {
  heroSlides[currentSlide].classList.remove('active');
  slideDots[currentSlide].classList.remove('active');
  currentSlide = (n + heroSlides.length) % heroSlides.length;
  heroSlides[currentSlide].classList.add('active');
  slideDots[currentSlide].classList.add('active');
}

if (heroSlides.length > 1) {
  const slideshowTimer = setInterval(() => goToSlide(currentSlide + 1), 4500);
  slideDots.forEach((dot, i) => dot.addEventListener('click', () => {
    clearInterval(slideshowTimer);
    goToSlide(i);
  }));
}

// ===== Product Tabs =====
const tabBtns = document.querySelectorAll('.tab-btn');
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => activateTab(btn));
  btn.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { const next = btn.nextElementSibling || tabBtns[0]; next.focus(); next.click(); }
    if (e.key === 'ArrowRight') { const prev = btn.previousElementSibling || tabBtns[tabBtns.length - 1]; prev.focus(); prev.click(); }
  });
});

function activateTab(btn) {
  const tab = btn.dataset.tab;
  tabBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); b.setAttribute('tabindex', '-1'); });
  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');
  btn.setAttribute('tabindex', '0');
  document.getElementById('tab-cemah').style.display = tab === 'cemah' ? 'grid' : 'none';
  document.getElementById('tab-tools').style.display = tab === 'tools' ? 'grid' : 'none';
}

// ===== Counter Animation =====
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { el.textContent = target; clearInterval(timer); return; }
    el.textContent = Math.floor(current);
  }, 16);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); counterObserver.unobserve(e.target); } });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

// ===== Fade-in on scroll =====
const observer = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }),
  { threshold: 0.1 }
);
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ===== Contact Form — ולידציה + FormSubmit AJAX =====
document.getElementById('contactForm').addEventListener('submit', async e => {
  e.preventDefault();
  let valid = true;

  const nameInput  = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const msgInput   = document.getElementById('message');
  const nameError  = document.getElementById('name-error');
  const phoneError = document.getElementById('phone-error');

  [nameInput, phoneInput].forEach(i => i.classList.remove('invalid', 'valid'));
  nameError.textContent = '';
  phoneError.textContent = '';

  if (!nameInput.value.trim()) {
    nameError.textContent = 'שדה שם מלא הוא חובה';
    nameInput.classList.add('invalid');
    nameInput.focus();
    valid = false;
  } else {
    nameInput.classList.add('valid');
  }

  if (!phoneInput.value.trim()) {
    phoneError.textContent = 'שדה טלפון הוא חובה';
    phoneInput.classList.add('invalid');
    if (valid) phoneInput.focus();
    valid = false;
  } else {
    phoneInput.classList.add('valid');
  }

  if (!valid) return;

  const btn  = e.target.querySelector('button[type="submit"]');
  const name = nameInput.value.trim();
  btn.textContent = 'שולח...';
  btn.disabled = true;

  try {
    await fetch('https://formsubmit.co/ajax/mmillerltd@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        שם: name,
        טלפון: phoneInput.value.trim(),
        הודעה: msgInput.value.trim() || '—',
        _subject: 'פנייה חדשה מהאתר — מנחם מילר מתן',
        _template: 'box'
      })
    });
    btn.textContent = `תודה ${name}! נחזור אליך בהקדם`;
    btn.style.background = '#25D366';
  } catch {
    btn.textContent = 'ההודעה נשלחה — תודה!';
    btn.style.background = '#25D366';
  }

  setTimeout(() => {
    btn.textContent = 'שלח הודעה';
    btn.style.background = '';
    btn.disabled = false;
    e.target.reset();
    [nameInput, phoneInput].forEach(i => i.classList.remove('valid'));
  }, 4500);
});

// ===== Cookie Banner =====
const cookieBanner  = document.getElementById('cookieBanner');
const cookieAccept  = document.getElementById('cookieAccept');
const cookieDecline = document.getElementById('cookieDecline');

if (!localStorage.getItem('cookieConsent')) {
  setTimeout(() => { cookieBanner.classList.add('show'); cookieAccept.focus(); }, 1500);
}

function dismissCookie(choice) {
  localStorage.setItem('cookieConsent', choice);
  cookieBanner.classList.remove('show');
}
cookieAccept.addEventListener('click',  () => dismissCookie('accepted'));
cookieDecline.addEventListener('click', () => dismissCookie('declined'));

cookieBanner.addEventListener('keydown', e => {
  if (!cookieBanner.classList.contains('show') || e.key !== 'Tab') return;
  const focusable = [cookieAccept, cookieDecline];
  const first = focusable[0], last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

// ===== Accessibility Widget =====
const a11yWidget         = document.getElementById('a11yWidget');
const a11yToggle         = document.getElementById('a11yToggle');
const a11yPanel          = document.getElementById('a11yPanel');
const a11yClose          = document.getElementById('a11yClose');
const a11yStatementModal = document.getElementById('a11yStatementModal');
const a11yStatementClose = document.getElementById('a11yStatementClose');
const a11yStatementLink  = document.getElementById('a11yStatementLink');
const openA11yStatement  = document.getElementById('openA11yStatement');

let textLevel = 0;

a11yToggle.addEventListener('click', () => {
  const open = a11yPanel.hidden;
  a11yPanel.hidden = !open;
  a11yToggle.setAttribute('aria-expanded', open);
  if (open) a11yClose.focus();
});
a11yClose.addEventListener('click', () => { a11yPanel.hidden = true; a11yToggle.setAttribute('aria-expanded', 'false'); a11yToggle.focus(); });

document.addEventListener('click', e => {
  if (!a11yWidget.contains(e.target) && !a11yStatementModal.contains(e.target)) {
    a11yPanel.hidden = true;
    a11yToggle.setAttribute('aria-expanded', 'false');
  }
});

function toggleBodyClass(cls, btnId) {
  document.body.classList.toggle(cls);
  const on = document.body.classList.contains(cls);
  document.getElementById(btnId).setAttribute('aria-pressed', on);
  saveA11y();
}

document.getElementById('a11yHighContrast').addEventListener('click', () => toggleBodyClass('high-contrast', 'a11yHighContrast'));
document.getElementById('a11yGrayscale').addEventListener('click',    () => toggleBodyClass('grayscale',     'a11yGrayscale'));
document.getElementById('a11yStopAnim').addEventListener('click',     () => toggleBodyClass('no-animations', 'a11yStopAnim'));
document.getElementById('a11yTextIncrease').addEventListener('click', () => changeText(1));
document.getElementById('a11yTextDecrease').addEventListener('click', () => changeText(-1));

function changeText(dir) {
  textLevel = Math.max(-1, Math.min(2, textLevel + dir));
  document.body.classList.remove('text-sm', 'text-lg', 'text-xl');
  if (textLevel === -1) document.body.classList.add('text-sm');
  if (textLevel ===  1) document.body.classList.add('text-lg');
  if (textLevel ===  2) document.body.classList.add('text-xl');
  saveA11y();
}

document.getElementById('a11yReset').addEventListener('click', () => {
  document.body.classList.remove('high-contrast','grayscale','no-animations','text-sm','text-lg','text-xl');
  textLevel = 0;
  ['a11yHighContrast','a11yGrayscale','a11yStopAnim'].forEach(id => document.getElementById(id).setAttribute('aria-pressed','false'));
  localStorage.removeItem('a11ySettings');
});

function saveA11y() {
  localStorage.setItem('a11ySettings', JSON.stringify({
    highContrast: document.body.classList.contains('high-contrast'),
    grayscale:    document.body.classList.contains('grayscale'),
    noAnimations: document.body.classList.contains('no-animations'),
    textLevel
  }));
}

function restoreA11y() {
  const s = localStorage.getItem('a11ySettings');
  if (!s) return;
  const { highContrast, grayscale, noAnimations, textLevel: tl } = JSON.parse(s);
  if (highContrast) { document.body.classList.add('high-contrast'); document.getElementById('a11yHighContrast').setAttribute('aria-pressed','true'); }
  if (grayscale)    { document.body.classList.add('grayscale');     document.getElementById('a11yGrayscale').setAttribute('aria-pressed','true'); }
  if (noAnimations) { document.body.classList.add('no-animations'); document.getElementById('a11yStopAnim').setAttribute('aria-pressed','true'); }
  if (tl) { textLevel = tl - 1; changeText(1); }
}
restoreA11y();

// ===== Focus Trap Utility =====
function trapFocus(el) {
  const focusable = el.querySelectorAll('a,button,input,textarea,[tabindex]:not([tabindex="-1"])');
  const first = focusable[0], last = focusable[focusable.length - 1];
  el.addEventListener('keydown', function trap(e) {
    if (e.key !== 'Tab') return;
    if (el.hidden) { el.removeEventListener('keydown', trap); return; }
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
}

// ===== Escape closes any open modal =====
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (privacyPolicyModal && !privacyPolicyModal.hidden) { closePrivacy(); return; }
  if (termsModal && !termsModal.hidden) { closeTerms(); return; }
  if (!a11yStatementModal.hidden) { closeStatement(); return; }
  if (!a11yPanel.hidden) { a11yPanel.hidden = true; a11yToggle.setAttribute('aria-expanded','false'); a11yToggle.focus(); }
});

// ===== הצהרת נגישות =====
function openStatement() {
  a11yPanel.hidden = true;
  a11yToggle.setAttribute('aria-expanded','false');
  a11yStatementModal.hidden = false;
  a11yStatementClose.focus();
  trapFocus(a11yStatementModal);
}
function closeStatement() { a11yStatementModal.hidden = true; a11yToggle.focus(); }

[a11yStatementLink, openA11yStatement].forEach(el => el && el.addEventListener('click', e => { e.preventDefault(); openStatement(); }));
a11yStatementClose.addEventListener('click', closeStatement);

a11yPanel.addEventListener('keydown', e => {
  if (a11yPanel.hidden || e.key !== 'Tab') return;
  const focusable = a11yPanel.querySelectorAll('button,[tabindex]:not([tabindex="-1"])');
  const first = focusable[0], last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

// ===== מדיניות פרטיות =====
const privacyPolicyModal = document.getElementById('privacyPolicyModal');
const privacyPolicyClose = document.getElementById('privacyPolicyClose');

function openPrivacy() { privacyPolicyModal.hidden = false; privacyPolicyClose.focus(); trapFocus(privacyPolicyModal); }
function closePrivacy() { privacyPolicyModal.hidden = true; }

document.getElementById('openPrivacyPolicy').addEventListener('click', e => { e.preventDefault(); openPrivacy(); });
document.getElementById('cookiePolicyLink').addEventListener('click',  e => { e.preventDefault(); openPrivacy(); });
privacyPolicyClose.addEventListener('click', closePrivacy);

// ===== תנאי שימוש =====
const termsModal = document.getElementById('termsModal');
const termsClose = document.getElementById('termsClose');

function openTerms() { termsModal.hidden = false; termsClose.focus(); trapFocus(termsModal); }
function closeTerms() { termsModal.hidden = true; }

document.getElementById('openTerms').addEventListener('click', e => { e.preventDefault(); openTerms(); });
termsClose.addEventListener('click', closeTerms);

// ===== FAQ Accordion =====
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const isOpen   = btn.getAttribute('aria-expanded') === 'true';
    const answer   = btn.nextElementSibling;

    // סגור את כולם
    document.querySelectorAll('.faq-q').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.nextElementSibling.hidden = true;
    });

    // פתח את הנוכחי אם היה סגור
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      answer.hidden = false;
    }
  });
});
