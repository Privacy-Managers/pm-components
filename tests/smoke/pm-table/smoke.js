const tableList = document.querySelector("pm-table");
document.addEventListener("DOMContentLoaded", () =>
{
  const objItems = [];
  for (let i = 0; i < 300; i++) {
    objItems.push({
      id:    `example${i}.com`,
      texts: {"domain": `example${i}.com`, "cookienum": "3 Cookies"}
    });
  }
  tableList.addItems(objItems);
  console.log(tableList.getItemIndex("example0.com"));

  addSubItems("example0.com");
  console.log(tableList.getItemIndex("subexample3.com"));
  // tableList.removeItem("example1.com");
  console.log(tableList.getItemElem("example100.com"));
  addSubItems("example5.com");
  console.log(tableList.getItemIndex("subexample3.com", "example0.com"));
  const updatable = tableList.getItem("example1.com");
  updatable.id = "example1_@@.com"
  updatable.texts.domain = "example1_@@.com"
  tableList.selectItem("example1.com");
  tableList.updateItem(updatable, "example1.com");
  document.querySelector("pm-tab-panel").select("templating");
  tableList.setListener((action, current, parent) =>
  {
    console.log(action);
    console.log(current);
    console.log(parent);
  });
});

function addSubItems(parentId)
{
  const itemObjs = [];
  const order = [3,2,4,5,1];
  for (let i = 0; i < order.length; i++) {
    itemObjs.push({
      id:      `subexample${order[i]}.com`,
      texts:   {"name": `subexample${order[i]}.com`, "value": "3 Cookies"}
    });
  }
  tableList.addItems(itemObjs, parentId);

}