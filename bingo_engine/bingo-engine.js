function createBingoEngine(config){

  const sizeSelect = document.getElementById(config.sizeId);
  const grid = document.getElementById(config.gridId);
  const generateBtn = document.getElementById(config.generateBtnId);
  const randomBtn = document.getElementById(config.randomBtnId);

  let alreadyAlerted = false;

  function shuffle(array){
    return [...array].sort(()=>Math.random()-0.5);
  }

  function generate(){

    const size = parseInt(sizeSelect.value);
    const total = size * size;
    const freeIndex = Math.floor(total / 2);

    alreadyAlerted = false;

    const list = config.getItems();

    if(list.length < total-1){
      alert(config.notEnoughMessage || "数が足りません");
      return;
    }

    const shuffled = shuffle(list);

    grid.innerHTML = "";
    grid.style.gridTemplateColumns = `repeat(${size},1fr)`;

    let index = 0;

    for(let i=0;i<total;i++){

      const cell = document.createElement("div");
      cell.className = "bingo-cell";

      if(size % 2 === 1 && i === freeIndex){

        cell.textContent = "FREE";
        cell.classList.add("free","marked");

      }else{

        cell.textContent = shuffled[index++];

      }

      cell.addEventListener("click",()=>{
        cell.classList.toggle("marked");
      });

      grid.appendChild(cell);
    }
  }

  function randomPick(){

    const cells = document.querySelectorAll(".bingo-cell:not(.marked):not(.free)");

    if(cells.length === 0){

      if(!alreadyAlerted){
        alert("すべてのマスがチェック済みです！");
        alreadyAlerted = true;
      }

      return;
    }

    document.querySelectorAll(".highlight").forEach(c=>{
      c.classList.remove("highlight");
    });

    const cell = cells[Math.floor(Math.random()*cells.length)];

    cell.classList.add("highlight");
  }

  generateBtn.addEventListener("click",generate);
  randomBtn.addEventListener("click",randomPick);

  generate();
}