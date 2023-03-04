import seqSketch from "./modules/sequencer.js";
import keySketch from "./modules/keyboard.js";

window.addEventListener('load', () => {
    document.querySelector('#loader').style.height = window.innerHeight + 'px';
    console.log('hello')
    setTimeout(function(){ 
        document.querySelector('#loader').style.opacity = 0;
        document.querySelector('#synth').style.opacity = 1;
    }, 5000);
})


// Instance mode:
// https://github.com/processing/p5.js/wiki/Global-and-instance-mode

let sequencer = new p5(seqSketch, 'sequencer-container');
let keyboard = new p5(keySketch, 'keyboard-container');