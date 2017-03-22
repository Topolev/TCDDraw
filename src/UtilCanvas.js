export function clearCanvas(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);
}
;
export function drawFillRectangle(ctx, x1, y1, x2, y2, color) {
    ctx.beginPath();
    ctx.rect(x1, y1, x2, y2);
    ctx.fillStyle = color;
    ctx.fill();
}
;
export function drawOutlineRectangle(ctx, x1, y1, x2, y2, color) {
    ctx.fillStyle = color;
    ctx.strokeRect(x1, y1, x2, y2);
}
;
export function drawOutlineRectangleByPoints(ctx, point1, point2, color) {
    drawOutlineRectangle(ctx, point1.x, point1.y, point2.x, point2.y, color);
}
;
export function drawLine(ctx, x1, y1, x2, y2, colorLine = "#000000") {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = colorLine;
    ctx.stroke();
}
