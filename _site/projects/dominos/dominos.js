var scene;
var camera;
var renderer;
var raycaster;
var mouse;

var world;

var lastTime = 0;

var dominoes = [];

var dominoCannonMaterial = new CANNON.Material();

var mouseDown = false;

function begin() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

	raycaster = new THREE.Raycaster();

	scene.add( camera );

	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.shadowMapEnabled = true;
	renderer.setSize( window.innerWidth, window.innerHeight );

	document.body.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );

	start();
	animate();
}

function animate( step ) {
	var timeStep = step - lastTime;
	requestAnimationFrame( animate );
	if( isNaN( step ) ) {
		return;
	}
	draw( timeStep );
	lastTime = step;
}

function start() {
	world = new CANNON.World();
	world.gravity.set( 0, 0, -9.82 ); // m/s²
	world.broadphase = new CANNON.NaiveBroadphase();

	world.allowSleep = true;

	var groundCannonMaterial = new CANNON.Material();

	var groundDominoContactMaterial = new CANNON.ContactMaterial(
		groundCannonMaterial,
		dominoCannonMaterial,
		{
			friction: .2
		}
	);

	var dominoDominoContactMaterial = new CANNON.ContactMaterial(
		dominoCannonMaterial,
		dominoCannonMaterial,
		{
			friction: .01
		}
	);

	world.addContactMaterial( groundDominoContactMaterial );
	world.addContactMaterial( dominoDominoContactMaterial );

	var groundBody = new CANNON.Body({
		mass: 0, // mass == 0 makes the body static
		material: groundCannonMaterial
	});
	var groundShape = new CANNON.Plane();
	groundBody.addShape(groundShape);
	world.add(groundBody);

	var color = new THREE.Color( .7, .5, .1 );

	var groundGeom = new THREE.PlaneBufferGeometry( 100, 100 );
	var groundMesh = new THREE.Mesh(
		groundGeom,
		new THREE.MeshLambertMaterial({
			color: color,
			ambient: color
		})
	);

	groundMesh.receiveShadow = true;

	scene.add( groundMesh );

	var light = new THREE.AmbientLight( 0x404040 ); // soft white light
	scene.add( light );

	var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
	directionalLight.position.set( 100, 100, 100 );

	directionalLight.castShadow = true;
	//directionalLight.shadowCameraVisible = true;

	directionalLight.shadowCameraNear = 120;
	directionalLight.shadowCameraFar = 250;

	directionalLight.shadowCameraLeft = -50;
	directionalLight.shadowCameraRight = 50;
	directionalLight.shadowCameraTop = 50;
	directionalLight.shadowCameraBottom = -50;

	scene.add( directionalLight );

	camera.position.x = 10;
	camera.position.y = 10;
	camera.position.z = 10;

	camera.up = new THREE.Vector3( 0, 0, 1 );

	/*
	for( var a = 0; a < Math.PI*2; a += Math.PI / 8 )
	{
		var x = Math.cos( a ) * 10;
		var y = Math.sin( a ) * 10;
		dominoes.push( new Domino( x, y, a ) );
		break;
	}
	*/

	document.onkeydown = function (e) {
		if( dominoes.length < 2 ) return;
		if( e.keyCode == 32 ) {
			var domA = dominoes[0].body;
			var domB = dominoes[1].body;
			var dx = domA.position.x - domB.position.x;
			var dy = domA.position.y - domB.position.y;
			var length = Math.sqrt( dx*dx + dy*dy );
			dx /= length;
			dy /= length;
			domA.applyImpulse(
				new CANNON.Vec3( -dx, -dy, 0 ),
				new CANNON.Vec3( domB.position.x - dx, domB.position.y - dy, domB.position.z )
			);
			domA.wakeUp();
		} else if( e.keyCode == 82 ) { // R
			while( dominoes.length > 0 ) {
				var d = dominoes.pop();
				d.delete();
			}
		}
	};

	mouse = new THREE.Vector2();

	var mouseListener = function( e ) {
		if( !mouseDown ) return;
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;

		raycaster.setFromCamera( mouse, camera );
		var intersect = raycaster.intersectObject( groundMesh )[0];

		if( !intersect ) {
			return;
		}

		var dx = 0;
		var dy = 1;

		if( dominoes.length > 0 ) {
			var lastDomino = dominoes[dominoes.length-1];

			var dx = lastDomino.body.position.x-intersect.point.x;
			var dy = lastDomino.body.position.y-intersect.point.y;

			var distance = dx*dx + dy*dy;
			if( distance < 2*2 ) {
				return;
			}
		}

		dominoes.push( new Domino(
			intersect.point.x,
			intersect.point.y,
			-Math.atan2( -dy, dx ) + Math.PI*.5
		) );

		if( dominoes.length == 2 ) {
			dominoes[0].body.quaternion.setFromAxisAngle(
				new CANNON.Vec3( 0, 0, 1 ),
				-Math.atan2( -dy, dx ) + Math.PI*.5
			);
		}
	};

	$("canvas").mousemove( mouseListener );
	$("canvas").mousedown( mouseListener );

	$("canvas").mousedown( function() { mouseDown = true; } );
	$("canvas").mouseup( function() { mouseDown = false; } );

	//controls = new THREE.OrbitControls( camera, renderer.domElement );
}

function draw( step ) {
	world.step( Math.min( step, 20 ) * .002 );

	for( var i in dominoes ) {
		var domino = dominoes[i];
		domino.update();
	}

	camera.position.x = -50;
	camera.position.y = 0;
	camera.position.z = 50;
	camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
	renderer.render( scene, camera );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

var shape = new CANNON.Box( new CANNON.Vec3( 1, .2, 3 ) );

var Domino = function( x, y, rot ) {
	this.body = new CANNON.Body({
		mass: 1,
		material: dominoCannonMaterial
	});
	this.body.addShape( shape );
	this.body.position.set( x, y, 3 );

	this.body.allowSleep = true;

	this.body.quaternion.setFromAxisAngle( new CANNON.Vec3( 0, 0, 1 ), rot );

	var color = new THREE.Color( Math.random(), Math.random(), Math.random() );

	this.geometry = new THREE.Mesh(
		new THREE.BoxGeometry(
			shape.halfExtents.x*2,
			shape.halfExtents.y*2,
			shape.halfExtents.z*2
		),
		new THREE.MeshLambertMaterial({
			color: color,
			ambient: color
		})
	);

	this.geometry.castShadow = true;
	this.geometry.receiveShadow = true;

	world.add( this.body );
	scene.add( this.geometry );

	this.update = function() {
		this.geometry.position.copy( this.body.position );
		this.geometry.quaternion.copy( this.body.quaternion );
	};

	this.delete = function() {
		world.remove( this.body );
		scene.remove( this.geometry );
	};

	this.update();
};

function randomf( min, max ) {
	return Math.random() * (max - min) + min;
}

function toRadians( a )
{
	return a * (Math.PI / 180);
}

function toDegrees( a )
{
	return a / (Math.PI / 180);
}
