
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800; 
canvas.height = 500; 

const menuOptions = ["Start Game", "Settings", "Exit"];
let selectedOption = 0;

const snowflakes = [];
const numberOfSnowflakes = 100;

for (let i = 0; i < numberOfSnowflakes; i++) {
  snowflakes.push({
    x: Math.random() * canvas.width, 
    y: Math.random() * canvas.height, 
    size: Math.random() * 3 + 2, 
    speed: Math.random() * 1 + 0.5, 
  });
}

function drawSnowflakes() {
  ctx.fillStyle = "white";
  snowflakes.forEach((flake) => {
    ctx.beginPath();
    ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
    ctx.fill();
  });
}

function updateSnowflakes() {
  snowflakes.forEach((flake) => {
    flake.y += flake.speed; 
    if (flake.y > canvas.height) {
      flake.y = 0; 
      flake.x = Math.random() * canvas.width; 
    }
  });
}

function drawMenu() {


  ctx.clearRect(0, 0, canvas.width, canvas.height); 

  drawSnowflakes();

  ctx.font = "48px Arial";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText("Christmas Adventure game", canvas.width / 2, 150);

  menuOptions.forEach((option, index) => {
    ctx.font = "32px Arial";
    ctx.fillStyle = index === selectedOption ? "yellow" : "white";
    ctx.fillText(option, canvas.width / 2, 250 + index * 50);
  });
}




window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    selectedOption = (selectedOption - 1 + menuOptions.length) % menuOptions.length;
  } else if (e.key === "ArrowDown") {
    selectedOption = (selectedOption + 1) % menuOptions.length;
  } else if (e.key === "Enter") {
    handleMenuSelection();
  }
  drawMenu();
});

function handleMenuSelection() {
  if (menuOptions[selectedOption] === "Start Game") {
    window.location.href = "index.html";
  } else if (menuOptions[selectedOption] === "Settings") {
    window.location.href = "settings.html";
  } else if (menuOptions[selectedOption] === "Exit") {
    alert("Exiting the game...");
  }
}

function animate() {
  updateSnowflakes(); 
  drawMenu();
  requestAnimationFrame(animate);
}

drawMenu();
animate();
