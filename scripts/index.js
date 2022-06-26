const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

// ----------------------------------------------------------------
// Background
// ----------------------------------------------------------------
const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: '../assets/background.png'
});
const shop = new Sprite({
  position: {
    x: 600,
    y: 134
  },
  imageSrc: '../assets/shop.png',
  scale: 2.7,
  framesMax: 6
});

// ----------------------------------------------------------------
// Instancias
// ----------------------------------------------------------------
const player = new Fighter({
  position:{
  x: 0,
  y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset:{
    x:0,
    y:0
  },
  imageSrc: '../assets/samuraiMack/Idle.png',
  scale: 2.5,
  framesMax: 8,
  offset:{
    x:215,
    y:157
  },
  sprites: {
    idle:{
      imageSrc: '../assets/samuraiMack/Idle.png',
      framesMax: 8
    },
    run:{
      imageSrc: '../assets/samuraiMack/Run.png',
      framesMax: 8
    },
    jump:{
      imageSrc: '../assets/samuraiMack/Jump.png',
      framesMax: 2
    },
    fall:{
      imageSrc: '../assets/samuraiMack/Fall.png',
      framesMax: 2
    },
    attack1:{
      imageSrc: '../assets/samuraiMack/Attack1.png',
      framesMax: 6
    },
    attack2:{
      imageSrc: '../assets/samuraiMack/Attack2.png',
      framesMax: 6
    },
    takeHit:{
      imageSrc: '../assets/samuraiMack/Take Hit - white silhouette.png',
      framesMax: 4
    },
    death:{
      imageSrc: '../assets/samuraiMack/Death.png',
      framesMax: 6
    }
  },
  attackBox: {
    offset: {
      x:100,
      y: 50
    },
    width: 158,
    height: 50
  }
});

const enemy = new Fighter({
  position:{
  x: 400,
  y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset:{
    x:0,
    y:0
  },
  imageSrc: '../assets/kenji/Idle.png',
  scale: 2.5,
  framesMax: 4,
  offset:{
    x:215,
    y:167
  },
  sprites: {
    idle:{
      imageSrc: '../assets/kenji/Idle.png',
      framesMax: 4
    },
    run:{
      imageSrc: '../assets/kenji/Run.png',
      framesMax: 8
    },
    jump:{
      imageSrc: '../assets/kenji/Jump.png',
      framesMax: 2
    },
    fall:{
      imageSrc: '../assets/kenji/Fall.png',
      framesMax: 2
    },
    attack1:{
      imageSrc: '../assets/kenji/Attack1.png',
      framesMax: 4
    },
    attack2:{
      imageSrc: '../assets/kenji/Attack2.png',
      framesMax: 4
    },
    takeHit:{
      imageSrc: '../assets/kenji/Take hit.png',
      framesMax: 3
    },
    death:{
      imageSrc: '../assets/kenji/Death.png',
      framesMax: 7
    }
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50
    },
    width: 170,
    height: 50
  }
});

descreaseTimer();

// ----------------------------------------------------------------
// Variables para detectar movimiento
// ----------------------------------------------------------------
let leftPlayer = 0;
let rightPlayer = 0;

let leftEnemy = 0;
let rightEnemy = 0;

// ----------------------------------------------------------------
// Game Loop
// ----------------------------------------------------------------
function animate(){
  window.requestAnimationFrame(animate);
  c.beginPath();
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);

  background.update();
  shop.update();

  c.fillStyle = 'rgba( 255, 255, 255, .1)'
  c.fillRect( 0, 0,canvas.width, canvas.height )

  player.update();
  enemy.update();

  // Player Animation

  switch (true) {
    case ( player.velocity.y < 0 ):
      player.switchSprite('jump');
    break;
    case ( player.velocity.y > 0 ):
      player.switchSprite('fall');
    break;
    case ( player.velocity.x != 0 ):
      player.switchSprite('run');
    break;
    default:
      player.switchSprite('idle')
    break;
  }

  switch (true) {
    case ( enemy.velocity.y < 0 ):
      enemy.switchSprite('jump');
    break;
    case ( enemy.velocity.y > 0 ):
      enemy.switchSprite('fall');
    break;
    case ( enemy.velocity.x != 0 ):
      enemy.switchSprite('run');
    break;
    default:
      enemy.switchSprite('idle')
    break;
  }

  // Players move

  player.velocity.x = (-xMovement * leftPlayer) + (xMovement * rightPlayer) ;
  enemy.velocity.x = (-xMovement * leftEnemy) + (xMovement * rightEnemy)
  
  // detect player attack colision
  if ( 
      rectangularCollision({rectangle1: player,rectangle2: enemy}) &&
      player.isAttacking && player.frameCurrent == 4
    ){
    enemy.takeHit();
    player.isAttacking = false;

    // document.getElementById('enemyHealt').style.width = enemy.healt + '%';
    gsap.to('#enemyHealt', {
      width: player.healt + '%'
    })
  }

  // detect enemy attack colision
  if (
      rectangularCollision({rectangle1: enemy, rectangle2: player}) &&
      enemy.isAttacking  && enemy.frameCurrent == 1
  ){
    player.takeHit();
    enemy.isAttacking = false;

    // document.getElementById('playerHealt').style.width = player.healt + '%';
    gsap.to('#playerHealt', {
      width: player.healt + '%'
    })
  }

  // End game based on healt
  if (enemy.healt <= 0 || player.healt <=0){
    determinateWinner ({player, enemy, timerId})
  }
};
animate();

// ----------------------------------------------------------------
// Listeners
// ----------------------------------------------------------------
window.addEventListener('keydown', (event) =>{
  // Player
  if (!player.death)
    switch ( event.key.toUpperCase() ) {
      case 'D':
        rightPlayer = 1;
      break;
      case 'A':
        leftPlayer = 1;
      break;
      case 'W':
        if (player.position.y + player.height >= canvas.height - 96){
          player.velocity.y = -20;
        }
      break;
      case 'S':
        if (player.position.y + player.height < canvas.height - 96)
          player.velocity.y += 8;
      break;
      case ' ':
          player.attack();
      break;
    };
  
  // Enemy
  if (!enemy.death)
    switch (event.key.toUpperCase()){
      case 'ARROWRIGHT':
        rightEnemy = 1;
      break;
      case 'ARROWLEFT':
        leftEnemy = 1;
      break;
      case 'ARROWUP':
        if (enemy.position.y + enemy.height >= canvas.height - 96)
          enemy.velocity.y = -20;
      break;
      case 'ARROWDOWN':
        if (enemy.position.y + enemy.height < canvas.height)
          enemy.velocity.y += 8;
      break;
      case '0':
        enemy.attack();
      break;
    };
});

// ----------------------------
window.addEventListener('keyup', (event)=>{
  switch ( event.key.toUpperCase() ) {
    case 'D':
      rightPlayer = 0;
    case 'A':
      leftPlayer = 0;
    break;
    case 'ARROWRIGHT':
      rightEnemy = 0;
    case 'ARROWLEFT':
      leftEnemy = 0;
    break;
  }
});