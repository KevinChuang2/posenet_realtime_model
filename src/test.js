const width = 1000;
const height = 1000;
var viewport = new THREE.Vector2(width, height);
var canvas = document.createElement( 'canvas' );
var context = canvas.getContext( 'webgl2' );
const renderer = new THREE.WebGLRenderer( { canvas: canvas, context: context, antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize(width, height);
//renderer.autoClear = false;
renderer.setClearColor( 0x000000, 0 );

var scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 90, width/height, 0.1, 1000 ); 
camera.position.x =0;
camera.position.y = 0;
camera.position.z = 1; 
var controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.update();
document.body.appendChild( renderer.domElement );
scene.background = new THREE.Color( 0x000104 );
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
var pointLight = new THREE.PointLight( 0xffffff, 1 );
camera.add( pointLight );
controls.update();
var clock = new THREE.Clock();
var time = 0;

var waterLavaGroup = new THREE.Group();

var curvePathTest = new Helix(1);
var curveRadius = 0.1;
var lavaObject = new lavaspiral(curvePathTest, curveRadius);
waterLavaGroup.add(lavaObject.mesh);

//var curvePath = new CustomSinCurve(3 );
//var waterObject = new flowingWater(curvePath, curveRadius);
var waterObject = new flowingWaterMatcap(curvePathTest,  curveRadius);
var geo = new THREE.EdgesGeometry( waterObject.geometry ); // or WireframeGeometry( geometry )

var mat = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2 } );

var wireframe = new THREE.LineSegments( geo, mat );

//waterLavaGroup.add( wireframe );
//console.log(waterObject.geometry);
waterObject.geometry.uvsNeedUpdate = true;
//waterLavaGroup.add(waterObject.mesh);
scene.add(waterLavaGroup);
//console.log(waterObject.geometry.attributes);

waterLavaGroup.position.set(0,0,0);

var lightBallGeo = new THREE.SphereBufferGeometry(0.1,10,10);
var lightBallMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff} );
var sphere = new THREE.Mesh( lightBallGeo, lightBallMaterial );
//scene.add( sphere );
sphere.position.x = 0.0;
sphere.position.y = 0.0;
sphere.position.z = 1.0;

var tex = new THREE.TextureLoader().load("images/fire/fireTest3.jpg");
var fire = new THREE.Fire( tex );

scene.add( fire );

var parameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, stencilBuffer: false };
var renderTarget = new THREE.WebGLRenderTarget( width,height, parameters );
var renderModel = new THREE.RenderPass( scene, camera );
var effectBloom = new THREE.UnrealBloomPass(new THREE.Vector2(width,height), 1.5,0.4,0.85);
effectBloom.threshold = 0.20;
effectBloom.strength = 0.4;
effectBloom.radius = 0.2;
var composer = new THREE.EffectComposer( renderer, renderTarget );
composer.addPass( renderModel );
composer.addPass( effectBloom );

/*
var fireTexture = new THREE.TextureLoader().load( "images/fire/fireSpreadSheet.png" )
var fire = new TextureAnimator(fireTexture, 95, 1, 95 , 75);
var fireMaterial = new THREE.MeshBasicMaterial({map:fireTexture, side: THREE.DoubleSide});
var fireGeometry = new THREE.PlaneGeometry(50,50,1,1);
var fireMesh = new THREE.Mesh(fireGeometry, fireMaterial);
scene.add(fireMesh);
*/
var animate = function () {
  requestAnimationFrame( animate );
  var delta = clock.getDelta();
  time +=delta;
  //fire.update(1000*delta);
  controls.update();
  //renderer.render( scene, camera );
  composer.render(  );
  
  waterObject.updateTime(time);
  waterObject.rotate();
  lavaObject.updateTime(time);
  fire.update(time);
  

};


animate();

function getCenter(mesh)
{
  mesh.geometry.computeBoundingSphere();
  return mesh.geometry.boundingSphere.center;
}


