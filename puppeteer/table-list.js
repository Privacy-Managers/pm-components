const puppeteer = require('puppeteer');
const {readFileSync} = require("fs");
const assert = require('assert');

let browser;
let page;

before(async () => {
  browser = await puppeteer.launch({headless: false});
  page = await browser.newPage();
  await page.setContent(readFileSync("./puppeteer/table-list.html", "utf-8"));
});

describe("Testing table-list component", () =>
{
  it("", async() =>
  {
    
  });
});

after(async () => {
  await browser.close()
})
