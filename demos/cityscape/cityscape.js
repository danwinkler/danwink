var scene;
var camera;
var renderer;

var cityWidth = 60;
var cityHeight = 60;

var roadSize = .05;
var buildingSize = .9;
var blockSize = buildingSize + roadSize*2;

var a = 0;

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
	camera.position.z = 10;

	camera.up = new THREE.Vector3( 0, 0, 1 );

	for( var x = 0; x < cityWidth; x++ )
	{
		for( var y = 0; y < cityHeight; y++ )
		{
			var material = new THREE.MeshBasicMaterial({
				color: new THREE.Color( Math.random(), Math.random(), Math.random() ),
				transparent: true,
				opacity: .5,
				side: THREE.DoubleSide
			});

			var distFromCenter = (Math.pow( x-cityWidth/2, 2) + Math.pow( y-cityHeight/2, 2 ));
			var medHeight = (50 - distFromCenter) * .1;
			var height = randomf( Math.max( medHeight, .3 ), Math.max( medHeight + 3, 1 ) );
			var building = new THREE.Mesh(
				new THREE.BoxGeometry(
					buildingSize,
					buildingSize,
					height
				),
				material
			);
			building.translateX( x * blockSize + roadSize );
			building.translateY( y * blockSize + roadSize );
			building.translateZ( height*.5 );

			scene.add( building );
		}
	}

	var light = new THREE.AmbientLight( 0x404040 ); // soft white light
	scene.add( light );
}

function draw()
{
	a += .003;
	camera.position.x = Math.cos( a ) * 30 + cityWidth/2;
	camera.position.y = Math.sin( a ) * 30 + cityHeight/2;

	camera.lookAt( new THREE.Vector3( cityWidth/2, cityHeight/2, 0 ) );
	renderer.render( scene, camera );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

function randomf( min, max ) {
	return Math.random() * (max - min) + min;
}
