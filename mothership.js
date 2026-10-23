
class Mothership {
  static WIDTH = 50;
  static HEIGHT = 20;
  static PICKUP_DIAMETER = Mothership.WIDTH * 1.2;
  static CORNER_RADIUS = 8;
  static NUM_PORTHOLES = 4;
  static PORTHOLE_DIAMETER = 6;

  physics;

  constructor() {
    this.physics = new Physics();
  }

  draw() {
    push();
    drawEverywhere({
      offset: this.physics,
      drawFn: () => {
        Mothership.drawMothership({
          rotation: this.physics.rotation
        });

        if (game.debug) {
          this.physics.draw();
          noFill();
          stroke("#fff");
          circle(0, 0, Mothership.PICKUP_DIAMETER);
        }
      }
    });
    pop();
  }

  static drawMothership({ rotation }) {
    push();
    rotate(rotation);
    rectMode(CENTER);

    // Dark pink mothership body
    fill(215, 85, 145);
    stroke(130, 45, 95);
    strokeWeight(1);

    rect(
      0, 0,
      Mothership.WIDTH,
      Mothership.HEIGHT,
      Mothership.CORNER_RADIUS
    );

    // Light blue circular windows
    noStroke();
    fill(165, 225, 255);

    for (let i = 0; i < Mothership.NUM_PORTHOLES; i++) {
      let spacing =
        Mothership.WIDTH / (Mothership.NUM_PORTHOLES + 1);

      let x =
        -Mothership.WIDTH / 2 + spacing * (i + 1);

      circle( x, 0, Mothership.PORTHOLE_DIAMETER );
    }

    pop();
  }

  pickupContains({ x, y }) {
  const distance = dist(
    x, y,
    this.physics.x,
    this.physics.y
  );

  return distance <= Mothership.PICKUP_DIAMETER / 2;
}

  move(delta) {
    this.physics.move(delta, { constrain: true });
  }
}