import {getMsg} from "../utils.js";

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
      <style>
        :host
        {
          --color-primary: #679c16;
          --color-secondary: #989898;
        }
        div
        {
          display: flex;
          align-items: center;
        }
        #label
        {
          display: flex;
          flex-grow: 1;
          font-size: 13px;
          padding-bottom: 4px;
          vertical-align: top;
          word-wrap: break-word;
          margin-right: 10px;
          align-items: center;
        }
        #label::after
        {
          content: "";
          border: none;
          display: inline-block;
          width: 12px;
          height: 12px;
          background: url(../../../img/pm-toggle/info.svg) center no-repeat transparent;
          margin: 0px 3px;
        }
        #toggle
        {
          font-size: 0px; /* Fighting the Space Between Inline Block Elements */
          background: none;
          border: 0px;
          cursor: pointer;
          padding: 0px;
          display: flex;
        }
        #toggle > span
        {
          font-size: 12px;
          line-height: 19px;
          padding: 0 6px;
          border: 1px solid var(--color-secondary);
        }
        /*#7f7f7f #8abc25 #f8f8f8 */
        #toggle > span:first-child
        {
          border-radius: 5px 0px 0px 5px;
          border-right: 0px;
        }
        #toggle > span:last-child
        {
          border-radius: 0px 5px 5px 0px;
          background-color: var(--color-secondary);
          color: #fff;
        }
        :host([checked="true"]) #toggle > span:first-child
        {
          background-color: var(--color-primary);
          color: #fff;
        }
        :host([checked="true"]) #toggle > span:last-child
        {
          color: #000;
          background: none;
        }
      </style>
      <div>
        <span id="label" tabindex="0"><slot>Some default</slot></span>
        <button id="toggle" aria-labelledby="label" role="button" type="button">
          <span id="btn-on-label">On</span>
          <span id="btn-off-label">Off</span>
        </button>
      </div>
    `;
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
