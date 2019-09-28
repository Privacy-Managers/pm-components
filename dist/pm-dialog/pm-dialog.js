import {registerActionListener, initI18n, getMsg} from "../utils.js";

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
      <style>
        :host
{
  --color-primary: #679c16;
}
#dialog
{
  position: absolute;
  display: flex;
  top: 0px;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  background-color: rgba(219, 226, 221, 0.5);
  transition: all 0.2s;
}
/* Dialog animation */
#dialog[aria-hidden="true"]
{
  opacity: 0;
  transform: scale(0.5, 0.5);
  visibility: hidden;
}
/* Dialog animation */
#dialog[aria-hidden="false"]
{
  transform: scale(1, 1);
  visibility: visible;
  opacity: 1;
}
#dialog > div:first-child
{
  width: 90%;
  background-color: #f3f3f3;
  border-radius: 10px;
  box-shadow: 0 4px 23px -3px black;
  margin: auto;
}
header
{
  display: flex;
  background-color: var(--color-primary);
  padding: 5px;
  color: #fff;
  font-size: 14px;
}
header span
{
  padding: 5px;
  flex-grow: 1;
}
#dialog #body
{
  padding: 10px;
  font-size: 12px;
  line-height: 16px;
}
button
{
  background-color: transparent;
  border: none;
  width: 20px;
  padding: 0px;
  cursor: pointer;
}
button:after
{
  display: inline-block;
  content: "";
  width: 10px;
  height: 10px;
  margin: 0px auto;
  background-image: url(../../../img/pm-dialog/delete.svg);
}
button:hover:after
{
  background-image: url(../../../img/pm-dialog/delete-hover.svg);
}
      </style>
      <div id="dialog" data-keyQuite="close-dialog" role="dialog" aria-hidden="true">
  <div>
    <header>
      <span></span>
      <button data-action="close-dialog" class="icon delete" id="close"></button>
    </header>
    <div id="body">
      <slot name="body"></slot>
    </div>
  </div>
  <span tabindex="0" id="focustrap"></span>
</div>
    `;
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
