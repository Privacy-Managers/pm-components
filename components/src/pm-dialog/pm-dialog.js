import {registerActionListener, initI18n, getMsg} from "../utils.js";

class ModalDialog extends HTMLElement {
  constructor() {
    super();
    
    this.dialogElem = null;
    this.dialogBodyElem = null;
    this.modalTitle = "";
    this.fields = [];
    this.data = {};

    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        ${pmLoadCSS}
      </style>
      ${pmLoadHTML}
    `;
  }

  /**
   * Invoked each time the custom element is appended into a DOM element
   */
  connectedCallback()
  {
    this.dialogElem = this.shadowRoot.querySelector("[role='dialog']");
    this.dialogBodyElem = this.shadowRoot.querySelector("#body");
    const templateContent = this.querySelector("template").content;
    this.dialogBodyElem.appendChild(document.importNode(templateContent, true));
    registerActionListener(this.shadowRoot, this, this._onAction);
    document.addEventListener("keydown", ({key}) =>
    {
      if (key === "Escape")
        this.closeDialog();
    });
    initI18n(this.shadowRoot);
    this._render();
  }

  showDialog(title, data)
  {
    this.modalTitle = getMsg(title);
    this.data = data;
    this._render();
    this.dialogElem.setAttribute("aria-hidden", false);
  }

  closeDialog()
  {
    this.dialogElem.setAttribute("aria-hidden", true);
  }

  /**
   * Called each time an attribute on the custom element is changed
   * @param {String} name attribute name
   * @param {String} oldValue Old value of the attribute
   * @param {String} newValue New value of the attribute
   */
  attributeChangedCallback(name, oldValue, newValue)
  {
    if (oldValue === newValue) {
      return;
    }
    // TODO: Check for values
    if (this.connected)
      this._render();
  }

  static get observedAttributes() {
    // TODO: Add observables
    return [];
  }

  _onAction(action) {
    switch (action)
    {
      case "close-dialog":
        this.closeDialog();
        break;
    }
  }

  /**
   * Render method to be called after each state change
   */
  _render() {
    this.shadowRoot.querySelector("header span").textContent = this.modalTitle;

    for (const name in this.data)
    {
      const elem = this.shadowRoot.querySelector(`[data-id=${name}]`);
      if (!elem)
        continue;
      const value = this.data[name]
      if (elem.tagName == "INPUT" || elem.tagName == "TEXTAREA")
      {
        if (elem.type == "checkbox" || elem.type == "radio")
          elem.checked = value;
        else
          elem.value = value;
      }
      else
      {
        elem.textContent = value;
      }
    }
  }
}

customElements.define('pm-dialog', ModalDialog);
