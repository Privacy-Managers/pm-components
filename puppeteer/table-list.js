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
  await page.goto(`http://127.0.0.1:3001/table-list/table-list.html`);
  tableListHandle = await page.$('table-list');
});

function indexOfAccessor(accessor)
{
  return page.evaluate((tableListHandle, accessor) => {
    console.log("tableListHandle");
    console.log(tableListHandle);
    return tableListHandle.indexOfAccessor(accessor);
  }, tableListHandle, accessor);
}

describe("Table-list component", () =>
{
  it("indexOfAccessor method should return index for accessor", async() =>
  {
    const {index, subIndex} = await indexOfAccessor("example0.com");
    assert.equal(index, 0);
    assert.equal(subIndex, -1);
  });
});

after(async () =>
{
  await browser.close();
})
