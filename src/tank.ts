import Bullet from './bullet';
import Rectangle from './rectangle';
import Vector from './vector';
import { lighten, darken } from './utils/colour';

const TANK_WIDTH = 30;
const TANK_LENGTH = 50;

const TURRET_DIAMETER = 6;
const TURRET_LENGTH = 35;

const TREAD_WIDTH = 2;
const TREAD_OFFSET = 4;
const TREAD_LENGTH = TANK_LENGTH - TREAD_OFFSET * 2;
const TREAD_STRIPE_LENGTH = 10;

const HEALTH_BAR_WIDTH = 100;
const HEALTH_BAR_HEIGHT = 10;

const BULLET_SPEED = 10;
const COOLDOWN = 40;

class Tank {
  position: Vector;
  angle: number;
  turretAngle: number;

  colour: string;
  colourVents: string;
  colourTurret: string;

  treadOffsetLeft: number;
  treadOffsetRight: number;

  cooldown: number;
  health: number;
  maxHealth: number;

  constructor(position: Vector, colour: string) {
    this.position = position;
    this.angle = 0;
    this.turretAngle = 0;

    this.colour = colour;
    this.colourVents = darken(colour, 0.2);
    console.log(this.colourVents);
    this.colourTurret = lighten(colour, 0.2);

    this.treadOffsetLeft = 0;
    this.treadOffsetRight = 0;

    this.cooldown = 0;

    this.maxHealth = 100;
    this.health = this.maxHealth;
  }

  rotate(delta: number) {
    this.angle += delta;

    this.treadOffsetLeft  = (this.treadOffsetLeft  + delta * 20) % (TREAD_STRIPE_LENGTH * 2);
    this.treadOffsetRight = (this.treadOffsetRight - delta * 20) % (TREAD_STRIPE_LENGTH * 2);
  }

  aimAt(target: Vector) {
    this.turretAngle = Math.atan2(target.y - this.position.y, target.x - this.position.x);
  }

  move(delta: number) {
    this.position.x += delta * Math.cos(this.angle);
    this.position.y += delta * Math.sin(this.angle);

    this.treadOffsetLeft  = (this.treadOffsetLeft  + delta) % (TREAD_STRIPE_LENGTH * 2);
    this.treadOffsetRight = (this.treadOffsetRight + delta) % (TREAD_STRIPE_LENGTH * 2);
  }

  canFire() {
    return this.cooldown == 0;
  }

  getBoundingRectangle() {
    return new Rectangle(this.position.x - TANK_LENGTH / 2, this.position.y - TANK_LENGTH / 2, TANK_LENGTH, TANK_LENGTH);
  }

  createBullet() {
    this.cooldown = COOLDOWN;

    const bulletPosition = this.position.clone();
    const bulletVelocity = new Vector(
      Math.cos(this.turretAngle) * BULLET_SPEED,
      Math.sin(this.turretAngle) * BULLET_SPEED
    );

    return new Bullet(bulletPosition, bulletVelocity);
  }

  takeDamage(damage: number) {
    this.health = Math.max(this.health - damage, 0);
  }

  update() {
    if (this.cooldown > 0) {
      this.cooldown -= 1;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Draw base
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.angle);

    // Draw treads
    this.drawTread(ctx, -TANK_WIDTH / 2 - TREAD_WIDTH, this.treadOffsetLeft);
    this.drawTread(ctx, TANK_WIDTH / 2, this.treadOffsetRight);

    // Draw frame
    ctx.fillStyle = this.colour;
    ctx.fillRect(-TANK_LENGTH / 2, -TANK_WIDTH / 2, TANK_LENGTH - 4, TANK_WIDTH);
    ctx.fillRect(-TANK_LENGTH / 2, -TANK_WIDTH / 2, TANK_LENGTH, 8);
    ctx.fillRect(-TANK_LENGTH / 2, TANK_WIDTH / 2 - 8, TANK_LENGTH, 8);

    // Draw vents
    ctx.fillStyle = this.colourVents;
    ctx.fillRect(TANK_LENGTH / 2 - 10, -5, 3, 10);
    ctx.fillRect(-TANK_LENGTH / 2 + 5, -10, 5, 8);
    ctx.fillRect(-TANK_LENGTH / 2 + 5, 2, 5, 8);
    ctx.restore();

    // Draw turret
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.turretAngle);
    ctx.fillStyle = this.colourVents;
    ctx.beginPath();
    ctx.arc(0, 0, TANK_WIDTH / 2 - 4, 0, Math.PI*2);
    ctx.fill();

    ctx.fillStyle = this.colourTurret;
    ctx.fillRect(0, -TURRET_DIAMETER / 2, TURRET_LENGTH, TURRET_DIAMETER);

    ctx.beginPath();
    ctx.arc(0, 0, TANK_WIDTH / 2 - 6, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }

  drawTread(ctx, y: number, offset: number) {
    const treadStart = -TANK_LENGTH / 2 + TREAD_OFFSET;
    const treadEnd = treadStart + TREAD_LENGTH;

    ctx.fillStyle = '#333333';
    ctx.fillRect(treadStart, y, TREAD_LENGTH, TREAD_WIDTH);

    ctx.fillStyle = '#777777';

    for (let i = 0; i < TREAD_LENGTH / (TREAD_STRIPE_LENGTH * 2) + 1; i++) {

      let stripeStart = treadStart + (i - 1) * (TREAD_STRIPE_LENGTH * 2) + offset;
      let stripeEnd = stripeStart + TREAD_STRIPE_LENGTH;

      stripeStart = Math.max(stripeStart, treadStart);
      stripeEnd = Math.min(stripeEnd, treadEnd);

      const stripeLength = stripeEnd - stripeStart;

      if (stripeLength > 0) {
        ctx.fillRect(stripeStart, y, stripeLength, TREAD_WIDTH);
      }
    }
  }

  drawHealthBar(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#666';
    ctx.fillRect(this.position.x - HEALTH_BAR_WIDTH / 2 - 1, this.position.y - 50 - 1, HEALTH_BAR_WIDTH + 2, HEALTH_BAR_HEIGHT + 2);

    ctx.fillStyle = '#bbb';
    ctx.fillRect(this.position.x - HEALTH_BAR_WIDTH / 2, this.position.y - 50, HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT);

    const healthPercent = this.health / this.maxHealth;
    const healthBarWidth = HEALTH_BAR_WIDTH * healthPercent;

    if (healthPercent > 0.75) {
      ctx.fillStyle = '#00FF00';
    } else if (healthPercent > 0.5) {
      ctx.fillStyle = '#FFA500';
    } else if (healthPercent > 0.25) {
      ctx.fillStyle = '#FFFF00';
    } else {
      ctx.fillStyle = '#FF0000';
    }

    ctx.fillRect(this.position.x - HEALTH_BAR_WIDTH / 2, this.position.y - 50, healthBarWidth, 10);
  }
}

export default Tank;
