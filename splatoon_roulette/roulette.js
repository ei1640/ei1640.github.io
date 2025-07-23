const rouletteBox = document.getElementById("roulette-box");
const startBtn = document.getElementById("start-btn");

let intervalId = null;

startBtn.addEventListener("click", () => {
  startBtn.disabled = true;

  // 🎯 1. 最後に止まる武器をランダムに決めておく
  const finalWeapon = splatoonWeapons[Math.floor(Math.random() * splatoonWeapons.length)];

  // 🎞️ 2. 見た目用にくるくる回す（ランダム表示）
  intervalId = setInterval(() => {
    const randomWeapon = splatoonWeapons[Math.floor(Math.random() * splatoonWeapons.length)];
    rouletteBox.textContent = randomWeapon;
  }, 100); // 表示速度

  // ⏱️ 3. 一定時間後に決めたブキで止める
  setTimeout(() => {
    clearInterval(intervalId);
    rouletteBox.textContent = `🎉 ${finalWeapon} 🎉`;
    startBtn.disabled = false;
  }, 3000);
});
