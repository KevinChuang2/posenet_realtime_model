var length = 0.5;
var curveLengthScalar = 12.566;
var curveSizeScalar = 0.15;
var curveScale = 2;

function CustomSinCurve( scale, majorRadius, minorRadius, numHelixes ) {

	THREE.Curve.call( this );

	this.scale = ( scale === undefined ) ? 1 : scale;
	this.R = majorRadius;
	this.r = minorRadius;
	this.n = numHelixes;

}

CustomSinCurve.prototype = Object.create( THREE.Curve.prototype );
CustomSinCurve.prototype.constructor = CustomSinCurve;

CustomSinCurve.prototype.getPoint = function ( t ) {

    var curveLength =Math.PI*2;
    
    /*
    var tx = 0.15*Math.sin(Math.PI*8*t);
	var ty = 0.6*t;
	var tz = 0.15*Math.cos(Math.PI*8*t);
    */
    
    /*
	var tx = curveSizeScalar* Math.sin( curveLengthScalar*  t );
	var ty = curveSizeScalar*1.5*Math.sin(curveLengthScalar*1.5*t);
	var tz = curveSizeScalar* Math.cos(curveLengthScalar*t);
	*/
	
	
    var tx = (this.R+this.r*Math.cos(this.n*t*curveLength)) * Math.cos(t*curveLength);
	var ty = (this.R+this.r*Math.cos(this.n*t*curveLength)) * Math.sin(t*curveLength);
	var tz = this.r*Math.sin(this.n*t*curveLength);
	
	
	return new THREE.Vector3( tx, ty, tz ).multiplyScalar( this.scale );

};