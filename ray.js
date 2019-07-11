class Ray {
    constructor(position, angle) {
        this.position = position;
        this.setAngle(angle);
        this.distance;
        this.endPoint;
    }

    setAngle(angle) {
        this.direction = p5.Vector.fromAngle(angle);
    }

    castRay(object) {
        const x3 = this.position.x;
        const y3 = this.position.y;
        const x4 = x3 + this.direction.x;
        const y4 = y3 + this.direction.y;
        if (object instanceof Wall) {
            const x1 = object.p1.x;
            const y1 = object.p1.y;
            const x2 = object.p2.x;
            const y2 = object.p2.y;

            const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

            if (denominator == 0) {
                return;
            }

            const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
            const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator; // It's also distance
            if (t >= 0 && t <= 1 && u >= 0) {
                this.endPoint = createVector(x1 + t * (x2 - x1), y1 + t * (y2 - y1));
                return [this.endPoint, u]; // returns point and distance
            } else {
                return;
            }
        } else {
            const rx = object.position.x;
            const ry = object.position.y;
            // const result = (x4 - x3) * (ry - y3) - (y4 - y3) * (rx - x3);
            // const isPointOnLine = result < .6 && result > -.6;
            if (this.endPoint) {
                const len = this.position.dist(object.position) + object.position.dist(this.endPoint) - this.position.dist(this.endPoint);
                if (- Number.EPSILON - .001 < len && len < Number.EPSILON + .001) {                    
                    return [createVector(rx, ry), this.position.dist(object.position)];
                } else {
                    return;
                }
            }
        }
    }
}

// distance(a,c) + distance(c,b) == distance(a,b)
