import {Graph, Point} from "./Graph"

import * as utilCanvas from "./UtilCanvas";

export class CoordinatePlane {

    ctxMain: CanvasRenderingContext2D;
    ctxBack: CanvasRenderingContext2D;
    canvasMain: HTMLCanvasElement;
    canvasBack: HTMLCanvasElement;

    private x0Offset: number;
    private y0Offset: number;
    private xStepGrid: number = 10;
    private yStepGrid: number = 10;

    private yMin: number;
    private xMin: number;
    private yMax: number;
    private xMax: number;
    private stepX: number;
    private stepY: number;

    private scale: number = 1;
    private maxScale: number = 5;
    private minScale: number = 0.2;

    private prevMouseDown: boolean = false;
    private xMouseOverPrev: number;
    private yMouseOverPrev: number;

    private width: number;
    private height: number;

    private marginVertical: number = 30;
    private marginHorizontal: number = 40;


    private borderWorkspace: {};

    private graphs: Array<Graph> = [];

    constructor(canvasMain: HTMLCanvasElement, canvasBack: HTMLCanvasElement, countCellX: number = 10, countCellY: number = 10) {
        //create the workfield
        this.canvasMain = canvasMain;
        this.canvasBack = canvasBack;
        this.ctxMain = canvasMain.getContext("2d");
        this.ctxBack = canvasBack.getContext("2d");
        this.width = canvasMain.offsetWidth;
        this.height = canvasMain.offsetHeight;

        // offset the origin (point with coordinates(0, 0))
        this.x0Offset = 100;
        this.y0Offset = 100;

        //calculate value of division
        this.xStepGrid = 24;
        this.yStepGrid = 24;

        this.canvasMain.addEventListener("wheel", this.mouseWheel);

        this.canvasMain.addEventListener("mousemove", this.mouseOver);

         this.canvasMain.addEventListener("mousedown", this.mouseDown);
         this.canvasMain.addEventListener("mouseup", this.mouseUp);


        this.drawWorkspace();
    }


    public addGraph(graph: Graph) {
        this.graphs.push(graph);
    }


    private drawWorkspace() {
        this.clearWorkspace(this.ctxMain);
        this.drawAxis();
        this.render();
        this.drawBorderWorkspace();
    }

    private clearWorkspace(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, this.width, this.height);
    }

    private drawBorderWorkspace() {
        console.log("border");
        utilCanvas.drawOutlineRectangle(
            this.ctxMain,
            this.marginHorizontal, this.marginVertical,
            this.width - this.marginHorizontal, this.height - this.marginVertical,
            "red");
    };

    private drawVerticalLineOnWorkspace(ctx: CanvasRenderingContext2D, x: number, color: string = "#000000") {
        utilCanvas.drawLine(ctx, x, this.marginVertical, x, this.height - this.marginVertical, color);
    }

    private drawHorizontalLineOnWorkspace(ctx: CanvasRenderingContext2D, y: number, color: string = "#000000") {
        utilCanvas.drawLine(ctx, this.marginHorizontal, y, this.width - this.marginHorizontal, y, color);
    }

    private drawAxis() {
        //Main axises
        this.drawVerticalLineOnWorkspace(this.ctxMain, this.marginHorizontal + this.x0Offset * this.scale, "green");
        this.drawHorizontalLineOnWorkspace(this.ctxMain, this.height - this.marginVertical - this.y0Offset * this.scale, "green");
        this.ctxMain.font = "14px Arial";

        //Intermediate axises(X)
        var countAxisesBeforeX0 = this.x0Offset * this.scale / (this.xStepGrid * this.scale) | 0;
        var startX0Fact = this.marginHorizontal + this.x0Offset * this.scale - countAxisesBeforeX0 * this.xStepGrid * this.scale;

        for (var x = startX0Fact; x < this.width - this.marginHorizontal; x += this.xStepGrid * this.scale) {
            this.drawVerticalLineOnWorkspace(this.ctxMain, x, "rgba(0,0,0,0.1)");
            var text = (-(countAxisesBeforeX0--) * this.xStepGrid).toString();
            var widthText = this.ctxMain.measureText(text).width;
            this.ctxMain.fillText(text, x - widthText / 2, this.height - this.marginVertical + 16);
        }
        //Intermediate axises(Y)
        var countAxisesBeforeY0 = this.y0Offset * this.scale / (this.yStepGrid * this.scale) | 0;
        var startY0 = this.height - (this.marginVertical + this.y0Offset * this.scale - countAxisesBeforeY0 * this.yStepGrid * this.scale);
        for (var y = startY0; y > this.marginVertical; y -= this.yStepGrid * this.scale) {
            this.drawHorizontalLineOnWorkspace(this.ctxMain, y, "rgba(0,0,0,0.1)");
            var text = (-(countAxisesBeforeY0--) * this.yStepGrid).toString();;
            this.ctxMain.fillText(text, 10, y + 6);
        }
    }


    private mouseWheel = (e: MouseWheelEvent) => {
        var delta = e.deltaY || e.detail || e.wheelDelta;
        if (delta < 0 && this.scale < this.maxScale) this.scale += 0.1;
        if (delta > 0 && this.scale > this.minScale) this.scale -= 0.1;
        this.drawWorkspace();
    }

    public mouseDown = (ev: MouseEvent) => {
        this.xMouseOverPrev = ev.pageX - this.canvasMain.offsetLeft;
        this.yMouseOverPrev = ev.pageY - this.canvasMain.offsetTop;
        this.prevMouseDown = true;
    }

    public mouseUp = (ev: MouseEvent) => {
        this.prevMouseDown = false;
    }

    public mouseOver = (ev: MouseEvent) => {
        var currentX = ev.pageX - this.canvasMain.parentElement.offsetLeft;
        var currentY = ev.pageY - this.canvasMain.parentElement.offsetTop;

        if (this.prevMouseDown) {
            var dx = currentX - this.xMouseOverPrev;
            var dy = currentY - this.yMouseOverPrev;

            this.x0Offset += dx;
            this.y0Offset -= dy;

            this.xMouseOverPrev = currentX;
            this.yMouseOverPrev = currentY;
            this.drawWorkspace();
        }


    }

    public render() {
        console.log("render");
        this.clearWorkspace(this.ctxMain);
        for (let graph of this.graphs) {
            if (graph.type == 'EXPRESSION') {
                this.drawExpressionGraph(graph.expression);
            }
        }
        this.drawAxis();

    }

    private drawExpressionGraph(func: (x: number) => number, step: number = 1) {
        var xPrev: number = -this.x0Offset;
        var yPrev: number = func(xPrev);
        var xEnd = (this.width - 2*this.marginHorizontal)/this.scale - this.x0Offset;
        for (let i = xPrev + step; i < xEnd; i += step) {
            utilCanvas.drawLine(this.ctxMain,
                this.convertOriginXIntoFact(xPrev), this.convertOriginYIntoFact(yPrev),
                this.convertOriginXIntoFact(xPrev + step), this.convertOriginYIntoFact(func(xPrev + step)));
            xPrev = xPrev + step;
            yPrev = func(xPrev);
        }
    }

    private convertOriginYIntoFact(yOrigin: number){
        return this.height - this.marginVertical - (yOrigin + this.y0Offset)*this.scale;
    }

    private convertOriginXIntoFact(xOrigin: number){
        return this.marginHorizontal + (xOrigin + this.x0Offset) * this.scale
    }

    private isYOnWorkspace(yOrigin: number){
        return true;
    }


    /*public mouseOver = (ev: MouseEvent) => {
     console.log("sadsd", this.canvasMain.parentElement.offsetTop);
     var currentX = ev.pageX - this.canvasMain.parentElement.offsetLeft;
     var currentY = ev.pageY - this.canvasMain.parentElement.offsetTop;

     console.log(currentX);

     if (this.prevMouseDown) {
     var dx = currentX - this.xMouseOverPrev;
     var dy = currentY - this.yMouseOverPrev;

     this.x0Offset += dx;
     this.y0Offset += dy;

     this.xMouseOverPrev = currentX;
     this.yMouseOverPrev = currentY;
     this.drawAxis();
     this.render();
     }

     this.clearCanvas(this.ctxBack);
     this.verticalLine(this.ctxBack, currentX, "red");
     this.renderHorizontalLineForExpressionGraph(currentX);
     this.renderHorizontalLineForPointsGraph(currentX);

     }

     public mouseDown = (ev: MouseEvent) => {
     this.xMouseOverPrev = ev.pageX - this.canvasMain.offsetLeft;
     this.yMouseOverPrev = ev.pageY - this.canvasMain.offsetTop;
     this.prevMouseDown = true;
     }

     public mouseUp = (ev: MouseEvent) => {
     this.prevMouseDown = false;
     console.log("prevMouseDown", false);
     }









     private drawPointsGraph(graph: Graph) {
     var prevPoint: Point = null;
     for (var point of graph.points) {
     if (prevPoint == null) {
     prevPoint = point;
     } else {
     this.drawLine(this.ctxMain,
     (prevPoint.x + this.x0Offset) * this.scale, (this.y0Offset - prevPoint.y) * this.scale,
     (point.x + this.x0Offset) * this.scale, (this.y0Offset - point.y) * this.scale);
     prevPoint = point;
     }

     }
     }



     renderHorizontalLineForExpressionGraph(x: number) {
     for (let graph of this.graphs) {
     if (graph.type == 'EXPRESSION') {
     this.horizontalLine(this.ctxBack, (this.y0Offset - graph.expression(x / this.scale - this.x0Offset)) * this.scale, "red")
     }
     }
     }

     renderHorizontalLineForPointsGraph(x: number) {
     console.log("RENDER HORISONAL LINE");

     for (let graph of this.graphs) {
     if (graph.type == 'POINTS') {
     var func = this.prepareExpressionLineBeetweenTwoPoints(x / this.scale - this.x0Offset, graph.points);
     if (func != null) {
     this.horizontalLine(this.ctxBack, (this.y0Offset - func(x / this.scale - this.x0Offset)) * this.scale, "red");
     }
     }
     }
     }

     prepareExpressionLineBeetweenTwoPoints(xCurrent: number, points: Array<Point>): (x: number) => number {
     if ((xCurrent+0.1 <= points[0].x) || (points[points.length - 1].x <= xCurrent)) {
     return null;
     }
     var prevPoint = points[0];
     var point1 = null, point2 = null;
     for (var i = 1; i < points.length; i++) {
     if ((prevPoint.x < xCurrent) && (xCurrent < points[i].x)) {
     point1 = prevPoint;
     point2 = points[i];
     break;
     } else {
     prevPoint = points[i];
     }
     }
     return this.createLineFunction(point1, point2);
     }

     createLineFunction(point1: Point, point2: Point): (x: number) => number {
     if (point1 == null || point2 == null) return null;
     var x1 = point1.x;
     var y1 = point1.y;
     var x2 = point2.x;
     var y2 = point2.y;
     var A = (y2 - y1) / (x2 - x1);
     var B = (x2 * y1 - x1 * y2) / (x2 - x1);
     return (x: number) => A * x + B;
     }
















     public convertCanvasToImage(){
     return this.canvasMain.toDataURL("image/png");

     }
     */
}