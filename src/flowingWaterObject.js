//takes some curve path for water to follow
function flowingWater(curvePath, curveRadius)
{
  var geometry = new THREE.TubeGeometry( curvePath, 50, curveRadius, 30, false );
  
  var waterMaterial = new THREE.ShaderMaterial( {
		uniforms: {
			shallowColor: {value: new THREE.Vector4(0.1, 0.92, 0.999, 0.725)},
			deepColor: {value: new THREE.Vector3(0.086, 0.407, 1, 0.749)},
			textureWater: { type: "t", value: new THREE.TextureLoader().load( "images/water.jpg" ) },
			time: {value: 0},
			side: {value: -1},
			rotationSpeed: {value: 4.0},
			lightPos: {value: new THREE.Vector3(0,0,1)},
			lightColor: {value: new THREE.Vector4(.7,1,1,1)}

		},
		vertexShader: document.getElementById( 'vs-water' ).textContent.trim(),
		fragmentShader: document.getElementById( 'fs-water' ).textContent.trim(),
	} );
  var mesh = new THREE.Mesh( geometry, waterMaterial );
 
  this.mesh = mesh;
  this.material = waterMaterial;
  this.updateTime = function(time)
  {
    this.material.uniforms.time.value = time;
  }
  

}