import {registerActionListener, initI18n, getMsg} from "../utils.js";
import pmLoadCSS from './pm-dialog.css';
import pmLoadHTML from './pm-dialog.html';

const sheet = new CSSStyleSheet();
sheet.replaceSync(`${pmLoadCSS}`);

class ModalDialog extends HTMLElement {
  constructor() {
    super();
    
    this.dialogElem = null;
    this.dialogBodyElem = null;
    this.modalTitle = "";
    this.fields = [];
    this.data = {};
    this.closeButton = null;
    this.outerFocus = null;

    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      ${pmLoadHTML}
    `;
    this.shadowRoot.adoptedStyleSheets = [sheet];
  }

  /**
   * Invoked each time the custom element is appended into a DOM element
   */
  connectedCallback()
  {
    this.dialogElem = this.shadowRoot.querySelector("[role='dialog']");
    this.dialogBodyElem = this.shadowRoot.querySelector("#body");
    this.closeButton = this.shadowRoot.querySelector("#close");

    registerActionListener(this.shadowRoot, this, this._onAction);
    document.addEventListener("keydown", ({key}) =>
    {
      if (key === "Escape")
        this.closeDialog();
    });

    // Focus trap
    this.shadowRoot.querySelector("#focustrap").addEventListener("focus", () =>
    {
      this.closeButton.focus();
    });
    initI18n(this);
    this._render();
  }

  showDialog(title, data)
  {
    this.modalTitle = getMsg(title);
    this.data = data;
    this._render();
    this.dialogElem.setAttribute("aria-hidden", false);
    this.outerFocus = this._getFocusedElement();
    this._focusDialogFirstFocusable();
  }

  _getFocusedElement()
  {
    const focusedComponent = document.activeElement;
    if (focusedComponent.shadowRoot)
      return focusedComponent.shadowRoot.activeElement;
    return focusedComponent;
  }

  _focusDialogFirstFocusable()
  {
    // get focusable element
    const focusables = ["button", "[href]", "input", "select", "textarea",
                        "[tabindex]:not([tabindex='-1'])", "pm-button"]
                        .join(":not([disabled]),");
    const firstFocusableElem = this.querySelectorAll(focusables)[0];
    window.setTimeout(() =>
    {
      if (firstFocusableElem)
      {
        if (firstFocusableElem.tagName === "PM-BUTTON")
          firstFocusableElem.shadowRoot.querySelector("button").focus();
        else
          firstFocusableElem.focus();
      }
      else
        this.closeButton.focus();
    }, 50);

  }

  closeDialog()
  {
    this.dialogElem.setAttribute("aria-hidden", true);
    this.outerFocus.focus();
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
      const elem = this.querySelector(`[data-id=${name}]`);
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
