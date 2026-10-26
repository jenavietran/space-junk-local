
class Game {
  static DEFAULT_NUM_LIVES = 3;
  static JUNK_CATCH_TIME_MS = 500;
  static JUNK_DROPOFF_TIME_MS = 1000;
  static SCORE_DROPOFF = 100;
  static LEVEL = { name: "Training", junk: 5, time: 120000 };

  lives;
  level;
  magpie;
  mothership;
  inputs;
  debug;
  score;
  paused;

  constructor() {
    this.lives = Game.DEFAULT_NUM_LIVES;
    this.level = new Level(Game.LEVEL);

    const padW = width / 4;
    const padH = height / 4;

    this.magpie = new Magpie();
    this.magpie.physics.x = random(padW, padW * 3);
    this.magpie.physics.y = random(padH, padH * 3);
    this.magpie.physics.rotation = random(0, 2 * Math.PI);

    this.mothership = new Mothership();
    this.mothership.physics.x = random(padW, padW * 3);
    this.mothership.physics.y = random(padH, padH * 3);
    this.mothership.physics.rotation = random(0, 2 * Math.PI);
    this.mothership.physics.dx = random(-12, 12);
    this.mothership.physics.dy = random(-12, 12);

    this.inputs = new Inputs(this.magpie);
    this.debug = false;
    this.score = 0;
    this.paused = false;
  }

  move(delta) {
    this.inputs.handleKeyDown(delta);
    this.magpie.move(delta);
    this.mothership.move(delta);

    this.level.move(delta, {
      countTime: !this.isLevelComplete()
    });

    const junk = this.resolveBeam(delta);

    if (junk) {
      this.level.removeJunk(junk);
      this.magpie.captureJunk(junk);
      this.magpie.enableBeam(false);
    }
  if (this.resolveDropoff(delta)) {
  this.updateScore("dropoff");
  this.magpie.capturedJunk = null;
    }
  }

  resolveBeam(delta) {
    let best = null;

    for (let junk of this.level.junk) {
      if (this.magpie.beamContains(junk.physics)) {
        junk.beamTime += delta;
      } else {
        junk.beamTime = Math.max(0, junk.beamTime - delta);
      }

      if (junk.beamTime > Game.JUNK_CATCH_TIME_MS) {
        if (best === null || junk.beamTime > best.beamTime) {
          best = junk;
        }
      }
    }

    return best;
  }

  resolveDropoff(delta) {
  if (!this.magpie.capturedJunk) {
  return false;
    }
    const inside = this.mothership.pickupContains(
  this.magpie.physics
    );

    if (inside) {
  this.magpie.capturedJunk.dropoffTime += delta;
} else {
  this.magpie.capturedJunk.dropoffTime = Math.max(
    0,
    this.magpie.capturedJunk.dropoffTime - delta
  );
}
if (this.magpie.capturedJunk.dropoffTime >= Game.JUNK_DROPOFF_TIME_MS) {
  return true;
}

return false;
  }

  draw() {
    this.level.draw(this.score, this.lives);
    this.mothership.draw();
    this.magpie.draw();

    if (this.paused) {
      Game.drawMessage("Paused");
    } else if (this.isLevelComplete()) {
      Game.drawMessage("All clear!");
    }
  }

  static drawMessage(message) {
    push();
    noStroke();
    fill("#000000a0");
    rect(0, 0, width, height);

    fill("#ffffff");
    textAlign(CENTER, CENTER);
    textSize(64);
    text(message, width / 2, height / 2);
    pop();
  }

  updateScore(reason) {
  if (reason === "dropoff") {
    this.score += Game.SCORE_DROPOFF;
  }
}

  isLevelComplete() {
    return this.level.junk.length === 0 &&
           this.magpie.capturedJunk === null;
  }
}