function fireball(size, viewport) {
    var geometry = new THREE.SphereGeometry(size, 32, 32);
    geometry.computeBoundingBox();
    var fireballMaterial = new THREE.ShaderMaterial({
        uniforms: {
            textureSurface: {
                type: "t",
                value: new THREE.TextureLoader().load("images/fireball.png")
            },
            iTime: {
                value: 0
            },

            center: {
                value: new THREE.Vector2(geometry.boundingBox.getCenter().x, geometry.boundingBox.getCenter().y)
            },
            viewport: {
                value: viewport
            },
            scale: {
                value: 1.0
            }

        },
        vertexShader: document.getElementById('vs-fireball').textContent.trim(),
        fragmentShader: document.getElementById('fs-fireball').textContent.trim()

    });
    this.mesh = new THREE.Mesh(geometry, fireballMaterial);
    this.material = fireballMaterial;
    this.geometry = geometry;
    this.updateTime = function(time) {
        this.material.uniforms.iTime.value = time;
    }
    this.setPosition = function(position) {
        this.mesh.position.set(position.x, position.y, position.z);
        this.material.uniforms.center.value = new THREE.Vector2(position.x, position.y);
    }
    this.updateScale = function(scale) {
        this.material.uniforms.scale.value = scale;
        this.mesh.scale.set(scale, scale, scale);
    }
}

function fireballSprite() {
    var spriteMap = new THREE.TextureLoader().load("images/fireballSprite.png");
    var spriteMaterial = new THREE.SpriteMaterial({
        map: spriteMap,
        color: 0xffffff
    });
    var sprite = new THREE.Sprite(spriteMaterial);
    this.material = spriteMaterial;
    this.sprite = sprite;
}