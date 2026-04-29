// --- ระบบเปิดหน้าหนังสือ (Flipbook Logic) ---
const pages = document.querySelectorAll('.page');
let currentPage = 0;

// ตั้งค่า Z-index เริ่มต้นให้หน้ากระดาษซ้อนกันอย่างถูกต้อง
function initBook() {
    pages.forEach((page, index) => {
        // หน้าแรกๆ จะต้องอยู่บนสุด (Z-index สูงสุด)
        page.style.zIndex = pages.length - index;
    });
}

function nextPage() {
    if (currentPage < pages.length - 1) {
        pages[currentPage].classList.add('flipped');
        currentPage++;
    }
}

function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        pages[currentPage].classList.remove('flipped');
    }
}

function resetBook() {
    pages.forEach(page => page.classList.remove('flipped'));
    currentPage = 0;
    createHearts(20);
}

// เริ่มต้นสมุด
initBook();


// --- ระบบ Modal ขยายรูปภาพ ---
const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-img");
const clickableImages = document.querySelectorAll(".clickable-img");
const closeModal = document.querySelector(".close-modal");

clickableImages.forEach(img => {
    img.addEventListener("click", function() {
        modal.style.display = "flex";
        modalImg.src = this.src;
    });
});

closeModal.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
});


// --- ระบบรหัสลับ (Secret Message) ---
function checkSecret() {
    const input = document.getElementById('secret-input').value;
    const message = document.getElementById('secret-message');
    if (input === '1402') {
        message.style.display = 'block';
    } else {
        alert('รหัสผ่านไม่ถูกต้อง ลองนึกถึงวันครบรอบของเราดูนะ 😊');
    }
}


// --- ระบบเสียงเพลง (BGM) ---
const bgm = document.getElementById("bgm");
const bgmBtn = document.getElementById("bgm-btn");
let isPlaying = false;

if (bgmBtn && bgm) {
    bgmBtn.addEventListener("click", () => {
        if (isPlaying) {
            bgm.pause();
            bgmBtn.innerText = "🎵 เล่นเพลง";
        } else {
            bgm.play();
            bgmBtn.innerText = "⏸️ หยุดเพลง";
        }
        isPlaying = !isPlaying;
    });
}


// --- ระบบหัวใจลอย (Floating Hearts) ---
let heartInterval;
let heartsEnabled = true;
const heartBtn = document.getElementById("heart-btn");

function createHeart() {
    if (!heartsEnabled) return;

    const heart = document.createElement("div");
    heart.classList.add("heart");
    heart.innerText = ["💖", "💕", "🌸", "✨"][Math.floor(Math.random() * 4)];
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.animationDuration = (Math.random() * 2 + 3) + "s";

    document.getElementById("hearts-container").appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 5000);
}

function createHearts(amount) {
    for (let i = 0; i < amount; i++) {
        setTimeout(createHeart, i * 100);
    }
}

// สร้างหัวใจอัตโนมัติทุกๆ 800ms
heartInterval = setInterval(createHeart, 800);

if (heartBtn) {
    heartBtn.addEventListener("click", () => {
        heartsEnabled = !heartsEnabled;
        heartBtn.innerText = heartsEnabled ? "💖 ปิดหัวใจ" : "💖 เปิดหัวใจ";

        if (!heartsEnabled) {
            document.getElementById("hearts-container").innerHTML = '';
        }
    });
}
