import seqSketch from "./modules/sequencer.js";
import keySketch from "./modules/keyboard.js";

setTimeout(function(){ 
    document.getElementById('loader').style.display = 'none';
}, 5000);

// Instance mode:
// https://github.com/processing/p5.js/wiki/Global-and-instance-mode

let sequencer = new p5(seqSketch, 'sequencer-container');
let keyboard = new p5(keySketch, 'keyboard-container');