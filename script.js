// --- ระบบเปิดหน้าหนังสือ (Flipbook Logic) ---
const pages = document.querySelectorAll('.page');
let currentPage = 0;

function initBook() {
    pages.forEach((page, index) => {
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
    // รหัสผ่านคือ 0405
    if (input === '0405') {
        message.style.display = 'block';
    } else {
        alert('รหัสผ่านไม่ถูกต้อง ลองใส่วันเกิดอ้วนดูสิ 😊');
    }
}

// --- ระบบเสียงเพลง (BGM) ---
const bgm = document.getElementById("bgm");
const bgmBtn = document.getElementById("bgm-btn");
let isPlaying = false;

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

// --- ระบบหัวใจลอย (Floating Hearts แบบอัตโนมัติตลอดเวลา) ---
function createHeart() {
    const heart = document.createElement("div");
    heart.classList.add("heart");
    heart.innerText = ["💖", "💕", "🌸", "✨"][Math.floor(Math.random() * 4)];
    
    // สุ่มตำแหน่งซ้ายขวา
    heart.style.left = Math.random() * 100 + "vw";
    
    // สุ่มความเร็วในการลอย (3-5 วินาที)
    heart.style.animationDuration = (Math.random() * 2 + 3) + "s"; 
    
    document.getElementById("hearts-container").appendChild(heart);

    // ลบหัวใจทิ้งเมื่อลอยสุดจอ เพื่อไม่ให้เครื่องค้าง
    setTimeout(() => {
        heart.remove();
    }, 5000);
}

function createHearts(amount) {
    for(let i=0; i<amount; i++) {
        setTimeout(createHeart, i * 100);
    }
}

// สั่งให้สร้างหัวใจอัตโนมัติตลอดเวลา ทุกๆ 800 มิลลิวินาที 
setInterval(createHeart, 800);
