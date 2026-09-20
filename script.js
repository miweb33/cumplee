const scene = document.querySelector(".scene");
const card = document.getElementById("card3d");
const particles = document.getElementById("particles");
const partyBtn = document.getElementById("partyBtn");
const wishBtn = document.getElementById("wishBtn");
const wishOverlay = document.getElementById("wishOverlay");
const closeWish = document.getElementById("closeWish");
const musicBtn = document.getElementById("musicBtn");

let audioCtx = null;
let musicOn = false;

function launchConfetti(amount = 90) {
  const rect = scene.getBoundingClientRect();
  const originX = rect.width * 0.51;
  const originY = rect.height * 0.48;

  for (let i = 0; i < amount; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti";

    const angle = Math.random() * Math.PI * 2;
    const distance = 120 + Math.random() * 360;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance + 130 + Math.random() * 180;

    const colors = ["#ff4f86", "#ffd32a", "#19c37d", "#ffffff", "#7c5cff", "#ff6b35"];
    piece.style.left = `${originX}px`;
    piece.style.top = `${originY}px`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.setProperty("--x", `${x}px`);
    piece.style.setProperty("--y", `${y}px`);
    piece.style.setProperty("--r", `${-720 + Math.random() * 1440}deg`);
    piece.style.animationDelay = `${Math.random() * .25}s`;
    piece.style.width = `${6 + Math.random() * 9}px`;
    piece.style.height = `${10 + Math.random() * 14}px`;

    particles.appendChild(piece);
    setTimeout(() => piece.remove(), 2400);
  }

  playPop();
}

function createBalloons(count = 7) {
  const colors = ["#ff4e45", "#3b91ff", "#ffd43b", "#ff4f86", "#6ad66a"];
  for (let i = 0; i < count; i++) {
    const balloon = document.createElement("div");
    balloon.className = "balloon";
    balloon.style.position = "absolute";
    balloon.style.left = `${20 + Math.random() * 60}%`;
    balloon.style.top = `${35 + Math.random() * 30}%`;
    balloon.style.background = colors[Math.floor(Math.random() * colors.length)];
    balloon.style.animationDelay = `${Math.random() * -3}s`;
    balloon.style.transform = `scale(${.55 + Math.random() * .45})`;
    balloon.style.zIndex = "7";
    balloon.style.opacity = "0";
    balloon.style.transition = "opacity .3s ease";

    scene.appendChild(balloon);
    requestAnimationFrame(() => {
      balloon.style.opacity = "1";
      balloon.animate(
        [
          { transform: "translateY(180px) scale(.6)", opacity: 0 },
          { transform: "translateY(-120px) scale(1)", opacity: 1 }
        ],
        { duration: 1700 + Math.random() * 700, easing: "cubic-bezier(.2,.8,.2,1)", fill: "forwards" }
      );
    });

    setTimeout(() => balloon.remove(), 2800);
  }
}

function celebrate() {
  launchConfetti(110);
  createBalloons(8);
  card.animate(
    [
      { transform: "translate(-50%, -50%) rotateX(7deg) rotateY(-9deg) rotateZ(-1deg) scale(1)" },
      { transform: "translate(-50%, -50%) rotateX(7deg) rotateY(9deg) rotateZ(1deg) scale(1.04)" },
      { transform: "translate(-50%, -50%) rotateX(7deg) rotateY(-9deg) rotateZ(-1deg) scale(1)" }
    ],
    { duration: 850, easing: "ease-in-out" }
  );
}

scene.addEventListener("mousemove", (e) => {
  const r = scene.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - .5;
  const y = (e.clientY - r.top) / r.height - .5;

  card.style.transform =
    `translate(-50%, -50%) rotateX(${7 - y * 12}deg) rotateY(${-9 + x * 18}deg) rotateZ(${x * 2}deg)`;
});

scene.addEventListener("mouseleave", () => {
  card.style.transform = "translate(-50%, -50%) rotateX(7deg) rotateY(-9deg) rotateZ(-1deg)";
});

partyBtn.addEventListener("click", celebrate);

wishBtn.addEventListener("click", () => {
  wishOverlay.classList.add("show");
  launchConfetti(130);
});

closeWish.addEventListener("click", () => {
  wishOverlay.classList.remove("show");
});

wishOverlay.addEventListener("click", (e) => {
  if (e.target === wishOverlay) wishOverlay.classList.remove("show");
});

function playPop() {
  try {
    audioCtx ??= new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.setValueAtTime(520, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, audioCtx.currentTime + .12);
    gain.gain.setValueAtTime(.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, audioCtx.currentTime + .13);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + .14);
  } catch {}
}

musicBtn.addEventListener("click", () => {
  musicOn = !musicOn;
  musicBtn.textContent = musicOn ? "♫ Música: ON" : "♫ Música";

  if (musicOn) {
    // Mini melodía generada por Web Audio, sin archivos externos.
    try {
      audioCtx ??= new (window.AudioContext || window.webkitAudioContext)();
      const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 659.25];
      notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const start = audioCtx.currentTime + i * .18;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(.035, start);
        gain.gain.exponentialRampToValueAtTime(.001, start + .16);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(start);
        osc.stop(start + .17);
      });
    } catch {}
  }
});

// Fiesta automática suave al entrar.
setTimeout(() => launchConfetti(45), 700);
