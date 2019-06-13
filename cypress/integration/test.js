describe("Testing settings-list", () =>
{
  it("Doesn't do much", () => {
    cy.visit("http://127.0.0.1:3000/setting-list/setting-list.html");
  });
  it("smth", () => {
    cy.window().then((win) => {
        const settingList = win.document.querySelector("setting-list");
        settingList.toggle();
        expect(settingList.hasAttribute("checked")).to.equal(true);
      });
    });
  it("select", () => {
    focusInShadow("setting-list", "button").then(() =>
    {
      
    });
  });
});


function focusInShadow(componentSelector, shadowSelector)
{
  return cy.window().then((win) =>
  {
    const shadow = win.document.querySelector(componentSelector).shadowRoot;
    return shadow.querySelector(shadowSelector).focus();
  });
}