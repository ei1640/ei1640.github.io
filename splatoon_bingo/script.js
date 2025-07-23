window.onload = function () {
    const categoryGroup = document.getElementById("category-group");
    const gridSizeInput = document.getElementById("grid-size");
    const generateBtn = document.getElementById("generate-btn");
    const bingoCard = document.getElementById("bingo-card");
    let alreadyAlerted = false; 

    // チェックボックス自動生成
    for (const category in weaponData) {
      const label = document.createElement("label");
      label.style.marginRight = "10px";
  
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = category;
  
      // デフォルトで「全ブキ」がチェックされている
      if (category === "全ブキ") {
        checkbox.checked = true;
      }
  
      label.appendChild(checkbox);
      label.append(" " + category);
      categoryGroup.appendChild(label);
    }
  
    // ビンゴカード生成処理
    generateBtn.addEventListener("click", () => {
      const gridSize = parseInt(document.getElementById("size").value);
      const totalCells = gridSize * gridSize;
  
      // 警告をリセット
      alreadyAlerted = false;

      // 選択されたカテゴリ取得
      const selectedCategories = Array.from(
        categoryGroup.querySelectorAll("input[type='checkbox']:checked")
      ).map(cb => cb.value);
  
      // 選択されたカテゴリの武器を統合して1つのリストに
      let selectedWeapons = [];
      selectedCategories.forEach(category => {
        selectedWeapons = selectedWeapons.concat(weaponData[category]);
      });
  
      // 重複削除
      selectedWeapons = [...new Set(selectedWeapons)];
  
      // 抽選できる数が足りない場合
      if (selectedWeapons.length < totalCells - (totalCells % 2 === 1 ? 1 : 0)) {
        alert("選択されたカテゴリでは、十分な武器数がありません。");
        return;
      }
  
      // ランダムシャッフル
      const shuffled = selectedWeapons.sort(() => Math.random() - 0.5);
  
      // ビンゴカード描画
      bingoCard.innerHTML = "";
      bingoCard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  
      for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement("div");
        cell.className = "bingo-cell";
  
        // 奇数グリッドで中央をFREEに
        if (gridSize % 2 === 1 && i === Math.floor(totalCells / 2)) {
          cell.textContent = "FREE";
          cell.classList.add("free");
        } else {
          const weapon = shuffled.shift();
          cell.textContent = weapon;
        }
        
        cell.addEventListener("click", () => {
            cell.classList.toggle("marked");
        });
          

        bingoCard.appendChild(cell);
      }
    });

    const randomPickBtn = document.getElementById("random-pick-btn");

randomPickBtn.addEventListener("click", () => {
  const allCells = document.querySelectorAll(".bingo-cell:not(.free)");
  const cellsArray = Array.from(allCells);

  // すでにハイライトされているものをリセット
  cellsArray.forEach(cell => cell.classList.remove("highlight"));

  // 空なら中止
  if (cellsArray.length === 0) {
    alert("ビンゴカードがまだ生成されていません。");
    return;
  }

  // ランダムに1つ選んでハイライト
  const randomPickBtn = document.getElementById("random-pick-btn");

  randomPickBtn.addEventListener("click", () => {
    const allCells = document.querySelectorAll(".bingo-cell:not(.free)");
    const unmarkedCells = Array.from(allCells).filter(cell => !cell.classList.contains("marked"));
  
    // すでにハイライトされているものをリセット
    allCells.forEach(cell => cell.classList.remove("highlight"));
  
  // ✅ すべてマーク済み → 最初の1回だけ警告
    if (unmarkedCells.length === 0) {
      if (!alreadyAlerted) {
        alert("すべてのマスがチェック済みです！");
        alreadyAlerted = true;
      }
      return;
    }

    const randomIndex = Math.floor(Math.random() * unmarkedCells.length);
    const chosenCell = unmarkedCells[randomIndex];
    chosenCell.classList.add("highlight");
  });

})};