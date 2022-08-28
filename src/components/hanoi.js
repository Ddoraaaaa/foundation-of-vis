var myAngle = 30;
var myColor = "#eeee00";
var gui;
let button;

function setup() {
  createCanvas(windowWidth, windowHeight);
  button = createButton("");
  button.position(random(windowWidth), random(windowHeight));
  button.show();
  // Create the GUI
  sliderRange(0, 90, 1);
  gui = createGui("Control");
  gui.addGlobals("myColor", "myAngle", "button");

  // Only call draw when then gui is changed
  noLoop();
}

function draw() {
  // this is a piece of cake
  background(0);
  fill(myColor);
  angleMode(DEGREES);
  arc(width / 2, height / 2, 100, 100, myAngle / 2, 360 - myAngle / 2, PIE);
}

// dynamically adjust the canvas to the window
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
