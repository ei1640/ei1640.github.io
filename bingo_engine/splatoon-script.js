window.onload=function(){

  const categoryGroup=document.getElementById("category-group");

  for(const category in weaponData){

    const label=document.createElement("label");

    const checkbox=document.createElement("input");
    checkbox.type="checkbox";
    checkbox.value=category;

    const saved=localStorage.getItem("splatoon_category_"+category);

    if(saved===null){
      checkbox.checked=category==="全ブキ";
    }else{
      checkbox.checked=saved==="true";
    }

    checkbox.addEventListener("change",()=>{
      localStorage.setItem("splatoon_category_"+category,checkbox.checked);
    });

    label.appendChild(checkbox);
    label.append(" "+category);

    categoryGroup.appendChild(label);
  }

  function getWeapons(){

    const selected=[...document.querySelectorAll("#category-group input:checked")]
      .map(cb=>cb.value);

    let weapons=[];

    selected.forEach(c=>{
      weapons=weapons.concat(weaponData[c]);
    });

    return [...new Set(weapons)];
  }

  createBingoEngine({
    sizeId:"size",
    gridId:"bingo-card",
    generateBtnId:"generate-btn",
    randomBtnId:"random-pick-btn",

    getItems:getWeapons,

    notEnoughMessage:"武器が足りません"
  });

}