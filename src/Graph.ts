class Point {
    public x: number;
    public y: number;
    constructor(x:number, y:number){
        this.x = x;
        this.y = y;
    }

}

class Graph {
    //There are two type: 'POINTS' and 'EXPRESSION'
    public type: string;
    public points: Point[] = [];
    //Function is identify how calculate Y from X (Y = f(X))
    public expression: (x:number) => number;

    public addPoint(point: Point){
        this.points.push(point);
        return this;
    }

}

export {Graph, Point};