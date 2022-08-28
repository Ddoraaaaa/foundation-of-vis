/// <reference path="../libraries/TSDef/p5.global-mode.d.ts" />

// Pseudo code

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

var codeText = [
    'lo, hi <- 0, n',           // 1
    'while lo < hi do',         // 2
    '    m <- (lo + hi) / 2',   // 3
    '    if x < A[m] then',     // 4
    '      hi <- m',            // 5
    '    else if x > A[m] then',// 6
    '      lo <- m + 1',        // 7
    '    else' ,                // 8
    '      return m',           // 9
    'return notfound'           // 10
];

var lineWeight = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; 

// Input

var inputN, inputA, inputX; 

var N; 
var A; 
var X; 

// UI stuff

var gui; 
var speed; 
var backgroundColor; 
var secondBGColor; 
var correctAnswerColor; 
var testedColor; 
var progressBarColor; 
var startButton; 
var resetButton; 
var backArrow; 
var nextArrow; 

// Logic stuff

var _IsPaused; 
var curFrame;
var curPhase;  
var curlpos; 
var currpos;
var phases = []; 
var LoAndHi = []; 
var corrLines = []; 
var frameSum; 
var phaseNum; 

const NOT_FOUND = -1; 

// length of operations

var INITLength; 
var COMPLength;
var ASSILength; 
var RETLength;

// display 

var sumElementWidth;
var elementWidth; 
var element_y1; 
var elementHeight; 

// background stuff

var vnum = 100; 
var vx = []; 
var vy = [];

function setup() {
    createCanvas(windowWidth, windowHeight); 
    backgroundColor = '#a2f5dc';    
    secondBGColor = color(180, 211, 217); 
    correctAnswerColor = color(114, 214, 56); 
    testedColor = color(168, 141, 50); 
    progressBarColor = color(28, 55, 74); 

    sumElementWidth = 0.5 * windowWidth; 

    noStroke(); 
    frameRate(60); 
    textSize(23); 
    textFont(ConsolasFont); 

    createController(); 

    readInputAndInitialize(); // initialize for default data
    console.log('sdlfdslkjf'); 
    console.log([curlpos, currpos])
}

function createController() { 
    gui = createGui('Controller'); 
    gui.setPosition(0.835 * windowWidth, 0.05 * windowHeight); 

    sliderRange(0.25, 2, 0.1); 
    speed = 1; let speedMin = 0.5, speedMax = 2, speedStep = 0.1; 
    gui.addGlobals('speed');

    inputN = '10'; 
    inputA = '1, 2, 3, 4, 5, 6, 7, 8, 9, 10'; 
    inputX = '7'; 
    gui.addGlobals('inputN', 'inputA', 'inputX');  

        
    let buttonX =  windowWidth * 0.875, buttonY = windowHeight * 0.4; 
    startButton = createButton('Start');
    beautifyButton(startButton);  
    startButton.mousePressed(startButtonPressed);

    resetButton = createButton('Reset');
    beautifyButton(resetButton); 
    resetButton.mousePressed(readInputAndInitialize);; 
    startButton.position(buttonX, buttonY); 
    resetButton.position(buttonX, buttonY);  

    // prevButton = create

}

function startButtonPressed() { 
    pausePlay(); 
    startButton.hide(); 
    resetButton.show(); 
}

function pausePlay() { 
    if(_IsPaused == 1) _play(); 
    else _pause(); 
}
function _pause() { 
    _IsPaused = 1; 
}
function _play() { 
    _IsPaused = 0; 
}

function readInputAndInitialize() { 
    N = parseInt(inputN); 
    A = inputA.split(',').map(function(item) {
        return parseInt(item, 30);
    });
    X = parseInt(inputX); 

    elementWidth = sumElementWidth / N; 
    elementHeight = elementWidth; 
    element_y1 = 0.5 * windowHeight - 0.5 * elementHeight; 

    INITLength = 60 / speed; 
    COMPLength = 60 / speed; 
    ASSILength = 60 / speed; 
    RETLength = 75 / speed; 

    generate_phases(); 

    console.log(phaseNum); 
    for(let i = 0; i < phaseNum; i++) { 
        console.log(phases[i]); 
        console.log(LoAndHi[i]); 
    }
    
    _pause(); 

    curFrame  = 0; 
    curPhase = 0; 
    curlpos = convert_coordinate(0); 
    currpos = convert_coordinate(N); 

    resetButton.hide(); 
    startButton.show(); 
}

function generate_phases() { 
    let lo = 0, hi = N; 
    function addPhase(arg1, arg2, duration, lines) { 
        phases[phaseNum] = [arg1, arg2, frameSum + duration]; 
        LoAndHi[phaseNum] = [lo, hi]; 
        corrLines[phaseNum] = lines; 
        frameSum += duration;
        phaseNum++; 
    }
    frameSum = 0; 
    phaseNum = 0; 
    addPhase('I', 0, INITLength, [1, 1]); 
    while(1) { 
        addPhase('lohi', lo < hi, COMPLength, [2, 2]); 
        if(lo < hi) { 
            addPhase('mid', floor((lo + hi) / 2), COMPLength, [3, 3]);
            let mid = floor((lo + hi) / 2); 
            addPhase('C', mid, COMPLength, [4, 4]); 
            if(X < A[mid]) { 
                addPhase('hi', mid, ASSILength, [5, 5]); 
                hi = mid; 
            }
            else { 
                addPhase('C', mid, COMPLength, [6, 6]); 
                 if(X > A[mid]) {
                    addPhase('lo', mid + 1, ASSILength, [7, 7]); 
                    lo = mid + 1; 
                }
                else { 
                    addPhase('R', mid, RETLength, [8, 9]); 
                    return mid; 
                }
            }
        }
        else break; 
    }
    addPhase('R', NOT_FOUND, RETLength, [10, 10]); 
    return NOT_FOUND; 
}

function convert_coordinate(p) { 
    return windowWidth / 2 - elementWidth * N / 2 + elementWidth * p; 
}

function draw() {
    console.log([curFrame, curPhase]); 
    console.log(phases[curPhase]); 
    console.log([curlpos, currpos]); 

    if(curFrame + 1 > frameSum) _pause(); 
    // console.log(['curFrame: ', curFrame, ' / ', frameSum]); 
    if(_IsPaused === 0) getNextFrame(); 

    drawFrame(); 
    displayCode(); 
    outputProgress();
}
let params = { 
    codeText: codeText,
    lineWeight: lineWeight,
    needHigh: 0,
    needLen: 1,
    curHigh: 0,
    curLen: 0
}
function displayCode() { 
    let lastPhase = curPhase == 0? 0: curPhase - 1; 
    params.needHigh = corrLines[curPhase][0];
    showCode(params, windowWidth * 0.01, windowHeight * 0.375, 18, windowWidth * 0.2); 
}

function outputProgress() { 
    var x = 0, y = 0; 
    var x2 = curFrame * 1.0 / frameSum * windowWidth, y2 = 0.005 * windowHeight; 
    push(); 
    fill(progressBarColor); 
    rect(x, y, x2, y2); 
    pop(); 
}

function getNextFrame() { 
    curFrame++; 
    if(curFrame > phases[curPhase][2]) ++curPhase; 

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
    else if(p[0] === 'lo') { 
        let desLo = p[1]; 
        let deslpos = convert_coordinate(desLo); 
        let frameLeft = p[2] - curFrame + 1; 
        curlpos += (deslpos - curlpos) / frameLeft; 
    }
    else if(p[0] === 'R') { 

    }
}

function drawFrame() { 
    background(backgroundColor); 

    let p = phases[curPhase]; 

    push();
    fill('white'); 
    rect(convert_coordinate(0), element_y1, elementWidth * N, elementHeight); 
    pop(); 

    push(); 
    noFill(); 
    stroke('blue'); 
    strokeWeight(1.5); 
    rect(curlpos, element_y1, currpos - curlpos, elementHeight); 
    pop(); 

    push(); 
    fill('black'); 
    textAlign(CENTER, CENTER); 
    text('L', curlpos, element_y1 + elementHeight, elementWidth, elementHeight); 
    text('R', currpos, element_y1 - elementHeight, elementWidth, elementHeight); 
    pop(); 
    
    if(p[0] === 'C') { 
        let mid = p[1]; 
        push(); 
        stroke(168, 141, 50); 
        strokeWeight(3);  
        rect(convert_coordinate(mid), element_y1, elementWidth, elementHeight); 
        pop(); 
    }

    if(p[0] === 'R' && p[1] != NOT_FOUND) { 
        push(); 
        stroke(correctAnswerColor); 
        strokeWeight(3);  
        rect(convert_coordinate(p[1]), element_y1, elementWidth, elementHeight); 
        pop(); 
    }

    for(let i = 0; i < N; i++) {        
        let x = convert_coordinate(i), y = element_y1;  
        push(); 
        noFill(); 
        rect(x, y, elementWidth, elementHeight); 
        pop(); 

        push(); 
        fill(0);
        text(String(A[i]), x + elementWidth / 2 - 8, y + elementHeight / 2 + 8); 
        pop(); 
    }

    // push(); 
    // fill('white'); 
    // rect(0.8 * windowWidth, 0.85 * windowHeight, 0.15 * windowWidth, 0.1 * windowHeight); 
    // fill('black');
    // textAlign(CENTER, CENTER); 
    // text(lines[p[3]], 0.8 * windowWidth, 0.85 * windowHeight, 0.15 * windowWidth, 0.1 * windowHeight); 
    // pop(); 
}

function keyPressed() { 
    if(keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
        if(keyCode === RIGHT_ARROW) {
            let desPhase = (curFrame === phases[curPhase][2] && curPhase + 1 != phaseNum)? curPhase + 1: curPhase; 
            let [deslo, deshi] = LoAndHi[desPhase]; 
            [curFrame, curPhase, curlpos, currpos] = [phases[desPhase][2], desPhase, convert_coordinate(deslo), convert_coordinate(deshi)]; 
        }
        else { 
            if(curPhase === 0) [curFrame, curPhase, curlpos, currpos] = [0, 0, convert_coordinate(0), convert_coordinate(N)]; 
            else { 
                let desPhase = curPhase - 1; 
                let [deslo, deshi] = LoAndHi[desPhase]; 
                [curFrame, curPhase, curlpos, currpos] = [phases[desPhase][2], desPhase, convert_coordinate(deslo), convert_coordinate(deshi)]; 
            }
        }
        _pause(); 
    }
    else if(keyCode == SPACE) { 
        pausePlay(); 
    }
}

function windowResized() { 
    
}