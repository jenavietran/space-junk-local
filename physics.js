
/**
 * Represents a particle-style physical object with position, velocity,
 * and rotation.
 */
class Physics {
  x;
  y;
  dx;
  dy;
  rotation;

  constructor() {
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
    this.rotation = 0;
  }

  draw() {
    push();
    noFill();
    stroke("#ffffff");
    strokeWeight(1);
    circle(0, 0, 10);

    const v = createVector(this.dx, this.dy);
    const future = v.copy().mult(0.5);
    line(0, 0, future.x, future.y);

    strokeWeight(2);
    const dir = v.copy().setMag(10);
    line(0, 0, dir.x, dir.y);
    pop();
  }

  move(delta, { constrain = false } = {}) {
    // Move based on velocity and elapsed time
    const seconds = delta / 1000;

    this.x += this.dx * seconds;
    this.y += this.dy * seconds;

    if (constrain) {
      while (this.x < 0) this.x += width;
      while (this.y < 0) this.y += height;
      while (this.x >= width) this.x -= width;
      while (this.y >= height) this.y -= height;
    }
  }

  rotate(rate, delta) {
    // Rotate based on elapsed time
    this.rotation += rate * (delta / 1000);
  }

  thrust(accel, delta) {
    // Change velocity in the direction the ship faces
    const amt = accel * (delta / 1000);

    this.dx += amt * sin(this.rotation);
    this.dy -= amt * cos(this.rotation);
  }
}