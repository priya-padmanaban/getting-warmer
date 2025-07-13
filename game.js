const game = document.getElementById("game");
    const player = document.getElementById("player");
    const timerEl = document.getElementById("timer");
    const bestEl = document.getElementById("best");
    const resetBtn = document.getElementById("reset");

    const gameSize = { width: 800, height: 600 };
    const speed = 2;
    let timer = 0, interval, gameStarted = false, gameOver = false;
    let playerPos = { x: 50, y: 50 };
    let target = {};
    const heldKeys = {};
    let animationFrameId;

    const obstacles = [];
    const obstacleEmojis = ['🏢','🏬','🏪','🏫','🏭','🏘️','🗼','🗽'];

    function placeTarget() {
      let x, y;
      do {
        x = Math.floor(Math.random() * (gameSize.width - 30));
        y = Math.floor(Math.random() * (gameSize.height - 30));
      } while (Math.hypot(x - playerPos.x, y - playerPos.y) < 100);
      target = { x, y };
    }

    function generateObstacles() {
      for (let i = 0; i < 30; i++) {
        let x, y, tries = 0;
        do {
          x = Math.floor(Math.random() * (gameSize.width - 30));
          y = Math.floor(Math.random() * (gameSize.height - 30));
          tries++;
        } while ((Math.hypot(x - playerPos.x, y - playerPos.y) < 60 || Math.hypot(x - target.x, y - target.y) < 60) && tries < 100);

        const div = document.createElement("div");
        div.className = "obstacle";
        div.textContent = obstacleEmojis[Math.floor(Math.random() * obstacleEmojis.length)];
        div.style.left = x + "px";
        div.style.top = y + "px";
        game.appendChild(div);
        obstacles.push({ x, y, el: div });
      }
    }

    function isCollision(x, y) {
      return obstacles.some(ob => {
        return Math.abs(ob.x - x) < 30 && Math.abs(ob.y - y) < 30;
      });
    }

    function updatePlayer() {
      player.style.transform = `translate(${playerPos.x}px, ${playerPos.y}px)`;
      if (!gameStarted) {
        interval = setInterval(() => {
          timer += 0.1;
          timerEl.textContent = `Time: ${timer.toFixed(1)}s`;
        }, 100);
        gameStarted = true;
      }
      const dx = playerPos.x - target.x;
      const dy = playerPos.y - target.y;
      const distance = Math.hypot(dx, dy);
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

    function gameLoop() {
      if (!gameOver) {
        if (heldKeys["ArrowUp"]) {
          const newY = playerPos.y - speed;
          if (newY >= 0 && !isCollision(playerPos.x, newY)) playerPos.y = newY;
        }
        if (heldKeys["ArrowDown"]) {
          const newY = playerPos.y + speed;
          if (newY <= gameSize.height - 30 && !isCollision(playerPos.x, newY)) playerPos.y = newY;
        }
        if (heldKeys["ArrowLeft"]) {
          const newX = playerPos.x - speed;
          if (newX >= 0 && !isCollision(newX, playerPos.y)) playerPos.x = newX;
        }
        if (heldKeys["ArrowRight"]) {
          const newX = playerPos.x + speed;
          if (newX <= gameSize.width - 30 && !isCollision(newX, playerPos.y)) playerPos.x = newX;
        }
        updatePlayer();
        animationFrameId = requestAnimationFrame(gameLoop);
      }
    }

    document.addEventListener("keydown", (e) => heldKeys[e.key] = true);
    document.addEventListener("keyup", (e) => heldKeys[e.key] = false);

    resetBtn.addEventListener("click", () => location.reload());

    const best = localStorage.getItem("bestTime");
    if (best) bestEl.textContent = `Best Time: ${best}s`;

    placeTarget();
    generateObstacles();
    updatePlayer();
    gameLoop();
