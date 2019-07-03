class Source {
    constructor(radiusX, radiusY, positionX, positionY) {
        this.radius = createVector(radiusX, radiusY);
        this.position = createVector(positionX, positionY);
        this.rotation = 0;
        this.velocity = 0;
        this.rays = [];
        this.fov = 60;
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

    lookFor(walls) {
        this.collidingPoints = 0;
        this.rays.forEach(ray => {
            let closestPoint = null;
            ray.distance = Infinity;
            walls.forEach(wall => {
                const pointAndDistance = ray.castRay(wall);
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
            if (closestPoint) {
                this.showRayToPoint(closestPoint);
                this.collidingPoints++;
            }
        });
        return this.rays;
    }

    preventColliding(walls) {
        const xOffset = 1;
        const yOffset = 1;

        const yWallOffset = 1;
        const xWallOffset = 1;
        for (let wall of walls) {
            if (wall.p1.x < wall.p2.x) {
                if (this.position.x >= wall.p1.x - xWallOffset && this.position.x <= wall.p2.x + xWallOffset) {
                    if (this.position.y >= wall.p1.y && this.position.y <= wall.p1.y + yWallOffset) {
                        this.position.y += yOffset;
                        break;
                    } else if (this.position.y <= wall.p1.y && this.position.y >= wall.p1.y - yWallOffset) {
                        this.position.y -= yOffset;
                        break;
                    }
                }
            } else if (wall.p1.x > wall.p2.x) {
                if (this.position.x <= wall.p1.x + xWallOffset && this.position.x >= wall.p2.x - xWallOffset) {
                    if (this.position.y >= wall.p1.y && this.position.y <= wall.p1.y + yWallOffset) {
                        this.position.y += yOffset;
                        break;
                    } else if (this.position.y <= wall.p1.y && this.position.y >= wall.p1.y - yWallOffset) {
                        this.position.y -= yOffset;
                        break;
                    }
                }
            }
            if (wall.p1.y < wall.p2.y) {
                if (this.position.y >= wall.p1.y - yWallOffset && this.position.y <= wall.p2.y + yWallOffset) {
                    if (this.position.x >= wall.p1.x && this.position.x <= wall.p1.x + xWallOffset) {
                        this.position.x += xOffset;
                        break;
                    } else if (this.position.x <= wall.p1.x && this.position.x >= wall.p1.x - xWallOffset) {
                        this.position.x -= xOffset;
                        break;
                    }
                }
            } else if (wall.p1.y > wall.p2.y) {
                if (this.position.y <= wall.p1.y + yWallOffset && this.position.y >= wall.p2.y - yWallOffset) {
                    if (this.position.x >= wall.p1.x && this.position.x <= wall.p1.x + xWallOffset) {
                        this.position.x += xOffset;
                        break;
                    } else if (this.position.x <= wall.p1.x && this.position.x >= wall.p1.x - xWallOffset) {
                        this.position.x -= xOffset;
                        break;
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