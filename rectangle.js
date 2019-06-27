class Rectangle {
    constructor(x1, y1, x2, y2) {
        this.p1 = createVector(x1, y1);
        this.p3 = createVector(x2, y2);
    
        this.width = this.p3.x - this.p1.x;
        this.heigth = this.p3.y - this.p1.y;
        this.diagonal = sqrt(pow(this.p3.x - this.p1.x, 2) + pow(this.p3.y - this.p1.y, 2));

        this.p2 = createVector(this.p1.x + this.width, this.p1.y);
        this.p4 = createVector(this.p1.x, this.p1.y + this.heigth);

        walls.push(new Wall(this.p1.x, this.p1.y, this.p2.x, this.p2.y));
        walls.push(new Wall(this.p2.x, this.p2.y, this.p3.x, this.p3.y));
        walls.push(new Wall(this.p3.x, this.p3.y, this.p4.x, this.p4.y));
        walls.push(new Wall(this.p4.x, this.p4.y, this.p1.x, this.p1.y));
    }
}