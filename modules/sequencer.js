// To make this sequencer I followed this tutorial series: 
// https://www.youtube.com/watch?v=mmluIbsmvoY&list=PLLgJJsrdwhPywJe2TmMzYNKHdIZ3PASbr&ab_channel=TheAudioProgrammer

const seqSketch = (sketch) => {

  let hh, clap, bass; // Instrument
  let hPat, cPat, bPat; // Instrument pattern
  let hPhrase, cPhrase, bPhrase; // Instrument phrase
  let drums; // part
  let bpmSlide;
  let cnv;
  let sPat;
  let toggleOnOff;
  let tempo;
  let width;
  let height;
  let beatLength = 16;
  let cellWidth = width / beatLength;
  let rowClicked;
  let indexClicked

  sketch.preload = () => {
      width = 840;
      height = 158;
    if (window.innerWidth < 703 && window.innerHeight > 1134) { 
      width = window.innerWidth * 1.2;
      height = window.innerWidth * 0.33 - 73;
    } else if (window.innerWidth < 1134 && window.innerHeight < 1134) {
      width = 637;
      height = 127
    }
    cellWidth = width / beatLength;
  }

  sketch.setup = () => {
    cnv = sketch.createCanvas(width, height);
    cnv.mousePressed(sketch.canvasPressed);
    cnv.id('sequencer-canvas');
    
    hh = sketch.loadSound('assets/hh_sample.mp3');
    clap = sketch.loadSound('assets/clap_sample.mp3');
    bass = sketch.loadSound('assets/bass_sample.mp3');
    
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
    drums.addPhrase('seq', sketch.sequence, sPat);
    

    bpmSlide = sketch.createSlider(20, 160, 80, 1).addClass('slider').id('bpm-slider').parent('controls');

    drums.setBPM(80);  

    sketch.drawSeq();

    toggleOnOff = sketch.createButton('PLAY').id('play').parent('controls').mousePressed(() =>
      {if (drums.isPlaying){
        drums.metro.metroTicks = 0;
        drums.stop();
        toggleOnOff.style('background-color', '#f5df6d')
      }else {drums.loop();
        toggleOnOff.style('background-color', '#f28952');} 
    });
  };


  sketch.canvasPressed = () => {
    if (window.innerWidth > 1133){
      rowClicked = sketch.floor(3 * sketch.mouseY / height);
      indexClicked = sketch.floor(beatLength * sketch.mouseX / width);
    } else if (window.innerWidth < 1132) {
      rowClicked = sketch.floor(3 * sketch.mouseX / height);
      indexClicked = sketch.floor(-beatLength * (sketch.mouseY - width) / width);
    }

      if(rowClicked === 0){
        hPat[indexClicked] = +!hPat[indexClicked];
      } else if(rowClicked === 1){
        cPat[indexClicked] = +!cPat[indexClicked];
      } else if(rowClicked === 2){
        bPat[indexClicked] = +!bPat[indexClicked];
      }
  
    sketch.drawSeq();
  }

  sketch.drawSeq = () => {
    tempo = bpmSlide.value();
    drums.setBPM(tempo);  
      
    sketch.background(236, 230, 223);
    sketch.stroke('gray');
    sketch.strokeWeight(0.75);
    sketch.fill(242, 137, 82);
    for(let i = 1; i < beatLength; i++){
      sketch.line( i * cellWidth, 0, i * cellWidth, height);
    }

    for(let i = 1; i < 3; i++){
      sketch.line(0, i * height / 3, width, i * height / 3);
    }

      
    for (let i =0; i < beatLength; i++){
      if(hPat[i] === 1){
        sketch.ellipse(i * cellWidth + 0.5 * cellWidth, height / 6, cellWidth / 2.3);
    }
      if(cPat[i] === 1){
        sketch.ellipse(i * cellWidth + 0.5 * cellWidth, height / 2, cellWidth / 2.3);
    }
      if (bPat[i] === 1){
      sketch.ellipse(i * cellWidth + 0.5 * cellWidth, height * 5 / 6, cellWidth / 2.3);
        }
      }
  };

  sketch.sequence = (time, beatIndex) => {
    setTimeout(() => {
      sketch.drawSeq();
      sketch.drawPlayhead(beatIndex);
    }, time*1000);

  };

  // Draws the red playhead
  sketch.drawPlayhead = (beatIndex) => {
    sketch.noStroke();
    sketch.fill(255, 0, 0, 30);
    sketch.rect((beatIndex - 1) * cellWidth, 0, cellWidth, height);
  };

  // Browser permission for audio to play
  sketch.touchStarted = () => {
    if(sketch.getAudioContext().state !== 'running'){
  sketch.getAudioContext().resume();
    }
  };

  // Responsive design
  sketch.windowResized = () => {
    if (window.innerWidth > 1134) {
      width = 840;
      height = 158;
    } else if (window.innerWidth > 704 && window.innerHeight > 1134) {
      width = 840;
      height = 158;
    } else if (window.innerWidth < 703 && window.innerHeight > 1134) {
      width = window.innerWidth * 1.2;
      height = window.innerWidth * 0.33 - 73;
    } else if (window.innerWidth < 1134 && window.innerHeight < 1134) {
      width = 637;
      height = 127
    } 
    cellWidth = width / beatLength;
    sketch.resizeCanvas(width, height);
    sketch.drawSeq();
  }
}

export default seqSketch;