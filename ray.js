class Ray {
    constructor(position, angle) {
        this.position = position;
        this.setAngle(angle);
    }

    setDirection(x, y) {
        this.direction.x = x - this.direction.x;
        this.direction.y = y - this.direction.y;
        this.direction.normalize();
    }

    setAngle(angle) {
        this.direction = p5.Vector.fromAngle(angle);
    }

    show() {
        stroke(255);
        line(this.position.x, this.position.y, this.direction.x, this.direction.y);
    }

    castRay(wall) {
        const x1 = wall.p1.x;
        const y1 = wall.p1.y;
        const x2 = wall.p2.x;
        const y2 = wall.p2.y;
        const x3 = this.position.x;
        const y3 = this.position.y;
        const x4 = x3 + this.direction.x;
        const y4 = y3 + this.direction.y;

        const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

        if (denominator == 0) {
            return;
        }

        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator;

        if (t >= 0 && t <= 1 && u >= 0) {
            const point = createVector(x1 + t * (x2 - x1), y1 + t * (y2 - y1));
            return point;
        } else {
            return;
        }
    }
}