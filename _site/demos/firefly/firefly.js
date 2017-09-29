var canvas;
var g;

var fireflies = [];

function begin() {
    canvas = document.getElementById( "canvas" );

    canvas.width = projWidth();
    canvas.height = projHeight();

    g = canvas.getContext( '2d' );

    start();
    setInterval( draw, 1000/30 );
}

function start() {
    g.fillStyle = "#000000";
    g.fillRect( 0, 0, canvas.width, canvas.height );

    for( var i = 0; i < 100; i++ ) {
        fireflies.push( new Firefly() );
    }

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

    g.fillStyle = "#000000";
    g.fillRect( 0, 0, canvas.width, canvas.height );

    for( var i in fireflies ) {
        fireflies[i].update();
        fireflies[i].render();

    }

    g.restore();
}

function Firefly() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.angle = Math.random() * Math.PI * 2;
    this.delta_angle = Math.random() * 2 - 1;
    this.blink = Math.random();
    this.speed = 1 + Math.random();
    this.fade = 0;

    this.update = function() {
        this.blink -= .01;
        this.fade *= .7;

        this.delta_angle += Math.random() * .01 - .005;
        this.delta_angle = clamp( this.delta_angle, -.05, .05 );

        this.angle += this.delta_angle;

        this.x += Math.cos( this.angle ) * this.speed;
        this.y += Math.sin( this.angle ) * this.speed;

        if( this.x < 0 ) this.x = canvas.width;
        if( this.x > canvas.width ) this.x = 0;
        if( this.y < 0 ) this.y = canvas.height;
        if( this.y > canvas.height ) this.y = 0;

        if( this.blink < 0 ) {
            this.fade = 1;
            this.blink = 1;

            for( var i in fireflies ) {
                var firefly = fireflies[i];
                if( firefly == this ) continue;
                var id2 = 1.0 / (Math.pow( firefly.x - this.x, 2 ) + Math.pow( firefly.y - this.y, 2 ));
                console.log( id2 );
                firefly.blink -= Math.min( id2 * 500, .1 );
            }
        }
    };

    this.render = function() {
        //g.strokeStyle = "#FFFF00";
        //drawOval( this.x-5, this.y-5, 10, 10 );
        var gradient = g.createRadialGradient( this.x, this.y, 0, this.x, this.y, 7 );
        gradient.addColorStop( 0, getRGBString( 255, 255, 0, 255 * this.fade ) );
        gradient.addColorStop( 1, getRGBString( 255, 255, 0, 0 ) );
        g.fillStyle = gradient;
        fillOval( g, this.x-7, this.y-7, 14, 14 );
    };
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

function ellipse(c, aX, aY, aWidth, aHeight)
{
	c.save();
	var hB = (aWidth / 2) * .5522848,
		vB = (aHeight / 2) * .5522848,
		eX = aX + aWidth,
		eY = aY + aHeight,
		mX = aX + aWidth / 2,
		mY = aY + aHeight / 2;
	c.moveTo(aX, mY);
	c.bezierCurveTo(aX, mY - vB, mX - hB, aY, mX, aY);
	c.bezierCurveTo(mX + hB, aY, eX, mY - vB, eX, mY);
	c.bezierCurveTo(eX, mY + vB, mX + hB, eY, mX, eY);
	c.bezierCurveTo(mX - hB, eY, aX, mY + vB, aX, mY);
	c.closePath();
	c.restore();
}
function fillOval(c, aX, aY, aWidth, aHeight)
{
	c.beginPath();
	ellipse(c, aX, aY, aWidth, aHeight);
	c.fill();
}

function drawOval(c, aX, aY, aWidth, aHeight)
{
	c.beginPath();
	ellipse(c, aX, aY, aWidth, aHeight);
	c.stroke();
}

function getRGBString( r, g, b, a ) {
    if (arguments.length === 1) {
        b = r.b, g = r.g, r = r.r;
    }
    if( a === undefined ) {
        a = 255;
    }
    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
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
