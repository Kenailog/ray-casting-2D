class Enemy {
    constructor(x, y, spritesheet) {
        this.position = createVector(x, y);
        this.speed = .15;
        this.index = 0;
        this.frameCounter = 0;
        this.spritesheet = spritesheet;
        this.distance = 0;

        this.front = [this.spritesheet[0], this.spritesheet[5], this.spritesheet[10]];
        this.attack = [this.spritesheet[15], this.spritesheet[20], this.spritesheet[25], this.spritesheet[30]];
        this.dead = [this.spritesheet[16], this.spritesheet[17], this.spritesheet[18], this.spritesheet[19], this.spritesheet[20], this.spritesheet[21], this.spritesheet[22], this.spritesheet[23], this.spritesheet[24], this.spritesheet[25], this.spritesheet[26]];
    }

    show(positionX, positionY) {
        // this.moveTowards(positionX, positionY);
        this.playDeath(positionX, positionY);
    }

    animate() {
        this.index = Number.isInteger(this.frameCounter) ? this.frameCounter : floor(this.frameCounter);
        this.frameCounter += this.speed;
    }

    playMoveTowards(positionX, positionY) {
        image(this.front[this.index % this.front.length], positionX, positionY);
    }

    playHit(positionX, positionY) {
        image(this.attack[this.index % this.attack.length], positionX, positionY);
    }

    playDeath(positionX, positionY) {
        image(this.dead[this.index % this.dead.length], positionX, positionY);
    }

    setSpritesheet(spritesheet) {
        this.spritesheet = spritesheet;
    }

    showOnMinimap() {
        stroke(255, 0, 0);
        strokeWeight(5);
        point(this.position.x, this.position.y);
        strokeWeight(0);
        stroke(255);
    }
}