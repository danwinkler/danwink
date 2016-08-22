var canvas;
var g;

var units = [];

var pheremones = [];

function begin() {
    canvas = document.getElementById("canvas");

    canvas.width = $("#canvas").width();
    canvas.height = $("#canvas").height();

    g = canvas.getContext('2d');

    $(window).resize( function() {
        canvas.width = $("#canvas").width();
        canvas.height = $("#canvas").height();

        draw();
    });

    start();
    animate();
}

function animate() {
    requestAnimationFrame( animate );
    draw();
}

function start() {
    for( var x = 0; x < 100; x++ ) {
        var col = [];
        for( var y = 0; y < 100; y++ ) {
            col.push( Math.random() );
        }
        pheremones.push( col );
    }
}

function draw() {
    for( var x = 0; x < pheremones.length; x++ ) {
        for( var y = 0; y < pheremones[x].length; y++ ) {
            g.fillStyle = "rgb(" + Math.floor(pheremones[x][y]*255) + ",0,0)";
            g.fillRect( x*10, y*10, 10, 10 );
        }
    }
}

var Ant = function( x, y ) {
    this.x = x;
    this.y = y;
    this.heading = 0;

    this.draw = function() {

    };
};
