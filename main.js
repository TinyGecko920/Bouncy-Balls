const INITIAL_AMOUNT_OF_BALLS = 10;
const MIN_BALL_VELOCITY = -10;
const MAX_BALL_VELOCITY = 10;
const MIN_BALL_SIZE = 10;
const MAX_BALL_SIZE = 30;

// setup canvas
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// function to generate random number
function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// ball constructor
function Ball(x, y, velocityX, velocityY, color, size) {
  this.x = x;
  this.y = y;
  this.velocityX = velocityX;
  this.velocityY = velocityY;
  this.color = color;
  this.size = size;
}

Ball.prototype.draw = function() {
  context.beginPath();
  context.fillStyle = this.color;
  context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  context.fill();
}

Ball.prototype.update = function() {
  if ((this.x + this.size) >= width) {
    this.velocityX =- (this.velocityX);
  }

  if ((this.x - this.size) <= 0) {
    this.velocityX =- (this.velocityX);
  }

  if ((this.y + this.size) >= height) {
    this.velocityY =- (this.velocityY);
  }

  if ((this.y - this.size) <= 0) {
    this.velocityY =- (this.velocityY);
  }

  this.x += this.velocityX;
  this.y += this.velocityY
}

Ball.prototype.detetctCollision = function() {
  for (let j = 0; j < balls.length; j++) {
    if (!(this === balls[j])) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = "rgb(" + random(0, 255) + "," + random(0, 255) + "," + random(0, 255) + ")";
      }
    }
  }
}

function createBall() {
  let size = random(MIN_BALL_SIZE, MAX_BALL_SIZE);
  let ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size,width - size),
    random(0 + size,height - size),
    random(MIN_BALL_VELOCITY, MAX_BALL_VELOCITY),
    random(MIN_BALL_VELOCITY, MAX_BALL_VELOCITY),
    "rgb(" + random(0,255) + "," + random(0,255) + "," + random(0,255) +")",
    size
  );

  balls.push(ball);
}

let balls = [];

// Spawn in initial amount of balls
while (balls.length < INITIAL_AMOUNT_OF_BALLS) {
  createBall();
}

// Create a new ball when clicking
window.addEventListener("click", function() {
  createBall();
})

function loop() {
  context.fillStyle = "rgba(0, 0, 0, 0.25)";
  context.fillRect(0, 0, width, height);

  for (let i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].update();
    balls[i].detetctCollision();
  }

  requestAnimationFrame(loop);
}

loop();