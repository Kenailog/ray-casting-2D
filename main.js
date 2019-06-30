const size = 14;
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
let val = 0.0;

let scene3D;
let minimapWidth;
let minimapHeight;
let sceneWidth;
let sceneHeight;

let numberOfRectInFloor;

let rectWidth;
let rectHeight;
let rectBrightness;

function setup() {
    frameRate(60);
    sceneWidth = windowWidth * .7;
    sceneHeight = windowHeight;
    minimapWidth = sceneWidth * .4;
    minimapHeight = sceneHeight / 2;
    createCanvas(displayWidth - 10, displayHeight - 150);
    textSize(size);

    source = new Source(10, 10, width / 7, height * .25);

    fovSlider = createSlider(0, 360, 60);
    fovSlider.position(80, (height / 2) + 55);
    fovSlider.input(() => {
        fov = fovSlider.value();
        source.setFov(fov);
    });

    raysSlider = createSlider(0, 500, 240);
    raysSlider.position(80, (height / 2) + 85);
    raysSlider.input(() => {
        rays = raysSlider.value();
        source.setRays(rays);
    });

    for (let index = 0; index < 10; index++) {
        const rect = new Rectangle(noise(val) * minimapWidth, noise(val + .3) * minimapHeight, noise(val - .2) * minimapWidth, noise(val + .5) * minimapHeight);
        val += .9;
    }

    walls.push(new Wall(0, 0, minimapWidth, 0));
    walls.push(new Wall(0, minimapHeight, minimapWidth, minimapHeight));
    walls.push(new Wall(0, 0, 0, minimapHeight));
    walls.push(new Wall(minimapWidth, 0, minimapWidth, minimapHeight));

    drawMode = false;
}

function draw() {
    if (keyIsDown(LEFT_ARROW)) {
        source.rotate(-.05);
    } else if (keyIsDown(RIGHT_ARROW)) {
        source.rotate(.05);
    }
    if (keyIsDown(UP_ARROW)) {
        source.move(3);
    } else if (keyIsDown(DOWN_ARROW)) {
        source.move(-3);
    }

    background(0);
    fill(255, 255, 255);

    push();
    translate(0, height / 2);
    text('mouse click -> mouse click to draw', 10, 5 + size);
    text('use arrows to move', 10, 30 + size);
    text('ctrl to toogle draw mode: '.concat(drawMode ? "on" : "off"), 10, 115 + size);
    text('fov: ' + source.fov, 10, 55 + size);
    text('rays: ' + source.rays.length, 10, 85 + size);
    text('points of collision: ' + source.collidingPoints, 10, 145 + size);
    text('FPS: ' + round(frameRate()), 10, 175 + size);
    pop();

    // sky
    push();
    translate(width * .3, 0);
    for (let index = 0; index < 100; index++) {
        noStroke();
        // fill(sqrt(index) * 15, sqrt(index) * 15, 0);
        fill(255, 255, 0, index * 2);
        rect(0, 5 * index, sceneWidth, 5);
    }
    pop();

    // floor
    numberOfRectInFloor = (height / 2) / 5;
    push();
    translate(width * .3, height / 2);
    for (let index = 0; index < numberOfRectInFloor; index++) {
        noStroke();
        fill(sqrt(index) * 10);
        rect(0, 10 + 5 * index, sceneWidth, 5);
    }
    pop();


    // 3D view
    scene3D = source.lookFor(walls);
    rectWidth = sceneWidth / scene3D.length;
    push();
    translate(width * .3, 0);
    let i = 0;
    scene3D.forEach(ray => {
        rectBrightness = 255 - ray.distance + 20;
        // rectBrightness = (1 / ray.distance ** 2) * 400000;
        rectHeight = (1 / ray.distance) * source.fov * sceneHeight;
        noStroke();
        rectMode(CENTER);
        fill(rectBrightness);
        rect(i++ * rectWidth, sceneHeight / 2, rectWidth + 1, rectHeight);
    });
    pop();

    walls.forEach(wall => wall.show());
    source.show();
    if (customWallPointX1 && customWallPointY1) {
        stroke(255);
        strokeWeight(lineStrokeWeight + 4);
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
        walls.push(new Wall(customWallPointX1, customWallPointY1, customWallPointX2, customWallPointY1));
        walls.push(new Wall(customWallPointX2, customWallPointY1, customWallPointX2, customWallPointY2));
        walls.push(new Wall(customWallPointX2, customWallPointY2, customWallPointX1, customWallPointY2));
        walls.push(new Wall(customWallPointX1, customWallPointY2, customWallPointX1, customWallPointY1));
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