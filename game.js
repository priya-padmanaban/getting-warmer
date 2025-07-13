const game = document.getElementById("game");
const player = document.getElementById("player");
const timerEl = document.getElementById("timer");
const bestEl = document.getElementById("best");

let playerPos = { x: 50, y: 50 };
const speed = 10;

const gameSize = { width: 800, height: 600 };
const target = {
  x: Math.floor(Math.random() * gameSize.width),
  y: Math.floor(Math.random() * gameSize.height)
};

let timer = 0;
let interval;
let gameStarted = false;
let gameOver = false;

// Restore best time
const best = localStorage.getItem("bestTime");
if (best) bestEl.textContent = `Best Time: ${best}s`;

function updatePlayer() {
  player.style.transform = `translate(${playerPos.x}px, ${playerPos.y}px)`;
  if (!gameStarted) {
    interval = setInterval(() => {
      timer += 0.1;
      timerEl.textContent = `Time: ${timer.toFixed(1)}s`;
    }, 100);
    gameStarted = true;
  }

  const distance = Math.hypot(playerPos.x - target.x, playerPos.y - target.y);
  let color = "grey";
  if (distance < 30) color = "green";
  else if (distance < 100) color = "yellow";
  else if (distance < 200) color = "orange";
  else if (distance < 350) color = "red";

  game.style.backgroundColor = color;

  if (color === "green" && !gameOver) {
    clearInterval(interval);
    gameOver = true;
    const time = timer.toFixed(1);
    alert(`🎉 You found it in ${time}s!`);
    const bestTime = parseFloat(localStorage.getItem("bestTime"));
    if (!bestTime || timer < bestTime) {
      localStorage.setItem("bestTime", time);
      bestEl.textContent = `Best Time: ${time}s`;
    }
  }
}

document.addEventListener("keydown", (e) => {
  if (gameOver) return;

  switch (e.key) {
    case "ArrowUp":
      playerPos.y = Math.max(0, playerPos.y - speed);
      break;
    case "ArrowDown":
      playerPos.y = Math.min(gameSize.height - 30, playerPos.y + speed);
      break;
    case "ArrowLeft":
      playerPos.x = Math.max(0, playerPos.x - speed);
      break;
    case "ArrowRight":
      playerPos.x = Math.min(gameSize.width - 30, playerPos.x + speed);
      break;
  }
  updatePlayer();
});

updatePlayer();
