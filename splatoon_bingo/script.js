window.onload = function () {

  const categoryGroup = document.getElementById("category-group");
  const generateBtn = document.getElementById("generate-btn");
  const bingoCard = document.getElementById("bingo-card");
  const randomPickBtn = document.getElementById("random-pick-btn");

  let alreadyAlerted = false;

  /* カテゴリチェックボックス生成 */

  for (const category in weaponData) {

    const label = document.createElement("label");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = category;

    const saved = localStorage.getItem("splatoon_category_" + category);

    if (saved === null) {
      checkbox.checked = category === "全ブキ";
    } else {
      checkbox.checked = saved === "true";
    }

    checkbox.addEventListener("change", () => {
      localStorage.setItem("splatoon_category_" + category, checkbox.checked);
    });

    label.appendChild(checkbox);
    label.append(" " + category);

    categoryGroup.appendChild(label);
  }


  function generateBingoCard(){

    const gridSize = parseInt(document.getElementById("size").value);
    const totalCells = gridSize * gridSize;

    alreadyAlerted = false;

    const selectedCategories = Array.from(
      categoryGroup.querySelectorAll("input:checked")
    ).map(cb => cb.value);

    let selectedWeapons = [];

    selectedCategories.forEach(category => {
      selectedWeapons = selectedWeapons.concat(weaponData[category]);
    });

    selectedWeapons = [...new Set(selectedWeapons)];

    if (selectedWeapons.length < totalCells - (gridSize % 2 === 1 ? 1 : 0)) {
      alert("選択されたカテゴリでは、十分な武器数がありません。");
      return;
    }

    const shuffled = selectedWeapons.sort(() => Math.random() - 0.5);

    bingoCard.innerHTML = "";
    bingoCard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    for (let i = 0; i < totalCells; i++) {

      const cell = document.createElement("div");
      cell.className = "bingo-cell";

      if (gridSize % 2 === 1 && i === Math.floor(totalCells / 2)) {

        cell.textContent = "FREE";
        cell.classList.add("free","marked");

      } else {

        cell.textContent = shuffled.shift();

      }

      cell.addEventListener("click", () => {
        cell.classList.toggle("marked");
      });

      bingoCard.appendChild(cell);
    }

  }


  generateBtn.addEventListener("click", generateBingoCard);

  generateBingoCard();


  randomPickBtn.addEventListener("click", () => {

    const cells = document.querySelectorAll(".bingo-cell:not(.marked):not(.free)");

    if (cells.length === 0){

      if(!alreadyAlerted){
        alert("すべてのマスがチェック済みです！");
        alreadyAlerted = true;
      }

      return;
    }

    document.querySelectorAll(".highlight").forEach(cell=>{
      cell.classList.remove("highlight");
    });

    const randomCell = cells[Math.floor(Math.random() * cells.length)];

    randomCell.classList.add("highlight");

  });

};