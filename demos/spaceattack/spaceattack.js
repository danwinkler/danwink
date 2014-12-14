var canvas;
var g;

var time;

var up;
var down;
var left;
var right;
var r;
var space;

var bg;
var ship1;
var shipm1;
var shipm2;
var e1;
var e2;
var e3;
var explode = [];

var ship;
var nme = [];
var bullet = [];

var numBullet = 0;
var counteroni = 0;

var running = true;
var moving = false;

var lives = 3;
var score = 0;
var level = 1;
var lose = false;
var living = false;

var eSpeed = .1;

var counter = 0;

function begin() {
	canvas = document.getElementById("canvas");

	canvas.width = 800;
	canvas.height = 600;

	g = canvas.getContext('2d');

	start();
	setInterval( draw, 15 );
}

function start() {
	ship = new Ship();

	for( var x = 0; x < 20; x++ ) {
		nme.push( new Enemy() );
	}

	for( var bx = 0; bx < 10; bx++ ) {
		bullet.push( new Bullet() );
	}

	for( var l = 0; l < 7; l++ ) {
		explode.push( $("#ex" + l)[0] );
	}

	bg = $("#bg")[0];
	ship1 = $("#ship")[0];
	shipm1 = $("#shipm1")[0];
	shipm2 = $("#shipm2")[0];
	e1 = $("#enemy")[0];
	e2 = $("#enemy2")[0];
	e3 = $("#enemy3")[0];

	$("#canvas").focus();

	window.addEventListener(
		"keydown",
		function( e ) {
			switch( e.keyCode ) {
				case 37: left = true; break;
				case 38: up = true; break;
				case 39: right = true; break;
				case 40: down = true; break;
				case 82: r = true; break;
				case 32: space = true; break;
			}
		},
		false
	);

	window.addEventListener(
		"keyup",
		function( e ) {
			switch( e.keyCode ) {
				case 37: left = false; break;
				case 38: up = false; break;
				case 39: right = false; break;
				case 40: down = false; break;
				case 82:
					r = false;
					for( var bi = 0; bi < 10; bi++ )
					{
						bullet[bi].heading = 0.0;
						bullet[bi].xloc = 1000.0;
						bullet[bi].yloc = 1000.0;
					}
					ship.xloc = 400;
					ship.yloc =  300;
					score = 0;
					ship.xspeed = 0;
					ship.yspeed = 0;
					ship.heading = 0;
					lose = false;
					lives = 3;
					eSpeed = .1;
					level = 1;
					resetEnemy();
				break;
				case 32: space = false; break;
			}
		},
		false
	);

	resetEnemy();
}

function draw() {
	if( !lose ) {
		if( up ) {
			ship.up();
			moving = true;
		}
		if( down ) {
			ship.down();
		}
		if( left ) {
			ship.left();
		}
		if( right ) {
			ship.right();
		}

		counteroni++;
		if( space ) {
			if( counteroni > 10 ) {
				bullet[numBullet].shot( ship.xloc, ship.yloc, ship.heading );
				numBullet = (numBullet + 1) % 10;
				counteroni = 0;
			}
		}

		moving = up;

		ship.xloc = (ship.xloc + ship.xspeed) % 800;
		ship.yloc = (ship.yloc + ship.yspeed) % 600;
		if(ship.xloc < 0)
			ship.xloc = 800;
		if(ship.yloc < 0)
			ship.yloc = 600;

		for(var i = 0; i < 10; i++) {
			bullet[i].update();
		}

		living = false;
		for(var ei = 0; ei < 20; ei++)
		{
			if(nme[ei].alive == 2)
				living = true;
		}

		if( !living )
		{
			level++;
			if( level == 3 )
			{
				eSpeed -= .05;
			}
			else if( level == 4 ) {
				eSpeed += .05;
			}

			eSpeed = eSpeed * 1.3;

			resetEnemy();
		}

		for(var ei = 0; ei < 20; ei++)
		{
			for(var bi = 0; bi < 10; bi++)
			{
				if( Math.sqrt( Math.pow(nme[ei].xloc - bullet[bi].xloc, 2) + Math.pow(nme[ei].yloc - bullet[bi].yloc, 2) ) < 10 && nme[ei].alive == 2)
				{
					nme[ei].alive = 1;
					bullet[bi].xloc = 1000;
					bullet[bi].yloc = -100;
					bullet[bi].heading = 0;
					score += 60;
				}
				nme[ei].update( ship.xloc, ship.yloc, eSpeed );

			}
			if( Math.sqrt( Math.pow(nme[ei].xloc - ship.xloc, 2) + Math.pow(nme[ei].yloc - ship.yloc, 2) ) < 12 && nme[ei].alive == 2)
			{
				ship.xloc = 400;
				ship.yloc = 300;
				ship.xspeed = 0;
				ship.yspeed = 0;
				lives--;
				if(lives < 0)
				{

					lose = true;

					lives = 0;
				}

				for(var bi = 0; bi < 10; bi++)
				{
					bullet[bi].heading = 0.0;
					bullet[bi].xloc = 1000.0;
					bullet[bi].yloc = 1000.0;
				}
				for(ei = 0; ei < 20; ei++)
				{
					nme[ei].xloc = -ei * 30;
					nme[ei].yloc = -ei * 30;
					nme[ei].expl = 0;
				}
			}
		}
	}

	g.drawImage( bg, 0, 0, 800, 600 );
	g.fillStyle = "#FFFFFF";
	g.fillText( "Score: " + score, 700, 20 );
	g.fillText( "Level: " + level, 300, 20 );
	g.fillText( "Lives: " + lives, 20, 20 );

	for( var i = 0; i < 10; i++ ) {
		g.strokeStyle = "#FFFF00";
		drawLine(
			bullet[i].xloc,
			bullet[i].yloc,
			bullet[i].xloc + (Math.cos(-(bullet[i].heading) * (Math.PI / 180)) * 8),
			bullet[i].yloc + (Math.sin(-(bullet[i].heading) * (Math.PI / 180)) * 16)
		);
	}

	for(var ei = 0; ei < 20; ei++)
	{
		if(nme[ei].alive == 2) {
			if(level == 1)
				g.drawImage(e1, nme[ei].xloc-10, nme[ei].yloc-10);
			else if(level == 2)
				g.drawImage(e2, nme[ei].xloc-10, nme[ei].yloc-10);
			else if(level == 3)
			{
				if(ei % 2 == 0)
					g.drawImage(e1, nme[ei].xloc-10, nme[ei].yloc-10);
				else
					g.drawImage(e2, nme[ei].xloc-10, nme[ei].yloc-10);
			}
			else if(level == 4)
				g.drawImage(e3, nme[ei].xloc-10, nme[ei].yloc-10);
			else if(level % 3 == 0)
				g.drawImage(e1, nme[ei].xloc-10, nme[ei].yloc-10);
			else if(level % 3 == 1)
				g.drawImage(e2, nme[ei].xloc-10, nme[ei].yloc-10);
			else if(level % 3 == 2)
				g.drawImage(e3, nme[ei].xloc-10, nme[ei].yloc-10);
		}
		if(nme[ei].alive == 1)
		{
			g.drawImage( explode[Math.floor(nme[ei].expl / 4)], nme[ei].xloc-10, nme[ei].yloc-10 );
			nme[ei].expl++;
		}
		if(nme[ei].expl > 24)
		{
			nme[ei].alive = 0;
			nme[ei].expl = 0;
		}
	}

	if( lose == true )
	{
		g.fillStyle = "#FFFFFF";
		g.fillText( "GAME OVER", 300, 300 );
	}

	var matrix = g.currentTransform;

	var tx = ship.xloc;
	var ty = ship.yloc;
	var rot = -(ship.heading-90) * (Math.PI / 180 );

	g.translate( tx, ty );
	g.rotate( rot );
	g.drawImage( ship1, -15, -15 );
	if( moving ) {
		if( counter <= 5 ) {
			g.drawImage( shipm1, -15, -15 );
		}
	}

	g.rotate( -rot );
	g.translate( -tx, -ty );
}

function resetEnemy() {
	for( var ei = 0; ei < 20; ei++ ) {
		nme[ei].reset( ei, level );
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

function toRadians( a )
{
	return a * (Math.PI / 180);
}

function toDegrees( a )
{
	return a / (Math.PI / 180);
}

var Ship = function() {
	this.xloc = 400;
	this.yloc = 300;
	this.xspeed = 0;
	this.yspeed = 0;
	this.heading = 0;
	this.lastYS = 0;
	this.lastXS = 0;

	this.up = function() {
		this.lastXS = this.xspeed;
		this.lastYS = this.yspeed;
		this.xspeed += Math.cos( toRadians( -this.heading ) ) * .06;
		this.yspeed += Math.sin( toRadians( -this.heading ) ) * .06;

		if( Math.sqrt( Math.pow( this.xspeed, 2) + Math.pow( this.yspeed, 2 ) ) > 10 ) {
			this.xspeed = this.lastXS;
			this.yspeed = this.lastYS;
		}
	};

	this.down = function() {
		this.lastXS = this.xspeed;
		this.lastYS = this.yspeed;
		this.xspeed -= Math.cos( -this.heading * (Math.PI / 180) ) * .06;
		this.yspeed -= Math.sin( -this.heading * (Math.PI / 180) ) * .06;

		if( Math.sqrt( Math.pow( this.xspeed, 2) + Math.pow( this.yspeed, 2 ) ) > 10 ) {
			this.xspeed *= .8;
			this.yspeed *= .8;
		}
	};

	this.left = function()
	{
		this.heading = (this.heading + 3) % 360;
	};

	this.right = function()
	{
		this.heading = this.heading - 3;
		if( this.heading < 0 )
			this.heading += 360;
	}
};

var Bullet = function() {
	this.heading = 0.0;
	this.xloc = 1000.0;
	this.yloc = 1000.0;

	this.update = function() {
		this.xloc += Math.cos( -this.heading * (Math.PI / 180) ) * 8;
		this.yloc += Math.sin( -this.heading * (Math.PI / 180) ) * 8;
	};

	this.shot = function( x, y, h ) {
		this.heading = h;
		this.yloc = y;
		this.xloc = x;
	};
};

var Enemy = function() {
	this.heading = 0.0;
	this.xloc = 0.0;
	this.yloc = 0.0;
	this.alive = 0;   //0 = dead .  1 = dying .  2 = alive
	this.expl = 0;

	this.update = function( x, y, eS ) {
		if( this.alive == 2 )
		{
			this.heading = Math.atan2( (y - this.yloc), (x - this.xloc) ) / (Math.PI / 180);
			this.xloc += Math.cos( this.heading * (Math.PI / 180) ) * eS;
			this.yloc += Math.sin( this.heading * (Math.PI / 180) ) * eS;
		}
	};

	this.reset = function( ei, level ) {
		if(level == 1)
		{
			if(ei < 5)
			{
				this.xloc = -ei * 30;
				this.yloc = -ei * 30;
				this.alive = 2;
				this.expl = 0;
			}
			else if(ei < 10)
			{
				this.xloc = 800 + ((ei - 5) * 30);
				this.yloc = -ei * 30;
				this.alive = 2;
				this.expl = 0;
			}
			else if(ei < 15)
			{
				this.xloc = 800 + ((ei - 5) * 30);
				this.yloc = 600 + (ei * 30);
				this.alive = 2;
				this.expl = 0;
			}
			else if(ei < 20)
			{
				this.xloc = -ei * 30;
				this.yloc = 600 + (ei * 30);
				this.alive = 2;
				this.expl = 0;
			}
		}
		else if(level == 2)
		{
			if(ei < 5)
			{
				this.xloc = 400;
				this.yloc = -ei * 30;
				this.alive = 2;
				this.expl = 0;
			}
			else if(ei < 10)
			{
				this.xloc = 800 + ((ei - 5) * 30);
				this.yloc = 300;
				this.alive = 2;
				this.expl = 0;
			}
			else if(ei < 15)
			{
				this.xloc = 400;
				this.yloc = 600 + (ei * 30);
				this.alive = 2;
				this.expl = 0;
			}
			else if(ei < 20)
			{
				this.xloc = -ei * 30;
				this.yloc = 300;
				this.alive = 2;
				this.expl = 0;
			}
		}
		else if(level == 3)
		{
			if(ei < 5 && ei % 2 == 1)
			{
				this.xloc = 400;
				this.yloc = -ei * 30;
				this.alive = 2;
				this.expl = 0;
			}
			else if(ei < 5)
			{
				this.xloc = -ei * 30;
				this.yloc = -ei * 30;
				this.alive = 2;
				this.expl = 0;
			}
			else if(ei < 10 && ei % 2 == 1)
			{
				this.xloc = 800 + ((ei - 5) * 30);
				this.yloc = 300;
				this.alive = 2;
				this.expl = 0;
			}
			else if(ei < 10)
			{
				this.xloc = 800 + ((ei - 5) * 30);
				this.yloc = -ei * 30;
				this.alive = 2;
				this.expl = 0;
			}
			else if(ei < 15 && ei % 2 == 1)
			{
				this.xloc = 400;
				this.yloc = 600 + (ei * 30);
				this.alive = 2;
				this.expl = 0;
			}
			else if(ei < 15)
			{
				this.xloc = 800 + ((ei - 5) * 30);
				this.yloc = 600 + (ei * 30);
				this.alive = 2;
				this.expl = 0;
			}
			else if(ei < 20 && ei % 2 == 1)
			{
				this.xloc = -ei * 30;
				this.yloc = 300;
				this.alive = 2;
				this.expl = 0;
			}
			else if(ei < 20)
			{
				this.xloc = -ei * 30;
				this.yloc = 600 + (ei * 30);
				this.alive = 2;
				this.expl = 0;
			}
		}
		else if(level == 4)
		{
			this.xloc = 800 - (40 * ei);
			this.yloc = -ei * 40;
			this.alive = 2;
			this.expl = 0;
		}
		else
		{
			if(ei < 5)
			{
				this.xloc = -ei * 30;
				this.yloc = -ei * 30;
				this.alive = 2;
				this.expl = 0;
			}
			else if(ei < 10)
			{
				this.xloc = 800 + ((ei - 5) * 30);
				this.yloc = -ei * 30;
				this.alive = 2;
				this.expl = 0;
			}
			else if(ei < 15)
			{
				this.xloc = 800 + ((ei - 5) * 30);
				this.yloc = 600 + (ei * 30);
				this.alive = 2;
				this.expl = 0;
			}
			else if(ei < 20)
			{
				this.xloc = -ei * 30;
				this.yloc = 600 + (ei * 30);
				this.alive = 2;
				this.expl = 0;
			}
		}
	};
}
