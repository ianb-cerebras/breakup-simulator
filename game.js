const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const overlay = document.getElementById("overlay");
const titleEl = document.getElementById("title");
const subEl = document.getElementById("subtitle");
const startBtn = document.getElementById("start");
const restartBtn = document.getElementById("restart");
const scoreEl = document.getElementById("score");
const highscoreEl = document.getElementById("highscore");
const instructionsEl = document.getElementById("instructions");

let W = 800, H = 600;
let GRAVITY, JUMP, GAP, PIPE_W, BIRD_SIZE, SPEED, GROUND_HEIGHT;

function setDimensions() {
  const container = document.getElementById("game-container");
  const rect = container.getBoundingClientRect();
  
  canvas.width = 800;
  canvas.height = 600;
  W = 800;
  H = 600;
  
  BIRD_SIZE = 40;
  PIPE_W = 120;
  GAP = 200;
  GROUND_HEIGHT = 50;
  GRAVITY = 0.2;
  JUMP = -7;
  SPEED = 2;
}
setDimensions();
window.addEventListener("resize", setDimensions);

const TOXIC_MESSAGES = [
  "We need to talk",
  "Where have you been?",
  "Why won't you answer my texts?",
  "I know you're online",
  "You owe me an explanation",
  "Everyone says you've changed",
  "Are you seeing someone else?",
  "I'm not letting go that easily",
  "You can't just ignore me forever",
  "I saw you post them on Instagram",
  "Do you even care about our relationship?",
  "I thought we had something special",
  "You're making this too complicated",
  "Come back to me",
  "I'll wait for you no matter how long",
  "You're just confused about your feelings",
  "Don't you miss us?",
  "I'm not the problem here",
  "I didn't mean to hurt you",
  "Can we just go back to how things were?",
  "You're overthinking this",
  "I still love you",
  "Why are you doing this to me?",
  "You're making me crazy",
  "I can't eat or sleep without you",
  "This is all your fault",
  "You're being selfish",
  "I'm not going to give up on us",
  "You're just scared of commitment",
  "I know what's best for you",
  "You don't know what you want",
  "I'm not the person you think I am",
  "You're making a huge mistake",
  "I'll make you happy again",
  "You're just going through a phase",
  "Don't throw away everything we had",
  "I'm not like your other relationships",
  "You're being too sensitive",
  "I was just joking around",
  "You're taking things too seriously",
  "I never got to say goodbye properly",
  "You're being dramatic",
  "I can change, just give me another chance",
  "You're being too hard on me",
  "I didn't cheat, we were on a break",
  "You're being unreasonable",
  "I'm not the person you think I am",
  "You're being too picky",
  "I was going to tell you eventually",
  "You're being too controlling",
  "I'm not trying to hurt you",
  "You're so jealous",
  "You're being too insecure",
  "I'm not trying to manipulate you",
  "You're being too dependent",
  "I'm not trying to make you crazy"
];

// Game state
let gameState = "start"; // "start", "playing", "gameover"
let score = 0;
let highscore = localStorage.getItem("toxicExHighscore") || 0;
highscoreEl.textContent = "Best: " + highscore;

// Bird object
const bird = {
  x: 100,
  y: H / 2,
  velocity: 0,
  
  draw: function() {
    ctx.fillStyle = "#FFD700"; // Yellow bird for retro look
    ctx.fillRect(this.x, this.y, BIRD_SIZE, BIRD_SIZE);
    
    // Draw eyes for a more bird-like appearance
    ctx.fillStyle = "#000";
    ctx.fillRect(this.x + 30, this.y + 10, 5, 5);
    ctx.fillRect(this.x + 30, this.y + 25, 5, 5);
  },
  
  update: function() {
    this.velocity += GRAVITY;
    this.y += this.velocity;
    
    // Ground collision
    if (this.y + BIRD_SIZE >= H - GROUND_HEIGHT) {
      this.y = H - GROUND_HEIGHT - BIRD_SIZE;
      if (gameState === "playing") {
        gameOver();
      }
    }
    
    // Ceiling collision
    if (this.y <= 0) {
      this.y = 0;
      this.velocity = 0;
    }
  },
  
  jump: function() {
    this.velocity = JUMP;
  },
  
  reset: function() {
    this.y = H / 2;
    this.velocity = 0;
  }
};

// Toxic messages (replacing pipes)
let toxicMessages = [];

function ToxicMessage(x) {
  this.x = x;
  this.width = PIPE_W;
  this.text = TOXIC_MESSAGES[Math.floor(Math.random() * TOXIC_MESSAGES.length)];
  
  // Random gap position
  this.gapY = Math.floor(Math.random() * (H - GROUND_HEIGHT - GAP - 100)) + 50;
  
  this.draw = function() {
    // Draw top message
    ctx.fillStyle = "#FF0000"; // Red for toxic messages
    ctx.fillRect(this.x, 0, this.width, this.gapY);
    
    // Draw bottom message
    ctx.fillRect(this.x, this.gapY + GAP, this.width, H - this.gapY - GAP - GROUND_HEIGHT);
    
    // Draw ground
    ctx.fillStyle = "#8B4513"; // Brown ground
    ctx.fillRect(0, H - GROUND_HEIGHT, W, GROUND_HEIGHT);
    
    // Draw text on obstacles
    ctx.fillStyle = "#FFF";
    ctx.font = "12px 'Press Start 2P'";
    ctx.textAlign = "center";
    
    // Top message
    const topTextY = this.gapY - 10;
    wrapText(this.text, this.x + this.width / 2, topTextY, this.width - 10);
    
    // Bottom message
    const bottomTextY = this.gapY + GAP + 20;
    wrapText(this.text, this.x + this.width / 2, bottomTextY, this.width - 10);
  };
  
  this.update = function() {
    this.x -= SPEED;
  };
  
  this.isOffScreen = function() {
    return this.x + this.width < 0;
  };
  
  this.collidesWith = function(bird) {
    // Check collision with top message
    if (
      bird.x + BIRD_SIZE > this.x &&
      bird.x < this.x + this.width &&
      bird.y < this.gapY
    ) {
      return true;
    }
    
    // Check collision with bottom message
    if (
      bird.x + BIRD_SIZE > this.x &&
      bird.x < this.x + this.width &&
      bird.y + BIRD_SIZE > this.gapY + GAP
    ) {
      return true;
    }
    
    return false;
  };
}

// Function to wrap text within a specified width
function wrapText(text, x, y, maxWidth) {
  const words = text.split(" ");
  let line = "";
  let lineHeight = 15;
  let lines = [];
  
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const testWidth = ctx.measureText(testLine).width;
    
    if (testWidth > maxWidth && i > 0) {
      lines.push(line);
      line = words[i] + " ";
    } else {
      line = testLine;
    }
  }
  lines.push(line);
  
  // Draw lines
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x, y + i * lineHeight);
  }
}

// Initialize game
function init() {
  toxicMessages = [];
  score = 0;
  scoreEl.textContent = "Score: " + score;
  bird.reset();
}

// Game over function
function gameOver() {
  gameState = "gameover";
  restartBtn.classList.remove("hide");
  
  // Update highscore
  if (score > highscore) {
    highscore = score;
    localStorage.setItem("toxicExHighscore", highscore);
    highscoreEl.textContent = "Best: " + highscore;
  }
}

// Draw everything
function draw() {
  // Clear canvas
  ctx.fillStyle = "#87CEEB"; // Sky blue background
  ctx.fillRect(0, 0, W, H);
  
  // Draw bird
  bird.draw();
  
  // Draw toxic messages
  toxicMessages.forEach(message => message.draw());
  
  // Draw score
  if (gameState === "playing") {
    scoreEl.textContent = "Score: " + score;
  }
}

// Update everything
function update() {
  if (gameState !== "playing") return;
  
  // Update bird
  bird.update();
  
  // Update toxic messages
  for (let i = 0; i < toxicMessages.length; i++) {
    toxicMessages[i].update();
    
    // Check collision
    if (toxicMessages[i].collidesWith(bird)) {
      gameOver();
      return;
    }
    
    // Check if passed (scoring)
    if (toxicMessages[i].x + toxicMessages[i].width < bird.x && !toxicMessages[i].scored) {
      score++;
      toxicMessages[i].scored = true;
    }
    
    // Remove off-screen messages
    if (toxicMessages[i].isOffScreen()) {
      toxicMessages.splice(i, 1);
      i--;
    }
  }
  
  // Add new toxic message
  if (toxicMessages.length === 0 || toxicMessages[toxicMessages.length - 1].x < W - 300) {
    toxicMessages.push(new ToxicMessage(W));
  }
}

// Game loop
function gameLoop() {
  draw();
  update();
  requestAnimationFrame(gameLoop);
}
gameLoop();

// Event listeners
startBtn.addEventListener("click", () => {
  gameState = "playing";
  overlay.classList.add("hide");
  scoreEl.classList.remove("hide");
  init();
});

restartBtn.addEventListener("click", () => {
  gameState = "playing";
  overlay.classList.add("hide");
  restartBtn.classList.add("hide");
  init();
});

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (gameState === "start") {
      gameState = "playing";
      overlay.classList.add("hide");
      scoreEl.classList.remove("hide");
      init();
    } else if (gameState === "playing") {
      bird.jump();
    } else if (gameState === "gameover") {
      gameState = "playing";
      overlay.classList.add("hide");
      restartBtn.classList.add("hide");
      init();
    }
  }
  
  if (e.code === "KeyR") {
    if (gameState === "gameover") {
      gameState = "playing";
      overlay.classList.add("hide");
      restartBtn.classList.add("hide");
      init();
    }
  }
});

canvas.addEventListener("click", () => {
  if (gameState === "playing") {
    bird.jump();
  }
});

// Touch support for mobile
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  if (gameState === "playing") {
    bird.jump();
  }
});
