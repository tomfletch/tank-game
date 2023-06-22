import Vector from './vector';

const RADIUS = 3;

class Bullet {
  position: Vector;
  velocity: Vector;

  constructor(position: Vector, velocity: Vector) {
    this.position = position;
    this.velocity = velocity;
  }

  update() {
    this.position.add(this.velocity);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#111111';
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, RADIUS, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default Bullet;
