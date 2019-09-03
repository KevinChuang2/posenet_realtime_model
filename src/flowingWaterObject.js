//takes some curve path for water to follow
var wrapNum = 10.0;
function flowingWater(curvePath, curveRadius)
{
  var geometry = new THREE.TubeGeometry( curvePath, 200, curveRadius, 200, false );
  //var geometry = new THREE.SphereGeometry(0.2,100,100);
  var bufferGeometry = new THREE.BufferGeometry().fromGeometry( geometry );
  //bufferGeometry = new THREE.SphereBufferGeometry();
  var textureWater =  new THREE.TextureLoader().load( "images/water/water_color.jpg" );
  var waterNormal = new THREE.TextureLoader().load( "images/water/water_norm.jpg" );
  var waterBump = new THREE.TextureLoader().load( "images/water/water_disp.png" ) ;
  var waterOcclusion = new THREE.TextureLoader().load( "images/water/water_occ.jpg" ) ;
  var waterRoughness = new THREE.TextureLoader().load( "images/water/water_rough.jpg" ) ;
  var waterMaterial = new THREE.ShaderMaterial( {
		uniforms: {
			textureWater: { type: "t", value: textureWater},
			waterNormal:{ type: "t", value: waterNormal },
			waterBump:{ type: "t", value: waterBump},
			time: {value: 0},
			wrapNum: {value: wrapNum},
			rotationSpeed: {value: 2.0},
			lightPos: {value: new THREE.Vector3(0.0,0.0, 0.8)},
			viewPos: {value:new THREE.Vector3(0,0,1)},
			lightColor: {value: new THREE.Vector3(1.0,1.0,1)}

		},
		transparent: true,
		vertexShader: document.getElementById( 'vs-water' ).textContent.trim(),
		fragmentShader: document.getElementById( 'fs-water' ).textContent.trim(),
	} );
  var mesh = new THREE.Mesh( bufferGeometry, waterMaterial );
  setWrapping(waterNormal);
  setWrapping(textureWater);
  setWrapping(waterBump);
  this.mesh = mesh;
  this.geometry = bufferGeometry;
  this.material = waterMaterial;
  var realVertices = [];
  var realUvs = [];
  var positionAttributes = bufferGeometry.getAttribute('position');
  console.log(positionAttributes);
  var uvAttributes = bufferGeometry.getAttribute('uv');
  for(var i=0; i<positionAttributes.array.length; i+=3)
  {
	realVertices.push(new THREE.Vector3(positionAttributes.array[i], positionAttributes.array[i+1], positionAttributes.array[i+2]));
  }
  for(var i=0; i<uvAttributes.array.length; i+=2)
  {
	realUvs.push(new THREE.Vector2(uvAttributes.array[i], uvAttributes.array[i+1]));
  }
  console.log(positionAttributes);
  console.log(uvAttributes);
  var tangents = new Float32Array(positionAttributes.array.length);
  //var bitangents = new Float32Array(positionAttributes.array.length);
  var tangArray = [];
  //var bitangentArray = [];

   for (var i = 0; i < realVertices.length ; i += 3){
        var v0 = realVertices[i+0];
        var v1 = realVertices[i+1];
        var v2 = realVertices[i+2];

        var uv0 = realUvs[i+0];
        var uv1 = realUvs[i+1];
        var uv2 = realUvs[i+2]; 


        var deltaPos1 =  v1.sub(v0);
        var deltaPos2 = v2.sub(v0);

        var deltaUV1 = uv1.sub(uv0);
        var deltaUV2 = uv2.sub(uv0);

        var r = 1.0 / (deltaUV1.x * deltaUV2.y - deltaUV1.y * deltaUV2.x);
        var tangent =   deltaPos1.multiplyScalar(deltaUV2.y).sub(  deltaPos2.multiplyScalar(deltaUV1.y) ).multiplyScalar(r); //p1 * uv2.y - p2 * uv1.y
        //var bitangent =  deltaPos2.multiplyScalar(deltaUV2.x).sub(  deltaPos1.multiplyScalar(deltaUV2.x) ).multiplyScalar(r);
		tangent.normalize();
		//bitangent.normalize();
        tangArray.push(tangent.x);
        tangArray.push(tangent.y);
        tangArray.push(tangent.z);

        tangArray.push(tangent.x);
        tangArray.push(tangent.y);
        tangArray.push(tangent.z);

        tangArray.push(tangent.x);
        tangArray.push(tangent.y);
        tangArray.push(tangent.z);
		/*
        bitangentArray.push (bitangent.x);
        bitangentArray.push (bitangent.y);
        bitangentArray.push (bitangent.z);

        bitangentArray.push (bitangent.x);
        bitangentArray.push (bitangent.y);
        bitangentArray.push (bitangent.z);

        bitangentArray.push (bitangent.x);
        bitangentArray.push (bitangent.y);
        bitangentArray.push (bitangent.z);
        */
    } 
  for (var i = 0; i < tangArray.length; i++ ){
      tangents[i] =tangArray[i];
      //bitangents[i] = bitangentArray[i];
    }
  console.log(tangArray);
  bufferGeometry.addAttribute( 'tangent',  new THREE.BufferAttribute( tangents, 3 ) );
  //bufferGeometry.addAttribute( 'bitangent',  new THREE.BufferAttribute( bitangents, 3 ));
  this.updateTime = function(time)
  {
    this.material.uniforms.time.value = time;
  }
  this.updateCamera = function(position)
  {
  	this.material.uniforms.viewPos.value = new THREE.Vector3(position.x, position.y, position.z);
  	//this.material.uniforms.lightPos.value = new THREE.Vector3(position.x, position.y, position.z);
  }
  

}

function setWrapping(texture)
{
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(wrapNum, wrapNum);
	texture.needsUpdate = true;
}

function flowingWaterMatcap(curvePath, curveRadius)
{
  var geometry = new THREE.TubeGeometry( curvePath, 200, curveRadius, 200, false );
  //var geometry = new THREE.SphereGeometry(0.2,100,100);
  var bufferGeometry = new THREE.BufferGeometry().fromGeometry( geometry );
  //bufferGeometry = new THREE.SphereBufferGeometry();
  
  var matcap = new THREE.TextureLoader().load("images/water/cropped_Material_604.png");
  var waterMaterial = new THREE.MeshMatcapMaterial(
  {
  	color:0xFFEEEE,
  	matcap: matcap

  })
  waterMaterial.onBeforeCompile = (shader) => {
  console.log(shader);
  shader.uniforms.time = { value: 0}
  shader.vertexShader = `
         uniform float time;
         ` + shader.vertexShader
   const token = "#include <begin_fragment>";
   const customTransform = `
       vUv = vUv + vec2(time,time);
       
       `
   shader.fragmentShader =
         shader.fragmentShader.replace(token,customTransform)
   
  this.materialShader =  shader;
 }
  var mesh = new THREE.Mesh( bufferGeometry, waterMaterial );
  this.mesh = mesh;
  this.geometry = bufferGeometry;
  this.material = waterMaterial;
  this.updateTime = function(time)
  {
  	if(this.materialShader)
    	this.materialShader.uniforms.time.value = time;
  }
  this.rotate = function()
  {
  	this.mesh.rotation.z+=0.02;
  }
  

}