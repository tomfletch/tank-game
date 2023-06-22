import Vector from "./vector";

class Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  intersects(other: Rectangle) {
    return !(
      (this.x + this.width < other.x) ||
      (this.x > other.x + other.width) ||
      (this.y + this.height < other.y) ||
      (this.y > other.y + other.height)
    );
  }

  contains(point: Vector) {
    return (
      point.x >= this.x &&
      point.x <= this.x + this.width &&
      point.y >= this.y &&
      point.y <= this.y + this.height
    );
  }
}

export default Rectangle;
