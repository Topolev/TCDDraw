class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class Graph {
    constructor() {
        this.points = [];
    }
    addPoint(point) {
        this.points.push(point);
        return this;
    }
}
export { Graph, Point };
