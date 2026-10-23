
/** Organizer class for user input and applying it against the magpie. */
class Inputs {
  /** Forward thrust */
  static THRUST = 60;

  /** Reverse thrust */
  static REVERSE_THRUST = 40;

  /** Turning speed */
  static TURN_RATE = 2.4;

  magpie;

  constructor(magpie) {
    this.magpie = magpie;
  }

  handleKeyDown(delta) {
    // W moves the ship forward
    if (keyIsDown("w")) {
      this.magpie.physics.thrust(Inputs.THRUST, delta);
    }

    // S moves the ship backward
    if (keyIsDown("s")) {
      this.magpie.physics.thrust(-Inputs.REVERSE_THRUST, delta);
    }

    // A turns the ship left
    if (keyIsDown("a")) {
      this.magpie.physics.rotate(-Inputs.TURN_RATE, delta);
    }

    // D turns the ship right
    if (keyIsDown("d")) {
      this.magpie.physics.rotate(Inputs.TURN_RATE, delta);
    }

    // Space turns the tractor beam on and off
    if (keyIsDown(" ")) {
      this.magpie.enableBeam(true);
    } else {
      this.magpie.enableBeam(false);
    }
  }
}

/** Keys that normally scroll the browser */
const SCROLL_KEYS = [
  " ",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight"
];

function keyPressed() {
  if (game && (key === "~" || key === "`")) {
    game.debug = !game.debug;
  }

  if (SCROLL_KEYS.includes(key)) {
    return false;
  }
}