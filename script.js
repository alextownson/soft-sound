setTimeout(function(){ 
  document.getElementById('app').style['display'] = 'block';
  document.getElementById('loader').style['display'] = 'none';
}, 5000);

// Instance mode:
// https://github.com/processing/p5.js/wiki/Global-and-instance-mode

// Keyboard synth:
const synthSketch = (sketch) => {

  let cnv;
  let sineBut, triBut, sawBut, squareBut;
  let attackSlide, decaySlide, sustainSlide, releaseSlide, LPSlide, verbSlide, delSlide, ampSlide;
  let attack, decay, sustain, release;
  let cellWidth;
  let osc = [];
  let env = [];
  let verb = [];
  let delay = [];
  let white = [];
  let root = 60;
  let black = [];
  let LPFilter = [];
  let freq;
  let verbWet;
  let delWet;
  let vol;

  sketch.setup = () => {
    cnv = sketch.createCanvas(window.innerWidth/1.69, window.innerHeight/4);
    cnv.mousePressed(sketch.canvasPressed);
    cnv.addClass('synthCnv');
    cellWidth = cnv.width/10;
    white = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    black = [null, 0, 0, null, 0, 0, 0, null, 0, 0];

    // Create sliders
    attackSlide = sketch.createSlider(0, 1.0, 0.1, 0.01).position(window.innerWidth/3.06, window.innerHeight/2.05);
    attackSlide.addClass('slider');
    decaySlide = sketch.createSlider(0, 1.0, 0.1, 0.01).position(window.innerWidth/2.81, window.innerHeight/2.05);
    decaySlide.addClass('slider');
    sustainSlide = sketch.createSlider(0, 1.0, 0.1, 0.01).position(window.innerWidth/2.60, window.innerHeight/2.05);
    sustainSlide.addClass('slider');
    releaseSlide = sketch.createSlider(0, 1.0, 0.1, 0.01).position(window.innerWidth/2.41, window.innerHeight/2.05);
    releaseSlide.addClass('slider');
    LPSlide = sketch.createSlider(0, 2500, 2500, 50).position(window.innerWidth/2.055, window.innerHeight/2.05);
    LPSlide.addClass('slider');
    LPSlide.id('filterSlide');
    verbSlide = sketch.createSlider(0, 1, 0, 0.1).position(window.innerWidth/1.7, window.innerHeight/2.05);
    verbSlide.addClass('slider');
    verbSlide.id('verbSlide');
    delSlide = sketch.createSlider(0, 1, 0, 0.1).position(window.innerWidth/1.465, window.innerHeight/2.05);
    delSlide.addClass('slider');
    delSlide.id('delSlide');
    ampSlide = sketch.createSlider(0, 1, 1, 0.1).position(window.innerWidth/1.308, window.innerHeight/2.05);
    ampSlide.addClass('slider');

    // Create buttons
    sineBut = sketch.createButton('SINE').position(window.innerWidth/4.91, window.innerHeight/2.18).style('background-color','#f28952').mousePressed(() =>
        { for (var j = 0; j < 17; j++) {
          osc[j].setType('sine');}
          sineBut.style('background-color', '#f28952')
          triBut.style('background-color', 'rgba(245, 223, 109, 0.7)')
          sawBut.style('background-color', 'rgba(245, 223, 109, 0.7)')
          squareBut.style('background-color', 'rgba(245, 223, 109, 0.7)')
        })

    triBut = sketch.createButton('TRI').position(window.innerWidth/4.91, window.innerHeight/2).mousePressed(() =>
        { for (var j = 0; j < 17; j++) {
          osc[j].setType('triangle');}
          sineBut.style('background-color', 'rgba(245, 223, 109, 0.7)')
          triBut.style('background-color', '#f28952')
          sawBut.style('background-color', 'rgba(245, 223, 109, 0.7)')
          squareBut.style('background-color', 'rgba(245, 223, 109, 0.7)')
        })

    sawBut = sketch.createButton('SAW').position(window.innerWidth/3.87, window.innerHeight/2.18).mousePressed(() =>
        { for (var j = 0; j < 17; j++) {
          osc[j].setType('sawtooth');}
          sineBut.style('background-color', 'rgba(245, 223, 109, 0.7)')
          triBut.style('background-color', 'rgba(245, 223, 109, 0.7)')
          sawBut.style('background-color', '#f28952')
          squareBut.style('background-color', 'rgba(245, 223, 109, 0.7)')
        })

    squareBut = sketch.createButton('SQR').position(window.innerWidth/3.87, window.innerHeight/2).mousePressed(() =>
        { for (var j = 0; j < 17; j++) {
          osc[j].setType('square');}
          sineBut.style('background-color', 'rgba(245, 223, 109, 0.7)')
          triBut.style('background-color', 'rgba(245, 223, 109, 0.7)')
          sawBut.style('background-color', 'rgba(245, 223, 109, 0.7)')
          squareBut.style('background-color', '#f28952')
        })

    // Create sounds, filters, effects
    for (var j = 0; j < 17; j++) {
      env.push(new p5.Env());
      env[j].setADSR(0.1, 0.1, 0.1, 0.1);
      env[j].setRange(1, 0);
      osc.push(new p5.Oscillator());
      osc[j].amp(env[j]);
      LPFilter.push(new p5.LowPass());  
      LPFilter[j].set(2500, 1);
      verb.push(new p5.Reverb());
      verb[j].process(LPFilter[j], 5, 2);
      verb[j].amp(0);
      delay.push(new p5.Delay());
      delay[j].process(LPFilter[j], 0.75, 0.5);
      delay[j].amp(0);
    }
  };

  sketch.draw = () => {

    // Draw the keyboard
      sketch.background(236, 230, 223);
      sketch.stroke('gray');
      sketch.strokeWeight(0.75);
      sketch.fill(242, 137, 82);
    
      for(let i = 1; i < 10; i++){
      sketch.line( i*cellWidth, 0, i*cellWidth, sketch.height);
      }
    
      for (let i =0; i < 40; i++){
        if(white[i] === 1){
          sketch.rect(i*cellWidth, 0, cellWidth, sketch.height);
          }
        } 
    
        for (let i =1 ; i< 3; i++){
          if(black[i] === 0){
            sketch.rect(i*cellWidth-cellWidth/4, 0, cellWidth/2, sketch.height/2)
          }
      }
    
      for (let i =4 ; i< 7; i++){
        if(black[i] === 0){
          sketch.rect(i*cellWidth-cellWidth/4, 0, cellWidth/2, sketch.height/2)
        }
    }
    
    for (let i =8 ; i< 10; i++){
      if(black[i] === 0){
        sketch.rect(i*cellWidth-cellWidth/4, 0, cellWidth/2, sketch.height/2)
      }
    }
    
      for (let i =0; i< 10; i++){
        if(black[i] === 1){
          sketch.fill(236, 230, 223)
          sketch.rect(i*cellWidth-cellWidth/4, 0, cellWidth/2, sketch.height/2)}
      }
    
    // Assign the slider values to a variable
      attack = attackSlide.value();
      decay = decaySlide.value();
      sustain = sustainSlide.value();
      release = releaseSlide.value();
      freq = LPSlide.value();
      verbWet = verbSlide.value();
      delWet = delSlide.value();
      vol = ampSlide.value();
    
    // Change params based on slider values
    for (let i =0; i<17; i++){
      env[i].setADSR(attack, decay, sustain, release);
      env[i].setRange(1.0, 0.0);
      LPFilter[i].set(freq, 1);
      osc[i].disconnect();
      osc[i].connect(LPFilter[i]);
      verb[i].amp(verbWet);
      delay[i].amp(delWet); 
      LPFilter[i].amp(vol);
    }
    
  };

  // Click/touch functionality for keys
  sketch.canvasPressed = () => {

    // Detect where the keys have been clicked
    let indexClicked = sketch.floor(40*sketch.mouseX/cnv.width);
    let rowClicked = sketch.floor(2*sketch.mouseY/cnv.height);;

    // Play osc and change colour; dependant on location of click
    if(indexClicked >=0 && indexClicked <=3 && rowClicked === 1 || indexClicked >=1 && indexClicked <=2 && rowClicked === 0){
      osc[0].start();
      osc[0].freq(sketch.midiToFreq(root));
      env[0].play();
      white[0] = 1;
    }else if(indexClicked >=3 && indexClicked <=4 && rowClicked === 0){
        osc[1].start();
        osc[1].freq(sketch.midiToFreq(root+1));
        env[1].play();
        black[1] = 1;
    } else if(indexClicked >=4 && indexClicked <=7 && rowClicked === 1 || indexClicked >=5 && indexClicked <=6 && rowClicked === 0){
      osc[2].start();
      osc[2].freq(sketch.midiToFreq(root + 2));
      env[2].play();
      white[1] = 1;
    }else if(indexClicked >=7 && indexClicked <=8 && rowClicked === 0){
        osc[3].start();
        osc[3].freq(sketch.midiToFreq(root+3));
        env[3].play();
        black[2] = 1;
    } else if(indexClicked >=8 && indexClicked <=11 && rowClicked === 1 || indexClicked >=9 && indexClicked <=11 && rowClicked === 0){
      osc[4].start();
      osc[4].freq(sketch.midiToFreq(root + 4));
      env[4].play();
      white[2] = 1;
    } else if(indexClicked >=12 && indexClicked <=15 && rowClicked === 1 || indexClicked >=12 && indexClicked <=14 && rowClicked === 0){
      osc[5].start();
      osc[5].freq(sketch.midiToFreq(root + 5));
      env[5].play();
      white[3] = 1;
    }else if(indexClicked >=15 && indexClicked <=16 && rowClicked === 0){
        osc[6].start();
        osc[6].freq(sketch.midiToFreq(root+6));
        env[6].play();
        black[4] = 1;
    } else if(indexClicked >=16 && indexClicked <=19 && rowClicked === 1 || indexClicked >=17 && indexClicked <=18 && rowClicked === 0){
      osc[7].start();
      osc[7].freq(sketch.midiToFreq(root + 7));
      env[7].play();
      white[4] = 1;
    }else if(indexClicked >=19 && indexClicked <=20 && rowClicked === 0){
        osc[8].start();
        osc[8].freq(sketch.midiToFreq(root+8));
        env[8].play();
        black[5] = 1;
    }else if(indexClicked >=20 && indexClicked <=23 && rowClicked === 1 || indexClicked >=21 && indexClicked <=22 && rowClicked === 0){
      osc[9].start();
      osc[9].freq(sketch.midiToFreq(root + 9));
      env[9].play();
      white[5] = 1;
    }else if(indexClicked >=23 && indexClicked <=24 && rowClicked === 0){
        osc[10].start();
        osc[10].freq(sketch.midiToFreq(root+10));
        env[10].play();
        black[6] = 1;
    }else if(indexClicked >=24 && indexClicked <=27 && rowClicked === 1 || indexClicked >=25 && indexClicked <=27 && rowClicked === 0){
      osc[11].start();
      osc[11].freq(sketch.midiToFreq(root + 11));
      env[11].play();
      white[6] = 1;
    }else if(indexClicked >=28 && indexClicked <=31 && rowClicked === 1 || indexClicked >=28 && indexClicked <=30 && rowClicked === 0){
      osc[12].start();
      osc[12].freq(sketch.midiToFreq(root + 12));
      env[12].play();
      white[7] = 1;
    }else if(indexClicked >=31 && indexClicked <=32 && rowClicked === 0){
        osc[13].start();
        osc[13].freq(sketch.midiToFreq(root+13));
        env[13].play();
        black[8] = 1;
    }else if(indexClicked >=32 && indexClicked <=35 && rowClicked === 1 || indexClicked >=33 && indexClicked <=34 && rowClicked === 0){
      osc[14].start();
      osc[14].freq(sketch.midiToFreq(root + 14));
      env[14].play();
      white[8] = 1;
    }else if(indexClicked >=35 && indexClicked <=36 && rowClicked === 0){
        osc[15].start();
        osc[15].freq(sketch.midiToFreq(root+15));
        env[15].play();
        black[9] = 1;
    }else if(indexClicked >=36 && indexClicked <=39 && rowClicked === 1 || indexClicked >=37 && indexClicked <=38 && rowClicked === 0){
      osc[16].start();
      osc[16].freq(sketch.midiToFreq(root + 16));
      env[16].play();
      white[9] = 1;
    }
    sketch.draw();
  };

  // Computer keyboard as controller functionality
  // https://editor.p5js.org/mrbombmusic/sketches/ryeLfZTd-
    
  sketch.keyPressed = () => {
      // a
      if (sketch.keyCode === 65) {
        osc[0].start();
        osc[0].freq(sketch.midiToFreq(root));
        env[0].play();
        white[0] = 1;
      // w
      } else if (sketch.keyCode === 87) {
        osc[1].start();
        osc[1].freq(sketch.midiToFreq(root + 1));
        env[1].play();
        black[1] = 1;
      // s
      } else if (sketch.keyCode === 83) {
        osc[2].start();
        osc[2].freq(sketch.midiToFreq(root + 2));
        env[2].play();
        white[1] = 1;
        // e
      } else if (sketch.keyCode === 69) {
        osc[3].start();
        osc[3].freq(sketch.midiToFreq(root + 3));
        env[3].play();
        black[2] = 1;
        // d
      } else if (sketch.keyCode === 68) {
        osc[4].start();
        osc[4].freq(sketch.midiToFreq(root + 4));
        env[4].play();
        white[2] = 1;
        // f
      } else if (sketch.keyCode === 70) {
        osc[5].start();
        osc[5].freq(sketch.midiToFreq(root + 5));
        env[5].play();
        white[3] = 1;
        // t
      } else if (sketch.keyCode === 84) {
        osc[6].start();
        osc[6].freq(sketch.midiToFreq(root + 6));
        env[6].play();
        black[4] = 1;
        // g
      } else if (sketch.keyCode === 71) {
        osc[7].start();
        osc[7].freq(sketch.midiToFreq(root + 7));
        env[7].play();
        white[4] = 1;
        // y
      } else if (sketch.keyCode === 89) {
        osc[8].start();
        osc[8].freq(sketch.midiToFreq(root + 8));
        env[8].play();
        black[5] = 1;
        // h
      } else if (sketch.keyCode === 72) {
        osc[9].start();
        osc[9].freq(sketch.midiToFreq(root + 9));
        env[9].play();
        white[5] = 1;
        // u
      } else if (sketch.keyCode === 85) {
        osc[10].start();
        osc[10].freq(sketch.midiToFreq(root + 10));
        env[10].play();
        black[6] = 1;
        // j
      } else if (sketch.keyCode === 74) {
        osc[11].start();
        osc[11].freq(sketch.midiToFreq(root + 11));
        env[11].play();
        white[6] = 1;
        // k
      } else if (sketch.keyCode === 75) {
        osc[12].start();
        osc[12].freq(sketch.midiToFreq(root + 12));
        env[12].play();
        white[7] = 1;
        // o
      } else if (sketch.keyCode === 79) {
        osc[13].start();
        osc[13].freq(sketch.midiToFreq(root + 13));
        env[13].play();
        black[8] = 1;
        // l
      } else if (sketch.keyCode === 76) {
        osc[14].start();
        osc[14].freq(sketch.midiToFreq(root + 14));
        env[14].play();
        white[8] = 1;
        // p
      } else if (sketch.keyCode === 80) {
        osc[15].start();
        osc[15].freq(sketch.midiToFreq(root + 15));
        env[15].play();
        black[9] = 1;
        // ;
      } else if (sketch.keyCode === 186) {
        osc[16].start();
        osc[16].freq(sketch.midiToFreq(root + 16));
        env[16].play();
        white[9] = 1;
      }
  };

  // Change colour back when key is released
  sketch.keyReleased = () =>{
  for (var j = 0; j < 10; j++){
      white[j]= 0;
      black[j]= 0;
    }
  }

  // Change colour back when mouse/touch is released
  sketch.mouseReleased = () =>{
    for (var j = 0; j < 10; j++){
      white[j]= 0;
      black[j]= 0;
    }
  };
  
  // Reponsive design
  sketch.windowResized = () => {
    sketch.resizeCanvas(window.innerWidth/1.69, window.innerHeight/4);;
    sineBut.position(window.innerWidth/4.91, window.innerHeight/2.18);
    triBut.position(window.innerWidth/4.91, window.innerHeight/2);
    sawBut.position(window.innerWidth/3.87, window.innerHeight/2.18);
    squareBut.position(window.innerWidth/3.87, window.innerHeight/2);
    cellWidth = cnv.width/10;
    attackSlide.position(window.innerWidth/3.06, window.innerHeight/2.05);
    decaySlide.position(window.innerWidth/2.81, window.innerHeight/2.05);
    sustainSlide.position(window.innerWidth/2.60, window.innerHeight/2.05);
    releaseSlide.position(window.innerWidth/2.41, window.innerHeight/2.05);
    LPSlide.position(window.innerWidth/2.055, window.innerHeight/2.05);
    verbSlide.position(window.innerWidth/1.7, window.innerHeight/2.05);
    delSlide.position(window.innerWidth/1.465, window.innerHeight/2.05);
    ampSlide.position(window.innerWidth/1.308, window.innerHeight/2.05);
    sketch.draw();
  }

};

let myp5 = new p5(synthSketch, 'parent');

// To make this sequencer I followed this tutorial series: 
// https://www.youtube.com/watch?v=mmluIbsmvoY&list=PLLgJJsrdwhPywJe2TmMzYNKHdIZ3PASbr&ab_channel=TheAudioProgrammer

const seqSketch = (sketch2) => {

  let hh, clap, bass; // Instrument
  let hPat, cPat, bPat; // Instrument pattern
  let hPhrase, cPhrase, bPhrase; // Instrument phrase
  let drums; // part
  let bpmSlide;
  let beatLength;
  let cellWidth;
  let cnv;
  let sPat;
  let toggleOnOff;
  let tempo;

  sketch2.setup = () => {
    cnv = sketch2.createCanvas(window.innerWidth/2, window.innerHeight/6);
    cnv.mousePressed(sketch2.canvasPressed);
    cnv.addClass('seqCnv');
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
    

    bpmSlide = sketch2.createSlider(20, 160, 80, 1).position(window.innerWidth/1.308, window.innerHeight/3.25);
    bpmSlide.addClass('slider');

    drums.setBPM(80);  

    sketch2.drawMatrix();

    toggleOnOff = sketch2.createButton('PLAY').position(window.innerWidth/4.91, window.innerHeight/3.4).mousePressed(() =>
      {if (drums.isPlaying){
        drums.metro.metroTicks = 0;
        drums.stop();
        toggleOnOff.style('background-color', '#f5df6d')
      }else {drums.loop();
        toggleOnOff.style('background-color', '#f28952');} 
    });
  };


  sketch2.canvasPressed = () => {
    let rowClicked = sketch2.floor(3*sketch2.mouseY/cnv.height);
    let indexClicked = sketch2.floor(16*sketch2.mouseX/cnv.width);
      if(rowClicked === 0){
        hPat[indexClicked] = +!hPat[indexClicked];
      } else if(rowClicked === 1){
        cPat[indexClicked] = +!cPat[indexClicked];
      } else if(rowClicked === 2){
        bPat[indexClicked] = +!bPat[indexClicked];
      }
  
    sketch2.drawMatrix();
  }

  sketch2.drawMatrix = () => {

    tempo = bpmSlide.value();
    drums.setBPM(tempo);  
      
    sketch2.background(236, 230, 223);
    sketch2.stroke('gray');
    sketch2.strokeWeight(0.75);
    sketch2.fill(242, 137, 82);
    for(let i = 1; i < beatLength; i++){
      sketch2.line( i*cellWidth, 0, i*cellWidth, sketch2.height);
    }

    for(let i = 1; i < 3; i++){
      sketch2.line(0, i*sketch2.height/3, sketch2.width, i*sketch2.height/3);
    }

      
    for (let i =0; i < beatLength; i++){
      if(hPat[i] === 1){
        sketch2.ellipse(i*cellWidth + 0.5*cellWidth, sketch2.height/6, cellWidth/2.3);
    }
      if(cPat[i] === 1){
        sketch2.ellipse(i*cellWidth + 0.5*cellWidth, sketch2.height/2, cellWidth/2.3);
    }
      if (bPat[i] === 1){
      sketch2.ellipse(i*cellWidth + 0.5*cellWidth, sketch2.height*5/6, cellWidth/2.3);
        }
      }
  };

  sketch2.sequence = (time, beatIndex) => {
    setTimeout(() => {
      sketch2.drawMatrix();
      sketch2.drawPlayhead(beatIndex);
    }, time*1000);

  };

  // Draws the red playhead
  sketch2.drawPlayhead = (beatIndex) => {
    sketch2.noStroke();
    sketch2.fill(255, 0, 0, 30);
    sketch2.rect((beatIndex-1)*cellWidth, 0, cellWidth, sketch2.height);
  };

  // Browser permission for audio to play
  sketch2.touchStarted = () => {
    if(sketch2.getAudioContext().state !== 'running'){
  sketch2.getAudioContext().resume();
    }
  };

  // Responsive design
  sketch2.windowResized = () => {
    sketch2.resizeCanvas(window.innerWidth/2, window.innerHeight/6);
    cellWidth = cnv.width/beatLength;
    toggleOnOff.position(window.innerWidth/4.91, window.innerHeight/3.4)
    bpmSlide.position(window.innerWidth/1.308, window.innerHeight/3.25);
    sketch2.drawMatrix();
  };

}

let myp5d = new p5(seqSketch, 'parent');
