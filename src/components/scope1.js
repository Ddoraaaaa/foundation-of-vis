/// <reference path="../libraries/TSDef/p5.global-mode.d.ts" />

/* Variable decl begins */ 

// Code snippet variables
let snippet = {
  code: 
  [
  `int`, 
  `main(int argc, char *argv[]) {`,
  `  int x=3, z=5;`,
  `  printf("main; x=%2d, z=%2d\\n", x, z);`,
  `  func(x);`,
  `  printf("main: x=%2d, z=%2d\\n", x, z);`,
  `  return 0;`,
  `}\n`, 
  `void`, 
  `func(int x) {`, 
  `  int z=7;`,
  `  x = x+1;` ,
  `  z = x+z+1;`, 
  `  printf("func: x=%2d, z=%2d\\n", x, z);`,
  `}`,
  ], 
  curHigh: 0,
  lenHigh: 1, 
  curAt: 0, 
}; 
let xSnippet, ySnippet; 

// Stack visualizer variables
let curStep; 
let xStack, yStack; 
let curXStack, curYStack; 
let steps = [ // TODO: update to also include how many lines to highlight
  {line: 1, value: "argc main()", explanation: "Allocate 4 bytes for argc in stack."}, 
  {line: 1, value: "argv main()", explanation: "Allocate 4 bytes for argv in stack."}, 
  {line: 2, value: "x = 3 main()", explanation: "Allocate 4 bytes for x in stack, storing the number 3"}, 
  {line: 2, value: "z = 5 main()", explanation: "Allocate 4 bytes for z in stack, storing the number 5"}, 
  {line: 3, value: "print 3 5", explanation: "Print x (3) and z (5) seperated by a space to the console. "}, 
  {line: 4, value: "bg func()", explanation: "Call func()."}, 
  {line: 9, value: "x = 3 func()", explanation: 
  "Allocate 4 bytes for x in stack with value 3. \nx here is DIFFERENT from the x created in main()." }, 
  {line: 10, value: "z = 7 func", explanation: 
  "Allocate 4 bytes for x in stack with value 3. \nz here is DIFFERENT from the z created in main()."}, 
  {line: 11, value: "update x = 4", explanation: "Update value of x (local variable of func()) to 4."}, 
  {line: 12, value: "update z = 12", explanation: "Update value of z (local variable of func()) to (x + z + 1) = (4 + 7 + 1) = 12."}, 
  {line: 13, value: "print 4 12", explanation: "Print x and z created in func()."}, 
  {line: 5, value: "print 3 5", explanation: 
  "Exit func(). Notice how the local variables x and z are not removed from the stack - we have to do that manually. \nHowever, the x and z being printed out are created in main() (3 and 5). "}, 
]; 

// Console variables
let xConsole, yConsole; 
let Console = []; 

// Explanation variables
let mxExpl; 
let xExpl, yExpl; 

/* Variable dec ends */


function setup() {
  createCanvas(windowWidth, windowHeight); 
  frameRate(1);
  xSnippet = width/2, ySnippet = height/2; 
  xStack = width/12, yStack = height - height/12;
  xConsole = width/2, yConsole = height/6;
  xExpl = width*2/3, yExpl = height/6; 
  mxExpl = 0; 
  curStep = 0; 
  for (let i = 0; i < steps.length; i++) {
    steps[i]['color'] = [random(255), random(100), random(100, 255)];
    mxExpl = max(mxExpl, steps[i]['explanation'].length); 
  }
}

function updateState() {
  if (curStep == steps.length - 1) 
    noLoop();
  curStep = (curStep + 1) % steps.length; 
}

function curY() {
  console.log("current line: ", steps[curStep]['line']); 
  return steps[curStep]['line'] * textSize(); 
}

function drawSnippet() {
  push(); 
  textSize(19);
  // Print code snippet
  stroke('white');
  noStroke();
  fill('white');
  for (let i = 0; i < snippet['code'].length; i++) {
    text(' ' + i, xSnippet, ySnippet + i * textSize()); 
    text(snippet['code'][i], xSnippet + 50, ySnippet + i * textSize()); 
  }
  // Draw highlighting box
  noFill();
  stroke('orange');
  rect(xSnippet, curY() + ySnippet - textSize() + 5, 400, textSize());
  pop(); 
}

function drawStack() {
  let rowHeight = height / 50;   
  let rowIdLength = width / 50; 
  let nameLength = rowIdLength * 5; 
  let holderLength = rowIdLength * 2; 
  let margin = 0; 
  let segmentSize = [5, 7, 33]; 
  let segmentColor = ["#ffcc66", "#ff9933", "#00b33c"]; 
  let segmentText = ["Program Code Segment", "Program Data Segment", "Stack"]; 
  let row = 0; 
  stroke(0);
  for (let seg = 0; seg < 3; seg++) {
    for (let i = 0; i < segmentSize[seg]; i++) {
      // Coordinates
      let x = xStack + (nameLength + margin); 
      let y = yStack - (rowHeight + margin) * row;
      // Draw the stack
      fill('white');
      rect(x, y, rowIdLength, rowHeight); 
      fill(segmentColor[seg]); 
      x += rowIdLength + margin; 
      rect(x, y, holderLength, rowHeight);
      // Draw segment name
      if (i == segmentSize[seg] - 1) {
        let W = nameLength, H = rowHeight * segmentSize[seg] + margin * (segmentSize[seg] - 1);
        fill(segmentColor[seg]); 
        rect(xStack, y, W, H); 
        fill(0);
        noStroke(); 
        text(segmentText[seg], xStack + W/5, y + H/5, W - W/4, H - H/4); 
        stroke(0); 
      }  
      row++; 
    }
  } 
  // Simulate pushing items to stack
  curXStack = xStack + (nameLength + margin) + rowIdLength;  
  curYStack = yStack - (rowHeight + margin) * (segmentSize[0] + segmentSize[1]); 
  for (let it = 0; it <= curStep; it++) {
    let step = steps[it]; 
    fill(...step['color']); 
    let s = step['value']; 
    if (s.startsWith('print')) {
      Console.push(s.slice(6)); 
    }
    else if (!s.startsWith('bg') && !s.startsWith('update')) {
      for (let i = 0; i < 4; i++) {
        rect(curXStack, curYStack, holderLength, rowHeight); 
        if (i == 2) {
          push(); 
          fill('white');
          textSize(18);
          text('val', curXStack + holderLength / 6, curYStack + rowHeight);
          text(s, curXStack + holderLength / 4 + holderLength, curYStack + rowHeight); 
          pop();
        }
        curYStack -= (rowHeight + margin); 
      }
    }
  }
}

function drawConsole() {
  push(); 
  noStroke(); 
  fill('white'); 
  textSize(24);
  text('Console', xConsole, yConsole - textSize()); 
  textSize(18);
  fill('green'); 
  for (let i = 0; i < Console.length; i++) {
    text(Console[i], xConsole, yConsole + i * textSize()); 
  }
  pop(); 
}

function drawExplanation() {
  push(); 
  fill('white');
  textSize(24); 
  text("Explanation", xExpl, yExpl - textSize()); 
  textSize(18); 
  fill('#66ffff'); 
  text(steps[curStep]['explanation'], xExpl, yExpl, 300, 200); 
  pop(); 
}

function reset() {
  background(0); 
  frameRate(min(0.7, 0.3 * mxExpl / steps[curStep]['explanation'].length));
  Console = [];
}

function draw() {
  reset(); 
  drawSnippet(); 
  drawStack();
  drawConsole(); 
  drawExplanation();
  updateState(); 
}