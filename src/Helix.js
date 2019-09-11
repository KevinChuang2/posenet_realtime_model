function Helix( scale) {

	THREE.Curve.call( this );


	this.scale = ( scale === undefined ) ? 1 : scale;
}

Helix.prototype = Object.create( THREE.Curve.prototype );
Helix.prototype.constructor = Helix;

Helix.prototype.getPoint = function ( t ) {

    
    var tx = 0.5*Math.sin(Math.PI*4*t);
	var ty = 1.5*t-0.75;
	var tz = 0.5*Math.cos(Math.PI*4*t);
    
	return new THREE.Vector3( tx, ty, tz ).multiplyScalar( this.scale );

};