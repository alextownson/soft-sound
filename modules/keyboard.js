// Keyboard synth:
const keySketch = (sketch) => {

    let cnv;
    let sineBut, triBut, sawBut, squareBut;
    let attackSlide, decaySlide, sustainSlide, releaseSlide, LPSlide, verbSlide, delSlide, ampSlide;
    let attack, decay, sustain, release;
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
    let width;
    let height;
    let cellWidth = width/10;
    let rowClicked;
    let indexClicked;
  
    sketch.preload = () => {
      width = 994;
      height = 236;
      if (window.innerWidth <= 710 && window.innerHeight >= 1140) { 
        width = window.innerWidth * 1.4;
        height = window.innerWidth * 0.53 - 139;
      } else if (window.innerWidth <= 1140 && window.innerWidth >= 890 && window.innerHeight <= 1140 || window.innerHeight <= 710 && window.innerHeight >= 558 && window.innerWidth >= 890) {
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
      attackSlide = sketch.createSlider(0, 1.0, 0.1, 0.01).addClass('slider').id('attack-slider').parent('controls');
      decaySlide = sketch.createSlider(0, 1.0, 0.1, 0.01).addClass('slider').id('decay-slider').parent('controls');
      sustainSlide = sketch.createSlider(0, 1.0, 0.1, 0.01).addClass('slider').id('sustain-slider').parent('controls');
      releaseSlide = sketch.createSlider(0, 1.0, 0.1, 0.01).addClass('slider').id('release-slider').parent('controls');
      LPSlide = sketch.createSlider(0, 2500, 2500, 50).addClass('slider').id('filter-slider').parent('controls');
      verbSlide = sketch.createSlider(0, 1, 0, 0.1).addClass('slider').id('reverb-slider').parent('controls');
      delSlide = sketch.createSlider(0, 1, 0, 0.1).addClass('slider').id('delay-slider').parent('controls');
      ampSlide = sketch.createSlider(0, 1, 1, 0.1).addClass('slider').id('amp-slider').parent('controls');
  
      // Create buttons
      sineBut = sketch.createButton('SINE').id('sine').parent('osc-buttons').style('background-color','#f28952').mousePressed(() =>
          { for (var j = 0; j < 17; j++) {
            osc[j].setType('sine');}
            sineBut.style('background-color', '#f28952')
            triBut.style('background-color', 'rgba(245, 223, 109, 0.7)')
            sawBut.style('background-color', 'rgba(245, 223, 109, 0.7)')
            squareBut.style('background-color', 'rgba(245, 223, 109, 0.7)')
          })
  
      triBut = sketch.createButton('TRI').id('triangle').parent('osc-buttons').mousePressed(() =>
          { for (var j = 0; j < 17; j++) {
            osc[j].setType('triangle');}
            sineBut.style('background-color', 'rgba(245, 223, 109, 0.7)')
            triBut.style('background-color', '#f28952')
            sawBut.style('background-color', 'rgba(245, 223, 109, 0.7)')
            squareBut.style('background-color', 'rgba(245, 223, 109, 0.7)')
          })
  
      sawBut = sketch.createButton('SAW').id('saw').parent('osc-buttons').mousePressed(() =>
          { for (var j = 0; j < 17; j++) {
            osc[j].setType('sawtooth');}
            sineBut.style('background-color', 'rgba(245, 223, 109, 0.7)')
            triBut.style('background-color', 'rgba(245, 223, 109, 0.7)')
            sawBut.style('background-color', '#f28952')
            squareBut.style('background-color', 'rgba(245, 223, 109, 0.7)')
          })
  
      squareBut = sketch.createButton('SQR').id('square').parent('osc-buttons').mousePressed(() =>
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
    sketch.mousePressed = () => {
  
      // Detect where the keys have been clicked
      
      if (window.innerWidth > window.innerHeight){
        rowClicked = sketch.floor(2 * sketch.mouseY / height);
        indexClicked = sketch.floor(40 * sketch.mouseX/ width);
      } else if (window.innerWidth < window.innerHeight) {
        rowClicked = sketch.floor(2 * sketch.mouseX / height);
        indexClicked = sketch.floor(-40 * (sketch.mouseY - width) / width);
      }
  
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
    
    // Responsive design
    sketch.windowResized = () => {
      if (window.innerWidth >= 1134 && window.innerHeight >= 710) {
        width = 994;
        height = 236;
      } else if (window.innerWidth <= 710 && window.innerHeight >= 1140) { 
        width = window.innerWidth * 1.4;
        height = window.innerWidth * 0.53 - 139;
      } else if (window.innerWidth <= 1140 && window.innerWidth >= 890 && window.innerHeight <= 1140 || window.innerHeight <= 710 && window.innerHeight >= 558 && window.innerWidth >= 890) {
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
      sketch.draw;
    }
  
  };

  export default keySketch;