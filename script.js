const line1 = document.getElementById('line1');
const line2 = document.getElementById('line2');
const line3 = document.getElementById('line3');
const line4 = document.getElementById('line4');
const cable1 = document.getElementById('cable1');
const cable1con = document.getElementById('cable1con');
const cable2 = document.getElementById('cable2');
const cable3 = document.getElementById('cable3');
const cable4 = document.getElementById('cable4');
const noiseShadow = document.getElementById('noiseShadow');


line1.addEventListener('mouseover', ()=>{
 
  cable1.style.animationName = 'plugin';});


line1.addEventListener('mouseout', ()=>{
 
  cable1.style.animationName = '';});


line1.addEventListener('click', () => {
  line1.style.height = 1138 + 'px';
  cable1.style.height = 175 + 'px';
  cable1.style.animationName = '';
  noiseShadow.style.display = 'block';
  line2.style.height = 200 + 'vh';
  line3.style.height = 200 + 'vh';
  line4.style.height = 200 + 'vh';});
    


line2.addEventListener('mouseover', ()=>{
 
cable2.style.animationName = 'plugin';});

line2.addEventListener('mouseout', ()=>{
 
cable2.style.animationName = '';});


line2.addEventListener('click', () => {
cable2.style.height = 175 + 'px';
cable2.style.animationName = ''});

  
line3.addEventListener('mouseover', ()=>{
  
  cable3.style.animationName = 'plugin';});


line3.addEventListener('mouseout', ()=>{
 
 cable3.style.animationName = '';});

line3.addEventListener('click', () => {
  cable3.style.height = 175 + 'px';
  cable3.style.animationName = ''});

  
line4.addEventListener('mouseover', ()=>{
 
cable4.style.animationName = 'plugin';});

line4.addEventListener('mouseout', ()=>{
 
cable4.style.animationName = '';});

line4.addEventListener('click', () => {
cable4.style.height = 175 + 'px';
cable4.style.animationName = ''});
 


// Still don't fully understand instance mode:
// https://github.com/processing/p5.js/wiki/Global-and-instance-mode

const s = (sketch) => {

let oscillator, playing, freq, amp;
let trail = [];
let a = 0;
let canvas;


sketch.setup = () => {
  canvas = sketch.createCanvas(500, 400);
  canvas.mousePressed(sketch.playOscillator);
  canvas.mouseReleased(sketch.stopOscillator);
  canvas.position(740,220)
  
  oscillator = new p5.Oscillator('sine');
  oscillator.amp();
  
sketch.createButton('SINE').position(275,425).mousePressed(() =>
    { oscillator.setType('sine');})

sketch.createButton('TRIANGLE').position(385,425).mousePressed(() =>
    { oscillator.setType('triangle');})

sketch.createButton('SAWTOOTH').position(495,425).mousePressed(() =>
    { oscillator.setType('sawtooth');})

sketch.createButton('SQUARE').position(605,425).mousePressed(() =>
    { oscillator.setType('square');})


};

sketch.draw = () => {
  sketch.background(242, 138, 82);

  
// https://p5js.org/reference/#/p5.Oscillator

  
  freq = sketch.constrain(sketch.map(sketch.mouseX, 0, sketch.width, 100, 500), 100, 500);
  amp = sketch.constrain(sketch.map(sketch.mouseY, sketch.height, 0, 0, 1), 0, 1);


  if (playing) {
    oscillator.freq(freq, 0.1);
  oscillator.amp(amp, 0.1);
  }
  
  }

  // this is the rainbow mouse trail
  //https://editor.p5js.org/mrbombmusic/sketches/Sy7H6GmDm
  
//   if(sketch.mouseIsPressed){
//    trail.sketch.push([sketch.mouseX, sketch.mouseY]);
//   for(let i = 0; i < trail.length; i++) {
//   sketch.noStroke();
//   sketch.fill(242, 137, 82, a);
//   sketch.ellipse(trail[i][0], trail[i][1], 25);
//     if(a > 255) {
//       trail.shift();
//       a = 0;
//     }
//     a += 8;
//   }
// }else{trail=[] }


sketch.playOscillator = () => {
  oscillator.start();
  playing = true;
}

sketch.stopOscillator = () => {
  oscillator.amp(0, 0.5);
  playing = false;
}


};


let myp5 = new p5(s);

// To make this sequencer I followed this tutorial series: 
// https://www.youtube.com/watch?v=mmluIbsmvoY&list=PLLgJJsrdwhPywJe2TmMzYNKHdIZ3PASbr&ab_channel=TheAudioProgrammer


const d = (sketch2) => {

let hh, clap, bass; // Instrument
let hPat, cPat, bPat; // Instrument pattern
let hPhrase, cPhrase, bPhrase; // Instrument phrase
let drums; // part
let bpmCTRL;
let beatLength;
let cellWidth;
let cnv;
let sPat;
let cursorPos;
let toggleOnOff;

sketch2.setup = () => {
  cnv = sketch2.createCanvas(965,180);
  cnv.mousePressed(sketch2.canvasPressed);
  cnv.position(275,645)
  
  beatLength = 16;
  cellWidth = cnv.width/beatLength;
  cursorPos = 0;
  
  hh = sketch2.loadSound('assets/hh_sample.mp3');
  clap = sketch2.loadSound('assets/clap_sample.mp3');
  bass = sketch2.loadSound('assets/bass_sample.mp3');
  
  hPat = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  cPat = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0];
  bPat = [1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0];
  sPat = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ,13, 14 ,15, 16];
  
  hPhrase = new p5.Phrase('hh', (time) => {hh.play(time);}, hPat); 
  cPhrase = new p5.Phrase('clap', (time) => {clap.play(time);}, cPat); 
  bPhrase = new p5.Phrase('bass', (time) => {bass.play(time);}, bPat); 
  
  drums = new p5.Part();
  
  drums.addPhrase(hPhrase); 
  drums.addPhrase(cPhrase);
  drums.addPhrase(bPhrase);
  drums.addPhrase('seq', sketch2.sequence, sPat);
  
  drums.setBPM('80');
  
  sketch2.drawMatrix();

  toggleOnOff = sketch2.createButton('PLAY').position(605,565).mousePressed(() =>
    {

      if (drums.isPlaying){
      drums.metro.metroTicks = 0;
      drums.stop();
      toggleOnOff.html('PLAY')
    }else {drums.loop();
      toggleOnOff.html('STOP');} 
    });

toggleOnOff.class('play');

};


sketch2.canvasPressed = () => {
  let rowClicked = sketch2.floor(3*sketch2.mouseY/cnv.height);
  let indexClicked = sketch2.floor(16*sketch2.mouseX/cnv.width);
    if(rowClicked === 0){
      // console.log('first row')
      hPat[indexClicked] = +!hPat[indexClicked];
    } else if(rowClicked === 1){
      // console.log('second row')
      cPat[indexClicked] = +!cPat[indexClicked];
    } else if(rowClicked === 2){
      // console.log('third row')
      bPat[indexClicked] = +!bPat[indexClicked];
    }
 
  sketch2.drawMatrix();
}

sketch2.drawMatrix = () => {
  
sketch2.background(236, 230, 223);
sketch2.stroke('gray');
sketch2.strokeWeight(2);
sketch2.fill(242, 137, 82);
for(let i = 1; i < beatLength; i++){
  sketch2.line( i*cellWidth, 0, i*cellWidth, sketch2.height);
}

for(let i = 1; i < 3; i++){
  sketch2.line(0, i*sketch2.height/3, sketch2.width, i*sketch2.height/3);
}

sketch2.noStroke();
  
for (let i =0; i < beatLength; i++){
  if(hPat[i] === 1){
    sketch2.ellipse(i*cellWidth + 0.5*cellWidth, sketch2.height/6,   20);
}
  if(cPat[i] === 1){
    sketch2.ellipse(i*cellWidth + 0.5*cellWidth, sketch2.height/2, 20);
}
  if (bPat[i] === 1){
   sketch2.ellipse(i*cellWidth + 0.5*cellWidth, sketch2.height*5/6, 20);
    }
  }
}

sketch2.sequence = (time, beatIndex) => {
  // console.log(beatIndex);
  setTimeout(() => {
    sketch2.drawMatrix();
    sketch2.drawPlayhead(beatIndex);
  }, time*1000);

}

sketch2.drawPlayhead = (beatIndex) => {
  sketch2.noStroke();
  sketch2.fill(255, 0, 0, 30);
  sketch2.rect((beatIndex-1)*cellWidth, 0, cellWidth, sketch2.height);
}

sketch2.touchStarted = () => {
  if(sketch2.getAudioContext().state !== 'running'){
sketch2.getAudioContext().resume();
  }
}


}

let myp5d = new p5(d);

const n = (sketch3) => {

let noiseGen, cnv; 
let playButton, stopButton, chooseNoise, setVolume, toggelOnOff;
let fft;

sketch3.setup = () => {
  cnv = sketch3.createCanvas(800, 500)
  noiseGen = new p5.Noise();
  noiseGen.amp(0);
  cnv.position(210,100);
  cnv.class('noiseScreen');
  
  fft = new p5.FFT();
  
  toggleOnOff = sketch3.createButton('PLAY').position(57,550).mousePressed(() => {
  if (noiseGen.started) {noiseGen.stop()
    toggleOnOff.html('PLAY');                 
  } else{noiseGen.start()
    toggleOnOff.html('STOP');                 
        }
});
  
toggleOnOff.class('play');
  
  sketch3.createButton('WHITE').position(57,155).mousePressed(() =>
    { noiseGen.setType('white');
    sketch3.fill('white');})

sketch3.createButton('PINK').position(57,265).mousePressed(() =>
    { noiseGen.setType('pink');
    sketch3.fill('pink');})

sketch3.createButton('BROWN').position(57,375).mousePressed(() =>
    { noiseGen.setType('brown');
      sketch3.fill('brown');})



  setVolume = sketch3.createSlider(-60,0,-60,1).position(55 ,500);
  setVolume.input( () => {
    if (setVolume.value() > -56){
    //amplitude = 10^(decibels/20)
    //pow(base, exponent);
    //pow(10, setvolume.value()/20)
    noiseGen.amp(sketch3.pow(10, setVolume.value()/20), 0.01);  
    }else{
      noiseGen.amp(sketch3.map(setVolume.value(), -60, -56,0,0.0016),0.1);
    }
  });

setVolume.class('volume');
  
sketch3.fill('white');
sketch3.noStroke();
}

sketch3.draw = () => {
  sketch3.background(236, 230, 223);
  let spectrum = fft.analyze();
 sketch3.beginShape();
  sketch3.vertex(0, sketch3.height);
  for(let i=0; i<spectrum.length; i++){
    sketch3.vertex(sketch3.map(sketch3.log(i), 0, sketch3.log(spectrum.length), 0, sketch3.width),sketch3.map(spectrum [i], 0, 255, sketch3.height,0))
}
  sketch3.vertex(sketch3.width ,sketch3.height);
  
sketch3.endShape();
}

sketch3.touchStarted = () => {
  if(sketch3.getAudioContext().state !== 'running'){
sketch3.getAudioContext().resume();
  }
}

}
let myp5n = new p5(n, 'noiseGenerator');