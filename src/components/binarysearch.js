/// <reference path="../libraries/TSDef/p5.global-mode.d.ts" />

var inputN, inputA, inputX; 

var N; 
var A; 
var X; 

var gui; 
var speed; 
var backgroundColor; 
var correctAnswerColor; 
var simulate_button; 
var programState; 
var reset_button; 

var curFrame;
var curPhase;  
var curlpos; 
var currpos;
var phases = []; 
var frameSum; 
var phaseNum; 

const NOT_FOUND = -1; 
var INITLength; 
var COMPLength;
var ASSILength; 
var RETLength;

var sumElementWidth;
var elementWidth; 
var element_y1; 
var elementHeight; 

function setup() {
    // testing
    drawingContext.shadowOffsetX = 5;
    drawingContext.shadowOffsetY = -5;
    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = 'black';

    backgroundColor = color('#b3fff0');    
    correctAnswerColor = color(114, 214, 56); 

    sumElementWidth = 0.6 * windowWidth; 

    noStroke(); 
    frameRate(60); 

  initialize(); 
}

function initialize() { 
  createCanvas(windowWidth, windowHeight); 
  background(168, 235, 52); 
  createController(); 
}

function createController() { 
    gui = createGui('Controller'); 
    

    sliderRange(0.25, 2, 0.1); 
    speed = 1; let speedMin = 0.5, speedMax = 2, speedStep = 0.1; 
    gui.addGlobals('speed');

    inputN = '10'; 
    inputA = '1, 2, 3, 4, 5, 6, 7, 8, 9, 10'; 
    inputX = '7'; 
    gui.addGlobals('inputN', 'inputA', 'inputX');  

    simulate_button = createButton('Play/pause');
    simulate_button.position(windowWidth * 0.8, windowHeight * 0.8); 
    simulate_button.mousePressed(start_simulation); 

    reset_button = createButton('Reset'); 
    reset_button.position(simulate_button.x + simulate_button.width + 15, windowHeight * 0.8); 
    reset_button.mousePressed(readInputAndInitialize); 
}

function start_simulation() { 
    readInputAndInitialize(); 
    programState = 'simulating'; 

    INITLength = 45 / speed; 
    COMPLength = 45 / speed; 
    ASSILength = 60 / speed; 
    RETLength = 75 / speed; 
    
    curFrame  = 0; 
    curPhase = 0; 
    curlpos = convert_coordinate(0); 
    currpos = convert_coordinate(N); 
}

function readInputAndInitialize() { 
    N = parseInt(inputN); 
    A = inputA.split(',').map(function(item) {
        return parseInt(item, 10);
    });
    X = parseInt(inputX); 

    elementWidth = sumElementWidth / N; 
    elementHeight = elementWidth; 
    element_y1 = 0.5 * windowHeight - 0.5 * elementHeight; 

    programState = 'resting'; 
    generate_phases(); 
}

function addPhase(arg1, arg2, duration, lineNumber) { 
    phases[phaseNum] = [arg1, arg2, frameSum + duration, lineNumber]; 
    frameSum += duration;
    phaseNum++; 
}

var lines = [
'lo, hi <- 0, n',
'while lo < hi do',
'    m <- (lo + hi) / 2',
'    if x < A[m] then',
'      hi <- m',
'    else if x > A[m] then',
'      lo <- m + 1',
'    else' ,
'      return m',
'return notfound'
]; 

function generate_phases() { 
    frameSum = 0; phaseNum = 0; 
    addPhase('I', 0, INITLength, 0); 
    let lo = 0, hi = N; 
    while(1) { 
        addPhase('lohi', lo < hi, COMPLength, 1); 
        if(lo < hi) { 
            addPhase('mid', floor((lo + hi) / 2), COMPLength, 2);
            let mid = floor((lo + hi) / 2); 
            addPhase('C', mid, COMPLength, 3); 
            if(X < A[mid]) { 
                addPhase('hi', mid, ASSILength, 4); 
                hi = mid; 
            }
            else { 
                addPhase('C', mid, COMPLength, 5); 
                 if(X > A[mid]) {
                    addPhase('lo', mid + 1, ASSILength, 6); 
                    lo = mid + 1; 
                }
                else { 
                    addPhase('R', mid, RETLength, 8); 
                    return mid; 
                }
            }
        }
        else break; 
    }
    addPhase('R', NOT_FOUND, RETLength, 9); 
    return NOT_FOUND; 
}

function convert_coordinate(p) { 
    return windowWidth / 2 - elementWidth * N / 2 + elementWidth * p; 
}

function topLeft(i) { 
    return [convert_coordinate(i), element_y1]; 
}

function draw() {
    background(backgroundColor); 
    
    if(programState === 'simulating') curFrame++; 
    if(programState === 'simulating' && curFrame > frameSum) programState = 'resting'; 
    else if(programState == 'simulating') { 
        if(curFrame > phases[curPhase][2]) ++curPhase; 
    }


    if(programState === 'resting') drawRestingFrame(); 
    else if(programState == 'simulating') drawSimulatingFrame(); 

    // console.log('program state '); 
    // console.log(programState); 
}

function drawRestingFrame() { 
    push();
    fill('white'); 
    let [x0, y0] = topLeft(0); 
    rect(x0, y0, elementWidth * N, elementHeight); 
    pop(); 
    for(let i = 0; i < N; i++) { 
        let [x,y] = topLeft(i); 
        
        push(); 
        noFill(); 
        rect(x, y, elementWidth, elementHeight); 
        pop(); 

        push(); 
        fill(0);
        text(String(A[i]), x + elementWidth / 2 - 5, y + elementHeight / 2 + 5); 
        pop(); 
    }
}

function drawSimulatingFrame() { 
    let p = phases[curPhase]; 
    if(p[0] === 'I') { 

    }
    else if(p[0] === 'lohi') { 

    }
    else if(p[0] === 'mid') { 

    }
    else if(p[0] === 'hi') { 
        let desHi = p[1]; 
        let desrpos = convert_coordinate(desHi); 
        let frameLeft = p[2] - curFrame + 1; 
        currpos += (desrpos - currpos) / frameLeft; 
    }
    else if(p[0] == 'lo') { 
        let desLo = p[1]; 
        let deslpos = convert_coordinate(desLo); 
        let frameLeft = p[2] - curFrame + 1; 
        curlpos += (deslpos - curlpos) / frameLeft; 
        console.log('lo -> ');
        console.log(desLo);  
    }
    else if(p[0] == 'R') { 

    }

    push();
    fill('gray'); 
    rect(convert_coordinate(0), element_y1, elementWidth * N, elementHeight); 
    pop(); 

    push(); 
    fill('white') 
    rect(curlpos, element_y1, currpos - curlpos, elementHeight); 
    pop(); 

    push(); 
    fill('white'); 
    textAlign(CENTER, CENTER); 
    text('L', curlpos, element_y1 + elementHeight, elementWidth, elementHeight); 
    text('R', currpos, element_y1 - elementHeight, elementWidth, elementHeight); 
    pop(); 
    
    if(p[0] == 'C') { 
        let mid = p[1]; 
        push(); 
        fill('orange'); 
        rect(convert_coordinate(mid), element_y1, elementWidth, elementHeight); 
        pop(); 
    }

    if(p[0] == 'R' && p[1] != NOT_FOUND) { 
        push(); 
        fill(correctAnswerColor); 
        rect(convert_coordinate(p[1]), element_y1, elementWidth, elementHeight); 
        pop(); 
    }

    for(let i = 0; i < N; i++) { 
        let [x,y] = topLeft(i); 
        
        push(); 
        noFill(); 
        rect(x, y, elementWidth, elementHeight); 
        pop(); 

        push(); 
        fill(0);
        text(String(A[i]), x + elementWidth / 2 - 5, y + elementHeight / 2 + 5); 
        pop(); 
    }

    push(); 
    fill('white'); 
    rect(500, 700, 200, 100); 
    fill('black');
    text(lines[p[3]], 520, 720); 
    pop(); 
}

function windowResized() { 
}
/*
lo, hi <- 0, n
while lo < hi do 
    m <- (lo + hi) / 2
    if x < A[m] then
      hi <- m
    else if x > A[m] then
      lo <- m + 1
    else 
      return m
return notfound
*/