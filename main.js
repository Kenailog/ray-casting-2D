let walls = [];
let source;
let customWallPointX1 = null;
let customWallPointY1 = null;
let customWallPointX2 = null;
let customWallPointY2 = null;

function setup() {
    createCanvas(displayWidth, displayHeight);
    textSize(22);
    // for (let index = 0; index < 4; index++) {
    //     walls.push(new Wall(random(width), random(height), random(width), random(height)));
    // }

    // walls.push(new Wall(0, 0, width, 0));
    // walls.push(new Wall(0, height, width, height));
    // walls.push(new Wall(0, 0, 0, height));
    // walls.push(new Wall(width, 0, width, height));

    source = new Source(10, 10);
}

function draw() {
    background(0);
    fill(255, 255, 255);
    text('Points of collision: ' + source.collidingPoints, 10, 40);
    text('Rays casted: ' + source.rays.length, 10, 80);
    text('mouse click -> mouse click to draw line', 10, 120);
    text('use up & down arrows to ajust number of rays casted', 10, 160);
    walls.forEach(element => {
        element.show();
    });
    source.lookFor(walls);
    source.show();
    source.update(mouseX, mouseY);
    if (customWallPointX1 && customWallPointY1) {
        stroke(255);
        line(customWallPointX1, customWallPointY1, mouseX, mouseY);
    }
}

function mouseClicked() {
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
    if (keyCode === UP_ARROW) {
        source.setRays(source.rays.length + 50);
    } else if (keyCode === DOWN_ARROW) {
        source.setRays(source.rays.length - 50);
    }
}