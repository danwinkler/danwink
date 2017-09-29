var canvas;
var g;

function begin() {
    canvas = document.getElementById( "canvas" );

    canvas.width = projWidth();
    canvas.height = projHeight();

    g = canvas.getContext( '2d' );

    start();
    setInterval( draw, 1000/30 );
}

function start() {
    g.fillStyle = "#FFFFFF";
    g.fillRect( 0, 0, canvas.width, canvas.height );

    $("#canvas").focus();

    $("#canvas").mousemove( function(e) {

    });
    $("#canvas").mousedown( function(e) {

    });
    $("#canvas").mouseup( function(e) {

    });
}

function draw() {
    g.save();

    if( canvas.width != projWidth() || canvas.height != projHeight() )
    {
        canvas.width = projWidth();
        canvas.height = projHeight();
    }

    g.fillStyle = "#FFFFFF";
    g.fillRect( 0, 0, canvas.width, canvas.height );

    g.strokeStyle = "#000000";



    g.restore();
}

function clamp( num, min, max ) {
    return num <= min ? min : num >= max ? max : num;
}

function assert( v ) {
    if( !v ) {
        throw Error( "ERROR" );
    }
}

function drawLine( x1, y1, x2, y2 )
{
	g.save();
	g.beginPath();
	g.moveTo( x1, y1 );
	g.lineTo( x2, y2 );
	g.stroke();
	g.restore();
}

function canvas_arrow(fromx, fromy, tox, toy){
    var headlen = 10;   // length of head in pixels
    var angle = Math.atan2(toy-fromy,tox-fromx);
    g.save();
    g.beginPath();
    g.moveTo(fromx, fromy);
    g.lineTo(tox, toy);
    g.lineTo(tox-headlen*Math.cos(angle-Math.PI/6),toy-headlen*Math.sin(angle-Math.PI/6));
    g.moveTo(tox, toy);
    g.lineTo(tox-headlen*Math.cos(angle+Math.PI/6),toy-headlen*Math.sin(angle+Math.PI/6));
    g.stroke();
    g.restore();
}
