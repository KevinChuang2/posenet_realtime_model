var animationHandler = 
{
  currentAnimations : [],
  timeIn: [],
  timeOut: [],
  addAnimation: function(scene, group,timeIn, timeOut)
  {
    if(timeIn - this.timeIn[this.timeIn.length-1]>0.5 || this.timeIn.length ==0)
    {
      this.currentAnimations.push(group);
      this.timeIn.push(timeIn);
      this.timeOut.push(timeOut);
      scene.add(group);  
    }
    
  },
  updateTime: function(scene, time)
  {
    for(var i=0; i<this.currentAnimations.length; i++)
    {
      if(time>this.timeOut[i])
      {
        scene.remove(this.currentAnimations[i]);
        this.currentAnimations.splice(i,1);
        this.timeOut.splice(i,1);
        this.timeIn.splice(i,1);
      }
    }
  },

  updateGroupTimes: function(time)
  {
    for(var groupNum in this.currentAnimations)
    {
      var lines = this.currentAnimations[groupNum].children;
      for(var lineNum in lines)
      {
          lines[lineNum].material.uniforms.time.value = (time-this.timeIn[groupNum]);
      }
    }
  }

}