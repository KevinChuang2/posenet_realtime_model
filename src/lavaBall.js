function lavaball(size)
{
  //var geometry = new THREE.SphereGeometry( size, 32, 32 );
  var geometry = new THREE.TorusBufferGeometry( size, 0.1, 30, 30 )
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
