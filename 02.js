const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('scoreValue');
const gridSize = 20;
const tileCount = 20;
const eatSound = new Audio('ghop_ghop.mp3');
const gameOverSound = new Audio("khel-khatam-beta.mp3");

let snake = [{ x: 10, y: 10 }];
let direction = 'RIGHT';
let food = { x: 15, y: 10 };
let score = 0;
let gameRunning = false;

function draw() {
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#00FF00';
  snake.forEach(segment => {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
  });

  ctx.fillStyle = '#FF0000';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function move() {
  let head = { x: snake[0].x, y: snake[0].y };

  if (direction === 'UP') head.y--;
  if (direction === 'DOWN') head.y++;
  if (direction === 'LEFT') head.x--;
  if (direction === 'RIGHT') head.x++;

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreElement.innerText = score;
    eatSound.currentTime = 0;
    eatSound.play().catch(() => { });
    placeFood();
  } else {
    snake.pop();
  }
}

document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
  const key = event.key;
  if (key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  if (key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
  if (key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  if (key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
}

function checkCollision() {
  const head = snake[0];
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) return true;
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) return true;
  }
  return false;
}

function placeFood() {
  food.x = Math.floor(Math.random() * tileCount);
  food.y = Math.floor(Math.random() * tileCount);
}

function gameLoop() {
  move();

  if (checkCollision()) {
    gameOverSound.play().catch(() => { });
    alert('Game Over! Score: ' + score);
    score = 0;
    scoreElement.innerText = score;
    snake = [{ x: 10, y: 10 }];
    direction = 'RIGHT';
    placeFood();
  }

  draw();
  setTimeout(gameLoop, 200);
}

document.addEventListener("keydown", () => {
  gameOverSound.play().then(() => {
    gameOverSound.pause();
    gameOverSound.currentTime = 0;
  }).catch(() => { });
}, { once: true });

function start() {
  if (gameRunning) return;
  gameRunning = true;
  document.getElementById('btn').style.display = 'none';
  placeFood();
  gameLoop();
}