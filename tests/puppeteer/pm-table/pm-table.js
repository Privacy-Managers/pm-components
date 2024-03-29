const puppeteer = require('puppeteer');
const assert = require('assert');
let tableListHandle;

let browser;
let page;

before(async () =>
{
  browser = await puppeteer.launch({headless: true, args: ["--allow-file-access-from-files"]});
  page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
  await page.goto(`http://127.0.0.1:3001/puppeteer/pm-table.html`);
  tableListHandle = await page.$('pm-table');
});

const tableList = {};
const methods = ["getItemIndex", "addItems", "getItem", "removeItem",
                 "selectItem", "removeItem", "empty", "updateItem"];
methods.forEach((methodName) => {
  tableList[methodName] = (...args) => runComponentMethod(methodName, ...args);
});

function runComponentMethod()
{
  const functionName = arguments[0];
  const args = Array.prototype.slice.call(arguments, 1);
  return page.evaluate((tableListHandle, functionName, args) =>
  {
    return tableListHandle[functionName](...args);
  }, tableListHandle, functionName, args);
}

function getItemElemDatasetId(id, parentId)
{
  return page.evaluate((tableListHandle, id, parentId) =>
  {
    if (tableListHandle.getItemElem(id, parentId))
      return tableListHandle.getItemElem(id, parentId).dataset.id;
  }, tableListHandle, id, parentId);
}

function getLastItemElemDatasetId()
{
  return page.evaluate((tableListHandle) =>
  {
    const elements = tableListHandle.shadowRoot.querySelector("ul").children;
    return elements[elements.length - 1].dataset.id
  }, tableListHandle);
}

function scrollToBottom()
{
  return page.evaluate((tableListHandle) =>
  {
    const scrollableSection = tableListHandle.shadowRoot.querySelector("ul");
    scrollableSection.scrollTop = scrollableSection.scrollHeight;
  }, tableListHandle);
}

function getItemElemIndex(id, parentId)
{
  return page.evaluate((tableListHandle, id, parentId) =>
  {
    const elem = tableListHandle.getItemElem(id, parentId);
    if (elem)
      return Array.prototype.indexOf.call(elem.parentElement.children, elem);
  }, tableListHandle, id, parentId);
}

function queryAndGetAttribute(query, attribute)
{
  return page.evaluate((tableListHandle, query, attribute) =>
  {
    return tableListHandle.shadowRoot.querySelector(query).getAttribute(attribute);
  }, tableListHandle, query, attribute);
}

function queryAndGetContent(query)
{
  return page.evaluate((tableListHandle, query) =>
  {
    return tableListHandle.shadowRoot.querySelector(query).textContent;
  }, tableListHandle, query);
}

function getSelectedDatasetId()
{
  return page.evaluate((tableListHandle) =>
  {
    return tableListHandle.shadowRoot.activeElement.dataset.id;
  }, tableListHandle);
}

function updateSortAndReAdd(sort, sortSub)
{
  return page.evaluate((tableListHandle, sort, sortSub) =>
  {
    const [mainTemplate, subTemplate] = tableListHandle.querySelectorAll("template");
    const updateSort = (template, sortValue) =>
    {
      if (sortValue)
        template.setAttribute("sort", sortValue);
      else
        template.removeAttribute("sort");
    };
    updateSort(mainTemplate, sort);
    updateSort(subTemplate, sortSub);
    const parentElem = tableListHandle.parentElement;
    parentElem.removeChild(tableListHandle);
    parentElem.appendChild(tableListHandle);
  }, tableListHandle, sort, sortSub);
}

function getLoadedAmount(id)
{
  return page.evaluate((tableListHandle, id) => {
    let elements = tableListHandle.shadowRoot.querySelector("ul").children;
    if (id)
    {
      const index = tableListHandle.getItemIndex(id);
      elements = elements[index].querySelector("ul").children;
    }
    return elements.length;
  }, tableListHandle, id);
}

async function ensureItem(id, parentId)
{
  return !!(await getItemElemDatasetId(id, parentId) ||
            await tableList.getItem(id, parentId));
}

async function getItemAndElemIndex(id, parentId)
{
  const elemIndex = await getItemElemIndex(id, parentId);
  const itemIndex = await tableList.getItemIndex(id, parentId);
  if (elemIndex !== itemIndex)
    return false;
  else
    return itemIndex;
}

describe("pm-table component", () =>
{
  it("Populating Table with 300 items should load first 50 items by default", async() =>
  {
    const objItems = [];
    for (let i = 0; i < 300; i++) {
      objItems.push({
        id:    `example${i}.com`,
        texts: {"domain": `example${i}.com`, "cookienum": "3 Cookies"}
      });
    }

    await tableList.addItems(objItems);
    const loaded =  await getLoadedAmount();
    assert.equal(loaded, 50);
  });
  it("getItemIndex(id) method should return index for Item", async() =>
  {
    assert.equal(await tableList.getItemIndex("example0.com"), 0);
    assert.equal(await tableList.getItemIndex("example-1.com"), -1);
  });
  it("removeItem() method should remove item and from the table list", async() =>
  {
    await tableList.removeItem("example1.com");
    const index = await tableList.getItemIndex("example1.com");
    assert.equal(index, -1);
  });
  it("addItems(items, id) method should add subitems to the item when second argument is used", async() =>
  {
    const createSubItem = (index) => {
      return {
        id:    `subexample${index}.com`,
        texts: {"name": `subexample${index}.com`, "value": "3 Cookies"}
      }
    };
    const createItemObjects = (amount) => {
      const itemObjects = [];
      for (let i = 0; i < amount; i++) {
        itemObjects.push(createSubItem(i));
      }
      return itemObjects;
    };
    
    await tableList.addItems(createItemObjects(5), "example0.com");
    assert.equal(await getLoadedAmount("example0.com"), 5);
    await tableList.addItems(createItemObjects(5), "example5.com");
    assert.equal(await getLoadedAmount("example5.com"), 5);
    await tableList.addItems(createItemObjects(2), "example9.com");
    assert.equal(await getLoadedAmount("example9.com"), 2);

    await tableList.addItems([createSubItem(1)], "example11.com");
    await tableList.addItems([createSubItem(2)], "example11.com");
    const example11Item = await tableList.getItem("example11.com");
    assert.equal(example11Item.subItems.length, 2, "calling addItems multiple times should add subItems accordingy");

    const domain = "example01.com";
    const domainSub = "subexample01.com";
    const item = {
      id: domain,
      texts: {domain, "cookienum": "3 Cookies"},
      subItems: [
        {
          id: domainSub,
          texts: {name: domainSub, "cookienum": "3 Cookies"}
        }
      ]
    }
    await tableList.addItems([item]);
    assert.equal(await ensureItem(domainSub, domain), true, "Adding items with subitems should add subitems accordingly");
    assert.equal((await tableList.getItem("example01.com")).subItems.length, 1);
  });
  it("getItemIndex(id, parentId) method should return subIndex if one exist", async() =>
  {
    assert.equal(await tableList.getItemIndex("subexample3.com", "example0.com"), 3);
    assert.equal(await tableList.getItemIndex("subexample3.com", "example2.com"), -1);
    assert.equal(await tableList.getItemIndex("subexample-1.com", "example0.com"), -1);
  });
  it("getItemElem(access, parentId) should return the node element for id if loaded", async() =>
  {
    assert.equal(await getItemElemDatasetId("example0.com"), "example0.com");
    assert.equal(await getItemElemDatasetId("subexample3.com", "example0.com"), "subexample3.com");
    assert.equal(await getItemElemDatasetId("example100.com"), null);
    assert.equal(await getItemElemDatasetId("subexample100.com", "example0.com"), null);
  });
  it("getItem(access, parentId) method returns item or subItem if parentId is specified", async() =>
  {
    let item;

    item = await tableList.getItem("subexample3.com", "example0.com");
    assert.equal(item.id, "subexample3.com");

    item = await tableList.getItem("example4.com");
    assert.equal(item.id, "example4.com");
  });
  it("ArrowDown and ArrowUp should select sibling items also first and last when reaching the end", async() => 
  {
    await tableList.selectItem("example5.com");
    assert.equal(await getSelectedDatasetId(), "example5.com");
    await page.keyboard.press("ArrowDown");
    assert.equal(await getSelectedDatasetId(), "example6.com");
    await page.keyboard.press("ArrowUp");
    await page.keyboard.press("ArrowUp");
    assert.equal(await getSelectedDatasetId(), "example4.com");
    await tableList.selectItem("subexample3.com", "example0.com");
    assert.equal(await getSelectedDatasetId(), "subexample3.com");
    await page.keyboard.press("ArrowDown");
    assert.equal(await getSelectedDatasetId(), "subexample4.com");
    await page.keyboard.press("ArrowUp");
    await page.keyboard.press("ArrowUp");
    assert.equal(await getSelectedDatasetId(), "subexample2.com");
  });
  it("removeItem(id, parentId) method should remove item or subItem", async() =>
  {
    assert.equal(await ensureItem("example4.com"), true);
    await tableList.removeItem("example4.com");
    assert.equal(await ensureItem("example4.com"), false);

    assert.equal(await ensureItem("subexample0.com", "example5.com"), true);
    await tableList.removeItem("subexample0.com", "example5.com");
    assert.equal(await ensureItem("subexample0.com", "example5.com"), false);

    await tableList.selectItem("subexample1.com", "example5.com");
    await tableList.removeItem("subexample1.com", "example5.com");
    assert.equal(await getSelectedDatasetId(), "subexample2.com");

    await tableList.selectItem("subexample1.com", "example9.com");
    await tableList.removeItem("subexample1.com", "example9.com");
    assert.equal(await getSelectedDatasetId(), "subexample0.com");
    await tableList.removeItem("subexample0.com", "example9.com");
    assert.equal(await getSelectedDatasetId(), "example9.com");
  });
  it("updateItem(id, parentId) method should updated item or subItem", async() =>
  {
    const updatableParent = "example1.com";
    const updatableSubitem = "subexample1.com";
    const updatedParent = "example4.com";
    const updatedSubitem = "subexample2.com";
    await tableList.removeItem(updatedParent);
    await tableList.removeItem(updatableParent);
    const itemObject = {
      id:    updatableParent,
      texts: {"domain": updatableParent, "cookienum": "3 Cookies"}
    };
    const subItemObject = {
      id:    updatableSubitem,
      texts: {"domain": updatableSubitem, "cookienum": "3 Cookies"}
    };
    await tableList.addItems([itemObject]);
    assert.equal(await ensureItem(updatableParent), true);
    await tableList.selectItem(updatableParent);
    itemObject.id = updatedParent;
    await tableList.updateItem(itemObject, updatableParent);
    assert.equal(await ensureItem(updatableParent), false);
    assert.equal(await ensureItem(updatedParent), true);
    assert.equal(await getSelectedDatasetId(), updatedParent);
    await tableList.addItems([subItemObject], updatableSubitem);
    subItemObject.id = updatedSubitem;
    await tableList.updateItem(subItemObject, updatableSubitem, updatedParent);
    assert.equal(await ensureItem(updatedSubitem, updatedParent), true);

    assert.equal((await tableList.getItem("example01.com")).subItems.length, 1);
    const item = await tableList.getItem("example01.com");
    item.texts.cookienum = "4 Cookies";
    await tableList.updateItem(item, "example01.com");
    assert.equal((await tableList.getItem("example01.com")).subItems.length, 1);
  });
  it("Ensure that last item is the last item in the sorted array(`example299.com`)", async() =>
  {
    await scrollToBottom(); // 100 items load
    await page.waitForTimeout(50);
    await scrollToBottom(); // 150 items load
    await page.waitForTimeout(50);
    await scrollToBottom(); // 200 items load
    await page.waitForTimeout(50);
    await scrollToBottom(); // 250 items load
    await page.waitForTimeout(50);
    await scrollToBottom(); // 300 items load
    await page.waitForTimeout(50);
    assert.equal(await getLastItemElemDatasetId(), "example299.com");
  });
  it("Pressing enter on selected element should trigger action specified in data-action", async() => {
    let result;
    await tableList.selectItem("subexample3.com", "example0.com");
    await page.exposeFunction("setListener", ({detail }) => {
      result = detail;
    });
    page.evaluate((tableListHandle) =>
    {
      tableListHandle.setListener((action, item, parent) =>
      {
        window.setListener({ type: "actionListener", detail: {action, item, parent} });
      });
      return true;
    }, tableListHandle);
    await page.keyboard.press("Enter");
    await page.waitForTimeout(50);
    assert.equal(result.action, "edit-cookie");
    assert.equal(result.item.id, "subexample3.com");
    assert.equal(result.parent.id, "example0.com");
  });
  it("empty(id) should remove all items or subitems", async() =>
  {
    assert.equal(await ensureItem("subexample2.com", "example5.com"), true);
    await tableList.empty("example5.com");
    assert.equal(await ensureItem("subexample2.com", "example5.com"), false);
    assert.equal(await ensureItem("example5.com"), true);
    await tableList.empty();
    assert.equal(await ensureItem("example5.com"), false);
  });
  it("Content, data attribute and title can be added using itemObj", async() =>
  {
    await tableList.addItems([
      {
        id:    `item1`,
        texts: {"domain": `item1`, "value": "3 Cookies"},
        titles: {
          whitelist: "Whitelist test"
        },
        dataset: {
          whitelist: true
        }
      }
    ]);
    assert.equal(await queryAndGetAttribute("[data-id='item1'] [title='Whitelist test']", "title"), "Whitelist test");
    assert.equal(await queryAndGetAttribute("[data-id='item1']", "data-whitelist"), "true");
    assert.equal(await queryAndGetContent("[data-id='item1'] [data-text='domain']"), "item1");
  });
  it("Sort attribute of template item defines the sorting for list", async() =>
  {
    await tableList.empty();
    const populateTable = async() =>
    {
      const order = [3,2,4,5,1];
      const subItems = [];
      const mainItems = [];
      for (let i = 0; i < order.length; i++) {
        subItems.push({
          id:      `subexample${order[i]}.com`,
          texts:   {"name": `subexample${order[i]}.com`, "value": "3 Cookies"}
        });
        mainItems.push({
          id:      `example${order[i]}.com`,
          texts:   {"domain": `example${order[i]}.com`, "value": "3 Cookies"}
        });
      }
      await tableList.addItems(mainItems);
      await tableList.addItems(subItems, "example3.com");
    };
    populateTable();
    assert.equal(await getItemAndElemIndex("example1.com"), 0);
    assert.equal(await getItemAndElemIndex("example2.com"), 1);
    assert.equal(await getItemAndElemIndex("example3.com"), 2);
    assert.equal(await getItemAndElemIndex("subexample1.com", "example3.com"), 0);
    assert.equal(await getItemAndElemIndex("subexample2.com", "example3.com"), 1);
    assert.equal(await getItemAndElemIndex("subexample3.com", "example3.com"), 2);
    await tableList.empty();
    await updateSortAndReAdd();
    await populateTable();
    assert.equal(await getItemAndElemIndex("example1.com"), 4);
    assert.equal(await getItemAndElemIndex("example2.com"), 1);
    assert.equal(await getItemAndElemIndex("example3.com"), 0);
    assert.equal(await getItemAndElemIndex("subexample1.com", "example3.com"), 4);
    assert.equal(await getItemAndElemIndex("subexample2.com", "example3.com"), 1);
    assert.equal(await getItemAndElemIndex("subexample3.com", "example3.com"), 0);
    await tableList.empty();
    await updateSortAndReAdd("domain$reverse", "name$reverse");
    await populateTable();
    assert.equal(await getItemAndElemIndex("example1.com"), 4);
    assert.equal(await getItemAndElemIndex("example2.com"), 3);
    assert.equal(await getItemAndElemIndex("example3.com"), 2);
    assert.equal(await getItemAndElemIndex("subexample1.com", "example3.com"), 4);
    assert.equal(await getItemAndElemIndex("subexample2.com", "example3.com"), 3);
    assert.equal(await getItemAndElemIndex("subexample3.com", "example3.com"), 2);
    await tableList.empty();
    await updateSortAndReAdd("reverse");
    await populateTable();
    assert.equal(await getItemAndElemIndex("example1.com"), 0);
    assert.equal(await getItemAndElemIndex("example5.com"), 1);
    await tableList.addItems([{
      id:      "example9.com",
      texts:   {"domain": "example9.com", "value": "3 Cookies"}
    }]);
    assert.equal(await getItemAndElemIndex("example9.com"), 0);
  });
});

after(async () =>
{
  await browser.close();
})
