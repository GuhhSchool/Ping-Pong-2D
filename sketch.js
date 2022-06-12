// Variaveis iniciais
let x_bolinha = 300;
let y_bolinha = 200;
let borda = 13;
let d;

let vel_bol = 5;
let x_vel = vel_bol;
let y_vel = vel_bol;

let x_player = 10;
let y_player = 150;
let x_bot = 580;
let y_bot = 150;

let colid_1;
let colid_2;
let tamanho_raq = 90;
let vel_raq = 7;

let pause;
let update;
let point_player = 0;
let point_bot = 0;

let ponto_sound;
let ping_sound;
let fundo_sound;
let debug;

// Cenário
function setup() {
  createCanvas(600, 400);
  fundo_sound.loop();
}

// Musica
function preload() {
  ponto_sound = loadSound("ponto.mp3");
  ping_sound = loadSound("raquetada.mp3");
  fundo_sound = loadSound("trilha.mp3");
}

// START
function draw() {
  createitens();
  movBolinha();
  telacheia();

  if (!pause) {
    movPlayer();
    movBot();
  }

  pontuação();
  ponto();
}

// Restart
function restart() {
  x_bolinha = 300;
  y_bolinha = 200;
 
  x_player = 10;
  y_player = 150;
  x_bot = 580;
  y_bot = 150;
  vel_bol = 5;
  x_vel = vel_bol;
  y_vel = vel_bol;

  createitens();
}

// Criando itens
function createitens() {
  background(0);
  circle(x_bolinha, y_bolinha, 20);
  rect(x_player, y_player, 10, tamanho_raq, 0, 10, 10, 0);
  rect(x_bot, y_bot, 10, tamanho_raq, 10, 0, 0, 10);
  rect(300, -10, 10, width, 10, 0, 0, 10);
  fill("#404040");
}

function telacheia() {
  if (keyIsDown(70) && !d) { 
    d = true
    setTimeout(() => d = false, 1000);
    
    let fs = fullscreen();
    fullscreen(!fs);
  }
}

// Mover bolinha
function movBolinha() {
  colid_1 = collideRectCircle(
    x_player,
    y_player,
    10,
    tamanho_raq,
    x_bolinha,
    y_bolinha,
    borda + 10
  );
  colid_2 = collideRectCircle(
    x_bot,
    y_bot,
    10,
    tamanho_raq,
    x_bolinha,
    y_bolinha,
    borda + 10
  );

  if (!pause) {
    x_bolinha += x_vel;
    y_bolinha += y_vel;
  }

  if (!update) {
    update = true;
    acelerar();
    setTimeout(() => (update = false), 3000);
  }

  if (y_bolinha + borda > height || y_bolinha - borda < 0) y_vel *= -1;
  if (x_bolinha + borda > width || x_bolinha - borda < 0) x_vel *= -1;

  if (colid_1) x_vel = Math.abs(x_vel);
  if (colid_2) x_vel = -Math.abs(x_vel);

  if (!pause && !debug && (colid_1 || colid_2)) {
    debug = true;
    ping_sound.play();
    setTimeout(() => (debug = false), 500);
  }
}

function acelerar() {
  if (x_vel < 0) x_vel--;
  else x_vel++;

  if (y_vel < 0) y_vel--;
  else y_vel++;
}

// Mover player
function movPlayer() {
  if (keyIsDown(UP_ARROW) && y_player - 10 > 0) y_player -= vel_raq;
  if (keyIsDown(DOWN_ARROW) && y_player + tamanho_raq + 10 < height)
    y_player += vel_raq;
}

// Mover bot (ativo por padrão)
function movBot() {
  if (y_bot + tamanho_raq / 2 < y_bolinha) y_bot += vel_raq;
  else y_bot -= vel_raq;
}

// Mover p2 (ativar se quiser jogar com 2 jogadores)
/*
function movBot() {
  if (keyIsDown(87) && y_bot - 10 > 0) y_bot -= vel_raq;
  if (keyIsDown(83) && y_bot + tamanho_raq + 10 < height) y_bot += vel_raq;
}
*/

// Pontuação
function ponto() {
  if (x_bolinha + borda >= width && !pause) paused("ponto-win");
  if (x_bolinha - borda <= 0 && !pause) paused("ponto-lose");
}

function pontuação() {
  textSize(32);
  textAlign(CENTER);

  fill("#8D33FF");
  stroke("#20D665");
  rect(420, 0, 60, 40, 0, 0, 10, 10);
  rect(120, 0, 60, 40, 0, 0, 10, 10);

  fill("##33FFF0");
  text(`${point_bot}`, 450, 26);
  text(`${point_player}`, 150, 26);

  fill("#8D33FF");
  noStroke();
}

function paused(reason) {
  pause = true;
  ponto_sound.play();

  if (reason == "ponto-win") {
    point_player++;
    setTimeout(() => restart(), 1000);
    setTimeout(() => (pause = false), 2000);
  } 
  else if (reason == "ponto-lose") {
    point_bot++;
    setTimeout(() => restart(), 1000);
    setTimeout(() => (pause = false), 2000);
  }
}
