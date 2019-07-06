class Enemy {
    constructor(x, y, sheet) {
        this.position = createVector(x, y);
        this.speed = .25;
        this.index = 0;
        this.frameCounter = 0;
        this.sheet = sheet;
    }

    show() {
        image(this.sheet[this.index % this.sheet.length], this.position.x, this.position.y);
    }

    animate() {
        this.index = Number.isInteger(this.frameCounter) ? this.frameCounter : floor(this.frameCounter);
        this.frameCounter += this.speed;
    }
}