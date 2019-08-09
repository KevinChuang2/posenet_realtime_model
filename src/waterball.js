function waterball(size, viewport)
{
  var geometry = new THREE.SphereGeometry( size, 32, 32 );
  geometry.computeBoundingBox();
  var waterballMaterial = new THREE.ShaderMaterial( {
		uniforms: {
		  iTime: {value: 0},

          center: {value: new THREE.Vector2(geometry.boundingBox.getCenter().x,geometry.boundingBox.getCenter().y )},
          viewport: {value: viewport},
          scale: {value: 1.0},
          diffuse_map: {value: new THREE.TextureLoader().load( "images/rock/diffuse_map.jpg" )},
          normal_map: {value: new THREE.TextureLoader().load( "images/rock/normal_map.jpg" )},
          light_position: {value: new THREE.Vector3(1.0,1.0,1.0)},
          light_color: {value: new THREE.Vector3(1.0,1.0,1.0)}

		},
		vertexShader: document.getElementById( 'vs-waterball' ).textContent.trim(),
		fragmentShader: document.getElementById( 'fs-waterball' ).textContent.trim()

	} );
  this.mesh = new THREE.Mesh(geometry, waterballMaterial);
  this.material = waterballMaterial;
  this.geometry = geometry;
  this.updateTime = function(time)
  {
    this.material.uniforms.iTime.value = time;
  }
  this.setPosition = function(position)
  {
  	this.mesh.position.set(position.x, position.y, position.z);
  	this.material.uniforms.center.value = new THREE.Vector2(position.x, position.y);
  }
  this.updateScale = function(scale)
  {
  	this.material.uniforms.scale.value = scale;
  	this.mesh.scale.set(scale,scale, scale);
  }
}
