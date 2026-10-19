/**
 * APPLICATION LOGIC (app.js)
 * --------------------------
 * Handles Login, Countdown Timer, Background Music, Confetti Cannon,
 * Interactive Candle & Microphone Detection, Modal, and Floating Butterflies.
 */

let isMusicPlaying = false;
let audioContext;
let micStream;
let micAnalyser;
let isCandleLit = true;

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  // Populate Data from data.js
  document.getElementById("mainGreetingHeader").innerText = CONFIG_DATA.greetingTitle;
  document.getElementById("profilePhoto").src = CONFIG_DATA.profilePhoto;
  document.getElementById("giftMessageText").innerText = CONFIG_DATA.specialMessage;
  document.getElementById("bgMusic").src = CONFIG_DATA.audioUrl;

  // Render Dynamic Gallery
  renderGallery();

  // Create Butterfly Particles
  createButterflies();

  // Start Realtime Countdown
  startCountdown();
});

// Handle Login Verification
function handleLogin(e) {
  e.preventDefault();
  const userVal = document.getElementById("usernameInput").value.trim().toLowerCase();
  const passVal = document.getElementById("passwordInput").value.trim();
  const errorMsg = document.getElementById("errorMessage");

  if (userVal === CONFIG_DATA.credentials.username.toLowerCase() && passVal === CONFIG_DATA.credentials.password) {
    errorMsg.classList.add("hidden");
    
    // Hide Login Modal Smoothly
    const loginModal = document.getElementById("loginModal");
    loginModal.classList.add("opacity-0", "pointer-events-none");
    
    setTimeout(() => {
      loginModal.style.display = "none";
      
      // Reveal Main Content
      const mainContent = document.getElementById("mainContent");
      mainContent.classList.remove("hidden");
      setTimeout(() => mainContent.classList.remove("opacity-0"), 50);

      // Trigger Confetti Burst from Left and Right
      fireConfettiBurst();

      // Start Playing Music
      playMusic();
    }, 500);
  } else {
    errorMsg.classList.remove("hidden");
  }
}

// Confetti Burst Trigger
function fireConfettiBurst() {
  if (typeof confetti === 'function') {
    // Left Cannon
    confetti({
      particleCount: 90,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.7 },
      colors: ['#f472b6', '#c084fc', '#fb7185', '#a855f7']
    });
    // Right Cannon
    confetti({
      particleCount: 90,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.7 },
      colors: ['#f472b6', '#c084fc', '#fb7185', '#a855f7']
    });
  }
}

// Generate Animated Background Butterflies
function createButterflies() {
  const container = document.getElementById("butterflyContainer");
  const butterflyColors = ['#f472b6', '#c084fc', '#e879f9', '#fb7185'];
  
  for (let i = 0; i < 14; i++) {
    const butterfly = document.createElement("div");
    butterfly.className = "butterfly";
    butterfly.style.left = `${Math.random() * 90}%`;
    butterfly.style.animationDelay = `${Math.random() * 8}s`;
    butterfly.style.animationDuration = `${10 + Math.random() * 6}s`;
    
    const color = butterflyColors[Math.floor(Math.random() * butterflyColors.length)];
    butterfly.innerHTML = `
      <svg viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
        <path d="M12,2 C10,5 5,3 3,8 C1,13 6,17 12,22 C18,17 23,13 21,8 C19,3 14,5 12,2 Z"/>
      </svg>
    `;
    container.appendChild(butterfly);
  }
}

// Background Music Playback Control
function playMusic() {
  const music = document.getElementById("bgMusic");
  music.play().then(() => {
    isMusicPlaying = true;
    updateMusicIcon();
  }).catch(err => {
    console.log("Autoplay blocked by browser. User can tap audio icon.");
  });
}

function toggleMusic() {
  const music = document.getElementById("bgMusic");
  if (isMusicPlaying) {
    music.pause();
    isMusicPlaying = false;
  } else {
    music.play();
    isMusicPlaying = true;
  }
  updateMusicIcon();
}

function updateMusicIcon() {
  const icon = document.getElementById("musicIcon");
  const btn = document.getElementById("musicToggle");
  if (isMusicPlaying) {
    icon.className = "fa-solid fa-compact-disc text-lg animate-spin text-pink-500";
    btn.classList.add("ring-2", "ring-pink-300");
  } else {
    icon.className = "fa-solid fa-music text-lg text-gray-400";
    btn.classList.remove("ring-2", "ring-pink-300");
  }
}

// Realtime Countdown Timer
function startCountdown() {
  const target = new Date(CONFIG_DATA.targetDate).getTime();

  function updateTimer() {
    const now = new Date().getTime();
    const difference = target - now;

    if (difference < 0) {
      document.getElementById("days").innerText = "00";
      document.getElementById("hours").innerText = "00";
      document.getElementById("minutes").innerText = "00";
      document.getElementById("seconds").innerText = "00";
      document.getElementById("countdownTitle").innerText = "Hari Spesial Telah Tiba! 🎉";
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = days < 10 ? `0${days}` : days;
    document.getElementById("hours").innerText = hours < 10 ? `0${hours}` : hours;
    document.getElementById("minutes").innerText = minutes < 10 ? `0${minutes}` : minutes;
    document.getElementById("seconds").innerText = seconds < 10 ? `0${seconds}` : seconds;
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

// Candle Flame Controls
function extinguishCandle() {
  if (!isCandleLit) return;
  isCandleLit = false;

  const flame = document.getElementById("candleFlame");
  const smoke = document.getElementById("candleSmoke");
  const wishMessage = document.getElementById("wishMessage");

  flame.classList.add("extinguished");
  smoke.classList.remove("hidden");
  
  setTimeout(() => smoke.classList.add("hidden"), 2000);
  wishMessage.classList.remove("hidden");

  // Celebrate with Confetti
  fireConfettiBurst();
}

function relightCandle() {
  isCandleLit = true;
  const flame = document.getElementById("candleFlame");
  const wishMessage = document.getElementById("wishMessage");

  flame.classList.remove("extinguished");
  wishMessage.classList.add("hidden");
}

// Web Audio API Microphone Blow Detection
async function toggleMic() {
  const micBtn = document.getElementById("micBtn");

  if (micStream) {
    // Turn Off Microphone Stream
    micStream.getTracks().forEach(track => track.stop());
    micStream = null;
    micBtn.classList.remove("bg-red-100", "text-red-600");
    micBtn.innerHTML = `<i class="fa-solid fa-microphone mr-1"></i> Aktivasi Tiupan Mic`;
    return;
  }

  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    micAnalyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(micStream);
    source.connect(micAnalyser);
    micAnalyser.fftSize = 256;

    micBtn.classList.add("bg-red-100", "text-red-600");
    micBtn.innerHTML = `<i class="fa-solid fa-microphone-lines mr-1 animate-pulse"></i> Mic Aktif (Tiup Sekarang!)`;

    detectBlow();
  } catch (err) {
    alert("Akses mikrofon tidak diizinkan atau tidak didukung di perangkat ini.");
  }
}

function detectBlow() {
  if (!micStream || !isCandleLit) return;

  const dataArray = new Uint8Array(micAnalyser.frequencyBinCount);
  micAnalyser.getByteFrequencyData(dataArray);

  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    sum += dataArray[i];
  }
  let average = sum / dataArray.length;

  // Blow Threshold
  if (average > 48) {
    extinguishCandle();
  } else {
    requestAnimationFrame(detectBlow);
  }
}

// Surprise Gift Modal Functions
function openGiftModal() {
  const modal = document.getElementById("giftModal");
  modal.classList.add("modal-active");
  fireConfettiBurst();
}

function closeGiftModal() {
  const modal = document.getElementById("giftModal");
  modal.classList.remove("modal-active");
}

// Render Gallery Cards dynamically
function renderGallery() {
  const container = document.getElementById("galleryContainer");
  container.innerHTML = "";

  CONFIG_DATA.gallery.forEach(item => {
    const card = document.createElement("div");
    card.className = `glass-card p-3 rounded-2xl shadow-lg border border-white/80 transition-transform duration-300 hover:scale-105 ${item.swayClass}`;
    card.innerHTML = `
      <div class="overflow-hidden rounded-xl bg-gray-100 mb-3 aspect-square">
        <img src="${item.url}" alt="${item.caption}" class="w-full h-full object-cover">
      </div>
      <p class="text-center font-bold text-purple-800 font-aesthetic text-xl">${item.caption}</p>
    `;
    container.appendChild(card);
  });
}