var canvas;
var g;

var boids = [];

var towers = [];

function begin()
{
	canvas = document.getElementById("canvas");
	
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	g = canvas.getContext('2d');
	
	start();
	setInterval( draw, 1000/30 );
}

function start()
{
	g.fillStyle = "#000000";
	g.fillRect( 0, 0, canvas.width, canvas.height );
	
	for( var i = 0; i < 20; i++ )
	{
		boids.push( new Boid() );
	}
	
	for( var i = 0; i < 20; i++ )
	{
		towers.push( new Tower( Math.random() * canvas.width, Math.random() * canvas.height ) );
	}
}

function draw()
{
	if( canvas.width != window.innerWidth || canvas.height != window.innerHeight )
	{
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		g.fillStyle = "#000000";
		g.fillRect( 0, 0, canvas.width, canvas.height );
	}
	g.fillStyle = "#000000";
	g.globalAlpha = .4;
	g.fillRect( 0, 0, canvas.width, canvas.height );
	g.globalAlpha = 1;
	
	for( var i in boids )
	{
		boids[i].update();
		boids[i].render();
	}
	for( var i in towers )
	{
		towers[i].render();
	}
}

var Boid = function()
{
	this.x = Math.random() * canvas.width;
	this.y = Math.random() * canvas.height;
	this.dx = 0;
	this.dy = 0;
	this.heading = Math.random() * Math.PI * 2;
	this.accel = Math.random() * .3 + .05;
	this.update = function() {
		var avghx = 0;
		var avghy = 0;
		var avgaccel = 0;
		var avgcount = 0;
		var avgx = 0;
		var avgy = 0;
		for( var i in boids )
		{
			var boid = boids[i];
			if( boid != this )
			{
				var dist2 = boid.dist2( this );
				if( dist2 < 10 * 10 )
				{
					var dist = Math.sqrt( dist2 );
					var rx = boid.x - this.x;
					var ry = boid.y - this.y;
					rx = rx / dist;
					ry = ry / dist;
					this.dx -= rx * .5;
					this.dy -= ry * .5;
				}
				if( dist2 < 100*100 )
				{
					avgx += boid.x;
					avgy += boid.y;
					avghx += Math.cos( boid.heading );
					avghy += Math.sin( boid.heading );
					avgaccel += boid.accel;
					avgcount += 1;
				}
			}
		}
		if( avgcount > 0 )
		{
			avghx = avghx / avgcount;
			avghx = avghy / avgcount;
			avgaccel = avgaccel / avgcount;
			avgx = avgx / avgcount;
			avgy = avgy / avgcount;
			
			var avgxv = avgx - this.x;
			var avgyv = avgy - this.y;
			var distToAvg = Math.sqrt( avgxv*avgxv + avgyv*avgyv );
			avgxv = avgxv / distToAvg;
			avgyv = avgyv / distToAvg;
			var headingToAvg = Math.atan2( avgyv, avgxv );
			this.heading += turnTowards( this.heading, headingToAvg ) * .1;
			
			var avgheading = Math.atan2( avghy, avghx );
			this.heading += turnTowards( this.heading, avgheading ) * .1;
			this.accel += (avgaccel - this.accel) * .3;
		}
		
		for( var i in towers )
		{
			var tower = towers[i];
			var txv = tower.x - this.x;
			var tyv = tower.y - this.y;
			var distToTower = Math.sqrt( txv*txv + tyv*tyv );
			txv = txv / distToTower;
			tyv = tyv / distToTower;
			if( distToTower < tower.rad + 5 )
			{
				this.x = tower.x - (txv * (tower.rad+5));
				this.y = tower.y - (tyv * (tower.rad+5));
			}
			if( distToTower < 100 )
			{
				var headingToTower = Math.atan2( tyv, txv );
				var dh = Math.abs( deltaHeading( this.heading, headingToTower ) );
				if( dh < Math.PI/3 )
				{
					this.heading -= turnTowards( this.heading, headingToTower ) * .1 * ((Math.PI/3) - dh);
				}
			}
		}

		this.dx += this.accel * Math.cos( this.heading );
		this.dy += this.accel * Math.sin( this.heading );
		
		this.dy *= .95;
		this.dx *= .95;
		
		this.x += this.dx;
		this.y += this.dy;
		
		if( this.x < 0 )
			this.x = canvas.width;
		if( this.y < 0 )
			this.y = canvas.height;
		if( this.x > canvas.width )
			this.x = 0;
		if( this.y > canvas.height )
			this.y = 0;
		
	};
	this.render = function() {
		g.save();
		g.translate( this.x, this.y );
		g.rotate( this.heading );
		g.lineWidth = 3;
		g.strokeStyle = "#00FF00";
		g.beginPath();
		g.moveTo( -2, -4 );
		g.lineTo( 6, 0 );
		g.lineTo( -2, 4 );
		g.stroke();
		g.restore();
	};
	
	this.dist = function( boid ) {
		return Math.sqrt( this.dist2( boid ) );
	}
	
	this.dist2 = function( boid ) {
		var xx = this.x - boid.x;
		var yy = this.y - boid.y;
		return xx*xx + yy*yy;
	}
}

var Tower = function( x, y )
{
	this.x = x;
	this.y = y;
	this.rad = 30;
	this.render = function() {
		g.fillStyle = "#0000FF";
		fillOval( this.x - this.rad, this.y - this.rad, this.rad*2, this.rad*2 ); 
	};
}

function turnTowards( heading, desiredHeading )
{
	while( heading < 0 )
		heading += Math.PI*2;
	while( desiredHeading < 0 )
		desiredHeading += Math.PI*2;
	while( heading > Math.PI*2 )
		heading -= Math.PI*2;
	while( desiredHeading > Math.PI*2 )
		desiredHeading -= Math.PI*2;
	var delta = heading - desiredHeading;
	if( delta < -Math.PI )
		delta += Math.PI*2;
	if( delta > Math.PI )
		delta -= Math.PI*2;
	if( delta < 0 )
		return 1; //turn right
	else
		return -1; //turn left
}

function deltaHeading( heading, desiredHeading )
{
	while( heading < 0 )
		heading += Math.PI*2;
	while( desiredHeading < 0 )
		desiredHeading += Math.PI*2;
	while( heading > Math.PI*2 )
		heading -= Math.PI*2;
	while( desiredHeading > Math.PI*2 )
		desiredHeading -= Math.PI*2;
	var delta = heading - desiredHeading;
	if( delta < -Math.PI )
		delta += Math.PI*2;
	if( delta > Math.PI )
		delta -= Math.PI*2;
	return delta;
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