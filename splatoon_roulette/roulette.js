const rouletteBox = document.getElementById("roulette-box");
const startBtn = document.getElementById("start-btn");
const categoryGroup = document.getElementById("category-group");

// ✅ カテゴリのチェックボックスを自動生成
for (const category in weaponData) {
  const label = document.createElement("label");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.value = category;
  checkbox.checked = true; // デフォルトでON

  label.appendChild(checkbox);
  label.append(" " + category);
  categoryGroup.appendChild(label);
}

startBtn.addEventListener("click", () => {
  startBtn.disabled = true;

  // ✅ 選ばれたカテゴリを取得
  const selectedCategories = Array.from(
    categoryGroup.querySelectorAll("input[type='checkbox']:checked")
  ).map(cb => cb.value);

  // ✅ 対象武器を集める
  let availableWeapons = [];
  selectedCategories.forEach(category => {
    availableWeapons = availableWeapons.concat(weaponData[category]);
  });

  if (availableWeapons.length === 0) {
    rouletteBox.textContent = "※カテゴリを選んでください";
    startBtn.disabled = false;
    return;
  }

  // ✅ 最終的に止まるブキをランダムに選ぶ
  const finalWeapon = availableWeapons[Math.floor(Math.random() * availableWeapons.length)];

  // 🎞️ くるくる表示（見た目用）
  const intervalId = setInterval(() => {
    const w = availableWeapons[Math.floor(Math.random() * availableWeapons.length)];
    rouletteBox.textContent = w;
  }, 100);

  // ⏱️ 一定時間後に止める
  setTimeout(() => {
    clearInterval(intervalId);
    rouletteBox.textContent = `🎉 ${finalWeapon} 🎉`;
    startBtn.disabled = false;
  }, 3000);
});
