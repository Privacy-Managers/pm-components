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

function addItems(objItems)
{
  return page.evaluate((tableListHandle, objItems) =>
  {
    return tableListHandle.addItems(objItems);
  }, tableListHandle, objItems);
}

function getLoadedAmount(accessor)
{
  return page.evaluate((tableListHandle, accessor) => {
    let elements = tableListHandle.shadowRoot.querySelector("ul").children;
    if (accessor)
    {
      const {index} = tableListHandle.indexOfAccessor(accessor);
      elements = elements[index].querySelector("ul").children;
    }
    return elements.length;
  }, tableListHandle, accessor);
}

function addSubItem(objItem, accessor)
{
  return page.evaluate((tableListHandle, objItem, accessor) => {
    return tableListHandle.addSubItem(objItem, accessor);
  }, tableListHandle, objItem, accessor);
}

function indexOfAccessor(accessor)
{
  return page.evaluate((tableListHandle, accessor) => {
    return tableListHandle.indexOfAccessor(accessor);
  }, tableListHandle, accessor);
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
  it("indexOfAccessor() method should return index for accessor", async() =>
  {
    const {index, subIndex} = await indexOfAccessor("example0.com");
    assert.equal(index, 0);
    assert.equal(subIndex, -1);
  });
  it("removeItem() method should remove item and from the table list", async() =>
  {
    await removeItem("example1.com");
    const {index, subIndex} = await indexOfAccessor("example1.com");
    assert.equal(index, -1);
    assert.equal(subIndex, -1);
  });
  it("addSubItem() method should add subitems to the item with specified accessor", async() =>
  {
    for (let i = 0; i < 5; i++) {
      addSubItem({
        dataset:  { access: `subexample${i}.com`},
          texts: {"name": `subexample${i}.com`, "value": "3 Cookies"}
      }, "example0.com");
    }
    assert.equal(await getLoadedAmount("example0.com"), 5);
  });
  it("indexOfAccessor() method should return index and subIndex", async() =>
  {
    const {index, subIndex} = await indexOfAccessor("subexample3.com");
    assert.equal(index, 0);
    assert.equal(subIndex, 3);
  });
});

after(async () =>
{
  await browser.close();
})
