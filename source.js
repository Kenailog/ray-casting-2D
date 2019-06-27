class Source {
    constructor(radiusX, radiusY) {
        this.radius = createVector(radiusX, radiusY);
        this.position = createVector(width / 2, height / 2);
        this.rays = [];
        this.fov = 30;
        this.rotation = 0;
        this.collidingPoints = 0;
        for (let index = - this.fov / 2; index < this.fov / 2; index += .25) {
            this.rays.push(new Ray(this.position, radians(index)));
        }
        this.factor = this.fov / this.rays.length;
    }

    setFov(fov) {
        this.fov = fov;
        this.updateRays(this.rays.length);
    }

    setRays(rays) {
        this.updateRays(rays);
    }

    rotate(rotation) {
        this.rotation += rotation;
        let index = 0;
        for (let i = - this.fov / 2; i < this.fov / 2; i += this.factor) {
            this.rays[index].setAngle(radians(i) + this.rotation);
            index++;
        }
    }

    move(direction) {
        const velocity = p5.Vector.fromAngle(this.rotation);
        velocity.setMag(direction);
        this.position.add(velocity);
    }

    updateRays(rays) {
        this.rays.length = 0;
        this.factor = this.fov / rays;
        for (let index = - this.fov / 2; index < this.fov / 2; index += this.factor) {
            this.rays.push(new Ray(this.position, radians(index) + this.rotation));
        }
    }

    show() {
        fill(255);
        ellipse(this.position.x, this.position.y, this.radius.x, this.radius.y);
    }

    lookFor(walls) {
        let collidingPoints = 0;

        this.rays.forEach(ray => {
            let closestPoint = null;
            let track = Infinity;
            walls.forEach(wall => {
                const pointOfCollision = ray.castRay(wall);
                if (pointOfCollision) {
                    const distance = this.position.dist(pointOfCollision);
                    if (distance < track) {
                        track = distance;
                        closestPoint = pointOfCollision;
                    }
                }
            });
            if (closestPoint) {
                stroke(255, 60);
                strokeWeight(lineStrokeWeight);
                line(this.position.x, this.position.y, closestPoint.x, closestPoint.y);
                collidingPoints++;
                strokeWeight(1);
            }
        });
        this.collidingPoints = collidingPoints;
    }

    // update(x, y) {
    //     this.position.set(x, y);
    // }
}