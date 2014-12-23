var scene;
var camera;
var renderer;

var world;

var lastTime = 0;

var dominoes = []

function begin() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

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
	world.gravity.set(0,0,-9.82); // m/s²
	world.broadphase = new CANNON.NaiveBroadphase();

	var groundBody = new CANNON.Body({
		mass: 0 // mass == 0 makes the body static
	});
	var groundShape = new CANNON.Plane();
	groundBody.addShape(groundShape);
	world.add(groundBody);

	var color = new THREE.Color( Math.random(), Math.random(), Math.random() );

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

	for( var x = 0; x < 10; x++ )
	{
		dominoes.push( new Domino( 0, x*3, 0 ) );
	}

	var domB = dominoes[0].body;
	domB.applyImpulse(
		new CANNON.Vec3( domB.position.x, domB.position.y, domB.position.z-1 ),
		new CANNON.Vec3( 0, -1, 0 )
	);

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

var shape = new CANNON.Box( new CANNON.Vec3( 1, .1, 3 ) );

var Domino = function( x, y, rot ) {
	this.body = new CANNON.Body({ mass: 1 });
	this.body.addShape( shape );
	this.body.position.set( x, y, 3 );

	this.body.quaternion.setFromAxisAngle( new CANNON.Vec3(0,0,1), rot );

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

	world.add( this.body );
	scene.add( this.geometry );

	this.update = function() {
		this.geometry.position.copy( this.body.position );
		this.geometry.quaternion.copy( this.body.quaternion );
	};

	this.update();
};

function randomf( min, max ) {
	return Math.random() * (max - min) + min;
}
