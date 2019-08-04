const puppeteer = require('puppeteer');
const {readFileSync} = require("fs");
const assert = require('assert');
const {resolve} = require("path");
let tableListHandle;

let browser;
let page;

before(async () =>
{
  browser = await puppeteer.launch({headless: true, args: ["--allow-file-access-from-files"]});
  page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
  await page.goto(`http://127.0.0.1:3001/tests/puppeteer/table-list.html`);
  tableListHandle = await page.$('table-list');
});

function addItems(objItems, accessor)
{
  return page.evaluate((tableListHandle, objItems, accessor) =>
  {
    return tableListHandle.addItems(objItems, accessor);
  }, tableListHandle, objItems, accessor);
}

function getItemElemAccess(accessor, parentAccessor)
{
  return page.evaluate((tableListHandle, accessor, parentAccessor) =>
  {
    if (tableListHandle.getItemElem(accessor, parentAccessor))
      return tableListHandle.getItemElem(accessor, parentAccessor).dataset.access;
  }, tableListHandle, accessor, parentAccessor);
}

function getItem(accessor, parentAccessor)
{
  return page.evaluate((tableListHandle, accessor, parentAccessor) => {
    return tableListHandle.getItem(accessor, parentAccessor);
  }, tableListHandle, accessor, parentAccessor);
}

function getLoadedAmount(accessor)
{
  return page.evaluate((tableListHandle, accessor) => {
    let elements = tableListHandle.shadowRoot.querySelector("ul").children;
    if (accessor)
    {
      const index = tableListHandle.indexOfAccessor(accessor);
      elements = elements[index].querySelector("ul").children;
    }
    return elements.length;
  }, tableListHandle, accessor);
}

function indexOfAccessor(accessor, parentAccessor)
{
  return page.evaluate((tableListHandle, accessor, parentAccessor) => {
    return tableListHandle.indexOfAccessor(accessor, parentAccessor);
  }, tableListHandle, accessor, parentAccessor);
}

function removeItem(accessor)
{
  return page.evaluate((tableListHandle, accessor) => {
    return tableListHandle.removeItem(accessor);
  }, tableListHandle, accessor);
}

describe("Table-list component", () =>
{
  it("Populating Table with 300 items should load first 50 items by default", async() =>
  {
    const objItems = [];
    for (let i = 0; i < 300; i++) {
      objItems.push({
        dataset:  { access: `example${i}.com`},
        texts: {"domain": `example${i}.com`, "cookienum": "3 Cookies"}
      });
    }

    await addItems(objItems);
    const loaded =  await getLoadedAmount();
    assert.equal(loaded, 50);
  });
  it("indexOfAccessor(access) method should return index for accessor", async() =>
  {
    assert.equal(await indexOfAccessor("example0.com"), 0);
    assert.equal(await indexOfAccessor("example-1.com"), -1);
  });
  it("removeItem() method should remove item and from the table list", async() =>
  {
    await removeItem("example1.com");
    const index = await indexOfAccessor("example1.com");
    assert.equal(index, -1);
  });
  it("addItems(items, accessor) method should add subitems to the item when second argument is used", async() =>
  {
    const itemObjects = [];
    for (let i = 0; i < 5; i++) {
      itemObjects.push({
        dataset:  { access: `subexample${i}.com`},
        texts: {"name": `subexample${i}.com`, "value": "3 Cookies"}
      });
    }
    await addItems(itemObjects, "example0.com");
    assert.equal(await getLoadedAmount("example0.com"), 5);
  });
  it("indexOfAccessor(access, parentAccess) method should return subIndex if one exist", async() =>
  {
    assert.equal(await indexOfAccessor("subexample3.com", "example0.com"), 3);
    assert.equal(await indexOfAccessor("subexample3.com", "example2.com"), -1);
    assert.equal(await indexOfAccessor("subexample-1.com", "example0.com"), -1);
  });
  it("getItemElem(access, parentAccess) should return the node element for accessor if loaded", async() =>
  {
    assert.equal(await getItemElemAccess("example0.com"), "example0.com");
    assert.equal(await getItemElemAccess("subexample3.com", "example0.com"), "subexample3.com");
    assert.equal(await getItemElemAccess("example100.com"), null);
    assert.equal(await getItemElemAccess("subexample100.com", "example0.com"), null);
  });
  it("getItem(access, parentAccess) method returns item or subItem if parentAccess is specified", async() =>
  {
    let item;

    item = await getItem("subexample3.com", "example0.com");
    assert.equal(item.dataset.access, "subexample3.com");

    item = await getItem("example4.com");
    assert.equal(item.dataset.access, "example4.com");
  });
  it("ArrowDown and ArrowUp should select sibling items also first and last when reaching the end");
});

after(async () =>
{
  await browser.close();
})
