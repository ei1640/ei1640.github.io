function generateBingoCard() {
    const table = document.getElementById("bingo");
    const size = parseInt(document.getElementById("size").value, 10);
    table.innerHTML = ""; // 前回のカードをクリア
  
    const totalCells = size * size;
    const freeIndex = Math.floor(totalCells / 2);
  
    if (smashCharacters.length < totalCells - 1) {
      alert("キャラクターが足りません！");
      return;
    }
  
    const shuffled = shuffleArray([...smashCharacters]);
    let charIndex = 0;
  
    for (let row = 0; row < size; row++) {
      const tr = document.createElement("tr");
      for (let col = 0; col < size; col++) {
        const cellIndex = row * size + col;
        const td = document.createElement("td");
  
        if (cellIndex === freeIndex && size % 2 === 1) {
          td.textContent = "FREE";
          td.classList.add("marked");
        } else {
          td.textContent = shuffled[charIndex++];
        }
  
        td.addEventListener("click", () => {
          td.classList.toggle("marked");
        });
  
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
  }
  
  // 配列をシャッフル
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  // 初回生成
  generateBingoCard();
  