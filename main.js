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
let val = 0.0;

let scene3D;
let sceneWidth;
let sceneHeight;

let rectWidth;
let rectHeight;
let rectBrightness;

function setup() {
    frameRate(60);
    sceneWidth = windowWidth / 2;
    sceneHeight = windowHeight;
    createCanvas(displayWidth - 10, displayHeight - 150);
    textSize(size);
    fovSlider = createSlider(0, 360, 60);
    fovSlider.position(80, 60);
    fovSlider.input(() => {
        fov = fovSlider.value();
        source.setFov(fov);
    });

    raysSlider = createSlider(0, 500, 240, 2);
    raysSlider.position(80, 90);
    raysSlider.input(() => {
        rays = raysSlider.value();
        source.setRays(rays);
    });

    drawMode = false;

    for (let index = 0; index < 15; index++) {
        const rect = new Rectangle(noise(val) * sceneWidth, noise(val + .3) * sceneHeight, noise(val - .2) * sceneWidth, noise(val + .5) * sceneHeight);
        val += .9;
    }

    walls.push(new Wall(0, 0, sceneWidth, 0));
    walls.push(new Wall(0, sceneHeight, sceneWidth, sceneHeight));
    walls.push(new Wall(0, 0, 0, sceneHeight));
    walls.push(new Wall(sceneWidth, 0, sceneWidth, sceneHeight));

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

    text('mouse click -> mouse click to draw', 10, 5 + size);
    text('use arrows to move', 10, 30 + size);
    text('ctrl to toogle draw mode: '.concat(drawMode ? "on" : "off"), 290, 5 + size);
    text('fov: ' + fov, 10, 60 + size);
    text('rays: ' + source.rays.length, 10, 90 + size);
    text('points of collision: ' + source.collidingPoints, 290, 30 + size);
    text('1 & 2 to change line stroke weight: ' + lineStrokeWeight, 290, 60 + size);

    rectWidth = sceneWidth / source.rays.length;    
    
    push();
    translate(width / 2, height / 2);

    for (let index = 0; index < 30; index++) {
        noStroke();
        rect(0, 20 + 10 * index, sceneWidth, 20);
    }
    pop();

    push();
    translate(width / 2, 0);
    let i = 0;
    source.rays.forEach(ray => {
        rectBrightness = 255 - ray.distance + 20;
        rectHeight = (1 / ray.distance) * 10000;
        noStroke();
        rectMode(CENTER);
        fill(rectBrightness);
        rect(i++ * rectWidth, sceneHeight / 2, rectWidth + 1, rectHeight);   
    });
    pop();
    
    push();
    translate(0, height / 4);
    source.lookFor(walls);
    walls.forEach(wall => wall.show());
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
    pop();
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
        // const rect = new Rectangle(customWallPointX1, customWallPointY1, customWallPointX2, customWallPointY2);
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