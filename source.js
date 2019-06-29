class Source {
    constructor(radiusX, radiusY, positionX, poistionY) {
        this.radius = createVector(radiusX, radiusY);
        this.position = createVector(positionX, poistionY);
        this.rays = [];
        this.fov = 60;
        this.rotation = 0;
        this.collidingPoints = 0;
        for (let index = -this.fov / 2; index < this.fov / 2; index += .25) {
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
        for (let i = -this.fov / 2; i < this.fov / 2; i += this.factor) {
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
        for (let index = -this.fov / 2; index < this.fov / 2; index += this.factor) {
            this.rays.push(new Ray(this.position, radians(index) + this.rotation));
        }
    }

    show() {
        fill(255);
        ellipse(this.position.x, this.position.y, this.radius.x, this.radius.y);
    }

    lookFor(walls) {
        this.collidingPoints = 0;
        this.rays.forEach(ray => {
            let closestPoint = null;
            ray.distance = Infinity;
            walls.forEach(wall => {
                const pointOfCollision = ray.castRay(wall);
                if (pointOfCollision) {
                    let tmp_distance = this.position.dist(pointOfCollision);
                    const angle = ray.direction.heading() - this.rotation;
                    if (!mouseIsPressed) {
                        tmp_distance *= cos(angle);
                    }
                    if (tmp_distance < ray.distance) {
                        ray.distance = tmp_distance;
                        closestPoint = pointOfCollision;
                    }
                }
            });
            if (closestPoint) {
                this.showRayToPoint(closestPoint);
                this.collidingPoints++;
            }
        });
        return this.rays;
    }

    showRayToPoint(point) {
            stroke(255, 90);
            strokeWeight(lineStrokeWeight);
            line(this.position.x, this.position.y, point.x, point.y);
            strokeWeight(1);
        }
        // update(x, y) {
        //     this.position.set(x, y);
        // }
}