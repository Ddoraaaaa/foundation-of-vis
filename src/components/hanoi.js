let curCode = {
  codeText: ["doisa", "dwaff", "long long line of code very long yes yes long very", "dit me cuoc doi", "dit me cuoc doi", "dit me cuoc doi", "dit me cuoc doi", "dit me cuoc doi", "dit me cuoc doi"],
  curHigh:1,
  curLen:1,

  needHigh:6,
  needLen:3,
};

let curOutp = ["lon, buoi", "dit", "cac", "chimmmmmm"]
// let curcode = {
//   code: ["dois\ndsadaw\ndwadwqa"],
// };

function setup() {
  createCanvas(windowWidth, windowHeight);
  button = createButton('buoi');
  button.position(0, 0);
  button.mousePressed(cac);
}

function cac() {
  curOutp.push(`${new Date()}`);
  updateHigh(curCode, Math.floor(Math.random() * 5)+1, Math.floor(Math.random() * 3)+1)
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background('pink');
  showCode(curCode);
  showOutput(curOutp, 200, 200);
}