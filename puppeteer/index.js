const puppeteer = require('puppeteer');
const {resolve} = require("path");
const assert = require('assert');

let browser;
let page;

before(async () => {
  browser = await puppeteer.launch({headless: false});
  page = await browser.newPage()
})

describe("Testing settings-list", () =>
{
  it("smth", async () =>
  {
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
    const pathToComponent = resolve("components/setting-list/setting-list.html");
    await page.goto(`file://${pathToComponent}`);
    const settingListHandle = await page.$('setting-list');
    const isChecked = await page.evaluate((settingListElem) => {
      settingListElem.toggle();
      return settingListElem.hasAttribute("checked");
    }, settingListHandle);
    assert.equal(isChecked, true);
  });
});

after(async () => {
  await browser.close()
})
