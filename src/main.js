// three.js setup

const width = 500;
const height = 500;

// Setup scene
const scene = new THREE.Scene();

//  We use an orthographic camera here instead of persepctive one for easy mapping
//  Bounded from 0 to width and 0 to height
// Near clipping plane of 0.1; far clipping plane of 1000
const camera = new THREE.PerspectiveCamera( 90, width/height, 0.1, 1000 ); 
camera.position.z = 1; 

var canvas = document.createElement( 'canvas' );
var context = canvas.getContext( 'webgl2' );

// Setting up the renderer
const renderer = new THREE.WebGLRenderer( { canvas: canvas, context: context, antialias: true, alpha  :true } );

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( width, height );



// Attach the threejs animation to the div with id of threeContainer
const container = document.getElementById( 'threeContainer' );
container.appendChild( renderer.domElement );

var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
container.appendChild( stats.dom );


var clock = new THREE.Clock();

const ambientLight =
  new THREE.AmbientLight(0xFFFFFF);

// set its position
ambientLight.position.x = 100;
ambientLight.position.y = 200;
ambientLight.position.z = 130;

// add to the scene
scene.add(ambientLight);
var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
scene.add( directionalLight );

var loader = new THREE.GLTFLoader();
var model;
var boneDict = {};
var boneAngles = {};
// Load a glTF resource
loader.load(
	// resource URL
	'models/human.glb',
	// called when the resource is loaded
	function ( gltf ) {

        model = gltf.scene;
        scene.add( model );
        model.scale.set( -0.25,0.25,0.25);
        model.traverse( function ( object ) {
                        if ( object.isMesh ) object.castShadow = true;
                    } );

        var box = new THREE.Box3().setFromObject( model );
        model.position.set(0, 0, 0);
		
		helper = new THREE.SkeletonHelper( model );
		helper.material.linewidth = 5;
		helper.visible = true;
		scene.add(helper);

        var bones = model.children[1].skeleton.bones;
		for(var i=0; i<bones.length; i++)
	    {
		  boneDict[bones[i].name] = bones[i];
	    }
		populateBoneAngles(boneDict, boneAngles);
	},
	// called while loading is progressing
	function ( xhr ) {
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	},
	// called when loading has errors
	function ( error ) {
		console.log( 'An error happened' );
	}
);

/*
var ironManGeometry = new THREE.Geometry();
var mtlLoader = new THREE.MTLLoader();
mtlLoader.load( 'models/IronMan/IronMan.mtl', function( materials ) {

  materials.preload();

  var objLoader = new THREE.OBJLoader();
  objLoader.setMaterials( materials );
  objLoader.load( "models/IronMan/IronMan.obj", function ( object ) {
    console.log(object);
    for(var i=0; i<object.children.length; i++)
    {
      var tempGeometry =  new THREE.Geometry().fromBufferGeometry( object.children[i].geometry);
      object.children[i].updateMatrix();
      ironManGeometry.merge(tempGeometry, object.children[i].matrix);
    }
    var tempMesh = new THREE.Mesh(ironManGeometry, new THREE.MeshBasicMaterial( { color: 0xffffff } ));
    console.log("done");
    console.log(tempMesh);
    scene.add( tempMesh );
  } );

} );
*/
var time = 0.0;
// POSENET
// Adapted from code at https://github.com/tensorflow/tfjs-models/blob/master/posenet/demos/camera.js

// Check on the device that you are viewing it from
function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}

function isiOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isMobile() {
  return isAndroid() || isiOS();
}

// Load camera
async function setupCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(
        'Browser API navigator.mediaDevices.getUserMedia not available');
  }

  const video = document.getElementById('video');
  video.width = width;
  video.height = height;

  const mobile = isMobile();
  const stream = await navigator.mediaDevices.getUserMedia({
    'audio': false,
    'video': {
      facingMode: 'user',
      width: mobile ? undefined : width,
      height: mobile ? undefined : height,
    },
  });
  video.srcObject = stream;

  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

async function loadVideo() {
  const video = await setupCamera();
  video.play();

  return video;
}

// Net will hold the posenet model

let net;

// Initialise trackers to attach to body parts recognised by posenet model


// Main animation loop
function render(video, net) {
  stats.begin();
  const canvas = document.getElementById('output');
  const ctx = canvas.getContext('2d');

  // Flip the webcam image to get it right
  const flipHorizontal = false;

  canvas.width = width;
  canvas.height = height;

  async function detect() {


    // Scale the image. The smaller the faster
    const imageScaleFactor = 0.5;

    // Stride, the larger, the smaller the output, the faster
    const outputStride = 64;

    // Store all the poses
    let poses = [];
    let minPoseConfidence;
    let minPartConfidence;

    const pose = await net.estimateSinglePose(video, 
                                              0.5, 
                                              flipHorizontal, 
                                              64);

    // Show a pose (i.e. a person) only if probability more than 0.1
    minPoseConfidence = 0.1;
    // Show a body part only if probability more than 0.3
    minPartConfidence = 0.5;
    //poses.push(pose);
    var group = new THREE.Group();
    var bodyPositions = {};
    for (point in pose.keypoints)
    {
      if(pose.keypoints[point].score>minPartConfidence)
      {
        //translate to ratio coordinates
        var posX = ((width/2)-pose.keypoints[point].position.x)/(width/2);
        var posY = ((height/2)-pose.keypoints[point].position.y)/(height/2);
        var tempMesh = draw_square_point(posX, posY, 0x00FF00);
        bodyPositions[pose.keypoints[point].part] = new THREE.Vector3(posX, posY, 0);
        group.add(tempMesh);
      }
    }
    scene.add(group);
    /*
    console.log(bodyPositions);
    console.log(boneDict);
    */
    if(model)
    {
      var boneMidPoint;
      var boneShoulderR = new THREE.Vector3();
      var boneShoulderL = new THREE.Vector3();
      boneDict['shoulderR'].getWorldPosition(boneShoulderR);
      boneDict['shoulderL'].getWorldPosition(boneShoulderL);
      boneMidPoint = midPoint(boneShoulderR, boneShoulderL);
      if(bodyPositions['leftShoulder'] && bodyPositions['rightShoulder'] )
      {
      	realToModelRatio = bodyPositions['leftShoulder'].distanceTo(bodyPositions['rightShoulder'])/(boneShoulderR.distanceTo(boneShoulderL));
        
      	personMidPoint = midPoint(bodyPositions['leftShoulder'], bodyPositions['rightShoulder']);
      	personMidPoint.z = 0;
      	group.add(draw_square_point(personMidPoint.x,personMidPoint.y,0x00FF00));
      	offset = personMidPoint.clone().sub(boneMidPoint);
        model.position.set(model.position.x+offset.x, model.position.y + offset.y,0);
        
        if(realToModelRatio>9 || realToModelRatio<6)
        	model.scale.set(model.scale.x*realToModelRatio/7, model.scale.y*realToModelRatio/7, model.scale.z*realToModelRatio/7);
        
	
        if(bodyPositions['nose'])
        {
        	var headAngle = angleBetweenTwoX(personMidPoint, bodyPositions['nose']);
        	if(headAngle>0)
				boneDict['neck'].rotation.z =-headAngle+Math.PI/2;
			else
				boneDict['neck'].rotation.z =-headAngle-Math.PI/2;
        }
        if(bodyPositions['leftElbow'])
        {
        	var armAngle = angleBetweenTwoX(bodyPositions['leftShoulder'], bodyPositions['leftElbow']);
        	boneDict['upper_armL'].rotation.z = boneAngles['shoulderElbowL'] - armAngle - 3*Math.PI/4;
        }
        if(bodyPositions['rightElbow'])
        {
        	var armAngle = angleBetweenTwoX( bodyPositions['rightShoulder'], bodyPositions['rightElbow']);
        	boneDict['upper_armR'].rotation.z = boneAngles['shoulderElbowR'] - armAngle + 3*Math.PI/4;
        }
        if(bodyPositions['leftWrist'] && bodyPositions['leftElbow'])
        {
        	var angle = angleBetweenTwoX(bodyPositions['leftWrist'], bodyPositions['leftElbow']);
        	//var angle = Math.atan2((bodyPositions['leftWrist'].y-bodyPositions['leftElbow'].y),(bodyPositions['leftWrist'].x-bodyPositions['leftElbow'].x));
        	boneDict['forearmL'].rotation.z = boneAngles['elbowWristL'] - angle - Math.PI/2 ;
        	
        }
        if(bodyPositions['rightWrist'] && bodyPositions['rightElbow'])
        {
        	var armAngle = angleBetweenTwoX(bodyPositions['rightElbow'], bodyPositions['rightWrist']);
        	boneDict['forearmR'].rotation.z = boneAngles['elbowWristR'] - armAngle -Math.PI/2 ;
        }

        //boneDict['shoulderL'].position.set(bodyPositions['rightShoulder']);
      }
      else
      {
      	//couldnt find shoulders
      }
    }
    var delta = clock.getDelta();
    time += delta;
    
    ctx.clearRect(0, 0, width, height);
    const showVideo = true;
    if (showVideo) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.translate(-width, 0);
      // ctx.filter = 'blur(5px)';
      ctx.drawImage(video, 0, 0, width, height);
      ctx.restore();
    }
    
    renderer.render( scene, camera );

	scene.remove(group);
    stats.end();
    requestAnimationFrame(detect);
    
    
    
    //composer.render(delta);
    
  }

  detect();

}


async function main() {
  // Load posenet
  const net = await posenet.load({
    architecture: "MobileNetV1"
    });

  document.getElementById('main').style.display = 'block';
  let video;

  try {
    video = await loadVideo();
  } catch (e) {
    let info = document.getElementById('info');
    info.textContent = 'this browser does not support video capture,' +
        'or this device does not have a camera';
    info.style.display = 'block';
    throw e;
  }

  render(video, net);
}

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;


function draw_square_point(posX,posY, color)
{
  size = 0.01;
  var squareShape = new THREE.Shape();
  squareShape.moveTo( posX-size/2, posY-size/2 );
  squareShape.lineTo( posX-size/2, posY+size/2);
  squareShape.lineTo( posX+size/2, posY+size/2 );
  squareShape.lineTo( posX+size/2, posY-size/2 );
  var geometry = new THREE.ShapeGeometry( squareShape );
  var material = new THREE.MeshBasicMaterial( { color: color } );
  var mesh = new THREE.Mesh( geometry, material ) ;
  geometry.dispose();
  material.dispose();
  return mesh;
}



main();


function _mergeMeshes(meshes, toBufferGeometry) {

    var finalGeometry,
        materials = [],
        mergedGeometry = new THREE.Geometry(),
        mergeMaterial,
        mergedMesh;

    meshes.forEach(function(mesh, index) {
        mesh.updateMatrix();
        mesh.geometry.faces.forEach(function(face) {face.materialIndex = 0;});
        mergedGeometry.merge(mesh.geometry, mesh.matrix, index);
        materials.push(mesh.material);
    });

    mergedGeometry.groupsNeedUpdate = true;
    mergeMaterial = new THREE.MeshFaceMaterial(materials);

    if (toBufferGeometry) {
        finalGeometry = new THREE.BufferGeometry().fromGeometry(mergedGeometry);
    } else {
        finalGeometry = mergedGeometry;
    }

    mergedMesh = new THREE.Mesh(finalGeometry, mergeMaterial);
    mergedMesh.geometry.computeFaceNormals();
    mergedMesh.geometry.computeVertexNormals();

    return mergedMesh;

}

function midPoint(vec1, vec2)
{
	return new THREE.Vector3((vec1.x+vec2.x)/2, (vec1.y+vec2.y)/2, (vec1.z+vec2.z)/2);
}

function angleBetweenTwoX(vec1,vec2)
{
	return Math.atan2((vec1.y-vec2.y),(vec1.x-vec2.x));
}
function angleBetweenTwoY(vec1,vec2)
{
	return Math.atan((vec1.x-vec2.x)/(vec1.y-vec2.y));
}

function angleaTan2(vec1, vec2)
{
	return Math.atan2((vec1.y-vec2.y),(vec1.x-vec2.x));
}
function populateBoneAngles(boneDict, angleDict)
{
	angleDict['shoulderElbowL'] = angleBetweenTwoX(boneDict['shoulderL'].position, boneDict['upper_armL'].position);
	angleDict['shoulderElbowR'] = angleBetweenTwoX(boneDict['shoulderR'].position, boneDict['upper_armR'].position);
	angleDict['elbowWristL'] = angleBetweenTwoX(boneDict['upper_armL'].position, boneDict['handL'].position);
	angleDict['elbowWristR'] = angleBetweenTwoX(boneDict['upper_armR'].position, boneDict['handR'].position);
}