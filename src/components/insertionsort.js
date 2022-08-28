let myCode = {
  codeText: [
    "void sort(int A[], int n)",                          // 1
    "  int i, j;",                                        // 2
    "  for(i = 1;",                                       // 3
    "             i < n;",                                // 4
    "                    i++) {",                         // 5
    "    for(j = i - 1;",                                 // 6 
    "                   j >= 0",                          // 7
    "                          && A[j+1] < a[j];",        // 8
    "                                            j--) {", // 9
    "      swap(&A[j], &A[j+1]);",                        // 10
    "    }",                                              // 11
    "  }",                                                // 12
  ],
  lineWeight: [1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1],
  needHigh: 1,
  needLen: 1,
  curHigh: 1,
  curLen: 1,
};

let startButton, resetButton;
let gui = null;
var speed;
var my_array;
let n;

let pState = 'idle';
let curState;
let states = [];
// state content:
// n = 0
// curLine = 1
// I = 0
// J = 0;
// arrVal = []

function setup() {
  _init();
}

function _init() {
  states = [];
  pState = 'idle';

  createCanvas(windowWidth, windowHeight);
  background("#a2f5dc");
  if(gui == null) {
    makeGUI();
  }
  gui.setPosition(windowWidth * 0.8, windowHeight*0.1);
  startButton.show();
  resetButton.hide();
}

function makeGUI() {
  gui = createGui('Input').setPosition(windowWidth * 0.8, windowHeight*0.1);

  sliderRange(0.25, 2, 0.25);
  speed = 1;
  gui.addGlobals('speed');

  my_array = "1, 7, 8, 9, 3, 2, 6";
  gui.addGlobals('my_array');

  startButton = createButton("Start");
  beautifyButton(startButton);
  startButton.position(windowWidth*0.8, windowHeight*0.1 - 50);
  startButton.mousePressed(startVis);
  
  resetButton = createButton("Reset");
  beautifyButton(resetButton);
  resetButton.position(startButton.x, startButton.y);
  resetButton.mousePressed(_init);
}

function startVis() {
  startButton.hide();
  resetButton.show();
  gui.setPosition(-10000, -10000);
  simAlgo();
}

function simAlgo() {

  let s = {};
  s.arrVal = my_array.split(',').map(Number);
  n = s.arrVal.length;
  s.curLine = 1;
  s.i = -1;
  s.j = -1;
  updateS(s, 1);
  
  s.i = 0;
  s.j = 0;
  updateS(s, 2);

  s.i = 1;
  updateS(s, 3);

  while(true) {

    updateS(s, 4);
    if(s.i < n) {
      s.j = s.i - 1;
      updateS(s, 6);

      while(true){

        updateS(s, 7);
        if(s.j >= 0) {

          updateS(s, 8);
          if(s.arrVal[s.j+1] < s.arrVal[s.j])
          {
            [s.arrVal[s.j+1], s.arrVal[s.j]] = [s.arrVal[s.j], s.arrVal[s.j+1]]
            updateS(s, 10);
          }
          else {
            break;
          }
        }
        else {
          break;
        }
        
        s.j--;
        updateS(s, 9);
      }
    }
    else {
      break;
    }

    s.i++;
    updateS(s, 5);
  }
  updateS(s, 12);

  curState = 0;
  pState = 'fin';
  console.log(states);
}

function updateS(s, atLine) {
  s.curLine = atLine;
  states.push(deepClone(s))
}

function keyPressed() {
  if(pState != 'fin') {
    return;
  }
  if (keyCode === RIGHT_ARROW) {
    curState = min(curState+1, states.length-1);
  } else if (keyCode === LEFT_ARROW) {
    curState = max(curState-1, 0);
  }
  updateState(states[curState]);
}

function updateState(curState) {
  myCode.needHigh=curState.curLine;
}

function draw() {
  // console.log(states.length);
  if(pState!= 'fin'){
    return;
  }

  showCode(
    myCode,
    windowWidth / 50,
    windowHeight / 1.3,
    windowWidth / 80,
    windowWidth / 2.7
  );
  drawColumns();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background("#a2f5dc");
}
