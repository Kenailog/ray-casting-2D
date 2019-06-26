const size = 16;
let fovSlider;
let raysSlider;
let fov;
let drawMode;
let walls = [];
let source;
let customWallPointX1 = null;
let customWallPointY1 = null;
let customWallPointX2 = null;
let customWallPointY2 = null;

function setup() {
    createCanvas(displayWidth, displayHeight - 130);
    textSize(size);
    fovSlider = createSlider(0, 360, 30);
    fovSlider.position(80, 90);
    fovSlider.input(() => {
        fov = fovSlider.value();
        source.setFov(fov);
    });

    raysSlider = createSlider(0, 1000, 360, 4);
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
        source.rotate(-.05);
    } else if (keyIsDown(RIGHT_ARROW)) {
        source.rotate(.05);
    }
    if (keyIsDown(UP_ARROW)) {
        source.move(2);
    } else if (keyIsDown(DOWN_ARROW)) {
        source.move(-2);
    }

    background(0);
    fill(255, 255, 255);

    text('mouse click -> mouse click to draw line', 10, 5 + size);
    text('use arrows to move', 10, 30 + size);
    text('ctrl to toogle draw mode: '.concat(drawMode ? "on" : "off"), 10, 55 + size);
    text('fov: ' + fov, 10, 90 + size);
    text('rays: ' + source.rays.length, 10, 120 + size);
    text('points of collision: ' + source.collidingPoints, 10, 170 + size);

    walls.forEach(element => {
        element.show();
    });
    source.lookFor(walls);
    source.show();
    // source.update(mouseX, mouseY);
    if (customWallPointX1 && customWallPointY1) {
        stroke(255);
        strokeWeight(10);
        line(customWallPointX1, customWallPointY1, mouseX, mouseY);
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
        walls.push(new Wall(customWallPointX1, customWallPointY1, customWallPointX2, customWallPointY2));
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
    }
}