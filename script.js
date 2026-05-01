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
    // รหัสผ่านคือ 0205
    if (input === '0205') {
        message.style.display = 'block';
    } else {
        alert('รหัสผ่านไม่ถูกต้อง ลองใส่วันเกิดอ้วนดูสิ 😊');
    }
}



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
// ปล่อยหัวใจต้อนรับตอนเปิดเข้าเว็บครั้งแรก
setTimeout(() => {
    createHearts(30);
}, 500);
// สั่งให้สร้างหัวใจอัตโนมัติตลอดเวลา ทุกๆ 800 มิลลิวินาที 
setInterval(createHeart, 800);
// --- ระบบนับถอยหลัง (Countdown Lock Screen) ---

// ตั้งคู่วันและเวลาที่ต้องการให้เปิดได้ (รูปแบบ: "เดือน/วัน/ปี ชั่วโมง:นาที:วินาที")
// ตัวอย่าง: ถ้าอยากให้เปิดได้วันที่ 2 พฤษภาคม 2026 เวลาเที่ยงคืนตรง
// ปี 2027, เดือน 4 (พฤษภาคม), วันที่ 2, 00 นาฬิกา, 00 นาที, 00 วินาที
// --- ระบบนับถอยหลัง และปุ่มกดเปิด (Countdown & Unlock) ---
//const unlockDate = new Date(2026, 4, 1, 15, 3, 0).getTime();
const unlockDate = new Date(2026, 4, 2, 0, 0, 0).getTime();
const lockScreen = document.getElementById("lock-screen");
const unlockBtn = document.getElementById("unlock-btn");

const countdownTimer = setInterval(() => {
    const now = new Date().getTime();
    const distance = unlockDate - now;

    if (distance < 0) {
        // หมดเวลาแล้ว! ให้หยุดนับถอยหลัง
        clearInterval(countdownTimer);
        
        // ซ่อนตัวเลข เปลี่ยนข้อความ และแสดงปุ่มกดเปิด
        document.getElementById("countdown").style.display = "none";
        document.getElementById("lock-title").innerText = "เที่ยงคืนแล้ววว🎉";
        document.getElementById("lock-desc").innerText = "อ้วนพร้อมจะเปิดยังงง";
        unlockBtn.style.display = "block"; // แสดงปุ่ม

    } else {
        // คำนวณเวลาที่เหลืออยู่
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const totalHours = (days * 24) + hours;
        
        document.getElementById("hours").innerText = totalHours.toString().padStart(2, '0');
        document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
        document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');
    }
}, 1000);

// เมื่อกดปุ่ม "เปิดสมุดเลย!" ให้ซ่อนหน้าล็อคและปล่อยหัวใจ
unlockBtn.addEventListener("click", () => {
    lockScreen.style.opacity = "0"; // ค่อยๆ จางหายไป
    
    // ปล่อยหัวใจต้อนรับ 30 ดวง ตอนที่กดปุ่ม
    createHearts(30);

    setTimeout(() => {
        lockScreen.style.display = "none"; // เอาออกจากหน้าจอหลังจางหายเสร็จ
    }, 1000);
});
