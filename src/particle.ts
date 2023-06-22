import Vector from './vector';

class Particle {
  position: Vector;
  radius: number;
  colour: string;
  life: number;
  grow: number;

  constructor(position: Vector, radius: number, colour: string, life: number, grow: number) {
    this.position = position;
    this.radius = radius;
    this.colour = colour;
    this.life = life;
    this.grow = grow;
  }

  update() {
    this.life -= 1;
    this.radius += this.grow;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.radius <= 0) return;

    ctx.fillStyle = this.colour;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default Particle;
