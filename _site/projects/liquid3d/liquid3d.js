var scene;
var camera;
var renderer;

var balls = [];

var ballLight;

var a = 0;

var pressed = false;

function begin() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

	scene.add( camera );

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );

	document.body.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );

	start();
	animate();
}

function animate() {
	requestAnimationFrame( animate );
	draw();
}

function start() {
	for( var i = 0; i < 200; i++ ) {
		balls.push( new Ball() );
	}

	var light = new THREE.AmbientLight( 0x404040 ); // soft white light
	scene.add( light );

	var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
	directionalLight.position.set( 1, 1, 1 ).normalize();
	scene.add( directionalLight );

	camera.up = new THREE.Vector3( 0, 0, 1 );

	$("canvas").mousedown( function(e) {
		pressed = true;
	});
	$("canvas").mouseup( function(e) {
		pressed = false;
	});
}

function draw() {
	for( var i in balls ) {
		balls[i].update();
	}

	for( var i in balls ) {
		balls[i].updatePos();
	}

	a += .01;

	camera.position.z = 15;
	camera.position.x = Math.cos( a ) * 20;
	camera.position.y = Math.sin( a ) * 20;

	camera.lookAt( new THREE.Vector3( 0, 0, 5 ) );
	renderer.render( scene, camera );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

var ballForceVec = new THREE.Vector3();
var speed = new THREE.Vector3();
var accel = new THREE.Vector3();

var Ball = function() {
	this.pos = new THREE.Vector3( randomf(-10,10),randomf(-10,10),randomf(0,10) );
	this.lastPos = new THREE.Vector3().copy( this.pos );
	this.nextPos = new THREE.Vector3();

	var color = new THREE.Color( randomf(0,.2),randomf(0,.6),randomf(.5,1) );
	var material = new THREE.MeshLambertMaterial({
		color: color,
		ambient: color
	});

	this.geometry = new THREE.Mesh(
		new THREE.SphereGeometry( 1, 8, 6 ),
		material
	);

	scene.add( this.geometry );

	this.update = function() {
		this.geometry.position.copy( this.pos );

		speed.subVectors( this.pos, this.lastPos );

		accel.set( 0, 0, 0 );

		accel.z -= .01;

		for( var i in balls ) {
			var ball = balls[i];
			if( ball == this ) continue;

			ballForceVec.subVectors( ball.pos, this.pos );
			var length = ballForceVec.length();
			var force = 0;
			if( length < 2 ) {
				force = .5 / (length*length*length*length);
				if( force > .05 ) force = .05;
			}
			else
			{
				force = -.01 / (length*length*length);
				if( force < -.00005 ) force = -.00005;
			}
			ballForceVec.divideScalar( length );
			ballForceVec.multiplyScalar( force );
			accel.sub( ballForceVec );
		}

		if( this.pos.z < 0 ) {
			var floorRepel = (this.pos.z*this.pos.z) * .1;
			accel.z += floorRepel;
		}

		var x = this.pos.x*this.pos.x;
		var y = this.pos.y*this.pos.y;
		var l = Math.sqrt( x+y );
		/*
		if( l > 10 ) {
			this.speed.x += this.pos.x * -.01 * (l-10);
			this.speed.y += this.pos.y * -.01 * (l-10);
		}
		*/
		if( pressed ) {
			accel.x += .1/l * (this.pos.x);
			accel.y += .1/l * (this.pos.y);
		}

		speed.multiplyScalar( .97 );

		this.nextPos.copy( this.pos );
		this.nextPos.add( speed );
		this.nextPos.add( accel );

		if( this.nextPos.x > 10 ) this.nextPos.x = 10;
		if( this.nextPos.x < -10 ) this.nextPos.x = -10;
		if( this.nextPos.y > 10 ) this.nextPos.y = 10;
		if( this.nextPos.y < -10 ) this.nextPos.y = -10;
	};

	this.updatePos = function() {
		this.lastPos.copy( this.pos );
		this.pos.copy( this.nextPos );
	};
}

function randomf( min, max ) {
	return Math.random() * (max - min) + min;
}
