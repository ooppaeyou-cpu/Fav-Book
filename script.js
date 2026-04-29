/**
 * PAGES OF US — Romantic Birthday Flipbook
 * script.js
 *
 * Features:
 *  - Cover → Flipbook transition
 *  - Page-by-page flipping with 3D CSS animations
 *  - Progress bar
 *  - Floating petals background animation
 *  - Image modal (click to enlarge)
 *  - Reveal hidden message popup
 *  - Secret locked page with password
 *  - Background music toggle
 *  - Final page confetti + floating hearts
 *  - "Read Again" reset
 */

/* ─────────────────────────────────
   CONFIGURATION — edit these!
──────────────────────────────────*/
const CONFIG = {
  // Secret page password (format: MMDDYYYY, e.g. your anniversary date)
  secretPassword: '01012020',

  // Petal colors: soft romantic palette
  petalColors: [
    '#f9a8c9', '#f4b8d1', '#fce8ee',
    '#ffd6e7', '#e8c9f0', '#ffc8d5',
    '#f7d794', '#ffb3c1',
  ],

  // Number of petals to generate
  petalCount: 18,

  // Page sound volume (0 to 1)
  pageSoundVolume: 0.25,
};

/* ─────────────────────────────────
   DOM REFERENCES
──────────────────────────────────*/
const coverPage     = document.getElementById('page-cover');
const openBookBtn   = document.getElementById('openBookBtn');
const flipbook      = document.getElementById('flipbook');
const prevBtn       = document.getElementById('prev-btn');
const nextBtn       = document.getElementById('next-btn');
const currentNumEl  = document.getElementById('current-page-num');
const progressBar   = document.getElementById('progress-bar');
const musicBtn      = document.getElementById('music-btn');
const musicLabel    = document.getElementById('music-label');
const bgMusic       = document.getElementById('bg-music');
const pageSound     = document.getElementById('page-sound');
const imgModal      = document.getElementById('img-modal');
const modalImg      = document.getElementById('modal-img');
const modalCaption  = document.getElementById('modal-caption');
const modalClose    = document.getElementById('modal-close');
const modalBdrop    = document.getElementById('img-modal-backdrop');
const revealPopup   = document.getElementById('reveal-popup');
const revealText    = document.getElementById('reveal-text');
const revealClose   = document.getElementById('reveal-close');
const revealBdrop   = document.getElementById('reveal-backdrop');
const secretInput   = document.getElementById('secret-input');
const secretUnlock  = document.getElementById('secret-unlock-btn');
const secretError   = document.getElementById('secret-error');
const readAgainBtn  = document.getElementById('readAgainBtn');
const petalsContainer = document.getElementById('petals-container');

/* ─────────────────────────────────
   PAGE STATE
──────────────────────────────────*/
// Collect all book-page elements in order (excluding secret page, handled separately)
const allPages = Array.from(document.querySelectorAll('.book-page:not(.secret-content)'));
let secretUnlocked = false;
let currentIndex   = 0;   // 0-based index within allPages
let isAnimating    = false;
const totalPages   = allPages.length;

document.getElementById('total-pages-num').textContent = totalPages;

/* ─────────────────────────────────
   FLOATING PETALS
──────────────────────────────────*/
function createPetals() {
  for (let i = 0; i < CONFIG.petalCount; i++) {
    const petal    = document.createElement('div');
    petal.className = 'petal';

    const color   = CONFIG.petalColors[Math.floor(Math.random() * CONFIG.petalColors.length)];
    const size    = 10 + Math.random() * 10;
    const left    = Math.random() * 100;
    const delay   = Math.random() * 12;
    const dur     = 8 + Math.random() * 8;

    petal.style.cssText = `
      background: ${color};
      width: ${size}px;
      height: ${size * 1.3}px;
      left: ${left}%;
      animation-duration: ${dur}s;
      animation-delay: -${delay}s;
      border-radius: ${Math.random() > 0.5 ? '50% 0 50% 0' : '0 50% 0 50%'};
      opacity: ${0.4 + Math.random() * 0.4};
    `;

    petalsContainer.appendChild(petal);
  }
}

createPetals();

/* ─────────────────────────────────
   MUSIC PLAYER
──────────────────────────────────*/
let musicPlaying = false;

musicBtn.addEventListener('click', () => {
  if (musicPlaying) {
    bgMusic.pause();
    musicLabel.textContent = 'Music';
    musicBtn.classList.remove('playing');
    musicPlaying = false;
  } else {
    bgMusic.volume = 0.3;
    bgMusic.play().catch(() => {
      // autoplay blocked – user gesture needed, which we have here
      console.warn('Music play was blocked.');
    });
    musicLabel.textContent = 'Pause';
    musicBtn.classList.add('playing');
    musicPlaying = true;
  }
});

/* ─────────────────────────────────
   PAGE SOUND
──────────────────────────────────*/
function playPageSound() {
  try {
    pageSound.volume = CONFIG.pageSoundVolume;
    pageSound.currentTime = 0;
    pageSound.play().catch(() => {}); // silent fail if blocked
  } catch (e) { /* ignore */ }
}

/* ─────────────────────────────────
   SHOW / HIDE PAGES
──────────────────────────────────*/

/**
 * Display the page at `index` with a flip animation.
 * direction: 'next' | 'prev'
 */
function goToPage(newIndex, direction = 'next') {
  if (isAnimating || newIndex === currentIndex) return;
  if (newIndex < 0 || newIndex >= allPages.length) return;

  isAnimating = true;
  playPageSound();

  const outPage = allPages[currentIndex];
  const inPage  = allPages[newIndex];

  const outClass = direction === 'next' ? 'flip-out'      : 'flip-out-prev';
  const inClass  = direction === 'next' ? 'flip-in'       : 'flip-in-prev';

  // Animate out
  outPage.classList.add(outClass);

  outPage.addEventListener('animationend', () => {
    outPage.classList.remove('active', outClass);

    // Animate in
    inPage.classList.add('active', inClass);
    currentIndex = newIndex;
    updateNavUI();

    inPage.addEventListener('animationend', () => {
      inPage.classList.remove(inClass);
      isAnimating = false;

      // Trigger final page effects
      if (allPages[currentIndex].id === 'page-13') {
        triggerFinalEffects();
      }
    }, { once: true });

  }, { once: true });
}

function updateNavUI() {
  const pageNum = currentIndex + 1;
  currentNumEl.textContent  = pageNum;
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === allPages.length - 1;

  // Progress bar
  const pct = (pageNum / totalPages) * 100;
  progressBar.style.width = pct + '%';
}

/* ─────────────────────────────────
   OPEN BOOK
──────────────────────────────────*/
openBookBtn.addEventListener('click', () => {
  // Animate cover out
  coverPage.style.transition = 'transform 0.7s cubic-bezier(0.4,0,0.2,1), opacity 0.7s ease';
  coverPage.style.transform  = 'perspective(1200px) rotateY(-90deg)';
  coverPage.style.opacity    = '0';
  coverPage.style.transformOrigin = 'left center';

  setTimeout(() => {
    coverPage.style.display = 'none';
    flipbook.classList.remove('hidden');

    // Show page 1
    allPages[0].classList.add('active');
    currentIndex = 0;
    updateNavUI();

    // Activate petals more
    petalsContainer.style.opacity = '1';
  }, 650);

  playPageSound();
});

/* ─────────────────────────────────
   NAVIGATION BUTTONS
──────────────────────────────────*/
nextBtn.addEventListener('click', () => goToPage(currentIndex + 1, 'next'));
prevBtn.addEventListener('click', () => goToPage(currentIndex - 1, 'prev'));

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (flipbook.classList.contains('hidden')) return;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goToPage(currentIndex + 1, 'next');
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goToPage(currentIndex - 1, 'prev');
});

// Swipe navigation (touch)
let touchStartX = 0;
document.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
document.addEventListener('touchend', (e) => {
  if (flipbook.classList.contains('hidden')) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) < 50) return; // threshold
  if (dx < 0) goToPage(currentIndex + 1, 'next');
  else         goToPage(currentIndex - 1, 'prev');
});

/* ─────────────────────────────────
   PAGE CORNER CLICK → next page
──────────────────────────────────*/
document.querySelectorAll('.page-fold').forEach((fold) => {
  fold.addEventListener('click', () => goToPage(currentIndex + 1, 'next'));
});

/* ─────────────────────────────────
   IMAGE MODAL
──────────────────────────────────*/
document.addEventListener('click', (e) => {
  const frame = e.target.closest('.clickable-photo');
  if (!frame) return;

  const src     = frame.dataset.src || frame.querySelector('img')?.src;
  const caption = frame.dataset.caption || frame.querySelector('.photo-caption')?.textContent || '';

  modalImg.src        = src;
  modalCaption.textContent = caption;
  imgModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
});

function closeModal() {
  imgModal.classList.add('hidden');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalBdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

/* ─────────────────────────────────
   REVEAL HIDDEN MESSAGE
──────────────────────────────────*/
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.reveal-btn');
  if (!btn) return;

  const msg = btn.dataset.message || 'I love you. 💕';
  revealText.textContent = msg;
  revealPopup.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
});

function closeReveal() {
  revealPopup.classList.add('hidden');
  document.body.style.overflow = '';
}

revealClose.addEventListener('click', closeReveal);
revealBdrop.addEventListener('click', closeReveal);

/* ─────────────────────────────────
   SECRET PAGE UNLOCK
──────────────────────────────────*/
secretUnlock.addEventListener('click', tryUnlock);
secretInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') tryUnlock(); });

function tryUnlock() {
  const val = secretInput.value.replace(/\D/g, '');

  if (val === CONFIG.secretPassword) {
    // Success!
    secretError.classList.add('hidden');
    secretInput.value = '';

    if (!secretUnlocked) {
      secretUnlocked = true;

      // Insert secret page into allPages right after page-10 (index 9)
      const secretPage = document.getElementById('page-secret');
      const insertAfterIdx = 9; // page-10 is index 9

      // Remove from hidden, add to flow
      secretPage.classList.remove('hidden');

      // Add to our page array after index 9
      allPages.splice(insertAfterIdx + 1, 0, secretPage);

      // Update total pages display
      document.getElementById('total-pages-num').textContent = allPages.length;
    }

    // Navigate to secret page
    const secretIdx = allPages.indexOf(document.getElementById('page-secret'));
    if (secretIdx !== -1) {
      // short delay for feel
      setTimeout(() => goToPage(secretIdx, 'next'), 200);
    }

    // Celebrate unlock
    spawnHeartsLocal();
  } else {
    secretError.classList.remove('hidden');
    secretInput.value = '';
    secretInput.focus();

    // Shake animation
    secretInput.style.animation = 'none';
    requestAnimationFrame(() => {
      secretInput.style.animation = 'shakInput 0.4s ease';
    });
  }
}

/* Shake keyframes injected dynamically */
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shakInput {
    0%,100% { transform: translateX(0); }
    20%     { transform: translateX(-8px); }
    40%     { transform: translateX(8px); }
    60%     { transform: translateX(-6px); }
    80%     { transform: translateX(6px); }
  }
`;
document.head.appendChild(shakeStyle);

/* ─────────────────────────────────
   FINAL PAGE EFFECTS
──────────────────────────────────*/
let finalTriggered = false;

function triggerFinalEffects() {
  if (finalTriggered) return;
  finalTriggered = true;

  // Confetti
  if (typeof confetti === 'function') {
    const colors = ['#f9a8c9', '#fce8ee', '#f7d794', '#b5ead7', '#c7ceea', '#ffb7b2'];

    const burst = (origin, spread) => {
      confetti({
        particleCount: 60,
        spread,
        origin,
        colors,
        shapes: ['circle', 'square'],
        ticks: 150,
        gravity: 0.9,
        scalar: 0.85,
      });
    };

    burst({ x: 0.2, y: 0.7 }, 70);
    setTimeout(() => burst({ x: 0.8, y: 0.7 }, 70), 250);
    setTimeout(() => burst({ x: 0.5, y: 0.5 }, 100), 500);
    setTimeout(() => burst({ x: 0.3, y: 0.6 }, 60), 900);
    setTimeout(() => burst({ x: 0.7, y: 0.6 }, 60), 1100);
  }

  // DOM hearts
  spawnHeartsLocal();
}

function spawnHeartsLocal() {
  const heartsBurst = document.getElementById('hearts-burst');
  if (!heartsBurst) return;

  const emojis = ['❤️', '💕', '💖', '💗', '💝', '🌸', '✨'];

  for (let i = 0; i < 14; i++) {
    const h = document.createElement('span');
    h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    h.style.cssText = `
      position: absolute;
      font-size: ${14 + Math.random() * 18}px;
      left: ${10 + Math.random() * 80}%;
      top: ${20 + Math.random() * 60}%;
      pointer-events: none;
      animation: heartFloat ${1.5 + Math.random() * 1.5}s ease forwards;
      animation-delay: ${Math.random() * 0.8}s;
      z-index: 20;
    `;
    heartsBurst.appendChild(h);
  }

  // Inject float keyframes if not already done
  if (!document.getElementById('heart-float-kf')) {
    const kf = document.createElement('style');
    kf.id = 'heart-float-kf';
    kf.textContent = `
      @keyframes heartFloat {
        0%   { transform: translateY(0) scale(0.5); opacity: 1; }
        100% { transform: translateY(-120px) scale(1.2); opacity: 0; }
      }
    `;
    document.head.appendChild(kf);
  }

  // Clean up after 4s
  setTimeout(() => { heartsBurst.innerHTML = ''; }, 4000);
}

/* ─────────────────────────────────
   READ AGAIN BUTTON
──────────────────────────────────*/
readAgainBtn.addEventListener('click', () => {
  // Reset everything
  finalTriggered = false;

  // Hide all pages
  allPages.forEach((p) => {
    p.classList.remove('active', 'flip-in', 'flip-out', 'flip-in-prev', 'flip-out-prev');
  });

  // If secret page was unlocked, remove from allPages and hide
  if (secretUnlocked) {
    const secretPage = document.getElementById('page-secret');
    const idx = allPages.indexOf(secretPage);
    if (idx !== -1) allPages.splice(idx, 1);
    secretPage.classList.add('hidden');
    secretUnlocked = false;
    document.getElementById('total-pages-num').textContent = allPages.length;
  }

  // Go back to cover
  flipbook.classList.add('hidden');
  coverPage.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
  coverPage.style.transform  = 'perspective(1200px) rotateY(0deg)';
  coverPage.style.opacity    = '1';
  coverPage.style.display    = '';

  currentIndex = 0;
  updateNavUI();
});

/* ─────────────────────────────────
   MISCELLANEOUS POLISH
──────────────────────────────────*/

// Ensure page-fold cursor shows correctly
document.querySelectorAll('.page-fold').forEach((fold) => {
  fold.style.cursor = 'pointer';
  fold.title = 'Next page';
});

// Lazy-load page-specific animations on reveal
// (re-trigger float animations when a page becomes active)
const activatePageAnimations = (page) => {
  page.querySelectorAll('.float-anim').forEach((el) => {
    el.style.animation = 'none';
    requestAnimationFrame(() => {
      el.style.animation = '';
    });
  });
};

// Observe which page is shown by watching class changes
const observer = new MutationObserver((mutations) => {
  mutations.forEach((m) => {
    if (m.type === 'attributes' && m.attributeName === 'class') {
      const target = m.target;
      if (target.classList.contains('active')) {
        activatePageAnimations(target);
      }
    }
  });
});

allPages.forEach((page) => {
  observer.observe(page, { attributes: true });
});

/* ─────────────────────────────────
   INITIAL UI STATE
──────────────────────────────────*/
updateNavUI();
prevBtn.disabled = true;

console.log(
  '%c💕 Pages of Us — Loaded with love 💕',
  'font-size:16px; color:#d6789a; font-family: Georgia, serif;'
);
