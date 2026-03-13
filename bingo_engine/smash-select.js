// ==========================
// ⭐ チェックボックス生成
// ==========================

function createCheckboxList(containerId, list){

  const container = document.getElementById(containerId);

  list.forEach(name=>{

    const label = document.createElement("label");

    label.innerHTML =
      `<input type="checkbox" value="${name}" checked> ${name}`;

    container.appendChild(label);

  });
}

createCheckboxList("base-list", smashCharacters);
createCheckboxList("dlc-list", dlcCharacters);

// ==========================
// ⭐ 全チェック / 全解除
// ==========================

document.getElementById("check-all").onclick = ()=>{
  document.querySelectorAll("input[type=checkbox]")
    .forEach(c=>c.checked = true);
};

document.getElementById("uncheck-all").onclick = ()=>{
  document.querySelectorAll("input[type=checkbox]")
    .forEach(c=>c.checked = false);
};

// ==========================
// ⭐ 最小重複生成
// ==========================

function generateCharacters(selected, size){

  const total = size * size;
  const freeOffset = size % 2 === 1 ? 1 : 0;
  const needed = total - freeOffset;

  const base = Math.floor(needed / selected.length);
  const remainder = needed % selected.length;

  let result = [];

  selected.forEach(c=>{
    for(let i=0;i<base;i++) result.push(c);
  });

  const shuffled = [...selected].sort(()=>Math.random()-0.5);

  for(let i=0;i<remainder;i++){
    result.push(shuffled[i]);
  }

  return result.sort(()=>Math.random()-0.5);
}

// ==========================
// ⭐ ビンゴエンジン接続
// ==========================

createBingoEngine({

  sizeId: "size",
  gridId: "bingo-card",
  generateBtnId: "generate-btn",
  randomBtnId: "random-btn",

  notEnoughMessage: "キャラを選択してください",

  getItems: () => {

    const size =
      parseInt(document.getElementById("size").value);

    const selected =
      Array.from(
        document.querySelectorAll(
          "input[type=checkbox]:checked"
        )
      ).map(c=>c.value);

    if(selected.length === 0) return [];

    return generateCharacters(selected, size);
  }

});