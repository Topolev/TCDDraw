import { CoordinatePlane } from "./Grid";
import { Graph } from "./Graph";
var canvasMain;
var canvasBack;
window.onload = () => {
    canvasMain = document.getElementById('canvas');
    canvasBack = document.getElementById('canvasBack');
    var grid = new CoordinatePlane(canvasMain, canvasBack);
    var graph1 = new Graph();
    graph1.type = "EXPRESSION";
    graph1.expression = (x) => { return x + 1; };
    var graph2 = new Graph();
    graph2.type = "EXPRESSION";
    graph2.expression = (x) => { return 0.1 * 0.1 * x * x; };
    var graph5 = new Graph();
    graph5.type = "EXPRESSION";
    graph5.expression = (x) => { return 0.5 * 0.14 / (Math.pow((x / 100), 0.02) - 1); };
    grid.addGraph(graph1);
    grid.addGraph(graph2);
    grid.render();
    /* grid.convertCanvasToImage();
 
 
     function download() {
         var dt = grid.convertCanvasToImage();
         this.href = dt;
     };
     document.getElementById("downloadLnk").addEventListener('click', download, false);*/
};
