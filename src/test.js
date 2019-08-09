const width = 1000;
const height = 1000;
var viewport = new THREE.Vector2(width, height);
var canvas = document.createElement( 'canvas' );
var context = canvas.getContext( 'webgl2' );
const renderer = new THREE.WebGLRenderer( { canvas: canvas, context: context, antialias: true, alpha:true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize(width, height);
renderer.setClearColor( 0x000000, 0 );

var scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 90, width/height, 0.1, 1000 ); 
camera.position.z = 1; 
var controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.update();
document.body.appendChild( renderer.domElement );
scene.background = new THREE.Color( 0x000104 );
scene.fog = new THREE.FogExp2( 0x000104, 0.0000675 );

/****************************************************/
//create base cylinder
/****************************************************/

var centerX = 0;
var centerY = 0;
var cylinderTopRad = 0.2;
var cylinderBotRad = 0.2;
var cylinderLength = 0.5;
var cylinderRadialSeg =10;
var cylinderHeightSeg = 10;


var geometry = new THREE.CylinderGeometry(cylinderTopRad, cylinderBotRad, cylinderLength,cylinderRadialSeg,cylinderHeightSeg);
var material = new THREE.MeshPhongMaterial({
		flatShading: THREE.SmoothShading,
		color: 0x00BFFF,
		specular: 0x111111,
		shininess: 20,
		emissive: 0xd3ecf3,
		emissiveIntensity: 0.3,
		reflectivity: 0.3,
		combine: THREE.MixOperation,
	});
var cylinder = new THREE.Mesh( geometry, material );
cylinder.position.set(centerX,centerY,0.0);
//scene.add( cylinder );

var light = new THREE.AmbientLight( 0xFFFFFF ); // soft white light
scene.add( light );
camera.position.z = 1;
controls.update();

var waterballObject = new waterball(0.2, viewport);
scene.add(waterballObject.mesh);
//scene.add( new THREE.AmbientLight( 0xFFFFFF ) );




var clock = new THREE.Clock();


var time = 0;
var animate = function () {
  requestAnimationFrame( animate );
  var delta = clock.getDelta();
  time +=delta;
  waterballObject.updateTime(time);
  controls.update();
  renderer.render( scene, camera );

  //composer.render();
};


animate();

function getCenter(mesh)
{
  mesh.geometry.computeBoundingSphere();
  return mesh.geometry.boundingSphere.center;
}
