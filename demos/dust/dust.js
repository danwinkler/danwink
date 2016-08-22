var canvas;
var g;

var time;

var dust = [];

var lastX;
var lastY;

var pressed = false;

var timeSince = 0;

function begin()
{
    canvas = document.getElementById("canvas");

    canvas.width = projWidth();
    canvas.height = projHeight();

    g = canvas.getContext('2d');

    start();
    setInterval( draw, 1000/30 );
}

function start()
{
    g.fillStyle = "#000000";
    g.fillRect( 0, 0, canvas.width, canvas.height );

    for( var i = 0; i < 3000; i++ )
    {
        dust.push( new Dust() );
    }

    $("#canvas").focus();

    $("#canvas").mousemove( function(e) {
        e.pageX -= $(canvas).offset().left;
        if( !lastX )
        {
            lastX = e.pageX;
            lastY = e.pageY;
        }

        var dx = e.pageX - lastX;
        var dy = e.pageY - lastY;

        for( var i in dust )
        {
            dust[i].push( dx, dy, e.pageX, e.pageY );
        }

        lastX = e.pageX;
        lastY = e.pageY;
        timeSince = 0;
    });

    $("#canvas").mousedown( function(e) {
        pressed = true;
    } );
    $("#canvas").mouseup( function(e) {
        pressed = false;
    } );
}

function draw()
{
    g.save();
    time++;
    if( !pressed )
    {
        timeSince++;
    }
    if( canvas.width != projWidth() || canvas.height != projHeight() )
    {
        canvas.width = projWidth();
        canvas.height = projHeight();
        g.fillStyle = "#000000";
        g.fillRect( 0, 0, canvas.width, canvas.height );
    }

    g.globalAlpha = .5;
    g.fillStyle = "#000000";
    g.fillRect( 0, 0, canvas.width, canvas.height );
    g.globalAlpha = 1;

    for( var i in dust )
    {
        dust[i].update();
        dust[i].render();
    }

    if( timeSince > 90 )
    {
        timeSince = 0;
        for( var i in dust )
        {
            dust[i].dx += (Math.random() - .5) * 50;
            dust[i].dy += (Math.random() - .5) * 50;
        }
    }

    g.restore();
}

var Dust = function() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.dx = 0;
    this.dy = 0;
    this.dist = 0;
    this.push = function( x, y, px, py )
{
    var cx = this.x - px;
    var cy = this.y - py;
    var dist = Math.sqrt( (cx*cx) + (cy*cy) );
    this.dist = dist;
    var scale = 50 / (dist*dist);
    if( scale > .2 )
        scale = .2;
        this.dx += x * scale;
        this.dy += y * scale;
    };
    this.update = function() {
        if( pressed )
        {
            var cx = lastX - this.x;
            var cy = lastY - this.y;
            var dist = Math.sqrt( cx*cx + cy*cy );
            var scale = (1/dist) * 80;
            if( scale > .8 )
                scale = .8;
                this.dx += (cx / dist) * scale;
                this.dy += (cy / dist) * scale;
            }

            this.dx *= .92;
            this.dy *= .92;
            this.x += this.dx;
            this.y += this.dy;
            if( this.x < 10 )
            {
                this.x = 10;
                this.dx *= -1;
            }
            else if( this.x > canvas.width - 10 )
            {
                this.x = canvas.width - 10;
                this.dx *= -1;
            }
            if( this.y < 10 )
            {
                this.y = 10;
                this.dy *= -1;
            }
            else if( this.y > canvas.height - 10 )
            {
                this.y = canvas.height - 10;
                this.dy *= -1;
            }
        };
        this.render = function() {
            g.fillStyle = "#CCCCCC";
            g.fillRect( this.x - 1, this.y - 1, 2, 2 );
        };
    };
