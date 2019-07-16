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

let t = 0;
let T = 1000;

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
    sceneWidth = windowWidth;
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
     *  loads default rectangles to scene 
     */
    // for (let index = 0; index < 5; index++) {
    let rect = new Rectangle(0, 0, minimapWidth / 3, minimapHeight / 3);
    rect = new Rectangle(0, minimapHeight - 30, minimapWidth / 4, minimapHeight / 3 + 70);
    rect = new Rectangle(minimapWidth / 2, 0, minimapWidth / 1.5, minimapHeight / 3);
    rect = new Rectangle(minimapWidth / 1.4, minimapHeight / 1.5, minimapWidth, minimapHeight);
    // val += .9;
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

    for (let index = 0; index < 20; index++) {
        enemies.push(new Enemy(random(minimapWidth), random(minimapHeight), enemyAnimation));
    }
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

    enemies.forEach(enemy => preventColliding(enemy, walls));
    preventColliding(source, walls);
    source.rays.forEach(ray => source.showRayToPoint(ray.endPoint));

    fill(0, 70);
    rect(0, 0, minimapWidth, sceneHeight);

    walls.forEach(wall => wall.show());
    enemies.forEach(enemy => {
        enemy.animate();
        strokeWeight(1);
        if (source.canSee(enemy, walls)) {
            line(source.rays[source.rays.length - 1].position.x, source.rays[source.rays.length - 1].position.y, enemy.position.x, enemy.position.y);
        }
        strokeWeight(0);
        enemy.showOnMinimap();
    });

    // enemies.forEach(enemy => enemy.position.add(createVector(cos(noise(sceneWidth) * frameCount / 2), cos(noise(sceneHeight) * frameCount / 2))));
    for (let i = 0; i < enemies.length; i++) {
        if (enemies[i].distance < 100) {
            enemies[i].position.x += (source.position.x - enemies[i].position.x) * .005;
            enemies[i].position.y += (source.position.y - enemies[i].position.y) * .005;
        } else {
            let x = noise(i + t);
            let y = noise(i + T);
            x = round(x) == 0 ? -x : x;
            y = round(y) == 0 ? -y : y;
            x /= 3;
            y /= 3;
            enemies[i].position.x += x;
            enemies[i].position.y += y;
            t += .0001;
            T += .0001;
        }
    }
    // if (enemies[0].distance < enemies[1].distance) {
    //     enemies[0].position.add(createVector(0, cos(40) / .9));
    //     enemies[1].position.add(createVector(cos(40)) / .9, 0);
    // } else {
    //     enemies[1].position.add(createVector(0, cos(40) / .9));
    //     enemies[0].position.add(createVector(cos(40)) / .9, 0);
    // }

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
    translate(0, 0);
    let i = 0; // for rectangles
    scene3D.forEach(distance => {
        distance *= 2;
        // rectBrightness = (1 / distance ** 2) * source.fov * 1500;
        // rectBrightness = constrain(rectBrightness, 15, 140);
        rectBrightness = map(distance, min(scene3D) * 2, max(scene3D) * 2, 180, 50);
        rectHeight = (1 / distance) * source.fov * sceneHeight;
        noStroke();
        rectMode(CENTER);
        fill(rectBrightness);
        rect(i++ * rectWidth - 1, sceneHeight / 2, rectWidth, rectHeight);
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
            enemy.show(0, 25);
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
    translate(0, height / 2);
    for (let index = 0; index < numberOfRectInFloor; index++) {
        noStroke();
        fill(index - 10);
        rect(0, 10 + 5 * index, sceneWidth, 5);
    }
    pop();
}

function showSky() {
    push();
    translate(0, 0);
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
    let index = 1;
    val = 220;
    text('distances ', 10, 200 + size);
    enemies.forEach(enemy => {
        text('sp ' + index + ' ' + round(spritesDistances[index++ - 1]), 10, val + size);
        text(round(degrees(source.getAngleToSprite(enemy))), 100, val + size);
        val += 20;
    });
    text('angles ', 100, 200 + size);
    pop();
}

function preventColliding(object, obstacles) {
    const xOffset = 2;
    const yOffset = 2;

    const yElementOffset = 2;
    const xElementOffset = 2;
    for (let element of obstacles) {
        if (element.p1.x < element.p2.x) {
            if (object.position.x >= element.p1.x && object.position.x <= element.p2.x) {
                if (object.position.y >= element.p1.y && object.position.y <= element.p1.y + yElementOffset) {
                    object.position.y += yOffset;
                } else if (object.position.y <= element.p1.y && object.position.y >= element.p1.y - yElementOffset) {
                    object.position.y -= yOffset;
                }
            }
        } else if (element.p1.x > element.p2.x) {
            if (object.position.x <= element.p1.x && object.position.x >= element.p2.x) {
                if (object.position.y >= element.p1.y && object.position.y <= element.p1.y + yElementOffset) {
                    object.position.y += yOffset;
                } else if (object.position.y <= element.p1.y && object.position.y >= element.p1.y - yElementOffset) {
                    object.position.y -= yOffset;
                }
            }
        }
        if (element.p1.y < element.p2.y) {
            if (object.position.y >= element.p1.y && object.position.y <= element.p2.y) {
                if (object.position.x >= element.p1.x && object.position.x <= element.p1.x + xElementOffset) {
                    object.position.x += xOffset;
                } else if (object.position.x <= element.p1.x && object.position.x >= element.p1.x - xElementOffset) {
                    object.position.x -= xOffset;
                }
            }
        } else if (element.p1.y > element.p2.y) {
            if (object.position.y <= element.p1.y && object.position.y >= element.p2.y) {
                if (object.position.x >= element.p1.x && object.position.x <= element.p1.x + xElementOffset) {
                    object.position.x += xOffset;
                } else if (object.position.x <= element.p1.x && object.position.x >= element.p1.x - xElementOffset) {
                    object.position.x -= xOffset;
                }
            }
        }
    }
}