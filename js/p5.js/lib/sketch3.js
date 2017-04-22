var theta, theta_prev;
var w0;

function setup(){
  createCanvas(windowWidth, windowHeight);
  xPos = windowWidth+1;
  stroke(255);
  strokeWeight(6);
  fill(70);

  size = windowHeight/12;
  textSize(size);
  textAlign(CENTER,CENTER);
}

function draw(){
  background(255);

  // w0 is the quaternion for the original orientation
  if(frameCount < 5){
   w0 = quaternion(rotationX,rotationY,rotationZ);
  }

  var w = quaternion(rotationX,rotationY,rotationZ);

  // we can extract roll, pitch, yaw from the quaternion
  var radtodeg = 180/PI;
  var roll  = radtodeg*Math.atan2(2*w[2]*w[0] - 2*w[1]*w[3], 1 - 2*w[2]*w[2] - 2*w[3]*w[3]);
  var pitch = radtodeg*Math.atan2(2*w[1]*w[0] - 2*w[2]*w[3], 1 - 2*w[1]*w[1] - 2*w[3]*w[3]);
  var yaw   = radtodeg*Math.asin(2*w[1]*w[2] + 2*w[3]*w[0]);

  text("roll: "+str(round(roll)),windowWidth/2,size);
  text("pitch: "+str(round(pitch)),windowWidth/2,2*size);
  text("yaw: "+str(round(yaw)),windowWidth/2,3*size);

  // quaternion values
  text("Qw: " + str(round(w[0]*100)/100),windowWidth/2,4*size);
  text("Qx: " + str(round(w[1]*100)/100),windowWidth/2,5*size);
  text("Qy: " + str(round(w[2]*100)/100),windowWidth/2,6*size);
  text("Qz: " + str(round(w[3]*100)/100),windowWidth/2,7*size);

  // tells us if the device is turned by 90 degrees
  deviceTurned(w,w0)

}

function deviceTurned(w,w0){
  var radtodeg = 180/PI;

  // quaternion distance = 1 - <q1,q2>^2 is a measure of difference between orientations
  // Goes between 0 (identical orientations) to 1 (opposite orientations)
  // quaternion angle = arccos(2*<q1,q2>^2 - 1) converts this into an angle
  // this is the angle of rotation needed to get from one orientation to another
  // i.e. the angle between two orientations
  var quatDistance = quaternionDistance(w,w0);
  var quatAngleBetween = radtodeg*quaternionAngleBetween(w,w0);

  text("quat dist: "+str(round(quatDistance*100)/100),windowWidth/2,8*size);
  text("quat angle: "+str(round(quatAngleBetween)),windowWidth/2,9*size);

  // define quaternion orientations for +/- 90 degree rotations in X, Y, Z
  var xcw = quaternion(90,0,0);
  var xccw = quaternion(-90,0,0);
  var ycw = quaternion(0,90,0);
  var yccw = quaternion(0,-90,0);
  var zcw = quaternion(0,0,90);
  var zccw = quaternion(0,0,-90);

  // quaternion distance = (1 - cos(quaternion angle))/2
  // so when the angle is 90 degrees, quaternion distance is 0.5
  if(quatDistance >= 0.5){
    text("Device TURNED",windowWidth/2,10*size);
    if(quaternionDistance(w,quaternionMultiply(w0,xcw))<0.1){text("X",windowWidth/2,11*size);}
    else if (quaternionDistance(w,quaternionMultiply(w0,xccw))<0.1){text("-X",windowWidth/2,11*size);}
    else if (quaternionDistance(w,quaternionMultiply(w0,ycw))<0.1){text("Y",windowWidth/2,11*size);}
    else if (quaternionDistance(w,quaternionMultiply(w0,yccw))<0.1){text("-Y",windowWidth/2,11*size);}
    else if (quaternionDistance(w,quaternionMultiply(w0,zcw))<0.1){text("Z",windowWidth/2,11*size);}
    else if (quaternionDistance(w,quaternionMultiply(w0,zccw))<0.1){text("-Z",windowWidth/2,11*size);}
  }

  if (quatAngleBetween <= 45) {
    background(0, 0, 0);
  } else if (quatAngleBetween <= 90) {
    background(255, 0, 0);
  } else if (quatAngleBetween <= 135) {
    background(0, 255, 0);
  } else if (quatAngleBetween <= 180) {
    background(0, 0, 255);
  }

}
