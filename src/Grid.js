import * as utilCanvas from "./UtilCanvas";
export class CoordinatePlane {
    constructor(canvasMain, canvasBack, countCellX = 10, countCellY = 10) {
        this.xStepGrid = 10;
        this.yStepGrid = 10;
        this.scale = 1;
        this.maxScale = 5;
        this.minScale = 0.2;
        this.prevMouseDown = false;
        this.marginVertical = 30;
        this.marginHorizontal = 40;
        this.graphs = [];
        this.mouseWheel = (e) => {
            var delta = e.deltaY || e.detail || e.wheelDelta;
            if (delta < 0 && this.scale < this.maxScale)
                this.scale += 0.1;
            if (delta > 0 && this.scale > this.minScale)
                this.scale -= 0.1;
            this.drawWorkspace();
        };
        this.mouseDown = (ev) => {
            this.xMouseOverPrev = ev.pageX - this.canvasMain.offsetLeft;
            this.yMouseOverPrev = ev.pageY - this.canvasMain.offsetTop;
            this.prevMouseDown = true;
        };
        this.mouseUp = (ev) => {
            this.prevMouseDown = false;
        };
        this.mouseOver = (ev) => {
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
        };
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
    addGraph(graph) {
        this.graphs.push(graph);
    }
    drawWorkspace() {
        this.clearWorkspace(this.ctxMain);
        this.drawAxis();
        this.render();
        this.drawBorderWorkspace();
    }
    clearWorkspace(ctx) {
        ctx.clearRect(0, 0, this.width, this.height);
    }
    drawBorderWorkspace() {
        console.log("border");
        utilCanvas.drawOutlineRectangle(this.ctxMain, this.marginHorizontal, this.marginVertical, this.width - this.marginHorizontal, this.height - this.marginVertical, "red");
    }
    ;
    drawVerticalLineOnWorkspace(ctx, x, color = "#000000") {
        utilCanvas.drawLine(ctx, x, this.marginVertical, x, this.height - this.marginVertical, color);
    }
    drawHorizontalLineOnWorkspace(ctx, y, color = "#000000") {
        utilCanvas.drawLine(ctx, this.marginHorizontal, y, this.width - this.marginHorizontal, y, color);
    }
    drawAxis() {
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
            var text = (-(countAxisesBeforeY0--) * this.yStepGrid).toString();
            ;
            this.ctxMain.fillText(text, 10, y + 6);
        }
    }
    render() {
        console.log("render");
        this.clearWorkspace(this.ctxMain);
        for (let graph of this.graphs) {
            if (graph.type == 'EXPRESSION') {
                this.drawExpressionGraph(graph.expression);
            }
        }
        this.drawAxis();
    }
    drawExpressionGraph(func, step = 1) {
        var xPrev = -this.x0Offset;
        var yPrev = func(xPrev);
        var xEnd = (this.width - 2 * this.marginHorizontal) / this.scale - this.x0Offset;
        for (let i = xPrev + step; i < xEnd; i += step) {
            utilCanvas.drawLine(this.ctxMain, this.convertOriginXIntoFact(xPrev), this.convertOriginYIntoFact(yPrev), this.convertOriginXIntoFact(xPrev + step), this.convertOriginYIntoFact(func(xPrev + step)));
            xPrev = xPrev + step;
            yPrev = func(xPrev);
        }
    }
    convertOriginYIntoFact(yOrigin) {
        return this.height - this.marginVertical - (yOrigin + this.y0Offset) * this.scale;
    }
    convertOriginXIntoFact(xOrigin) {
        return this.marginHorizontal + (xOrigin + this.x0Offset) * this.scale;
    }
    isYOnWorkspace(yOrigin) {
        return true;
    }
}
