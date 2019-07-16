class Enemy {
    constructor(x, y, spritesheet) {
        this.position = createVector(x, y);
        this.speed = .15;
        this.index = 0;
        this.frameCounter = 0;
        this.spritesheet = spritesheet;
        this.distance;
        this.chaseSpeed = .005;
        this.t = 0;
        this.T = 1000;

        this.front = [this.spritesheet[0], this.spritesheet[5], this.spritesheet[10]];
        this.attack = [this.spritesheet[15], this.spritesheet[20], this.spritesheet[25], this.spritesheet[30]];
        this.dead = [this.spritesheet[16], this.spritesheet[17], this.spritesheet[18], this.spritesheet[19], this.spritesheet[20], this.spritesheet[21], this.spritesheet[22], this.spritesheet[23], this.spritesheet[24], this.spritesheet[25], this.spritesheet[26]];
    }

    show(positionX, positionY) {
        this.playMoveTowards(positionX, positionY);
        // this.playDeath(positionX, positionY);
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

    chase(target) {
        this.position.x += (target.position.x - this.position.x) * this.chaseSpeed;
        this.position.y += (target.position.y - this.position.y) * this.chaseSpeed;
    }

    move(factor) {
        let x = noise(this.t + factor);
        let y = noise(this.T + factor);
        x = round(x) == 0 ? -x : x;
        y = round(y) == 0 ? -y : y;
        x /= 3;
        y /= 3;
        this.position.x += x;
        this.position.y += y;
        this.t += .0001;
        this.T += .0001;
    }
}