var canvas;
var g;

var root;

var dwind = 0;
var windProgress = 1;
var wind = 0;
var time = 0;
var windStart = 0;
var windDest = 0;
var windTime = 0;
var maxPetalFade = 100;

var trunkImg;
var petalImg;

var petals = [];

var oldWindowWidth = window.innerWidth;
var oldWindowHeight = window.innerHeight;

function begin()
{
    canvas = document.getElementById("canvas");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    oldWindowWidth = window.innerWidth;
    oldWindowHeight = window.innerHeight;

    g = canvas.getContext('2d');

    window.addEventListener( 'resize', function() {
        var dx = window.innerWidth - oldWindowWidth;
        var dy = window.innerHeight - oldWindowHeight;
        for( var i in petals ) {
            var petal = petals[i];
            petal.x += dx/2;
            petal.y += dy;
        }
        oldWindowWidth = window.innerWidth;
        oldWindowHeight = window.innerHeight;
    }, false );

    start();
    setInterval( draw, 1000/30 );
}

function start()
{
    g.fillStyle = "#FFFFFF";
    g.fillRect( 0, 0, canvas.width, canvas.height );

    root = new Branch( 7 );
    root.angle = 0;
    trunkImg = $("#trunk")[0];
    petalImg = $("#petal")[0];
}

function newTree()
{
    root = new Branch( 7 );
    root.angle = 0;
    petals = [];
}

function draw()
{
    if( canvas.width != window.innerWidth || canvas.height != window.innerHeight )
    {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        g.fillStyle = "#FFFFFF";
        g.fillRect( 0, 0, canvas.width, canvas.height );
    }
    g.fillStyle = "#FFFFFF";
    //g.globalAlpha = 1;
    g.fillRect( 0, 0, canvas.width, canvas.height );
    //g.globalAlpha = 1;

    time++;

    if( windProgress >= 1 )
    {
        windProgress = 0;
        windStart = wind;
        windDest = Math.random() * .06 - .03;
        dwind = windDest - windStart;
        windTime = Math.random() * 100 + 50;
        dwind = dwind / windTime;
    }

    dwind = (windDest - wind) * .01;

    windProgress += 1.0 / windTime;
    wind = Math.sin( time * .01 ) * .01;

    g.save();
    g.translate( canvas.width * .5, canvas.height - 10 );
    root.draw( canvas.width * .5, canvas.height - 10, 0 );
    g.restore();

    for( var i = 0; i < petals.length; i++ )
    {
        var petal = petals[i];
        petal.update();
        petal.draw();
    }

    petals = petals.filter( function( e ) {
        return e.alive;
    });
}

var Branch = function( depth, parent ){
    this.angle = (Math.random() * 1.2) - .6;
    this.depth = depth;
    this.childs = [];
    this.parent = parent;
    this.drawx = 0;
    this.drawy = 0;
    this.drawr = 0;
    this.petals = [];
    this.phase = Math.random() * Math.PI * 2;
    if( depth > 1 )
    {
        for( var i = Math.floor( (Math.random() * 4) + .9 ); i > 0; i-- )
        {
            this.childs.push( new Branch( depth-1, this ) );
        }
    }
    if( this.childs.length == 0 )
    {
        this.depth = 1;
    }
    else
    {
        var maxDepth = 1;
        for( var i in this.childs )
        {
            if( this.childs[i].depth > maxDepth )
            {
                maxDepth = this.childs[i].depth;
            }
        }
        this.depth = maxDepth+1;
    }
    this.width = this.depth*3 + 2;
    this.height = this.depth * 16 + 10;
    if( this.depth < 4 )
    {
        for( var i = 0; i < 3 * this.depth; i++ )
        {
            this.petals.push( new Petal( (Math.random() * this.width*2 - this.width) * 1.1, (Math.random() * -this.height*1.2) ) );
        }
    }
    this.draw = function( x, y, r, shadow ) {
        var rot = this.angle + wind + (Math.sin( (time * .05) + this.phase ) * .005);
        this.drawr = r + rot;
        this.drawx = x + Math.sin( this.drawr ) * this.height * .95;
        this.drawy = y + Math.cos( this.drawr ) * -this.height * .95;
        g.save();
        g.rotate( rot );
        //g.strokeStyle = "#000000";
        //g.strokeRect( -this.width/2, -this.height, this.width, this.height );
        if( shadow )
        {
            g.fillStyle = "#444444";
            g.fillRect( -this.width/2, -this.height, this.width, this.height );
        }
        else
        {
            g.drawImage( trunkImg, -this.width/2, -this.height, this.width, this.height );
            for( var i in this.petals )
            {
                this.petals[i].draw();
            }
        }
        g.translate( 0, -this.height *.95 );
        for( var i in this.childs )
        {
            this.childs[i].draw( this.drawx, this.drawy, this.drawr, shadow );
        }
        g.restore();

        if( this.depth == 1 && Math.random() < .0025 )
        {
            petals.push( new Petal( this.drawx, this.drawy ) );
        }
    };
}

var Petal = function( x, y )
{
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.alive = true;
    this.dr = (Math.random() * .2) - .1;
    this.r = Math.random() * Math.PI * 2;
    this.fadeout = maxPetalFade;

    this.update = function() {
        if( this.y <= canvas.height-10 ) {
            this.x += wind*20;
            this.x += Math.sin( time * .01 + this.r );
            this.y += 1;
            this.r += this.dr;
        }
        else if( this.fadeout > 0 )
        {
            this.fadeout--;
        }
        else
        {
            this.alive = false;
        }
    };
    this.draw = function() {
        g.save();
        g.translate( this.x, this.y );
        g.rotate( this.r );
        g.globalAlpha = this.fadeout / maxPetalFade;
        g.drawImage( petalImg, -5, -5, 10, 10 );
        g.globalAlpha = 1;
        g.restore();
    };
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

function ellipse(aX, aY, aWidth, aHeight)
{
    g.save();
    var hB = (aWidth / 2) * .5522848,
        vB = (aHeight / 2) * .5522848,
        eX = aX + aWidth,
        eY = aY + aHeight,
        mX = aX + aWidth / 2,
        mY = aY + aHeight / 2;
    g.moveTo(aX, mY);
    g.bezierCurveTo(aX, mY - vB, mX - hB, aY, mX, aY);
    g.bezierCurveTo(mX + hB, aY, eX, mY - vB, eX, mY);
    g.bezierCurveTo(eX, mY + vB, mX + hB, eY, mX, eY);
    g.bezierCurveTo(mX - hB, eY, aX, mY + vB, aX, mY);
    g.closePath();
    g.restore();
}
function fillOval(aX, aY, aWidth, aHeight)
{
    g.beginPath();
    ellipse(aX, aY, aWidth, aHeight);
    g.fill();
}

function drawOval(aX, aY, aWidth, aHeight)
{
    g.beginPath();
    ellipse(aX, aY, aWidth, aHeight);
    g.stroke();
}
