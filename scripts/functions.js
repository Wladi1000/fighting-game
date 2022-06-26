// ----------------------------------------------------------------
// Funcion detectora de golpes colisionando
// ----------------------------------------------------------------
function rectangularCollision({rectangle1, rectangle2}){
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
      rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
      rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height &&
      rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
  )
}

// ----------------------------------------------------------------
// Determinar ganador
// ----------------------------------------------------------------
let displayText = document.getElementById('displayText');
function determinateWinner({player, enemy, timerId}){
  clearTimeout(timerId)
  displayText.style.display = 'flex';

  if (player.healt === enemy.healt){
    displayText.innerHTML = 'Tie';
  } else if (player.healt > enemy.healt){
    displayText.innerHTML = 'Player 1 WINS';
  } else if (player.healt < enemy.healt){
    displayText.innerHTML = 'Player 2 WINS';
  }
}

// ----------------------------------------------------------------
// Timer
// ----------------------------------------------------------------
let timer = 60;
let timerId;
function descreaseTimer(){
  if (timer>0){
    timerId = setTimeout(descreaseTimer, 1000);
    timer--;
    document.getElementById('timer').innerHTML = timer;
  }

  if (timer==0){
    determinateWinner({player, enemy, timerId})
  }
}