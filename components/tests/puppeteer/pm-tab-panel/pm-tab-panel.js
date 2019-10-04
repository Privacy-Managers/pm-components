const puppeteer = require('puppeteer');
const assert = require('assert');
let tabPanelHandle;

let browser;
let page;

before(async () =>
{
  browser = await puppeteer.launch({headless: true, args: ["--allow-file-access-from-files"]});
  page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
  await page.goto(`http://127.0.0.1:3001/puppeteer/pm-tab-panel.html`);
  tabPanelHandle = await page.$('pm-tab-panel');
});

const tabPanel = {};
const methods = ["select"];
methods.forEach((methodName) => {
  tabPanel[methodName] = (...args) => runComponentMethod(methodName, ...args);
});

function runComponentMethod()
{
  const functionName = arguments[0];
  const args = Array.prototype.slice.call(arguments, 1);
  return page.evaluate((tabPanelHandle, functionName, args) =>
  {
    return tabPanelHandle[functionName](...args);
  }, tabPanelHandle, functionName, args);
}

async function getAttributeValue(query, attribute)
{
  const elem = await page.$(query);
  return page.evaluate((elem, attribute) =>
  {
    return elem.getAttribute(attribute);
  },elem , attribute);
}

async function hasAttribute(query, attribute)
{
  const elem = await page.$(query);
  return page.evaluate((elem, attribute) =>
  {
    return elem.hasAttribute(attribute);
  },elem , attribute);
}

async function isTabSelected(id)
{
  return await getAttributeValue(`#${id}`, "tabindex") === "0" && 
         await getAttributeValue(`#${id}`, "aria-selected") === "true"
}

async function isPanelVisible(id)
{
  return await hasAttribute(`pm-panel[aria-labelledby='${id}']`, "hidden") === false
}

async function isTabUnSelected(id)
{
  return await getAttributeValue(`#${id}`, "tabindex") === "-1" && 
         await hasAttribute(`#${id}`, "aria-selected") === false
}

async function ensureTabSelectedPanelVisible(id)
{
  assert.equal(await isTabSelected(id), true);
  assert.equal(await isPanelVisible(id), true);
}

async function ensureTabUnselectedPanelInvisible(id)
{
  assert.equal(await isPanelVisible(id), false);
  assert.equal(await isTabUnSelected(id), true);
}

describe("pm-tab-panel component", () =>
{
  it("pmTab.select(id) method should select tab and make the panel visible", async() =>
  {
    await tabPanel.select("main-tab");
    await ensureTabSelectedPanelVisible("main-tab")
    await ensureTabUnselectedPanelInvisible("cookie-tab")
  });
  it("arrowRight and arrowDown should select next tab", async() =>
  {
    await page.keyboard.press('ArrowRight');
    await ensureTabSelectedPanelVisible("cookie-tab");
    await ensureTabUnselectedPanelInvisible("main-tab");

    await page.keyboard.press('ArrowDown');
    await ensureTabSelectedPanelVisible("network-tab");
    await ensureTabUnselectedPanelInvisible("main-tab");

    await page.keyboard.press('ArrowDown');
    await ensureTabSelectedPanelVisible("main-tab");
    await ensureTabUnselectedPanelInvisible("cookie-tab");
  });
  it("ArrowLeft and ArrowUp should select previous tab", async() =>
  {
    await page.keyboard.press('ArrowLeft');
    await ensureTabSelectedPanelVisible("network-tab");
    await ensureTabUnselectedPanelInvisible("main-tab");

    await page.keyboard.press('ArrowUp');
    await ensureTabSelectedPanelVisible("cookie-tab");
    await ensureTabUnselectedPanelInvisible("network-tab");
  });
  it("Clicking tab should select tab and make the panel visible", async() =>
  {
    await (await page.$('#network-tab')).click();
    await ensureTabSelectedPanelVisible("network-tab");
    await ensureTabUnselectedPanelInvisible("cookie-tab");
  });
});

after(async () =>
{
  await browser.close();
})
