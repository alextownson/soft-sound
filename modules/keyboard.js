// Keyboard synth:
const keySketch = (sketch) => {

    let cnv, width, height;
    let polySynth;
    let attackSlide, decaySlide, sustainSlide, releaseSlide, LPSlide, verbSlide, delSlide, ampSlide;
    let sineBut, triBut, sawBut, squareBut;
    let attack, decay, sustain, release;
    let white = [];
    let black = [];
    let cellWidth = width/10;
    let rowClicked, indexClicked;
  
    sketch.preload = () => {
      width = 994;
      height = 236;
      if (window.innerWidth <= 710 && window.innerHeight >= 1140) { 
        width = window.innerWidth * 1.4;
        height = window.innerWidth * 0.53 - 139;
      } else if (window.innerWidth <= 1140 && window.innerWidth >= 890 && window.innerHeight <= 1140 && window.innerHeight >= 558 || window.innerHeight <= 710 && window.innerHeight >= 558 && window.innerWidth >= 890) {
        width = 772;
        height = 178;
      } else if (window.innerWidth <= 558 && window.innerHeight <= 1140 && window.innerHeight >= 840) {
        width = window.innerWidth * 1.4;
        height = window.innerWidth * 0.57 - 139;
      } else if (window.innerWidth <= 890 && window.innerWidth >= 416 && window.innerHeight <= 840 || window.innerHeight <= 558) {
        width = 592;
        height = 100;
      } else if (window.innerWidth <= 416 && window.innerHeight <= 890) {
        width = window.innerWidth * 1.4;
        height = window.innerWidth * 0.6 - 139;
      }
      cellWidth = width/10;
    }
  
    sketch.setup = () => {
      cnv = sketch.createCanvas(width, height);
      cnv.id('synth-canvas');
  
      white = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      black = [null, 0, 0, null, 0, 0, 0, null, 0, 0];
  
      // Create sliders
      attackSlide = sketch.createSlider(0, 5.0, 0.1, 0.1).addClass('slider').id('attack-slider').parent('controls');
      decaySlide = sketch.createSlider(0, 5.0, 0.1, 0.1).addClass('slider').id('decay-slider').parent('controls');
      sustainSlide = sketch.createSlider(0, 1.0, 0.1, 0.1).addClass('slider').id('sustain-slider').parent('controls');
      releaseSlide = sketch.createSlider(0, 5.0, 0.1, 0.1).addClass('slider').id('release-slider').parent('controls');
      LPSlide = sketch.createSlider(0, 5000, 5000, 100).addClass('slider').id('filter-slider').parent('controls');
      verbSlide = sketch.createSlider(0, 1, 0, 0.1).addClass('slider').id('reverb-slider').parent('controls');
      delSlide = sketch.createSlider(0, 1, 0, 0.1).addClass('slider').id('delay-slider').parent('controls');
      ampSlide = sketch.createSlider(0, 1, 1, 0.1).addClass('slider').id('amp-slider').parent('controls');

      // Create buttons
      sineBut = sketch.createButton('SINE').id('sine').parent('osc-buttons').style('background-color','#f28952').mousePressed(() => { 
        polySynth.setOscType('sine');
        sineBut.style('background-color', '#f28952')
        triBut.style('background-color', 'rgba(245, 223, 109, 0.7)')
        sawBut.style('background-color', 'rgba(245, 223, 109, 0.7)')
        squareBut.style('background-color', 'rgba(245, 223, 109, 0.7)')
      })

      triBut = sketch.createButton('TRI').id('triangle').parent('osc-buttons').mousePressed(() => {
        polySynth.setOscType('triangle');
        sineBut.style('background-color', 'rgba(245, 223, 109, 0.7)')
        triBut.style('background-color', '#f28952')
        sawBut.style('background-color', 'rgba(245, 223, 109, 0.7)')
        squareBut.style('background-color', 'rgba(245, 223, 109, 0.7)')
      })

      sawBut = sketch.createButton('SAW').id('saw').parent('osc-buttons').mousePressed(() => {
        polySynth.setOscType('sawtooth');
        sineBut.style('background-color', 'rgba(245, 223, 109, 0.7)')
        triBut.style('background-color', 'rgba(245, 223, 109, 0.7)')
        sawBut.style('background-color', '#f28952')
        squareBut.style('background-color', 'rgba(245, 223, 109, 0.7)')
     })

      squareBut = sketch.createButton('SQR').id('square').parent('osc-buttons').mousePressed(() => {
        polySynth.setOscType('square');
        sineBut.style('background-color', 'rgba(245, 223, 109, 0.7)')
        triBut.style('background-color', 'rgba(245, 223, 109, 0.7)')
        sawBut.style('background-color', 'rgba(245, 223, 109, 0.7)')
        squareBut.style('background-color', '#f28952')
     })

      polySynth = new p5.PolySynth();
      polySynth.setOscType('sine')
      polySynth.setADSR(0.1, 0.1, 0.1, 0.1);
      
      sketch.drawKeys();
    };
  
    sketch.drawKeys = () => {
  
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
    
      for (let i = 0 ; i < black.length; i++){
          if(black[i] === 0){
            sketch.rect(i*cellWidth-cellWidth/4, 0, cellWidth/2, sketch.height/2)
          }
      }
   
      for (let i = 0; i< black.length; i++){
        if(black[i] === 1){
          sketch.fill(236, 230, 223)
          sketch.rect(i*cellWidth-cellWidth/4, 0, cellWidth/2, sketch.height/2)}
      }
      
      // Assign the slider values to a variable
        attack = attackSlide.value();
        decay = decaySlide.value();
        sustain = sustainSlide.value();
        release = releaseSlide.value();

      // Change params based on slider values
        polySynth.setADSR(attack, decay, sustain, release);

      
    };
  
    // Click/touch functionality for keys

    sketch.touchStarted = () => {
      if (sketch.getAudioContext().state !== 'running') {
        sketch.getAudioContext().resume();
      }
    }

    sketch.mousePressed = () => {
      sketch.userStartAudio();
      // Detect where the keys have been clicked
      if (window.innerWidth > window.innerHeight){
        rowClicked = sketch.floor(2 * sketch.mouseY / height);
        indexClicked = sketch.floor(40 * sketch.mouseX/ width);
      } else if (window.innerWidth < window.innerHeight) {
        rowClicked = sketch.floor(2 * sketch.mouseX / height);
        indexClicked = sketch.floor(-40 * (sketch.mouseY - width) / width);
      }

  
      // Play osc and change colour; dependant on location of click
      if (indexClicked >= 0 && indexClicked <= 3 && rowClicked === 1 || indexClicked >= 1 && indexClicked <= 2 && rowClicked === 0) {
        polySynth.play('C4')
        white[0] = 1;
      } else if (indexClicked >=3 && indexClicked <=4 && rowClicked === 0){
        polySynth.play('C#4')
        black[1] = 1;
      } else if (indexClicked >=4 && indexClicked <=7 && rowClicked === 1 || indexClicked >=5 && indexClicked <=6 && rowClicked === 0){
        polySynth.play('D4')
        white[1] = 1;
      }else if(indexClicked >=7 && indexClicked <=8 && rowClicked === 0){
        polySynth.play('D#4')
        black[2] = 1;
      } else if(indexClicked >=8 && indexClicked <=11 && rowClicked === 1 || indexClicked >=9 && indexClicked <=11 && rowClicked === 0){
        polySynth.play('E4')
        white[2] = 1;
      } else if(indexClicked >=12 && indexClicked <=15 && rowClicked === 1 || indexClicked >=12 && indexClicked <=14 && rowClicked === 0){
        polySynth.play('F4')
        white[3] = 1;
      }else if(indexClicked >=15 && indexClicked <=16 && rowClicked === 0){
        polySynth.play('F#4')
        black[4] = 1;
      } else if(indexClicked >=16 && indexClicked <=19 && rowClicked === 1 || indexClicked >=17 && indexClicked <=18 && rowClicked === 0){
        polySynth.play('G4')
        white[4] = 1;
      }else if(indexClicked >=19 && indexClicked <=20 && rowClicked === 0){
        polySynth.play('G#4')
        black[5] = 1;
      }else if(indexClicked >=20 && indexClicked <=23 && rowClicked === 1 || indexClicked >=21 && indexClicked <=22 && rowClicked === 0){
        polySynth.play('A5')
        white[5] = 1;
      }else if(indexClicked >=23 && indexClicked <=24 && rowClicked === 0){
        polySynth.play('A#5')
        black[6] = 1;
      }else if(indexClicked >=24 && indexClicked <=27 && rowClicked === 1 || indexClicked >=25 && indexClicked <=27 && rowClicked === 0){
        polySynth.play('B5')
        white[6] = 1;
      }else if(indexClicked >=28 && indexClicked <=31 && rowClicked === 1 || indexClicked >=28 && indexClicked <=30 && rowClicked === 0){
        polySynth.play('C5')
        white[7] = 1;
      }else if(indexClicked >=31 && indexClicked <=32 && rowClicked === 0){
        polySynth.play('C#5')
        black[8] = 1;
      }else if(indexClicked >=32 && indexClicked <=35 && rowClicked === 1 || indexClicked >=33 && indexClicked <=34 && rowClicked === 0){
        polySynth.play('D5')
        white[8] = 1;
      }else if(indexClicked >=35 && indexClicked <=36 && rowClicked === 0){
        polySynth.play('D#5')
        black[9] = 1;
      }else if(indexClicked >=36 && indexClicked <=39 && rowClicked === 1 || indexClicked >=37 && indexClicked <=38 && rowClicked === 0){
        polySynth.play('E5')
        white[9] = 1;
      }
      sketch.drawKeys();
    };

    sketch.keyPressed = () => { 
      sketch.userStartAudio();
      if (sketch.keyCode === 65) {
        polySynth.play('C4')
        white[0] = 1;
      } else if (sketch.keyCode === 87){
        polySynth.play('C#4')
        black[1] = 1;
      } else if (sketch.keyCode === 83){
        polySynth.play('D4')
        white[1] = 1;
      } else if (sketch.keyCode === 69){
        polySynth.play('D#4')
        black[2] = 1;
      } else if (sketch.keyCode === 68){
        polySynth.play('E4')
        white[2] = 1;
      } else if (sketch.keyCode === 70){
        polySynth.play('F4')
        white[3] = 1;
      }else if (sketch.keyCode === 84){
        polySynth.play('F#4')
        black[4] = 1;
      } else if (sketch.keyCode === 71){
        polySynth.play('G4')
        white[4] = 1;
      }else if (sketch.keyCode === 89){
        polySynth.play('G#4')
        black[5] = 1;
      }else if (sketch.keyCode === 72){
        polySynth.play('A5')
        white[5] = 1;
      }else if (sketch.keyCode === 85){
        polySynth.play('A#5')
        black[6] = 1;
      }else if (sketch.keyCode === 74){
        polySynth.play('B5')
        white[6] = 1;
      }else if (sketch.keyCode === 75){
        polySynth.play('C5')
        white[7] = 1;
      }else if (sketch.keyCode === 79){
        polySynth.play('C#5')
        black[8] = 1;
      }else if (sketch.keyCode === 76){
        polySynth.play('D5')
        white[8] = 1;
      }else if (sketch.keyCode === 80){
        polySynth.play('D#5')
        black[9] = 1;
      }else if (sketch.keyCode === 186){
        polySynth.play('E5')
        white[9] = 1;
      }
      sketch.drawKeys();
    };

  
    // Change colour back when key is released
    sketch.keyReleased = () => {
      for (var j = 0; j < 10; j++){
        if (white[j] === 1) {
          white[j]= 0;
          // polySynth.noteRelease(whiteNotes[j]);
        } else if (black[j] === 1){ 
          black[j]= 0;
          // polySynth.noteRelease(blackNotes[j]);
      }
    }
    sketch.drawKeys();
    };

    // Change colour back when mouse/touch is released
    sketch.mouseReleased = () => {
      for (var j = 0; j < 10; j++){
        if (white[j] === 1) {
          white[j]= 0;
          // polySynth.noteRelease(whiteNotes[j], release);
        } else if (black[j] === 1){ 
          black[j]= 0;
          // polySynth.noteRelease(blackNotes[j], release);
        }
      }
    sketch.drawKeys();
    };

    // Responsive design

    sketch.windowResized = () => {
      if (window.innerWidth >= 1134 && window.innerHeight >= 710) {
        width = 994;
        height = 236;
      } else if (window.innerWidth <= 710 && window.innerHeight >= 1140) { 
        width = window.innerWidth * 1.4;
        height = window.innerWidth * 0.53 - 139;
      } else if (window.innerWidth <= 1140 && window.innerWidth >= 890 && window.innerHeight <= 1140 && window.innerHeight >= 558 || window.innerHeight <= 710 && window.innerHeight >= 558 && window.innerWidth >= 890) {
        width = 772;
        height = 178;
      } else if (window.innerWidth <= 558 && window.innerHeight <= 1140 && window.innerHeight >= 840) {
        width = window.innerWidth * 1.4;
        height = window.innerWidth * 0.57 - 139;
      } else if (window.innerWidth <= 890 && window.innerWidth >= 416 && window.innerHeight <= 840 || window.innerHeight <= 558) {
        width = 592;
        height = 100;
      } else if (window.innerWidth <= 416 && window.innerHeight <= 890) {
        width = window.innerWidth * 1.4;
        height = window.innerWidth * 0.6 - 139;
      }
      cellWidth = width/10;
      sketch.resizeCanvas(width, height);
      sketch.drawKeys;
    }
  
  };

  export default keySketch;