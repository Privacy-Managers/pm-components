const puppeteer = require('puppeteer');
const assert = require('assert');

let browser;
let page;
let settingListHandle;
let buttonHandle;

before(async () => {
  browser = await puppeteer.launch({headless: true});
  page = await browser.newPage()
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
  await page.goto(`http://127.0.0.1:3001/puppeteer/pm-toggle.html`);
  settingListHandle = await page.$('pm-toggle');
  buttonHandle = await page.evaluateHandle(`document.querySelector('pm-toggle').shadowRoot.querySelector('button')`);
});

function isEnabled()
{
  return page.evaluate((settingListElem) => {
    return settingListElem.isEnabled();
  }, settingListHandle);
}

describe("Testing settings-list component", () =>
{
  it("Should change 'checked' attribute and status on toggle() method call", async() =>
  {
    function toggleAndGetChecked()
    {
      return page.evaluate((settingListElem) => {
        settingListElem.toggle();
        return settingListElem.getAttribute("checked");
      }, settingListHandle);
    }

    assert.equal(await toggleAndGetChecked(), "true");
    assert.equal(await isEnabled(), true);
    assert.equal(await toggleAndGetChecked(), "false");
    assert.equal(await isEnabled(), false);
  });

  it("Should change 'checked' and status attribute on setEnabled() method call", async() =>
  {
    function setEnabledAndGetChecked(status)
    {
      return page.evaluate((settingListElem, status) => {
        settingListElem.setEnabled(status);
        return settingListElem.getAttribute("checked");
      }, settingListHandle, status);
    }

    assert.equal(await setEnabledAndGetChecked(true), "true");
    assert.equal(await isEnabled(), true);
    assert.equal(await setEnabledAndGetChecked(false), "false");
    assert.equal(await isEnabled(), false);
  });

  it("Clicking the button changes the status", async() => {
    await buttonHandle.click();
    assert.equal(await isEnabled(), true);
    await buttonHandle.click();
    assert.equal(await isEnabled(), false);
  });

  it("Hitting 'Enter' on focused button changes the status", async() => {
    await buttonHandle.focus();
    await page.keyboard.press("Enter");
    assert.equal(await isEnabled(), true);
    await page.keyboard.press("Enter");
    assert.equal(await isEnabled(), false);
  });

});

after(async () => {
  await browser.close()
})
