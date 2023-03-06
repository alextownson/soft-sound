import seqSketch from "./modules/sequencer.js";
import keySketch from "./modules/keyboard.js";

let app = document.querySelector('#app');

window.addEventListener('load', () => {
    // document.querySelector('#loader').style.height = window.innerHeight + 'px';
    // setTimeout(function(){ 
    //     document.querySelector('#loader').style.opacity = 0;
    //     document.querySelector('#synth').style.opacity = 1;
    // }, 5000);
    // setTimeout(function(){ 
    //     document.querySelector('#loader').remove();
    // }, 6000);
    app.style.width = window.innerWidth + 'px';
    app.style.height = window.innerHeight + 'px';
})



window.addEventListener('resize', () => {
    app.style.width = window.innerWidth + 'px';
    app.style.height = window.innerHeight + 'px';
})

// Instance mode:
// https://github.com/processing/p5.js/wiki/Global-and-instance-mode

let sequencer = new p5(seqSketch, 'sequencer-container');
let keyboard = new p5(keySketch, 'keyboard-container');