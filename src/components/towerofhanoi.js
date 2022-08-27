function setup() {
  createCanvas(windowWidth, windowHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background('pink');
  rect(30, 20, 55, 55);
  let vecCenter = createVector(100, 100);
  let vecMouse = createVector(mouseX, mouseY);
  drawArrow(vecCenter, vecMouse, 'black');
  noStroke();
}

function drawArrow(base, vec, myColor) {
  vec.x -= base.x;
  vec.y -= base.y;
  push();
  stroke(myColor);
  strokeWeight(3);
  fill(myColor);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 7;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}