class Source {
    constructor(radiusX, radiusY) {
        this.radius = createVector(radiusX, radiusY);
        this.position = createVector(width / 2, height / 2);
        this.rays = [];
        this.collidingPoints = 0;
        this.setRays(360);
    }

    setRays(rays) {
        if (rays < 1) {
            return;
        }
        this.rays.length = 0;
        const factor = 360 / rays;
        for (let index = 0; index < 360; index += factor) {
            this.rays.push(new Ray(this.position, radians(index)));
        }
    }

    show() {
        fill(255);
        ellipse(this.position.x, this.position.y, this.radius.x, this.radius.y);
        // this.rays.forEach(element => {
        //     element.show();
        // });
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
                stroke(255, 100);
                line(this.position.x, this.position.y, closestPoint.x, closestPoint.y);
                collidingPoints++;
            }
        });
        this.collidingPoints = collidingPoints;
    }

    update(x, y) {
        this.position.set(x, y);
    }
}