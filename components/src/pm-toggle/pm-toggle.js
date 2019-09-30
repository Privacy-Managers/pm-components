import {getMsg} from "../utils.js";
import pmLoadCSS from './pm-toggle.css';
import pmLoadHTML from './pm-toggle.html';

const sheet = new CSSStyleSheet();
sheet.replaceSync(`${pmLoadCSS}`);

class SettingList extends HTMLElement {
  constructor() {
    super();
    this.text = "btn-txt";
    this.description = "btn-desc";
    this.checkboxElem = null;
    this.containerElem = null;
    this.labelElem = null;
    this.connected = false;

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
    this.connected = true;
    this.toggleElem = this.shadowRoot.querySelector("button");
    this.containerElem = this.shadowRoot.querySelector("div");
    this.labelElem = this.shadowRoot.querySelector("#label");

    this.toggleElem.addEventListener("click", this.toggle.bind(this));
    this.labelElem.addEventListener("click", this._requestInfo.bind(this));
    this.labelElem.addEventListener("keyup", ({key}) => {
      if (key === "Enter" || key === " ")
        this._requestInfo();
    });
    this._render();
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
    if (name === "text") {
      this.text = newValue;
    }
    else if (name === "description") {
      this.description = newValue;
    }
    if (this.connected)
      this._render();
  }

  static get observedAttributes() {
    return ["text", "description", "checked"];
  }

  /**
   * Called when the info(description) is requested
   */
  _requestInfo()
  {
    alert(this.description);
  }

  /**
   * Dipatches custom change event
   */
  _onChanged()
  {
    const changed = new CustomEvent("change");
    this.dispatchEvent(changed);
    this._render();
  }

  /**
   * Check if the component is toggled or not
   * @return {Boolean} state
   */
  isEnabled()
  {
    if (this.getAttribute("checked") == "true")
      return true;
    return false;
  }

  /**
   * Enable/Dissable toggle
   * @param {boolen} status set the state of the toggle
   */
  setEnabled(status)
  {
    this.setAttribute("checked", status);
    if (this.isEnabled() != status)
    {
      this._onChanged();
    }
  }

  /**
   * Toggles the state of the component
   */
  toggle()
  {
    this.setAttribute("checked", !this.isEnabled());
    this._onChanged();
  }

  /**
   * Render method to be called after each state change
   */
  _render() {
    this.toggleElem.setAttribute("aria-pressed", this.isEnabled());
    this.labelElem.textContent = getMsg(this.text);
    this.labelElem.setAttribute("title", getMsg(this.description));
  }
}

customElements.define('pm-toggle', SettingList);
