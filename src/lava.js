function lavatorus(size)
{
  //var geometry = new THREE.SphereGeometry( size, 32, 32 );
  var geometry = new THREE.TorusBufferGeometry( size, 0.1, 30, 30 )
  //var geometry = new THREE.TorusBufferGeometry( 0.3, 0.4, 30, 30 )
  geometry.computeBoundingBox();
  var textureLoader = new THREE.TextureLoader();
  var lavaballMaterial = new THREE.ShaderMaterial( {
		uniforms: {
			texture1: { value: textureLoader.load( 'images/lava/cloud.png' ) },
			texture2: { value: textureLoader.load( 'images/lava/lavatile.jpg' ) },
			time: {value: 0},
			uvScale: {value: new THREE.Vector2(2.0,1.0)}

		},
		vertexShader: document.getElementById( 'vs-lavaball' ).textContent.trim(),
		fragmentShader: document.getElementById( 'fs-lavaball' ).textContent.trim()

	} );

  lavaballMaterial.uniforms[ "texture1" ].value.wrapS = lavaballMaterial.uniforms[ "texture1" ].value.wrapT = THREE.RepeatWrapping;
  lavaballMaterial.uniforms[ "texture2" ].value.wrapS = lavaballMaterial.uniforms[ "texture2" ].value.wrapT = THREE.RepeatWrapping;
  this.mesh = new THREE.Mesh(geometry, lavaballMaterial);
  this.material = lavaballMaterial;
  this.geometry = geometry;
  this.updateTime = function(time)
  {
    this.material.uniforms.time.value = time;
  }
}
function lavaspiral(curvePath, curveRadius)
{
  var geometry = new THREE.TubeGeometry( curvePath, 200, curveRadius, 200, false );
  geometry.computeBoundingBox();
  var textureLoader = new THREE.TextureLoader();
  var lavaMaterial = new THREE.ShaderMaterial( {
		uniforms: {
			texture1: { value: textureLoader.load( 'images/lava/cloud.png' ) },
			texture2: { value: textureLoader.load( 'images/lava/lavatile.jpg' ) },
			time: {value: 0},
			uvScale: {value: new THREE.Vector2(5.0,1.0)}

		},
		vertexShader: document.getElementById( 'vs-lavaball' ).textContent.trim(),
		fragmentShader: document.getElementById( 'fs-lavaball' ).textContent.trim()

	} );

  lavaMaterial.uniforms[ "texture1" ].value.wrapS = lavaMaterial.uniforms[ "texture1" ].value.wrapT = THREE.RepeatWrapping;
  lavaMaterial.uniforms[ "texture2" ].value.wrapS = lavaMaterial.uniforms[ "texture2" ].value.wrapT = THREE.RepeatWrapping;
  this.mesh = new THREE.Mesh(geometry, lavaMaterial);
  this.material = lavaMaterial;
  this.geometry = geometry;
  this.updateTime = function(time)
  {
    this.material.uniforms.time.value = time;
  }
  this.rotate = function()
  {
  	this.mesh.rotation.y+=0.04;
  }
}
