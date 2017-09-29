var canvas;
var g;


function begin() {
    canvas = document.getElementById( "canvas" );

    canvas.width = projWidth();
	canvas.height = projHeight();

    g = canvas.getContext( '2d' );

    start();
    setInterval( draw, 1 );
}

function start() {
    g.fillStyle = "#FFFFFF";
    g.fillRect( 0, 0, canvas.width, canvas.height );

    black = g.createImageData( 1, 1 );
    black.data[3] = 255;
    x = Math.floor( canvas.width / 2 );
    y = Math.floor( canvas.height / 2 );
    startX = x;
    startY = y;
    g.putImageData( black, x, y );
    stack.push( [x, y] );

    $("#canvas").focus();

    $("#canvas").mousemove( function(e) {

    });
    $("#canvas").mousedown( function(e) {

    });
    $("#canvas").mouseup( function(e) {

    });
}

var DRAW_STATE = 0;
var FILL_STATE = 1;
var state = DRAW_STATE;

function draw() {
    g.save();

    g.strokeStyle = "#000000";

    switch( state ) {
        case DRAW_STATE: for( var i = 0; i < 10; i++ ) { nextPixel() }; break;
        case FILL_STATE: for( var i = 0; i < 10; i++ ) { if( !nextColorPixel() ) break; }; break;
    }

    g.restore();
}

var startX, startY;
var x, y;
var black;
var dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0]
];

var checkIndices = [
    [2, 4, 3, 3],
    [2, 0, 3, 3],
    [4, 2, 3, 3],
    [0, 2, 3, 3]
];

var stack = [];

var hue = Math.random();

function nextPixel() {
    var clear = getClear();
    if( clear.length > 0 ) {
        var next = getRandom( clear );
        for( var i = 0; i < 2; i++ ) {
            x += next[0];
            y += next[1];
            g.putImageData( black, x, y );
        }
        stack.push( [x, y] );
    } else if( stack.length > 0 ) {
        var last = stack.pop();
        x = last[0];
        y = last[1];
        nextPixel();
    } else {
        state = FILL_STATE;
        x = startX + 1;
        y = startY + 1;
        setPixel( x, y, hue );
        stack.push( [x, y, hue] );
    }
}

function nextColorPixel() {
    var clear = getColorClear();
    if( clear.length > 0 ) {
        var next = getRandom( clear );
        x += next[0];
        y += next[1];
        hue += .0003;
        setPixel( x, y, hue );
        stack.push( [x, y, hue] );
    } else if( stack.length > 1 ) {
        var last = stack.pop();
        last = stack[stack.length-1];
        x = last[0];
        y = last[1];
        hue = last[2];
        nextColorPixel();
    } else {
        state++;
        console.log( "DONE" );
        return false;
    }
    return true;
}

function setPixel( x, y, hue ) {
    var data = g.createImageData( 1, 1 );
    var rgb = HSVtoRGB( hue % 1, 1, 1 );
    data.data[0] = rgb.r;
    data.data[1] = rgb.g;
    data.data[2] = rgb.b;
    data.data[3] = 254;
    g.putImageData( data, x, y );
}

function getColorClear() {
    var ret = [];
    for( var i = 0; i < dirs.length; i++ ) {
        if( canColor( dirs[i] ) ) {
            ret.push( dirs[i] );
        }
    }
    return ret;
}

function getClear() {
    var ret = [];
    for( var i = 0; i < dirs.length; i++ ) {
        if( allWhite( checkIndices[i] ) ) {
            ret.push( dirs[i] );
        }
    }
    return ret;
}

function canColor( dir ) {
    var idata = g.getImageData( x + dir[0], y + dir[1], 1, 1 ).data;
    return (
        idata[0] == 255 &&
        idata[1] == 255 &&
        idata[2] == 255
    );
}

function allWhite( ind ) {
    var idata = g.getImageData( x + ind[0] - 3, y + ind[1] - 3, ind[2], ind[3] ).data;
    for( var i in idata ) {
        if( idata[i] != 255 ) return false;
    }
    return true;
}

function getRandom( arr ) {
    return arr[Math.floor(Math.random()*arr.length)];
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

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}
