class Enemy {
    constructor(x, y) {
        this.p1 = createVector(x, y);
        this.p2 = createVector(this.p1.x, this.p1.y + .4);
        this.speed = .25;
        this.index = 0;
        this.frameCounter = 0;
        this.spritesheet;
    }

    show(positionX, positionY, sheet) {
        this.moveTowards(positionX, positionY, sheet);
    }

    animate() {
        this.index = Number.isInteger(this.frameCounter) ? this.frameCounter : floor(this.frameCounter);
        this.frameCounter += this.speed;
    }

    moveTowards(positionX, positionY, sheet) {
        const front = [sheet[0], sheet[5], sheet[10]];
        image(front[this.index % front.length], positionX, positionY);
    }

    hit() {
        const attack = [this.spritesheet[15], this.spritesheet[20], this.spritesheet[25], this.spritesheet[30]];
        image(attack[this.index % attack.length], this.p1.x, this.p1.y);
    }

    setSpritesheet(spritesheet) {
        this.spritesheet = spritesheet;
    }
}