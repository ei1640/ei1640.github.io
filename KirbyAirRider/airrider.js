const characterBox = document.getElementById("character-box");
const machineBox = document.getElementById("machine-box");
const startBtn = document.getElementById("start-btn");

let spinning = false;

function adjustFontSize(box){

  let size = 40;

  box.style.fontSize = size + "px";

  while(box.scrollWidth > box.clientWidth && size > 12){
    size--;
    box.style.fontSize = size + "px";
  }

}

startBtn.addEventListener("click", () => {

  if(spinning) return;

  spinning = true;

  const interval = setInterval(()=>{

    const char =
      airriderData.キャラクター[
        Math.floor(Math.random()*airriderData.キャラクター.length)
      ];

    const machine =
      airriderData.マシン[
        Math.floor(Math.random()*airriderData.マシン.length)
      ];

    characterBox.textContent = char;
    machineBox.textContent = machine;

    adjustFontSize(characterBox);
    adjustFontSize(machineBox);

  },80);

  setTimeout(()=>{

    clearInterval(interval);

    const finalChar =
      airriderData.キャラクター[
        Math.floor(Math.random()*airriderData.キャラクター.length)
      ];

    const finalMachine =
      airriderData.マシン[
        Math.floor(Math.random()*airriderData.マシン.length)
      ];

    characterBox.textContent = finalChar;
    machineBox.textContent = finalMachine;

    adjustFontSize(characterBox);
    adjustFontSize(machineBox);

    spinning = false;

  },2000);

});

window.addEventListener("load", () => {

  adjustFontSize(characterBox);
  adjustFontSize(machineBox);

});