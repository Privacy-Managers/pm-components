const tableList = document.querySelector("table-list");
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
});

function addSubItems(parentId)
{
  const itemObjs = [];
  for (let i = 0; i < 5; i++) {
    itemObjs.push({
      id:      `subexample${i}.com`,
      texts:   {"name": `subexample${i}.com`, "value": "3 Cookies"}
    });
  }
  tableList.addItems(itemObjs, parentId);

  tableList.removeItem("example4.com");
  tableList.removeItem("subexample0.com", "example5.com");
  tableList.removeItem("subexample1.com", "example5.com");
}