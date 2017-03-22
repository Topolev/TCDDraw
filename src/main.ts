
import {CoordinatePlane} from "./Grid";
import {Graph, Point} from "./Graph";

var canvasMain: HTMLCanvasElement;
var canvasBack: HTMLCanvasElement;


window.onload = () => {
    canvasMain = <HTMLCanvasElement> document.getElementById('canvas');
    canvasBack = <HTMLCanvasElement> document.getElementById('canvasBack');

    var grid = new CoordinatePlane(canvasMain, canvasBack);


    var graph1: Graph = new Graph();
    graph1.type = "EXPRESSION";
    graph1.expression = (x: number) => {return x+1};

    var graph2: Graph = new Graph();
    graph2.type = "EXPRESSION";
    graph2.expression = (x: number) => {return 0.1*0.1*x*x};




   
    var graph5: Graph = new Graph();
    graph5.type = "EXPRESSION";
    graph5.expression = (x: number) => {return 0.5*0.14/(Math.pow((x/100),0.02)-1)};


    grid.addGraph(graph1);
    grid.addGraph(graph2);


    grid.render();

   /* grid.convertCanvasToImage();


    function download() {
        var dt = grid.convertCanvasToImage();
        this.href = dt;
    };
    document.getElementById("downloadLnk").addEventListener('click', download, false);*/




}