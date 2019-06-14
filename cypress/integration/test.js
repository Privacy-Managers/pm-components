describe("Testing settings-list", () =>
{
  it("Navigate to the component page", () => {
    cy.visit("http://127.0.0.1:3000/setting-list/setting-list.html");
  });
  it("Should change 'checked' attribute on toggle() method call", () => {
    cy.window().then((win) => {
        const settingList = win.document.querySelector("setting-list");
        settingList.toggle();
        expect(settingList.hasAttribute("checked")).to.equal(true);
      });
    });
  it("Focus on button", () => {
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