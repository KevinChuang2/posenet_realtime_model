function earthball(size, viewport)
{
  var geometry = new THREE.SphereGeometry( size, 20,20 );
  geometry.computeBoundingBox();
  var earthballMaterial = new THREE.ShaderMaterial( {
		uniforms: {
		  iTime: {value: 0},

          center: {value: new THREE.Vector3(0.0,0.0,0.0)},
          viewport: {value: viewport},
          scale: {value: 1.0},
          diffuse_map: {value: new THREE.TextureLoader().load( "images/rock/diffuse_map.jpg" )},
          normal_map: {value: new THREE.TextureLoader().load( "images/rock/normal_map.jpg" )},
          bump_map: {value: new THREE.TextureLoader().load( "images/rock/bump_map.jpg" )},
          ambientocclusion_map: {value: new THREE.TextureLoader().load( "images/rock/ambientocclusion_map.jpg" )},
          light_position: {value: new THREE.Vector3(1.0,1.0,1.0)},
          light_color: {value: new THREE.Vector3(1.0,1.0,1.0)}

		},
		vertexShader: document.getElementById( 'vs-earthball' ).textContent.trim(),
		fragmentShader: document.getElementById( 'fs-earthball' ).textContent.trim()

	} );
  this.mesh = new THREE.Mesh(geometry, earthballMaterial);
  this.material = earthballMaterial;
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
