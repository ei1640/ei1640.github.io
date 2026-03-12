window.onload = function(){

  const dlcArea = document.getElementById("dlc-area");

  dlcCharacters.forEach(name=>{

    const label = document.createElement("label");

    const checkbox = document.createElement("input");
    checkbox.type="checkbox";
    checkbox.value=name;

    const saved = localStorage.getItem("dlc_"+name);
    checkbox.checked = saved === null ? true : saved==="true";

    checkbox.addEventListener("change",()=>{
      localStorage.setItem("dlc_"+name,checkbox.checked);
    });

    label.appendChild(checkbox);
    label.append(" "+name);

    dlcArea.appendChild(label);
  });

  function getCharacters(){

    let list=[...smashCharacters];

    document.querySelectorAll("#dlc-area input:checked")
      .forEach(cb=>list.push(cb.value));

    return list;
  }

  createBingoEngine({
    sizeId:"size",
    gridId:"bingo-card",
    generateBtnId:"generate-btn",
    randomBtnId:"random-cell-btn",

    getItems:getCharacters,

    notEnoughMessage:"キャラが足りません"
  });

}