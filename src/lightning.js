function generateLightning(start,end, group)
{
	var perpindLine = new THREE.Vector3(end.y-start.y, -(end.x-start.x),0);
	perpindLine = perpindLine.normalize();
	var tempVertices = []
	tempVertices.push(start.x,start.y,start.z);
	tempVertices.push(end.x,end.y,end.z);
	var maxOffset = 0.02;
	tempVertices = bendLightning(tempVertices, 0.04, 11);
	var lightningVertices= new Float32Array(tempVertices);
	var lightningGeometry = new THREE.BufferGeometry();
	lightningGeometry.addAttribute( 'position', new THREE.BufferAttribute( lightningVertices, 3 ) );

	var lightningMaterial = new THREE.ShaderMaterial( {
		uniforms: {
			opacity: {value: 1.0},
			offset: {value: new THREE.Vector2(0,0)},
			colorVal: {value: new THREE.Vector3(.49,.976,1.0)},
			time: {value: 0},
			begin: {value: start },
			end: {value: end}
		},
		blending: THREE.AdditiveBlending,
		vertexShader: document.getElementById( 'vs-lightning' ).textContent.trim(),
		fragmentShader: document.getElementById( 'fs-lightning' ).textContent.trim(),
		depthTest: false,
		transparent: true
	} );

	var lightningLine = new THREE.Line( lightningGeometry, lightningMaterial );
	group.add(lightningLine);

	thickenLightning(lightningGeometry,lightningMaterial, 10, group, perpindLine);
	lightningGeometry.dispose();
	lightningMaterial.dispose();
}

function bendLightning(arr, maxLength, numTimes)
{
	var varyingMaxLength = maxLength;
	for(var i=0; i<numTimes; i++)
	{
		varyingMaxLength = Math.max(0, varyingMaxLength-varyingMaxLength*i/numTimes)
		arr = bendLightningOnce(arr, varyingMaxLength);
		if(Math.random()<0.5)
		{
			//console.log("branch");	
		}

	}
	return arr;
}
function bendLightningOnce(arr, maxLength)
{
	for(var i =0; i<arr.length-3; i=i+6)
	{
		
		var pos1 = new THREE.Vector3(arr[i], arr[i+1], arr[i+2]);
		var pos2 = new THREE.Vector3(arr[i+3], arr[i+4], arr[i+5]);
		var perpindicular = new THREE.Vector3(pos2.y-pos1.y,-(pos2.x-pos1.x), 0)
		perpindicular = perpindicular.normalize();
		var randomOffset = Math.random()*maxLength*2-maxLength;
		var randomVec = new THREE.Vector3(perpindicular.x*randomOffset , perpindicular.y*randomOffset, 0);
		arr.splice(i+3, 0,(pos1.x+(pos2.x-pos1.x)/2) + randomVec.x);
		arr.splice(i+4, 0,(pos1.y+(pos2.y-pos1.y)/2) + randomVec.y);
		arr.splice(i+5, 0,(pos1.z+(pos2.z-pos1.z)/2) + randomVec.z);
		pos1 = undefined;
		pos2 = undefined;
	}
	return arr;
}
function thickenLightning(lightningGeometry,lightningMaterial,num, group, normal)
{
	var offset = 0.001;
	var colorxscalar = 0.49;
	var coloryscalar = 0.88;
	var rColor = lightningMaterial.uniforms.colorVal.value.x;
	var gColor = lightningMaterial.uniforms.colorVal.value.y;
	for(var i=0; i<num; i++)
	{
		var temp = lightningMaterial.clone();
		var tempLine = lightningGeometry.clone();
		temp.uniforms.offset.value = new THREE.Vector3(normal.x*i*offset, normal.y*i*offset,0);
		temp.uniforms.colorVal.value.y = gColor - coloryscalar*i/(num-5);
		temp.uniforms.colorVal.value.x = rColor - colorxscalar*i/(num-5);
		temp.uniforms.opacity.value = 1-i*0.05;
		group.add(new THREE.Line(tempLine, temp));
		temp.dispose();
		tempLine.dispose();

	}
	for(var i=0; i<num; i++)
	{
		var temp = lightningMaterial.clone();
		var tempLine = lightningGeometry.clone();
		temp.uniforms.offset.value = new THREE.Vector3(-normal.x*i*offset, -normal.y*i*offset,0);
		temp.uniforms.colorVal.value.y = gColor - coloryscalar*i/(num-5);
		temp.uniforms.colorVal.value.x = rColor - colorxscalar*i/(num-5);
		temp.uniforms.opacity.value = 1-i*0.05;
		group.add(new THREE.Line(tempLine, temp));
		temp.dispose();
		tempLine.dispose();

	}
}