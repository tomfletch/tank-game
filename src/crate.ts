import Rectangle from './rectangle';
import Vector from './vector';

const SIZE = 30;

const PLANK_WIDTH = 6;
const DIAGONAL_PLANK_WIDTH = 8;

class Crate {
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
    ctx.fillStyle = '#cfa951';
    ctx.strokeStyle = '#6b541d';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(this.position.x, this.position.y, SIZE, SIZE);
    ctx.fillRect(this.position.x, this.position.y, SIZE, SIZE);

    // Diagonal planks
    ctx.fillStyle = '#d6b054';

    ctx.save();
    ctx.translate(this.position.x + SIZE / 2, this.position.y + SIZE / 2);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-15, -DIAGONAL_PLANK_WIDTH / 2, 30, DIAGONAL_PLANK_WIDTH);
    ctx.strokeRect(-15, -DIAGONAL_PLANK_WIDTH / 2, 30, DIAGONAL_PLANK_WIDTH);
    ctx.rotate(Math.PI / 2);
    ctx.fillRect(-15, -DIAGONAL_PLANK_WIDTH / 2, 30, DIAGONAL_PLANK_WIDTH);
    ctx.strokeRect(-15, -DIAGONAL_PLANK_WIDTH / 2, 30, DIAGONAL_PLANK_WIDTH);
    ctx.restore();

    // Outer planks
    ctx.fillStyle = '#e0b95c';
    ctx.strokeRect(this.position.x, this.position.y, SIZE, PLANK_WIDTH);
    ctx.fillRect(this.position.x, this.position.y, SIZE, PLANK_WIDTH);

    ctx.strokeRect(this.position.x, this.position.y + SIZE - PLANK_WIDTH, SIZE, PLANK_WIDTH);
    ctx.fillRect(this.position.x, this.position.y + SIZE - PLANK_WIDTH, SIZE, PLANK_WIDTH);

    ctx.strokeRect(this.position.x, this.position.y, PLANK_WIDTH, SIZE);
    ctx.fillRect(this.position.x, this.position.y, PLANK_WIDTH, SIZE);

    ctx.strokeRect(this.position.x + SIZE - PLANK_WIDTH, this.position.y, PLANK_WIDTH, SIZE);
    ctx.fillRect(this.position.x + SIZE - PLANK_WIDTH, this.position.y, PLANK_WIDTH, SIZE);
  }

}

export default Crate;
