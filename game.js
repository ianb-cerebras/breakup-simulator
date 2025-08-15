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
  "I'm the only one who understands you",
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
  "You're being too emotional",
  "What does gaslighting even mean",
  "Stop being so needy",
  "I'm not trying to ignore you",
  "You're being too dependent",
  "I'm not trying to make you crazy"
];

function randomText() {
  return TOXIC_MESSAGES[Math.floor(Math.random() * TOXIC_MESSAGES.length)];
}

class Bird {
  constructor() {
    this.x = 100;
    this.y = H / 2;
    this.vy = 0;
    this.alive = true;
    this.flapAnimation = 0;
    this.angle = 0;
  }
  
  flap() {
    this.vy = JUMP;
    this.flapAnimation = 8;
  }
  
  update() {
    this.vy += GRAVITY;
    this.y += this.vy;
    
    if (this.flapAnimation > 0) this.flapAnimation--;
    
    this.angle = Math.min(Math.max(this.vy * 2, -30), 90);
    
    if (this.y + BIRD_SIZE > H - GROUND_HEIGHT || this.y < 0) {
      this.alive = false;
    }
  }
  
  draw() {
    ctx.save();
    ctx.translate(this.x + BIRD_SIZE/2, this.y + BIRD_SIZE/2);
    ctx.rotate(this.angle * Math.PI / 180);
    
    ctx.fillStyle = "#FFFF66";
    ctx.fillRect(-BIRD_SIZE/2, -BIRD_SIZE/2, BIRD_SIZE, BIRD_SIZE);
    
    ctx.fillStyle = "#FFEB3B";
    ctx.fillRect(-BIRD_SIZE/2 + 2, -BIRD_SIZE/2 + 2, BIRD_SIZE - 4, BIRD_SIZE - 4);
    
    ctx.fillStyle = "#000";
    ctx.fillRect(BIRD_SIZE/2 - 10, -8, 6, 6);
    ctx.fillRect(BIRD_SIZE/2 - 9, -7, 4, 4);
    
    ctx.fillStyle = "#FFF";
    ctx.fillRect(BIRD_SIZE/2 - 8, -6, 2, 2);
    
    ctx.fillStyle = "#FFA500";
    ctx.beginPath();
    ctx.moveTo(BIRD_SIZE/2, 0);
    ctx.lineTo(BIRD_SIZE/2 + 10, -5);
    ctx.lineTo(BIRD_SIZE/2 + 10, 5);
    ctx.closePath();
    ctx.fill();
    
    const wingOffset = this.flapAnimation > 0 ? 
      (this.flapAnimation % 4 < 2 ? -5 : 5) : 0;
    
    ctx.fillStyle = "#FFD54F";
    ctx.fillRect(-BIRD_SIZE/2 + 2, wingOffset, 15, 10);
    ctx.fillStyle = "#FFCA28";
    ctx.fillRect(-BIRD_SIZE/2 + 4, wingOffset + 2, 11, 6);
    
    ctx.restore();
  }
  
  rect() {
    return {x: this.x, y: this.y, w: BIRD_SIZE, h: BIRD_SIZE};
  }
}

class Pipe {
  constructor(offsetX) {
    this.x = offsetX;
    this.top = Math.random() * (H - GAP - 200) + 100;
    this.topMsg = randomText();
    this.botMsg = randomText();
    this.passed = false;
    this.animCounter = 0;
  }
  
  update() {
    this.x -= SPEED;
    this.animCounter++;
  }
  
  draw() {
    const bounce = Math.sin(this.animCounter * 0.1) * 2;
    
    ctx.fillStyle = "#FF3333";
    ctx.fillRect(this.x, 0, PIPE_W, this.top);
    ctx.fillRect(this.x, this.top + GAP, PIPE_W, H - this.top - GAP - GROUND_HEIGHT);
    
    ctx.fillStyle = "#CC0000";
    ctx.fillRect(this.x + 2, 2, PIPE_W - 4, this.top - 4);
    ctx.fillRect(this.x + 2, this.top + GAP + 2, PIPE_W - 4, H - this.top - GAP - GROUND_HEIGHT - 4);
    
    ctx.fillStyle = "#1E6432";
    ctx.fillRect(this.x - 5, this.top - 10, PIPE_W + 10, 10);
    ctx.fillRect(this.x - 5, this.top + GAP, PIPE_W + 10, 10);
    
    ctx.fillStyle = "#32FF64";
    ctx.fillRect(this.x - 3, this.top - 8, PIPE_W + 6, 6);
    ctx.fillRect(this.x - 3, this.top + GAP + 2, PIPE_W + 6, 6);
    
    ctx.save();
    ctx.font = "10px 'Press Start 2P', monospace";
    ctx.fillStyle = "#FFF";
    
    const topLines = this.wrapText(this.topMsg, PIPE_W - 10);
    topLines.forEach((line, i) => {
      ctx.fillText(line, this.x + 5, this.top - 20 - (topLines.length - i - 1) * 12 + bounce);
    });
    
    const botLines = this.wrapText(this.botMsg, PIPE_W - 10);
    botLines.forEach((line, i) => {
      ctx.fillText(line, this.x + 5, this.top + GAP + 25 + i * 12 + bounce);
    });
    
    ctx.restore();
  }
  
  wrapText(text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let line = '';
    words.forEach(w => {
      const test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = w;
      } else {
        line = test;
      }
    });
    if (line) lines.push(line);
    return lines;
  }
  
  collide(bird) {
    const r = bird.rect();
    const hitX = r.x + r.w > this.x && r.x < this.x + PIPE_W;
    const hitY = r.y < this.top || r.y + r.h > this.top + GAP;
    return hitX && hitY;
  }
}

class Background {
  constructor() {
    this.stars = [];
    this.clouds = [];
    this.groundPoints = [];
    this.particles = [];
    this.populate();
  }
  
  populate() {
    for (let i = 0; i < 100; i++) {
      this.stars.push({
        x: Math.random() * W,
        y: Math.random() * (H - GROUND_HEIGHT),
        size: Math.random() * 2 + 1,
        brightness: Math.random() * 155 + 100,
        twinkle: Math.random() * Math.PI * 2
      });
    }
    
    for (let i = 0; i < 8; i++) {
      this.clouds.push({
        x: Math.random() * W,
        y: Math.random() * 200 + 50,
        size: Math.random() * 60 + 40,
        speed: Math.random() * 0.5 + 0.2
      });
    }
    
    for (let x = 0; x < W; x += 20) {
      this.groundPoints.push({
        x: x,
        height: Math.random() * 30 + 20
      });
    }
  }
  
  update() {
    this.clouds.forEach(c => {
      c.x -= c.speed;
      if (c.x < -c.size) {
        c.x = W + c.size;
        c.y = Math.random() * 200 + 50;
      }
    });
    
    this.stars.forEach(s => {
      s.twinkle += 0.05;
    });
    
    if (Math.random() < 0.1) {
      this.particles.push({
        x: W,
        y: Math.random() * (H - GROUND_HEIGHT),
        vx: -(Math.random() * 2 + 1),
        vy: Math.random() * 0.5 - 0.25,
        life: 1
      });
    }
    
    this.particles = this.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.01;
      return p.life > 0 && p.x > 0;
    });
  }
  
  draw() {
    const gradient = ctx.createLinearGradient(0, 0, 0, H);
    gradient.addColorStop(0, "#0a0a2e");
    gradient.addColorStop(0.5, "#16213e");
    gradient.addColorStop(1, "#1e3a5f");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H - GROUND_HEIGHT);
    
    this.stars.forEach(s => {
      const brightness = s.brightness + Math.sin(s.twinkle) * 50;
      ctx.fillStyle = `rgba(255, 255, 255, ${brightness / 255})`;
      ctx.fillRect(s.x, s.y, s.size, s.size);
    });
    
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    this.clouds.forEach(c => {
      this.drawCloud(c.x, c.y, c.size);
    });
    
    this.particles.forEach(p => {
      ctx.fillStyle = `rgba(100, 255, 150, ${p.life * 0.5})`;
      ctx.fillRect(p.x, p.y, 2, 2);
    });
    
    ctx.fillStyle = "#1E6432";
    ctx.fillRect(0, H - GROUND_HEIGHT, W, GROUND_HEIGHT);
    
    ctx.fillStyle = "#32FF64";
    this.groundPoints.forEach(g => {
      ctx.fillRect(g.x, H - g.height, 15, g.height);
    });
    
    ctx.fillStyle = "#28CC52";
    this.groundPoints.forEach(g => {
      ctx.fillRect(g.x + 2, H - g.height + 2, 11, g.height - 2);
    });
  }
  
  drawCloud(x, y, size) {
    ctx.fillRect(x, y, size, size * 0.5);
    ctx.fillRect(x + size * 0.2, y - size * 0.2, size * 0.6, size * 0.4);
    ctx.fillRect(x + size * 0.6, y, size * 0.5, size * 0.4);
  }
}

let bird, pipes, score, highscore = 0, playing = false, gameState = "menu", background;

function reset() {
  bird = new Bird();
  pipes = [new Pipe(W + 200), new Pipe(W + 500)];
  score = 0;
  scoreEl.textContent = 'Score: 0';
  highscoreEl.textContent = 'Best: ' + highscore;
  background = new Background();
}
reset();

function startGame() {
  reset();
  playing = true;
  gameState = "playing";
  overlay.classList.add('hide');
  scoreEl.classList.remove('hide');
  highscoreEl.classList.remove('hide');
}

function gameOver() {
  playing = false;
  gameState = "gameover";
  
  if (score > highscore) {
    highscore = score;
    localStorage.setItem('highscore', highscore);
  }
  
  titleEl.textContent = 'GAME OVER!';
  subEl.textContent = `Score: ${score} | Best: ${highscore}`;
  instructionsEl.classList.add('hide');
  startBtn.classList.add('hide');
  restartBtn.classList.remove('hide');
  overlay.classList.remove('hide');
}

function showMenu() {
  gameState = "menu";
  playing = false;
  titleEl.textContent = 'TOXIC EX AVOIDER';
  subEl.textContent = 'Avoid those texts!';
  instructionsEl.classList.remove('hide');
  startBtn.classList.remove('hide');
  restartBtn.classList.add('hide');
  overlay.classList.remove('hide');
  scoreEl.classList.add('hide');
  highscoreEl.classList.add('hide');
}

highscore = parseInt(localStorage.getItem('highscore') || 0);
highscoreEl.textContent = 'Best: ' + highscore;

window.addEventListener('keydown', e => {
  if (e.code === 'Space' && gameState === "playing") {
    e.preventDefault();
    bird.flap();
  }
  if (e.code === 'KeyR' && gameState === "gameover") {
    startGame();
  }
});

canvas.addEventListener('pointerdown', e => {
  e.preventDefault();
  if (gameState === "playing") bird.flap();
});

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

function createSoundEffect(frequency, duration, type = "square") {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}

function loop() {
  requestAnimationFrame(loop);
  
  ctx.clearRect(0, 0, W, H);
  
  background.draw();
  
  if (playing) {
    bird.update();
    background.update();
    
    if (pipes[pipes.length - 1].x < W * 0.6) {
      pipes.push(new Pipe(W + PIPE_W));
    }
    
    pipes.forEach(p => p.update());
    
    if (pipes[0] && pipes[0].x + PIPE_W < 0) {
      pipes.shift();
    }
    
    pipes.forEach(p => {
      if (p.collide(bird)) {
        bird.alive = false;
        try { createSoundEffect(100, 0.3, "sawtooth"); } catch(e) {}
      }
      
      if (!p.passed && p.x + PIPE_W < bird.x) {
        score++;
        p.passed = true;
        scoreEl.textContent = 'Score: ' + score;
        try { createSoundEffect(800, 0.1); } catch(e) {}
      }
    });
    
    if (!bird.alive) {
      gameOver();
    }
  }
  
  pipes.forEach(p => p.draw());
  bird.draw();
  
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, W, H);
}

showMenu();
loop();