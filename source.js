class Source {
    constructor(radiusX, radiusY, positionX, positionY) {
        this.radius = createVector(radiusX, radiusY);
        this.position = createVector(positionX, positionY);
        this.rotation = 0;
        this.velocity = 0;
        this.rays = [];
        this.fov = 60;
        this.collidingPoints = 0;
        for (let index = -this.fov / 2; index < this.fov / 2; index += .5) {
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
        this.velocity = p5.Vector.fromAngle(this.rotation).setMag(direction);
        this.position.add(this.velocity);
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

    lookFor(array) {
        let distances = [];
        this.collidingPoints = 0;
        this.rays.forEach(ray => {
            let closestPoint = null;
            ray.distance = Infinity;
            array.forEach(item => {
                const pointAndDistance = ray.castRay(item);
                if (pointAndDistance) {
                    const pointOfCollision = pointAndDistance[0];
                    let tmp_distance = pointAndDistance[1];
                    const angle = ray.direction.heading() - this.rotation;
                    tmp_distance *= cos(angle);
                    if (tmp_distance < ray.distance) {
                        ray.distance = tmp_distance;
                        closestPoint = pointOfCollision;
                    }
                }
            });
            if (closestPoint && array[0] instanceof Wall) {
                this.showRayToPoint(closestPoint);
                this.collidingPoints++;
            }
            distances.push(ray.distance);
        });
        return distances;
    }

    preventColliding(array) {
        const xOffset = .5;
        const yOffset = .5;

        const yWallOffset = .5;
        const xWallOffset = .5;
        for (let wall of array) {
            if (wall.p1.x < wall.p2.x) {
                if (this.position.x >= wall.p1.x && this.position.x <= wall.p2.x) {
                    if (this.position.y >= wall.p1.y && this.position.y <= wall.p1.y + yWallOffset) {
                        this.position.y += yOffset;
                    } else if (this.position.y <= wall.p1.y && this.position.y >= wall.p1.y - yWallOffset) {
                        this.position.y -= yOffset;
                    }
                }
            } else if (wall.p1.x > wall.p2.x) {
                if (this.position.x <= wall.p1.x && this.position.x >= wall.p2.x) {
                    if (this.position.y >= wall.p1.y && this.position.y <= wall.p1.y + yWallOffset) {
                        this.position.y += yOffset;
                    } else if (this.position.y <= wall.p1.y && this.position.y >= wall.p1.y - yWallOffset) {
                        this.position.y -= yOffset;
                    }
                }
            }
            if (wall.p1.y < wall.p2.y) {
                if (this.position.y >= wall.p1.y && this.position.y <= wall.p2.y) {
                    if (this.position.x >= wall.p1.x && this.position.x <= wall.p1.x + xWallOffset) {
                        this.position.x += xOffset;
                    } else if (this.position.x <= wall.p1.x && this.position.x >= wall.p1.x - xWallOffset) {
                        this.position.x -= xOffset;
                    }
                }
            } else if (wall.p1.y > wall.p2.y) {
                if (this.position.y <= wall.p1.y && this.position.y >= wall.p2.y) {
                    if (this.position.x >= wall.p1.x && this.position.x <= wall.p1.x + xWallOffset) {
                        this.position.x += xOffset;
                    } else if (this.position.x <= wall.p1.x && this.position.x >= wall.p1.x - xWallOffset) {
                        this.position.x -= xOffset;
                    }
                }
            }
        }
    }

    showRayToPoint(point) {
        stroke(255, 90);
        strokeWeight(lineStrokeWeight);
        line(this.position.x, this.position.y, point.x, point.y);
        strokeWeight(1);
    }
}