const gravity = 0.7;
const xMovement = 5;
// ----------------------------------------------------------------
// Clase de los personaje
// ----------------------------------------------------------------
class Sprite{
  constructor({ position, imageSrc, scale = 1, framesMax = 1, offset = {x: 0, y:0} }){
    this.position = position;
    this.height = 150;
    this.width = 50;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale,
    this.framesMax = framesMax,
    this.frameCurrent = 0,
    this.frameElapse = 0,
    this.frameHold = 8,
    this.offset = offset
  }

  draw(){
    c.drawImage(
      this.image,
      this.frameCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,

      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale,
    );

  }

  animateFrame(){
    this.frameElapse++;

    if (this.frameElapse % this.frameHold === 0){
      this.frameElapse = 0;

      if (this.frameCurrent < this.framesMax-1){
      this.frameCurrent++;
      }else this.frameCurrent = 0
    }
  }

  update(){
    this.draw();
    // Actualizacion de frame
    this.animateFrame();

  }

}

// ----------------------------------------------------------------
// Clase de los personaje
// ----------------------------------------------------------------
class Fighter extends Sprite{
  constructor({
    position,
    velocity,
    color = 'red',
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = {x: 0, y:0},
    sprites,
    attackBox = { offset: {}, width: undefined, height: undefined }
  }){
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset
    });

    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height
    }
    this.color = color;
    this.isAttacking = false;
    this.healt = 100;
    this.frameCurrent = 0;
    this.frameElapse = 0;
    this.frameHold = 8;
    this.sprites = sprites;
    this.death = false;

    for (const sprite in sprites){
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }

  }
  update(){
    this.draw();

    // Actualizacion de frame
    if (!this.death) this.animateFrame();

    // Attack Box

    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    // Draw attack Borx
    // c.fillRect(this.attackBox.position.x,
    //   this.attackBox.position.y,
    //   this.attackBox.width,
    //   this.attackBox.height
    // )

    // Horizontals borders Colisions 
    if (this.position.x + this.width >= canvas.width ){
      this.velocity.x -= xMovement;
    }
    if (this.position.x -1 <= 0){
      this.velocity.x = xMovement;
    }

    // Aceleration
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Gravity
    if ( this.position.y + this.height + this.velocity.y >= canvas.height - 96 ){
      this.velocity.y = 0;
      this.position.y = 330;
    } else this.velocity.y += gravity;
  }
  attack(){
    this.switchSprite('attack1')
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 1000);
  }
  takeHit(){
    this.healt -= 20;

    if ( this.healt <= 0 ){
      this.switchSprite('death');
    }else{
      this.switchSprite('takeHit');
    }

  }
  switchSprite(sprite){
    // overriding when the fighter is dead
    if (this.image === this.sprites.death.image) {
      if (this.frameCurrent === this.sprites.death.framesMax-1){
        this.death = true;
      }
      return
    };

    // overriding all other animations with the attack animation
    if (this.image === this.sprites.attack1.image && 
      this.frameCurrent < this.sprites.attack1.framesMax -1
      )
      return;

    // overriding when the fighter take hit
    if (this.image === this.sprites.takeHit.image && 
      this.frameCurrent < this.sprites.takeHit.framesMax -1
      )
      return;

    switch (sprite) {
      case 'idle':
        if (this.image !== this.sprites.idle.image){
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.frameCurrent = 0;
        }
      break;
      case 'run':
        if (this.image !== this.sprites.run.image){
          this.image = this.sprites.run.image
          this.framesMax = this.sprites.run.framesMax;
          this.frameCurrent = 0;
        }
      break;
      case 'jump':
        if (this.image !== this.sprites.jump.image){
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.frameCurrent = 0;
        }
      break;
      case 'fall':
        if (this.image !== this.sprites.fall.image){
          this.image = this.sprites.fall.image;
          this.framesMax = this.sprites.fall.framesMax;
          this.frameCurrent = 0;
        }
      break;
      case 'attack1':
        if (this.image !== this.sprites.attack1.image){
          this.image = this.sprites.attack1.image;
          this.framesMax = this.sprites.attack1.framesMax;
          this.frameCurrent = 0;
        }
      break;
      case 'takeHit':
        if (this.image !== this.sprites.takeHit.image){
          this.image = this.sprites.takeHit.image;
          this.framesMax = this.sprites.takeHit.framesMax;
          this.frameCurrent = 0;
        }
      break;
      case 'death':
        if (this.image !== this.sprites.death.image){
          this.image = this.sprites.death.image;
          this.framesMax = this.sprites.death.framesMax;
          this.frameCurrent = 0;
        }
      break;
    }
  }

}