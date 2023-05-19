const INITIAL_AMOUNT_OF_BALLS = 30;
const INITIAL_MAX_AMOUNT_OF_BALLS = 100;
const MIN_BALL_VELOCITY = -10;
const MAX_BALL_VELOCITY = 10;
const MIN_BALL_SIZE = 10;
const MAX_BALL_SIZE = 30;

let amount_of_balls = 0;
let max_amount_of_balls = INITIAL_MAX_AMOUNT_OF_BALLS;

// setup canvas
const canvas = document.querySelector("canvas");
const ballCount = document.querySelector("#ball-count");
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

  // debounce fixes bug where balls get stuck in 1 spot
  this.debounce = false;
}

Ball.prototype.draw = function () {
  context.beginPath();
  context.fillStyle = this.color;
  context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  context.fill();
};

Ball.prototype.update = function () {
  if (this.x + this.size >= width) {
    this.velocityX = -this.velocityX;
  }

  if (this.x - this.size <= 0) {
    this.velocityX = -this.velocityX;
  }

  if (this.y + this.size >= height) {
    this.velocityY = -this.velocityY;
  }

  if (this.y - this.size <= 0) {
    this.velocityY = -this.velocityY;
  }

  this.x += this.velocityX;
  this.y += this.velocityY;
};

Ball.prototype.detectCollision = function () {
  for (let j = 0; j < balls.length; j++) {
    if (!(this === balls[j])) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        if (balls[j].debounce == false) {
          balls[j].debounce = true;

          // change color and reverse the direction of the ball
          balls[j].color = this.color =
            "rgb(" +
            random(0, 255) +
            "," +
            random(0, 255) +
            "," +
            random(0, 255) +
            ")";
          balls[j].velocityX = -balls[j].velocityX;
          balls[j].velocityY = -balls[j].velocityY;

          setTimeout(() => {
            if (balls[j] != null) {
              balls[j].debounce = false;
            }
          }, 250);
        }
      }
    }
  }
};

let balls = [];

function updateBallCount() {
  ballCount.innerHTML = balls.length + " Balls";
}

function createBall() {
  // do not create ball if at max
  if (balls.length >= max_amount_of_balls) {
    return;
  }

  let size = random(MIN_BALL_SIZE, MAX_BALL_SIZE);
  let ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(MIN_BALL_VELOCITY, MAX_BALL_VELOCITY),
    random(MIN_BALL_VELOCITY, MAX_BALL_VELOCITY),
    "rgb(" + random(0, 255) + "," + random(0, 255) + "," + random(0, 255) + ")",
    size
  );

  balls.push(ball);
  amount_of_balls = balls.length;
}

// Spawn in initial amount of balls
function createInitialBalls() {
  while (balls.length < INITIAL_AMOUNT_OF_BALLS && balls.length < max_amount_of_balls) {
    createBall();
  }
}

// Create a new ball when clicking
canvas.addEventListener("click", function () {
  createBall();
});

function loop() {
  context.fillStyle = "rgba(0, 0, 0, 0.25)";
  context.fillRect(0, 0, width, height);

  for (let i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].update();
    balls[i].detectCollision();
    updateBallCount();
  }

  requestAnimationFrame(loop);
}

// balls sliders
const amountOfBallsSlider = document.querySelector("#amount-of-balls-slider")
const amountOfBalls = document.querySelector("#amount-of-balls")
const maxBallsSlider = document.querySelector("#max-balls-slider")
const maxAmountOfBalls = document.querySelector("#max-amount-of-balls")

amountOfBalls.value = INITIAL_AMOUNT_OF_BALLS
maxAmountOfBalls.value = 

amountOfBallsSlider.oninput = function () {
  amount_of_balls = this.value
  amountOfBalls.innerHTML = "Amount of Balls: " + this.value;

  if (this.value > max_amount_of_balls) {
    max_amount_of_balls = this.value
    maxAmountOfBalls.innerHTML = "Max Amount of Balls: " + max_amount_of_balls;
    maxBallsSlider.value = this.value
  }

  // clean up extra balls
  while (balls.length > this.value) {
    balls.pop();
  }

  // create more balls
  while (balls.length < max_amount_of_balls) {
    createBall();
  }
};

maxBallsSlider.oninput = function () {
  max_amount_of_balls = this.value
  maxAmountOfBalls.innerHTML = "Max Amount of Balls: " + this.value;

  if (this.value < amount_of_balls) {
    amount_of_balls = this.value
    amountOfBalls.innerHTML = "Amount of Balls: " + this.value;
    amountOfBallsSlider.value = this.value
  }

  // clean up extra balls
  while (balls.length > this.value) {
    balls.pop();
  }
};

// reset balls button
const resetBalls = document.querySelector("#reset-balls");
resetBalls.addEventListener("click", function () {
  balls = [];
  amount_of_balls = INITIAL_AMOUNT_OF_BALLS;
  amountOfBalls.value = INITIAL_AMOUNT_OF_BALLS;
  createInitialBalls();
});

createInitialBalls();
loop();
