const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const ballRadius = 10;
const paddleHeight = 10;
const paddleWidth = 75;
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const paddleXStart = (canvas.width - paddleWidth) / 2;
const PI2 = Math.PI * 2;
const gameObjectPrimaryColor = '#0095DD';
const gameOverMessage = 'Game Over';
const gameWonMessage = 'You win! Congratulations!';
const bricks = [];

const ball = {
  x: 0,
  y: 0,
  dx: 0,
  dy: 0,
};

let paddleX;
resetBallAndPaddle();
let rightPressed = false;
let leftPressed = false;
let score = 0;
let brickCounter = 0;
let lives = 3;

for (let c = 0; c < brickColumnCount; c += 1) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r += 1) {
    bricks[c][r] = {
      x: 0, y: 0, status: 1, points: 0,
    };
  }
  for (let r = 0; r < brickRowCount; r += 1) {
    bricks[c][r].points = (r + 1) * 10;
  }
}

ctx.fillStyle = 'gray';
ctx.fillRect(0, 0, canvas.width / 2, canvas.height);

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ballRadius, 0, PI2);
  ctx.fillStyle = gameObjectPrimaryColor;
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = gameObjectPrimaryColor;
  ctx.fill();
  ctx.closePath();
}
function drawBricks() {
  for (let r = 0; r < brickRowCount; r += 1) {
    for (let c = 0; c < brickColumnCount; c += 1) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        if (c === 0) {
          ctx.fillStyle = 'blue';
        } else if (c === 1) {
          ctx.fillStyle = 'purple';
        } else if (c === 2) {
          ctx.fillStyle = 'pink';
        } else if (c === 3) {
          ctx.fillStyle = 'orange';
        } else if (c === 4) {
          ctx.fillStyle = 'yellow';
        }
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function keyDownHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      const brick = bricks[c][r];
      if (brick.status === 1) {
        if (
          ball.x > brick.x
          && ball.x < brick.x + brickWidth
          && ball.y > brick.y
          && ball.y < brick.y + brickHeight
        ) {
          ball.dy = -ball.dy;
          brick.status = 0;
          score += brick.points;
          brickCounter += 1;
          if (brickCounter === brickRowCount * brickColumnCount) {
            // eslint-disable-next-line no-alert
            alert(gameWonMessage);
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = '16px Arial';
  ctx.fillStyle = gameObjectPrimaryColor;
  ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawLives() {
  ctx.font = '16px Arial';
  ctx.fillStyle = gameObjectPrimaryColor;
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

function resetBallAndPaddle() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 30;
  ball.dx = 2;
  ball.dy = -2;
  paddleX = paddleXStart;
}

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
}

function movePaddle() {
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
}

function collisionWithCanvasEdgesAndPaddle() {
// Rebound the ball off the left and right sides of the canvas
  if (ball.x + ball.dx > canvas.width - ballRadius || ball.x + ball.dx < ballRadius) {
    ball.dx = -ball.dx;
  }

  // Rebound the ball off the top of the canvas, hit the paddle, or hit the bottom of the canvas
  if (ball.y + ball.dy < ballRadius) {
    // rebound off the top
    ball.dy = -ball.dy;
  } else if (ball.y + ball.dy > canvas.height - ballRadius) {
    // Reach the bottom
    if (ball.x > paddleX && ball.x < paddleX + paddleWidth) {
      // Rebound off the paddle
      ball.dy = -ball.dy;
    } else {
      // lose one life
      lives -= 1;
      if (!lives) {
        // Game over
        // eslint-disable-next-line no-alert
        alert(gameOverMessage);
        document.location.reload();
      } else {
        // Start over after ball hits the bottom
        resetBallAndPaddle();
      }
    }
  }
}

// ?******
ctx.fillStyle = 'gray';
ctx.fillRect(0, 0, canvas.width / 2, canvas.height);

// Game loop
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Call helper functions
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();
  moveBall();
  movePaddle();
  collisionWithCanvasEdgesAndPaddle();

  requestAnimationFrame(draw);
}

draw();
