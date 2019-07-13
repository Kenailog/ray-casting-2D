class Source {
    constructor(radiusX, radiusY, positionX, positionY) {
        this.radius = createVector(radiusX, radiusY);
        this.position = createVector(positionX, positionY);
        this.rotation = 0;
        this.velocity = 0;
        this.rays = [];
        this.spritesRays = [];
        this.fov = 60;
        this.collidingPoints = 0;
        for (let index = -this.fov / 2; index < this.fov / 2; index += .5) {
            this.rays.push(new Ray(this.position, radians(index)));
        }
        this.factor = this.fov / this.rays.length;
    }

    updateSpritesPosition(array) {
        this.spritesRays = [];
        for (let index = 0; index < array.length; index++) {
            this.spritesRays.push(new Ray(this.position, array[index].position.heading()));
            this.spritesRays[index].endPoint = array[index].position;
        }
    }

    getDistancesToSprites() {
        let distances = [];
        this.spritesRays.forEach(ray => {
            ray.distance = p5.Vector.dist(ray.position, ray.endPoint);
            // ray.distance *= cos(ray.direction.heading() + this.rotation);
            distances.push(abs(ray.distance));
        });
        return distances;
    }

    getSpriteRayIndex(sprite) {
        for (let i = 0; i < this.spritesRays.length; i++) {
            if (this.spritesRays[i].endPoint == sprite.position) {
                return i;
            }
        }
        return null;
    }

    getAngleToSprite(sprite) {
        const index = this.getSpriteRayIndex(sprite);
        const angle = atan2(this.rays[this.rays.length - 1].endPoint.y - this.position.y,
            this.rays[this.rays.length - 1].endPoint.x - this.position.x) - atan2(this.spritesRays[index].endPoint.y - this.position.y,
                this.spritesRays[index].endPoint.x - this.position.x);
        return angle < 0 ? angle + radians(360) : angle;
    }

    canSee(sprite, obstacles) {
        const ray = this.spritesRays[this.getSpriteRayIndex(sprite)];
        for (let object of obstacles) {
            if (ray.isIntersecting(object)) {
                return false;
            }
        }
        return this.getAngleToSprite(sprite) < radians(this.fov);
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
                    tmp_distance *= cos(ray.direction.heading() - this.rotation);
                    if (tmp_distance < ray.distance) {
                        ray.distance = tmp_distance;
                        closestPoint = pointOfCollision;
                    }
                }
            });
            this.showRayToPoint(closestPoint);
            this.collidingPoints++;
            distances.push(ray.distance);
        });
        return distances;
    }

    preventColliding(array) {
        const xOffset = .5;
        const yOffset = .5;

        const yElementOffset = .5;
        const xElementOffset = .5;
        for (let element of array) {
            if (element.p1.x < element.p2.x) {
                if (this.position.x >= element.p1.x && this.position.x <= element.p2.x) {
                    if (this.position.y >= element.p1.y && this.position.y <= element.p1.y + yElementOffset) {
                        this.position.y += yOffset;
                    } else if (this.position.y <= element.p1.y && this.position.y >= element.p1.y - yElementOffset) {
                        this.position.y -= yOffset;
                    }
                }
            } else if (element.p1.x > element.p2.x) {
                if (this.position.x <= element.p1.x && this.position.x >= element.p2.x) {
                    if (this.position.y >= element.p1.y && this.position.y <= element.p1.y + yElementOffset) {
                        this.position.y += yOffset;
                    } else if (this.position.y <= element.p1.y && this.position.y >= element.p1.y - yElementOffset) {
                        this.position.y -= yOffset;
                    }
                }
            }
            if (element.p1.y < element.p2.y) {
                if (this.position.y >= element.p1.y && this.position.y <= element.p2.y) {
                    if (this.position.x >= element.p1.x && this.position.x <= element.p1.x + xElementOffset) {
                        this.position.x += xOffset;
                    } else if (this.position.x <= element.p1.x && this.position.x >= element.p1.x - xElementOffset) {
                        this.position.x -= xOffset;
                    }
                }
            } else if (element.p1.y > element.p2.y) {
                if (this.position.y <= element.p1.y && this.position.y >= element.p2.y) {
                    if (this.position.x >= element.p1.x && this.position.x <= element.p1.x + xElementOffset) {
                        this.position.x += xOffset;
                    } else if (this.position.x <= element.p1.x && this.position.x >= element.p1.x - xElementOffset) {
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