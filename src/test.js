var canvas = document.createElement( 'canvas' );
var context = canvas.getContext( 'webgl2' );
const renderer = new THREE.WebGLRenderer( { canvas: canvas, context: context, antialias: true, alpha:true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( 500,500 );
renderer.setClearColor( 0x000000, 0 );

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.lookAt( 0, 0, 0 );
var controls = new THREE.OrbitControls( camera, renderer.domElement );

document.body.appendChild( renderer.domElement );
scene.background = new THREE.Color( 0x000104 );
scene.fog = new THREE.FogExp2( 0x000104, 0.0000675 );

/****************************************************/
//create base cylinder
/****************************************************/

var centerX = 0;
var centerY = 0;
var cylinderTopRad = 0.005;
var cylinderBotRad = 0.005;
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
scene.add( cylinder );


var start = new THREE.Vector3(0,0,0);
var end = new THREE.Vector3(Math.random(), Math.random(),0);
var group = new THREE.Group();
generateLightning(start,end, group);
scene.add(group);
var groups = [];
groups.push(group);

camera.position.z = 1;
controls.update();

//scene.add( new THREE.AmbientLight( 0xFFFFFF ) );




var clock = new THREE.Clock();

var waterGroup = new THREE.Group();
createTestWater(waterGroup);
scene.add( waterGroup );
waterGroup.children[0].material.uniforms.viewPos.value = camera.position;
// White directional light at half intensity shining from the top.
var directionalLight = new THREE.DirectionalLight( 0xffffff, 1.0 );
//scene.add( directionalLight );
directionalLight.target = waterGroup.children[0];

var time = 0;
var animate = function () {
  requestAnimationFrame( animate );
  var delta = clock.getDelta();
  time +=delta;
  if(time>50.0)
  {
  	time = 0;
  }
  waterGroup.children[0].material.uniforms.time.value = time;
  for(var groupNum in groups)
  {
  	var lines = groups[groupNum].children;
    for(var lineNum in lines)
    {
    	lines[lineNum].material.uniforms.time.value = time;
    }
  }
	
  renderer.render( scene, camera );
  controls.update();

  //composer.render();
};


animate();

function getCenter(mesh)
{
  mesh.geometry.computeBoundingSphere();
  return mesh.geometry.boundingSphere.center;
}
