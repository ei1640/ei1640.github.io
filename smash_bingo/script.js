window.onload = function () {
  const sizeSelect = document.getElementById("size");
  const generateBtn = document.getElementById("generate-btn");
  const bingoCard = document.getElementById("bingo-card");

  function generateBingoCard() {
    const size = parseInt(sizeSelect.value);
    const totalCells = size * size;
    const freeIndex = Math.floor(totalCells / 2);

    if (smashCharacters.length < totalCells - 1) {
      alert("キャラが足りません！");
      return;
    }

    const shuffled = [...smashCharacters].sort(() => Math.random() - 0.5);
    let index = 0;

    bingoCard.innerHTML = "";
    bingoCard.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

    for (let i = 0; i < totalCells; i++) {
      const cell = document.createElement("div");
      cell.className = "bingo-cell";

      if (size % 2 === 1 && i === freeIndex) {
        cell.textContent = "FREE";
        cell.classList.add("free", "marked");
      } else {
        cell.textContent = shuffled[index++];
      }

      cell.addEventListener("click", () => {
        cell.classList.toggle("marked");
      });

      bingoCard.appendChild(cell);
    }
  }

  generateBtn.addEventListener("click", generateBingoCard);
  generateBingoCard();
};
