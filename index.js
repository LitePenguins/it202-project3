/*jshint esversion: 6 */

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
//canvas.style.backgroundColor = "grey";

//retrieve images
let player_img = new Image();
player_img.src = 'rocket_small.png';

let goodThing_img = new Image();
goodThing_img.src = 'gas_small.png';

let enemy_img = new Image();
enemy_img.src = 'meteor_small.png';

// let background_img = new Image();
// background_img.src = 'background.jpg';
// ctx.drawImage(background_img, 0, 0);

let lives = 5;
let score = 0;
let level = 1;
let gameOver = false;
let inIntro = true;

document.addEventListener("keydown", keyDown);

function keyDown(event) {
  switch (event.which) {
    case 38: //up
      player.y -= 15;
      break;
    case 40: //down
      player.y += 15;
      break;
    case 82: //r
      if (gameOver) {
        resetGame();
      }
      break;
    case 32: //space
      if (inIntro) {
        draw();
        inIntro = false;
      }
      break;
    default:
      break;
  }
}

//objects to represent entities
let player = {
  size: 50,
  x: 0,
  y: (canvas.height - 30) / 2,
  // color: "black"
};

let goodThing = {
  x: [], //x-coordinates of multiple objects
  y: [], //y-coordinates of multiple objects
  speed: 3,
  // color: "green",
  radius: 35
};

let enemy = {
  x: [], //x-coordinates of multiple objects
  y: [], //y-coordinates of multiple objects
  speed: 3,
  // color: "blue",
  radius: 25
};

function drawPlayer() {
  // ctx.beginPath();
  // ctx.rect(player.x, player.y, player.size, player.size);
  // ctx.closePath();
  // ctx.fillStyle = player.color;
  // ctx.fill();

  ctx.drawImage(player_img, player.x, player.y);
}

function updateGame() {
  drawPlayer();

  //can change threshold to determine how many objects to spawn
  if (Math.random() < 0.02) {
    enemy.x.push(canvas.width);
    enemy.y.push(Math.random() * canvas.width);
  }

  //can change threshold to determine how many objects to spawn
  if (Math.random() < 0.04) {
    goodThing.x.push(canvas.width);
    goodThing.y.push(Math.random() * canvas.width);
  }

  for (let i = 0; i < enemy.x.length; i++) {
    enemy.x[i] -= enemy.speed;
    //draw enemy
    // ctx.beginPath();
    // ctx.arc(enemy.x[i], enemy.y[i], enemy.radius, 0, Math.PI * 2);
    // ctx.closePath();
    // ctx.fillStyle = enemy.color;
    // ctx.fill();

    ctx.drawImage(enemy_img, enemy.x[i], enemy.y[i]);

    //remove from canvas once hits left edge
    if (enemy.x[i] + enemy.radius < enemy.radius - 25) {
      enemy.x.shift();
      enemy.y.shift();
    }

    //remove from canvas if collision
    if (detectCollision(player.x, player.y, enemy.x[i], enemy.y[i], "bad")) {
      enemy.x.splice(i, 1);
      enemy.y.splice(i, 1);
    }
  }

  for (let i = 0; i < goodThing.x.length; i++) {
    goodThing.x[i] -= goodThing.speed;
    //draw good thing
    // ctx.beginPath();
    // ctx.arc(goodThing.x[i], goodThing.y[i], goodThing.radius, 0, Math.PI * 2);
    // ctx.closePath();
    // ctx.fillStyle = goodThing.color;
    // ctx.fill();

    ctx.drawImage(goodThing_img, goodThing.x[i], goodThing.y[i]);

    //remove from canvas once hits left edge
    if (goodThing.x[i] + goodThing.radius < goodThing.radius - 25) {
      goodThing.x.shift();
      goodThing.y.shift();
    }

    //remove from canvas if collision
    if (detectCollision(player.x, player.y, goodThing.x[i], goodThing.y[i], "good")) {
      goodThing.x.splice(i, 1);
      goodThing.y.splice(i, 1);
    }
  }

  //really ugly, should really change
  if (score < 11) {
    enemy.speed = 4;
    level = 1;
  } else if (score < 21) {
    enemy.speed = 5;
    level = 2;
  } else if (score < 31) {
    enemy.speed = 6;
    level = 3;
  } else if (score < 41) {
    enemy.speed = 7;
    level = 4;
  } else if (score < 51) {
    enemy.speed = 8;
    level = 5;
  } else if (score < 61) {
    enemy.speed = 10;
    level = 6;
  } else if (score < 71) {
    enemy.speed = 12;
    level = 7;
  } else if (score < 81) {
    enemy.speed = 14;
    level = 8;
  } else if (score < 91) {
    enemy.speed = 16;
    level = 9;
  } else if (score < 101) {
    enemy.speed = 18;
    level = 10;
  }
}

//collision may appear to be slightly off due to transparency in entities
//that give a false impression of not being collided, but pixels
//count as collision
function detectCollision(playerX, playerY, objectX, objectY, type) {
  let radius = 0;

  if (type === "good") {
    radius = goodThing.radius;
  } else {
    radius = enemy.radius;
  }

  //https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
  if (playerX < objectX + radius &&
    playerX + player.size + radius > objectX &&
    playerY < objectY + radius &&
    playerY + player.size > objectY) {
    //collision
    console.log("hit");
    if (type === "good") {
      score = score + 5;
      console.log("good thing hit");
    } else {
      lives--;
      if (lives === 0) {
        gameOver = true;
      }
      console.log(lives);
    }
    return true;
  }
}

function resetGame() {
  //empty arrays of positions
  goodThing.x = [];
  goodThing.y = [];
  enemy.x = [];
  enemy.y = [];
  gameOver = false;
  score = 0;
  lives = 5;
  level = 1;
  enemy.speed = 3;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if(!gameOver) {
    updateGame();
    ctx.fillStyle = "white";
		ctx.font = "20pt Comic Sans MS";
		ctx.fillText("Score: " + score, canvas.width - 175, 50);
    ctx.fillText("Lives: " + lives, canvas.width - 175, 90);
    ctx.fillText("Level: " + level, canvas.width - 175, 130);
  } else {
    ctx.fillStyle = "grey";
		ctx.font = "20pt Comic Sans MS";
		ctx.textAlign = "center";
    ctx.fillText("Game over!", canvas.width / 2, canvas.height / 2);
    ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2 + 50);
    ctx.fillText("Press R to restart", canvas.width / 2, canvas.height / 2 + 100);
  }
  requestAnimationFrame(draw);
}

function intro() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "20pt Comic Sans MS";
  ctx.fillText("Press up and down to move -", canvas.width / 2 - 250, canvas.height / 2 - 50);
  ctx.fillText("Catch the gas, dodge the meteors!", canvas.width / 2 - 250, canvas.height / 2 );
  ctx.fillText("Press Space to start!", canvas.width / 2 - 250, canvas.height / 2 + 50);
}

intro();
