import {ConstructableCSS} from "../utils.js";
import pmLoadCSS from './pm-button.css';
import pmLoadHTML from './pm-button.html';

const constructableCSS = new ConstructableCSS(pmLoadCSS);

class PmButton extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      ${pmLoadHTML}
    `;
    constructableCSS.load(this.shadowRoot);
  }
}

customElements.define('pm-button', PmButton);
