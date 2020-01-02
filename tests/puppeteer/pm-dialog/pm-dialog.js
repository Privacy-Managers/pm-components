const puppeteer = require('puppeteer');
const assert = require('assert');
let dialogHandle;

let browser;
let page;

before(async () =>
{
  browser = await puppeteer.launch({headless: true, args: ["--allow-file-access-from-files"]});
  page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
  await page.goto(`http://127.0.0.1:3001/puppeteer/pm-dialog.html`);
  dialogHandle = await page.$('pm-dialog');
});

const dialog = {};
const methods = ["showDialog", "closeDialog"];
methods.forEach((methodName) => {
  dialog[methodName] = (...args) => runComponentMethod(methodName, ...args);
});

function runComponentMethod()
{
  const functionName = arguments[0];
  const args = Array.prototype.slice.call(arguments, 1);
  return page.evaluate((dialogHandle, functionName, args) =>
  {
    return dialogHandle[functionName](...args);
  }, dialogHandle, functionName, args);
}

function getDialogTitle()
{
  return page.evaluate((dialogHandle) => {
    return dialogHandle.shadowRoot.querySelector("header span").textContent;
  }, dialogHandle);
}

function isDialogHidden()
{
  return page.evaluate((dialogHandle) => {
    return dialogHandle.shadowRoot.querySelector("#dialog").getAttribute("aria-hidden");
  }, dialogHandle);
}

function clickCloseButton()
{
  // await (await page.evaluateHandle(`document.querySelector('pm-dialog').shadowRoot.querySelector('header button')`)).close(); // clicks wrong item
  return page.evaluate((dialogHandle) => {
    dialogHandle.shadowRoot.querySelector("header button").click();
  }, dialogHandle);
}

function checkValue(data, attr)
{
  return page.evaluate((dialogHandle, data, attr) => {
    return dialogHandle.querySelector(`[data-id='${data}']`)[attr];
  }, dialogHandle, data, attr);
}

function getFocusedElement()
{
  return page.evaluate(() => {
    return document.activeElement.id;
  });
}

describe("pm-tab-panel component", () =>
{
  it(".showDialog(title) should open the dialog and set the title", async() =>
  {
    await dialog.showDialog("Basic title");
    const title = await getDialogTitle();
    assert.equal(title, "Basic title");
  });
  it("Hitting 'x' button or 'Esc' should close the dialog", async() =>
  {
    assert.equal(await isDialogHidden(), "false");
    await clickCloseButton();
    assert.equal(await isDialogHidden(), "true");
    await dialog.showDialog("");
    assert.equal(await isDialogHidden(), "false");
    await page.keyboard.press('Escape');
    assert.equal(await isDialogHidden(), "true");
  });
  it(".showDialog(title, data) should open the dialog and pass various data into it", async() =>
  {
    const description = "My basic description";
    const text = "A random text";
    const date = "2030-05-15";
    const time = "17:00";
    const checkbox = true;
    const data = {
      description, text, date, time, checkbox
    };
    await dialog.showDialog("Basic title", data);
    assert.equal(await checkValue("description", "textContent"), description);
    assert.equal(await checkValue("text", "value"), text);
    assert.equal(await checkValue("date", "value"), date);
    assert.equal(await checkValue("time", "value"), time);
    assert.equal(await checkValue("checkbox", "checked"), checkbox);
  });
  it(".closeDialog() should close the dialog", async() =>
  {
    await dialog.closeDialog();
    assert.equal(await isDialogHidden(), "true");
  });
  it("Opening the dialog should focus first focusable element, closing should return the old focus", async() =>
  {
    const buttonHandle = await page.evaluateHandle(`document.querySelector('button')`);
    await buttonHandle.focus();
    assert.equal(await getFocusedElement(), "focusableButton");
    await dialog.showDialog("Basic title");
    await page.waitFor(500);
    assert.equal(await getFocusedElement(), "firstFocusable");
    await dialog.closeDialog();
    assert.equal(await getFocusedElement(), "focusableButton");
  });
});

after(async () =>
{
  await browser.close();
})
