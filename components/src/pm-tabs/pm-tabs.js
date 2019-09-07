class PmTabs extends HTMLElement {
  constructor() {
    super();
    this.tabs = [];
  }

  connectedCallback()
  {
    this.tabs = this.querySelectorAll("pm-tab");
    this.addEventListener("click", (e) =>
    {
      this._select(e.target.id);
    });
  }

  _select(id)
  {
    this.tabs.forEach((tab) =>
    {
      tab.hide();
      if (tab.id === id)
        tab.show();
    });
  }
}

class PmTab extends HTMLElement {
  constructor() {
    super();
    this.panel = null;
  }

  connectedCallback()
  {
    this.setAttribute("role", "tab");
    this.panel = document.querySelector(`[aria-labelledby=${this.id}]`);
  }

  show()
  {
    this.setAttribute("aria-selected", true);
    this.panel.show();
  }

  hide()
  {
    this.removeAttribute("aria-selected");
    this.panel.hide();
  }
}

class PmPanel extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback()
  {
    this.setAttribute("role", "tabpanel");
    this.setAttribute("hidden", true);
  }

  show()
  {
    this.removeAttribute("hidden");
  }

  hide()
  {
    this.setAttribute("hidden", true);
  }
}

customElements.define('pm-tab', PmTab);
customElements.define('pm-tabs', PmTabs);
customElements.define('pm-panel', PmPanel);
