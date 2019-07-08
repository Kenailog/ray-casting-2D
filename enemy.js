class Enemy {
    constructor(x, y) {
        this.position = createVector(x, y);
        this.speed = .25;
        this.index = 0;
        this.frameCounter = 0;
        this.spritesheet;
    }

    show(positionX, positionY) {
        this.moveTowards(positionX, positionY);
    }

    animate() {
        this.index = Number.isInteger(this.frameCounter) ? this.frameCounter : floor(this.frameCounter);
        this.frameCounter += this.speed;
    }

    moveTowards(positionX, positionY) {
        const front = [this.spritesheet[0], this.spritesheet[5], this.spritesheet[10]];
        image(front[this.index % front.length], positionX, positionY);
    }

    hit() {
        const attack = [this.spritesheet[15], this.spritesheet[20], this.spritesheet[25], this.spritesheet[30]];
        image(attack[this.index % attack.length], this.position.x, this.position.y);
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