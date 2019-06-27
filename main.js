const size = 16;
let fovSlider;
let raysSlider;
let fov;
let lineStrokeWeight = 1;
let drawMode;
let walls = [];
let source;
let customWallPointX1;
let customWallPointY1;
let customWallPointX2;
let customWallPointY2;

function setup() {
    createCanvas(displayWidth - 10, displayHeight - 150);
    textSize(size);
    fovSlider = createSlider(0, 360, 60);
    fovSlider.position(80, 90);
    fovSlider.input(() => {
        fov = fovSlider.value();
        source.setFov(fov);
    });

    raysSlider = createSlider(0, 500, 60, 4);
    raysSlider.position(80, 120);
    raysSlider.input(() => {
        rays = raysSlider.value();
        source.setRays(rays);
    });

    drawMode = false;

    // for (let index = 0; index < 4; index++) {
    //     walls.push(new Wall(random(width), random(height), random(width), random(height)));
    // }

    walls.push(new Wall(0, 0, width, 0));
    walls.push(new Wall(0, height, width, height));
    walls.push(new Wall(0, 0, 0, height));
    walls.push(new Wall(width, 0, width, height));

    source = new Source(10, 10);
    fov = source.fov;
}

function draw() {
    if (keyIsDown(LEFT_ARROW)) {
        source.rotate(-.03);
    } else if (keyIsDown(RIGHT_ARROW)) {
        source.rotate(.03);
    }
    if (keyIsDown(UP_ARROW)) {
        source.move(1.5);
    } else if (keyIsDown(DOWN_ARROW)) {
        source.move(-1.5);
    }

    background(0);
    fill(255, 255, 255);

    text('mouse click -> mouse click to draw', 10, 5 + size);
    text('use arrows to move', 10, 30 + size);
    text('ctrl to toogle draw mode: '.concat(drawMode ? "on" : "off"), 10, 55 + size);
    text('fov: ' + fov, 10, 90 + size);
    text('rays: ' + source.rays.length, 10, 120 + size);
    text('points of collision: ' + source.collidingPoints, 10, 160 + size);
    text('line stroke weight: ' + lineStrokeWeight, 10, 190 + size);

    walls.forEach(wall => wall.show());
    source.lookFor(walls);
    source.show();
    if (customWallPointX1 && customWallPointY1) {
        stroke(255);
        strokeWeight(lineStrokeWeight + 4);
        // line(customWallPointX1, customWallPointY1, mouseX, mouseY);
        line(customWallPointX1, customWallPointY1, mouseX, customWallPointY1);
        line(mouseX, customWallPointY1, mouseX, mouseY);
        line(mouseX, mouseY, customWallPointX1, mouseY);
        line(customWallPointX1, mouseY, customWallPointX1, customWallPointY1);
        strokeWeight(1);
    }
}

function mouseClicked() {
    if (!drawMode) {
        return;
    }
    if (customWallPointX1 && customWallPointY1) {
        customWallPointX2 = mouseX;
        customWallPointY2 = mouseY;
        const rect = new Rectangle(customWallPointX1, customWallPointY1, customWallPointX2, customWallPointY2);
        customWallPointX1 = null;
        customWallPointY1 = null;
        customWallPointX2 = null;
        customWallPointY2 = null;
    } else {
        customWallPointX1 = mouseX;
        customWallPointY1 = mouseY;
    }
}

function keyPressed() {
    switch (keyCode) {
        case CONTROL:
            drawMode = !drawMode;
            break;
        case 49:
            if (lineStrokeWeight > 1) {
                lineStrokeWeight--;
            }
            break;
        case 50:
            if (lineStrokeWeight < 20) {
                lineStrokeWeight++;
            }
            break;
    }
}