window.onload = function () {
  const sizeSelect = document.getElementById("size");
  const generateBtn = document.getElementById("generate-btn");
  const bingoCard = document.getElementById("bingo-card");

const dlcArea = document.getElementById("dlc-area");

dlcCharacters.forEach(name => {

  const label = document.createElement("label");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.value = name;

  // 保存された状態を読む
  const saved = localStorage.getItem("dlc_" + name);
  checkbox.checked = saved === null ? true : saved === "true";

  // チェック変更時に保存
  checkbox.addEventListener("change", () => {
    localStorage.setItem("dlc_" + name, checkbox.checked);
  });

  label.appendChild(checkbox);
  label.append(" " + name);

  dlcArea.appendChild(label);
});

function getAvailableCharacters(){

  let characters = [...smashCharacters];

  const checkedDLC = document.querySelectorAll("#dlc-area input:checked");

  checkedDLC.forEach(cb=>{
    characters.push(cb.value);
  });

  return characters;
}

function generateBingoCard() {

  const size = parseInt(sizeSelect.value);
  const totalCells = size * size;
  const freeIndex = Math.floor(totalCells / 2);

  const availableCharacters = getAvailableCharacters();

  if (availableCharacters.length < totalCells - 1) {
    alert("キャラが足りません！");
    return;
  }

  const shuffled = shuffleArray(availableCharacters);
  let index = 0;

  bingoCard.innerHTML = "";
  bingoCard.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

  for (let i = 0; i < totalCells; i++) {

    const cell = document.createElement("div");
    cell.className = "bingo-cell";

    if (size % 2 === 1 && i === freeIndex) {

      cell.textContent = "FREE";
      cell.classList.add("free","marked");

    } else {

      cell.textContent = shuffled[index++];

    }

    cell.addEventListener("click", () => {
      cell.classList.toggle("marked");
    });

    bingoCard.appendChild(cell);
  }
}

function shuffleArray(array){
  return [...array].sort(()=>Math.random()-0.5);
}

  generateBtn.addEventListener("click", generateBingoCard);
  generateBingoCard();

  const randomBtn = document.getElementById("random-cell-btn");

randomBtn.addEventListener("click", () => {

  const cells = document.querySelectorAll(".bingo-cell:not(.marked)");

  if (cells.length === 0) {
    alert("すべてのマスがチェック済みです");
    return;
  }

  // 既存ハイライトを消す
  document.querySelectorAll(".highlight").forEach(cell=>{
    cell.classList.remove("highlight");
  });

  const randomCell = cells[Math.floor(Math.random() * cells.length)];

  document.querySelectorAll(".highlight").forEach(cell=>{
    cell.classList.remove("highlight");
  });

  randomCell.classList.add("highlight");

});
};
