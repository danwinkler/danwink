var canvas;
var g;

var groups = [];
var units = [];

function begin() {
    canvas = document.getElementById("canvas");

    canvas.width = $("#canvas").width();
    canvas.height = $("#canvas").height();

    g = canvas.getContext('2d');

    start();
    animate();
}

function animate() {
    requestAnimationFrame( animate );
    draw();
}

function start() {

}

function draw() {

}

var Group = function( var units ) {
    this.units = units;

    //Find average position of units
    this.x = 0;
    this.y = 0;
    for( var i in units ) {
        var unit = units[i];
        this.x += unit.x;
        this.y += unit.y;
    }
    this.x /= units.length;
    this.y /= units.length;

    this.gx = x;
    this.gy = y;

    this.moveTo = function( var gx, var gy ) {
        this.gx = gx;
        this.gy = gy;
    };
};

var Unit = function( var x, var y ) {
    this.x = x;
    this.y = y;
    this.group = null;

    
};
