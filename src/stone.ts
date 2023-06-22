import Rectangle from './rectangle';
import Vector from './vector';

const SIZE = 30;

class Stone {
  position: Vector;

  constructor(position: Vector) {
    this.position = position;
  }

  contains(point: Vector) {
    return (point.x > this.position.x) && (point.y > this.position.y) && (point.x < this.position.x + SIZE) && (point.y < this.position.y + SIZE);
  }

  getCenter() {
    return new Vector(this.position.x + SIZE / 2, this.position.y + SIZE / 2);
  }

  getBoundingRectangle() {
    return new Rectangle(this.position.x, this.position.y, SIZE, SIZE);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#888';
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.roundRect(this.position.x, this.position.y, SIZE, SIZE, 4);
    ctx.fill();
    ctx.stroke();
  }

}

export default Stone;
