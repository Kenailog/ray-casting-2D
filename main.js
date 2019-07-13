const size = 14; // font size
let fovSlider; // change field of view
let raysSlider; // change number of casted rays
let fov; // field of view
let lineStrokeWeight = 1; // lines thickness
let walls = []; // array holding all walls in scene
let source; // player
let drawMode; // enable/disable draw mode
let customWallPointX1; // point holding point used in draw mode
let customWallPointY1;
let customWallPointX2;
let customWallPointY2;
let val = 0.0; // used for random location when loading first walls to scene

let scene3D; // array for rays, used in rendering 3D view
let spritesDistances;
let minimapWidth;
let minimapHeight;
let sceneWidth;
let sceneHeight;

let numberOfRectInFloor; // number of rectangles in floor

let rectWidth;
let rectHeight;
let rectBrightness;

let gunSpriteSheet; // gun sprite sheet
let gunAnimation = []; // array holding each frame from gun sprite sheet
let isFiring = false; // used to check firing state for proper displaying frames 
let fireFrameCounter; // controls which frame should be used in a particular draw function (loop) iteration

let enemySpriteSheet; // enemy sprite sheet
let enemyAnimation = []; // holds frames where enemy is oriented front your position

let enemies = []; // array holding enemies

let soundFire; // holds fire sound

function preload() {
    gunSpriteSheet = loadImage('assets/gunSheet.png');
    enemySpriteSheet = loadImage('assets/Imp-from-Doom-Spritesheet.png');
    soundFire = loadSound('assets/dsshotgn.wav');
}

function setup() {
    /*
     *  add frames from sprite sheet to array
     */
    gunAnimation.push(gunSpriteSheet.get(0, 0, 100, 154));
    gunAnimation.push(gunSpriteSheet.get(100, 0, 80, 154));
    gunAnimation.push(gunSpriteSheet.get(180, 0, 90, 154));
    gunAnimation.push(gunSpriteSheet.get(270, 0, 72, 154));
    gunAnimation.push(gunSpriteSheet.get(342, 0, 90, 154));
    gunAnimation.push(gunSpriteSheet.get(430, 0, 558 - 430, 154));
    gunAnimation.push(gunSpriteSheet.get(558, 0, 688 - 558, 154));
    gunAnimation.push(gunSpriteSheet.get(688, 0, 807 - 688, 154));
    gunAnimation.push(gunSpriteSheet.get(807, 0, 926 - 807, 154));

    /*
     *  scales each image in sprite sheet
     */
    gunAnimation.forEach(frame => {
        frame.resize(0, 180);
    })

    enemyAnimation.push(enemySpriteSheet.get(0, 0, 43, 60)); // front
    enemyAnimation.push(enemySpriteSheet.get(40, 0, 50, 60)); // left front
    enemyAnimation.push(enemySpriteSheet.get(90, 0, 40, 60)); // left
    enemyAnimation.push(enemySpriteSheet.get(130, 0, 30, 60)); // left back 
    enemyAnimation.push(enemySpriteSheet.get(170, 0, 40, 60)); // back
    enemyAnimation.push(enemySpriteSheet.get(210, 0, 43, 60)); // front
    enemyAnimation.push(enemySpriteSheet.get(260, 0, 40, 60)); // left front
    enemyAnimation.push(enemySpriteSheet.get(300, 0, 40, 60)); // left
    enemyAnimation.push(enemySpriteSheet.get(340, 0, 40, 60)); // left back
    enemyAnimation.push(enemySpriteSheet.get(380, 0, 35, 60)); // back
    enemyAnimation.push(enemySpriteSheet.get(415, 0, 43, 60)); // front
    enemyAnimation.push(enemySpriteSheet.get(460, 0, 40, 60));
    enemyAnimation.push(enemySpriteSheet.get(0, 60, 30, 60));
    enemyAnimation.push(enemySpriteSheet.get(30, 60, 40, 60));
    enemyAnimation.push(enemySpriteSheet.get(70, 60, 40, 60));
    enemyAnimation.push(enemySpriteSheet.get(110, 60, 40, 60)); // front
    // enemyAnimation.push(enemySpriteSheet.get(155, 60, 45, 60));
    // enemyAnimation.push(enemySpriteSheet.get(210, 70, 40, 50));
    // enemyAnimation.push(enemySpriteSheet.get(260, 70, 30, 50));
    // enemyAnimation.push(enemySpriteSheet.get(290, 60, 35, 50));
    enemyAnimation.push(enemySpriteSheet.get(330, 70, 50, 60)); // front
    // enemyAnimation.push(enemySpriteSheet.get(380, 70, 30, 60));
    // enemyAnimation.push(enemySpriteSheet.get(410, 70, 35, 50));
    // enemyAnimation.push(enemySpriteSheet.get(455, 70, 35, 50));
    // enemyAnimation.push(enemySpriteSheet.get(0, 130, 40, 50));
    enemyAnimation.push(enemySpriteSheet.get(40, 120, 50, 60)); // front
    // enemyAnimation.push(enemySpriteSheet.get(100, 120, 45, 60));
    // enemyAnimation.push(enemySpriteSheet.get(150, 130, 50, 50));
    // enemyAnimation.push(enemySpriteSheet.get(200, 130, 45, 50));
    // enemyAnimation.push(enemySpriteSheet.get(250, 130, 4535, 50));
    enemyAnimation.push(enemySpriteSheet.get(290, 130, 40, 60)); // front

    enemyAnimation.push(enemySpriteSheet.get(130, 260, 50, 70)); // death
    enemyAnimation.push(enemySpriteSheet.get(180, 260, 60, 70));
    enemyAnimation.push(enemySpriteSheet.get(240, 260, 60, 70));
    enemyAnimation.push(enemySpriteSheet.get(300, 270, 65, 60));
    enemyAnimation.push(enemySpriteSheet.get(365, 270, 60, 55));
    enemyAnimation.push(enemySpriteSheet.get(425, 270, 65, 55));
    enemyAnimation.push(enemySpriteSheet.get(0, 325, 70, 47));
    enemyAnimation.push(enemySpriteSheet.get(70, 325, 60, 47));


    /*
     *  sets frame rate
     */
    frameRate(60);

    /*
     *  sets scene size
     */
    sceneWidth = windowWidth * .85;
    sceneHeight = windowHeight;

    /*
     *  sets minimap size
     */
    minimapWidth = sceneWidth * .2;
    minimapHeight = sceneHeight * .3;

    /*
     *  creates canvas with given values
     */
    createCanvas(displayWidth - 10, displayHeight - 150);

    /*
     *  sets size of text
     */
    textSize(size);

    /*
     *  creates instance of source object and assings it to variable
     */
    source = new Source(10, 10, minimapWidth / 2, minimapHeight / 2);

    /*
     *  creates sliders for fov and rays at position
     */
    fovSlider = createSlider(0, 360, 60);
    fovSlider.position(80, minimapHeight + 55);
    fovSlider.input(() => {
        fov = fovSlider.value();
        source.setFov(fov);
    });

    raysSlider = createSlider(0, 500, 120);
    raysSlider.position(80, minimapHeight + 85);
    raysSlider.input(() => {
        rays = raysSlider.value();
        source.setRays(rays);
    });

    /*
     *  loads random rectangles to scene 
     */
    // for (let index = 0; index < 10; index++) {
    //     const rect = new Rectangle(noise(val) * minimapWidth, noise(val + .3) * minimapHeight, noise(val - .2) * minimapWidth, noise(val + .5) * minimapHeight);
    //     val += .9;
    // }

    /*
     *  loads walls to each side of scene
     */
    walls.push(new Wall(0, 0, minimapWidth, 0));
    walls.push(new Wall(0, minimapHeight, minimapWidth, minimapHeight));
    walls.push(new Wall(0, 0, 0, minimapHeight));
    walls.push(new Wall(minimapWidth, 0, minimapWidth, minimapHeight));

    /*
     *  sets draw mode to off
     */
    drawMode = false;

    enemies.push(new Enemy(minimapWidth / 1.5, minimapHeight / 2, enemyAnimation));
    enemies.push(new Enemy(minimapWidth / 2, minimapHeight / 3, enemyAnimation));
}

/*
 *  main loop
 */
function draw() {
    if (keyIsDown(LEFT_ARROW)) {
        source.rotate(-.05);
    } else if (keyIsDown(RIGHT_ARROW)) {
        source.rotate(.05);
    }
    if (keyIsDown(UP_ARROW)) {
        source.move(.5);
    } else if (keyIsDown(DOWN_ARROW)) {
        source.move(-.5);
    }

    background(0);

    // sky
    showSky();

    // floor
    showFloor();

    source.updateSpritesPosition(enemies);
    spritesDistances = source.getDistancesToSprites();

    assignDistancesToSprites();
    sortSpritesDistancesDesc();
    sortSpritesByDistance();

    // 3D view
    push();
    showWalls();
    showEnemies();
    showWeapon();
    pop();

    source.preventColliding(walls);
    walls.forEach(wall => wall.show());
    enemies.forEach(enemy => {
        enemy.animate();
        strokeWeight(1);
        line(source.rays[source.rays.length - 1].position.x, source.rays[source.rays.length - 1].position.y, enemy.position.x, enemy.position.y);
        strokeWeight(0);
        enemy.showOnMinimap();
    });

    // strokeWeight(1);
    // line(p5.Vector.fromAngle(source.spritesRays[0].endPoint.heading()).x * 100, p5.Vector.fromAngle(source.spritesRays[0].endPoint.heading()).y * 100, source.position.x, source.position.y);
    // line(p5.Vector.fromAngle(source.rays[59].direction.heading()).x * 100, p5.Vector.fromAngle(source.rays[59].direction.heading()).y * 100, source.position.x, source.position.y);
    // strokeWeight(0);

    // enemies[0].position.add(createVector(0, cos(frameCount / 40)));
    // enemies[1].position.add(createVector(cos(frameCount / 40)), 0);

    source.show();

    showTextInfo();

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
        case 32:
            if (!isFiring) {
                isFiring = true;
                soundFire.play();
            }
            break;
    }
}

function showWalls() {
    scene3D = source.lookFor(walls); // assignment prevents flickering when changing number of rays, which occurs when iterating directly
    rectWidth = sceneWidth / scene3D.length;
    translate(minimapWidth, 0);
    let i = 0; // for rectangles
    scene3D.forEach(distance => {
        distance *= 2;
        // rectBrightness = (1 / distance ** 2) * source.fov * 1500;
        // rectBrightness = constrain(rectBrightness, 15, 140);
        rectBrightness = map(distance, 0, max(scene3D) * 2, 200, 30);
        rectHeight = (1 / distance) * source.fov * sceneHeight;
        noStroke();
        rectMode(CENTER);
        fill(rectBrightness);
        rect(i++ * rectWidth, sceneHeight / 2, rectWidth + 1, rectHeight);
    });
}

function sortSpritesDistancesDesc() {
    spritesDistances.sort((el1, el2) => el2 - el1);
}

function assignDistancesToSprites() {
    let index = 0;
    enemies.forEach(enemy => enemy.distance = spritesDistances[index++]);
}

function sortSpritesByDistance() {
    enemies.sort((el1, el2) => el2.distance - el1.distance);
}

function showEnemies() {
    let spritesDistancesIndex = 0;
    enemies.forEach(enemy => {
        spritesDistances[spritesDistancesIndex] *= 2;
        push();
        if (source.canSee(enemy, walls)) {
            translate(map(source.getAngleToSprite(enemy), radians(0), radians(source.fov), sceneWidth, 0), sceneHeight / 2);
            imageMode(CENTER);
            let scaleValue = ((1 / spritesDistances[spritesDistancesIndex]) * source.fov * sceneHeight) / 100;
            scaleValue = constrain(scaleValue, 1, 13);
            scale(scaleValue);
            enemy.show(0, 20);
        }
        spritesDistancesIndex++;
        pop();
    });
}

function showWeapon() {
    if (!isFiring) {
        fireFrameCounter = 1;
        image(gunAnimation[0], sceneWidth / 2 - gunAnimation[0].width / 2, sceneHeight - gunAnimation[0].height - 8); // gun
    } else {
        let index = Number.isInteger(fireFrameCounter) ? fireFrameCounter : floor(fireFrameCounter);
        image(gunAnimation[index], sceneWidth / 2 - gunAnimation[index].width / 2, sceneHeight - gunAnimation[index].height - 8);
        fireFrameCounter >= gunAnimation.length - 1 ? isFiring = false : fireFrameCounter += .2;
    }
}

function showFloor() {
    numberOfRectInFloor = (height / 2) / 5;
    push();
    translate(minimapWidth, height / 2);
    for (let index = 0; index < numberOfRectInFloor; index++) {
        noStroke();
        fill(index - 10);
        rect(0, 10 + 5 * index, sceneWidth, 5);
    }
    pop();
}

function showSky() {
    push();
    translate(minimapWidth, 0);
    for (let index = 0; index < numberOfRectInFloor; index++) {
        noStroke();
        // fill(sqrt(index) * 15, sqrt(index) * 15, 0);
        fill(255, 255, 0, index * 2);
        rect(0, 5 * index, sceneWidth, 5);
    }
    pop();
}

function showTextInfo() {
    push();
    translate(0, minimapHeight);
    text('mouse click -> mouse click to draw', 10, 5 + size);
    text('use arrows to move', 10, 30 + size);
    text('ctrl to toogle draw mode: '.concat(drawMode ? "on" : "off"), 10, 115 + size);
    text('fov: ' + source.fov, 10, 55 + size);
    text('rays: ' + source.rays.length, 10, 85 + size);
    text('points of collision: ' + source.collidingPoints, 10, 145 + size);
    text('FPS: ' + round(frameRate()), 10, 175 + size);
    text('angle: ' + round(degrees(source.getAngleToSprite(enemies[0]))), 10, 200 + size);
    text('distance: ' + round(spritesDistances[0]), 10, 230 + size);
    pop();
}