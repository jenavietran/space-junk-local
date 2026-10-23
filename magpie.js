
class Magpie {
  static DOME_WIDTH = 20;
  static DOME_HEIGHT = 30;
  static PLATFORM_WIDTH = Magpie.DOME_WIDTH + 6;
  static PLATFORM_HEIGHT = 3;
  static BEAM_WIDTH = 50;
  static BEAM_HEIGHT = 60;
  static WINDOW_WIDTH = Magpie.DOME_WIDTH / 4;
  static WINDOW_HEIGHT = Magpie.DOME_HEIGHT / 4;
  static CARGO_Y = 40;

  physics;
  beam;
  capturedJunk;

  constructor() {
    this.physics = new Physics();
    this.beam = false;
    this.capturedJunk = null;
  }

  draw() {
    push();
    drawEverywhere({
      offset: this.physics,
      drawFn: () => {
        Magpie.drawMagpie({
          rotation: this.physics.rotation,
          beam: this.beam
        });

        if (game.debug) {
          this.physics.draw();
        }
      }
    });
    pop();
  }

  captureJunk(junk) {
    this.capturedJunk = junk;
    this.beam = false;
  }

  static drawMagpie({ rotation, beam }) {
    push();
    rotate(rotation);
    rectMode(CENTER);

    // Tractor beam
    if (beam) {
      noStroke();
      fill("#f5f37040");

      triangle(
        0, 0,
        -Magpie.BEAM_WIDTH / 2, Magpie.BEAM_HEIGHT,
        Magpie.BEAM_WIDTH / 2, Magpie.BEAM_HEIGHT
      );
    }

    // Dark pink platform
    fill(190, 55, 115);
    stroke(90, 30, 65);
    strokeWeight(1);

    rect(
      0,
      Magpie.DOME_HEIGHT / 2,
      Magpie.PLATFORM_WIDTH,
      Magpie.PLATFORM_HEIGHT
    );

    // Pink ship body
    fill(255, 125, 180);

    rect(
      0, 0,
      Magpie.DOME_WIDTH,
      Magpie.DOME_HEIGHT,
      6
    );

    // Light blue window
    fill(160, 225, 255);

    rect(
      Magpie.DOME_WIDTH / 2 - Magpie.WINDOW_WIDTH / 2,
      -Magpie.DOME_HEIGHT / 5,
      Magpie.WINDOW_WIDTH,
      Magpie.WINDOW_HEIGHT,
      2
    );

    pop();
  }

  move(delta) {
    this.physics.move(delta, { constrain: true });

    if (this.capturedJunk) {
      push();
      translate(this.physics.x, this.physics.y);
      rotate(this.physics.rotation);

      const cargo = worldToScreen(0, Magpie.CARGO_Y);
      pop();

      this.capturedJunk.physics.x = cargo.x;
      this.capturedJunk.physics.y = cargo.y;
    }
  }

  beamContains({ x, y }) {
    if (!this.beam) {
      return false;
    }

    let inside = false;

    drawEverywhere({
      offset: this.physics,
      drawFn: () => {
        rotate(this.physics.rotation);

        const p = screenToWorld(x, y);

        const halfWidth =
          (p.y / Magpie.BEAM_HEIGHT) *
          (Magpie.BEAM_WIDTH / 2);

        const withinDepth =
          p.y >= 0 && p.y <= Magpie.BEAM_HEIGHT;

        if (withinDepth && Math.abs(p.x) <= halfWidth) {
          inside = true;
        }
      }
    });

    return inside;
  }

  enableBeam(v) {
    if (v === false || this.capturedJunk === null) {
      this.beam = v;
    }
  }
}