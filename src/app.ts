import Tank from './tank';
import Vector from './vector';
import Bullet from './bullet';
import Crate from './crate';
import Stone from './stone';
import Particle from './particle';
import Rectangle from './rectangle';

const WIDTH = 800;
const HEIGHT = 600;


const BASE_LAND = new Rectangle(-200, -200, 400, 400);
const EAST_LAND = new Rectangle(400, -300, 600, 600);

const EAST_BRIDGE = new Rectangle(180, -50, 240, 100);

class App {
  ctx: CanvasRenderingContext2D;
  tank: Tank;
  bullets: Bullet[];
  crates: Crate[];
  stones: Stone[];
  enemyTanks: Tank[];
  particles: Particle[];

  isMouseDown: boolean;
  mousePosition: Vector | null;
  pressedKeys: {[key: string]: boolean};

  constructor() {
    const canvas = <HTMLCanvasElement> document.getElementById('game');
    this.ctx = canvas.getContext('2d', { alpha: false })!;

    this.bullets = [];
    this.crates = [];
    this.stones = [
      // new Stone(new Vector(100, 100)),
      // new Stone(new Vector(130, 100)),
      // new Stone(new Vector(160, 100)),
      // new Stone(new Vector(190, 100)),
      // new Stone(new Vector(100, 130)),
      // new Stone(new Vector(100, 160)),
      // new Stone(new Vector(100, 190)),
    ];
    this.particles = [];
    this.tank = new Tank(new Vector(0, 0), '#336633');

    this.enemyTanks = [
      new Tank(new Vector(550, 0), '#FF8FAB'),
      new Tank(new Vector(600, 150), '#1AA7EC')
    ];

    for (let x = 0; x < 10; x++) {
        // this.crates.push(new Crate(new Vector(300 + x * 40, 50)));
        // this.crates.push(new Crate(new Vector(300 + x * 40, 200)));
    }

    this.isMouseDown = false;
    this.pressedKeys = {};

    canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
    window.addEventListener('keydown', this.onKeyDown.bind(this));
    window.addEventListener('keyup', this.onKeyUp.bind(this));

    this.loop();
  }

  onMouseMove(event: MouseEvent) {
    this.mousePosition = new Vector(
      -(WIDTH / 2) + this.tank.position.x + event.offsetX,
      -(HEIGHT / 2) + this.tank.position.y + event.offsetY
    );
  }

  onMouseDown(event: MouseEvent) {
    this.isMouseDown = true;
  }

  onMouseUp(event: MouseEvent) {
    this.isMouseDown = false;
  }

  onKeyDown(event: KeyboardEvent) {
    const key = event.key;
    this.pressedKeys[key] = true;
  }

  onKeyUp(event: KeyboardEvent) {
    const key = event.key;
    this.pressedKeys[key] = false;
  }

  isKeyPressed(key: string) {
    return key in this.pressedKeys && this.pressedKeys[key];
  }

  loop() {
    this.update();
    this.draw();

    window.requestAnimationFrame(this.loop.bind(this));
  }

  update() {
    this.tank.update();

    if (this.isMouseDown && this.tank.canFire()) {
      const bullet = this.tank.createBullet();
      this.bullets.push(bullet);
    }

    // Check for bullet collisions
    for (let j = this.bullets.length - 1; j >= 0; j--) {
      const bullet = this.bullets[j];

      for (let i = this.crates.length - 1; i >= 0; i--) {
        const crate = this.crates[i];

        if (crate.contains(bullet.position)) {
          this.crates.splice(i, 1);
          this.bullets.splice(j, 1);

          this.createExplosionAt(crate.getCenter());
          break;
        }
      }

      for (const stone of this.stones) {
        if (stone.contains(bullet.position)) {
          this.bullets.splice(j, 1);
        }
      }

      for (let i = this.enemyTanks.length - 1; i >= 0; i--) {
        const enemyTank = this.enemyTanks[i];

        if (enemyTank.getBoundingRectangle().contains(bullet.position)) {
          enemyTank.takeDamage(10);
          this.bullets.splice(j, 1);
          this.particles.push(new Particle(bullet.position, 5, '#ff0000', 5, 1));

          if (enemyTank.health <= 0) {
            this.createExplosionAt(enemyTank.position);
            this.enemyTanks.splice(i, 1);
          }
        }
      }
    }

    for (const particle of this.particles) {
      particle.update();
    }

    // Remove dead particles
    this.particles = this.particles.filter((particle) => particle.life > 0);

    let moveDelta = 0;

    if (this.isKeyPressed('w')) {
      moveDelta = 1;
    } else if(this.isKeyPressed('s')) {
      moveDelta = -1;
    }

    if (moveDelta !== 0) {
      this.tank.move(moveDelta);
      const tankBoundingRect = this.tank.getBoundingRectangle();

      for (const crate of this.crates) {
        if (crate.getBoundingRectangle().intersects(tankBoundingRect)) {
          this.tank.move(-moveDelta);
          break;
        }
      }

      for (const stone of this.stones) {
        if (stone.getBoundingRectangle().intersects(tankBoundingRect)) {
          this.tank.move(-moveDelta);
          break;
        }
      }
    }

    if (this.isKeyPressed('a')) {
      this.tank.rotate(-Math.PI * 0.01);
    } else if(this.isKeyPressed('d')) {
      this.tank.rotate(Math.PI * 0.01);
    }

    if (this.mousePosition) {
      this.tank.aimAt(this.mousePosition);
    }

    for(const bullet of this.bullets) {
      bullet.update();
    }
  }

  createExplosionAt(position: Vector) {
    for (let k = 0; k < 20; k++) {
      const magnitude = Math.random() * 30;
      const angle = Math.random() * Math.PI * 2;

      const particlePosition = position.clone();

      particlePosition.x += Math.cos(angle) * magnitude;
      particlePosition.y += Math.sin(angle) * magnitude;

      const particleColour = ['#dddddd', '#ffffff', '#aaaaaa'][Math.floor(Math.random() * 3)];

      this.particles.push(new Particle(particlePosition, Math.random() * 10 - 10, particleColour, Math.random() * 20 + 20, Math.random() * 0.5));
    }

    this.particles.push(new Particle(position, 10, '#ff0000', 15, 0.5));
  }

  draw() {
    // Clear screen
    this.ctx.fillStyle = '#45b6fe';
    this.ctx.fillRect(0, 0, WIDTH, HEIGHT);

    this.ctx.save();
    this.ctx.translate((WIDTH / 2) - this.tank.position.x, (HEIGHT / 2) - this.tank.position.y);

    // Draw land
    this.ctx.fillStyle = '#e6fced';
    this.ctx.fillRect(BASE_LAND.x, BASE_LAND.y, BASE_LAND.width, BASE_LAND.height);
    this.ctx.fillRect(EAST_LAND.x, EAST_LAND.y, EAST_LAND.width, EAST_LAND.height);

    const gradient = this.ctx.createLinearGradient(EAST_BRIDGE.x, 0, EAST_BRIDGE.x + EAST_BRIDGE.width, 0);
    gradient.addColorStop(0, "#bbbbbb");
    gradient.addColorStop(0.5, "#eeeeee");
    gradient.addColorStop(1, "#bbbbbb");

    const gradient2 = this.ctx.createLinearGradient(EAST_BRIDGE.x, 0, EAST_BRIDGE.x + EAST_BRIDGE.width, 0);
    gradient2.addColorStop(0, "#888888");
    gradient2.addColorStop(0.5, "#aaaaaa");
    gradient2.addColorStop(1, "#888888");

    // Draw bridges
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(EAST_BRIDGE.x, EAST_BRIDGE.y, EAST_BRIDGE.width, EAST_BRIDGE.height);
    this.ctx.fillStyle = gradient2;
    this.ctx.fillRect(EAST_BRIDGE.x, EAST_BRIDGE.y, EAST_BRIDGE.width, 10);
    this.ctx.fillRect(EAST_BRIDGE.x, EAST_BRIDGE.y + EAST_BRIDGE.height - 10, EAST_BRIDGE.width, 10);

    // Draw bullets
    for(const bullet of this.bullets) {
      bullet.draw(this.ctx);
    }

    // Draw crates
    for (const crate of this.crates) {
      crate.draw(this.ctx);
    }

    // Draw stones
    for (const stone of this.stones) {
      stone.draw(this.ctx);
    }

    // Draw tank
    this.tank.draw(this.ctx);

    // Draw enemy tanks
    for (const enemyTank of this.enemyTanks) {
      enemyTank.draw(this.ctx);
    }

    // Draw particles
    for (const particle of this.particles) {
      particle.draw(this.ctx);
    }

    // Draw health bars
    this.tank.drawHealthBar(this.ctx);

    for (const enemyTank of this.enemyTanks) {
      enemyTank.drawHealthBar(this.ctx);
    }

    this.ctx.restore();
  }
}

new App();
