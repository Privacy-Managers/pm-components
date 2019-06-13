const {JSDOM} = require("jsdom");
const {readFileSync} = require("fs");
const {strictEqual} = require("assert"); 
const {window} = new JSDOM(readFileSync("tests/dom.html", "utf8"));
const {document} = window;

const settingListElem = document.querySelector("setting-list");


settingListElem.hasAttribute("checked");
settingListElem.toggle();
console.log(settingListElem);

const scenarios = [
  {
    description: "No 'checked' attribute on the element",
    method: "hasAttribute",
    args: ["checked"],
    equal: false
  },
  {
    method: "toggle"
  },
  {
    description: "'checked' attribute is true after toggling",
    method: "hasAttribute",
    equal: true
  }
];

function runAction(method, args = [], equal)
{
  if (method)
  {
    const result = settingListElem[method](...args);
    if (equal != null)
      strictEqual(result, equal);
  }
  else
    console.error("method is required");
}

/*
describe("Testing setting-list custom element", () => {
  scenarios.forEach(({description, method, args, equal}) =>
  {
    if (description)
    {
      it(description, () => {
        runAction(method, args, equal);
      });
    }
    runAction(method, args, equal);
  });
});
*/
