export class Point {

    static at(x, y) {
        return new this(x, y);
    }

    constructor(x, y) {
        this._x = x;
        this._y = y;
    }

    equals(aPoint) {
        return this.x === aPoint.x && this.y === aPoint.y;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    plus(aPoint) {
        return new Point(this.x + aPoint.x, this.y + aPoint.y);
    }

}