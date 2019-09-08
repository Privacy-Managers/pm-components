class PmTabPanel extends HTMLElement {
  constructor() {
    super();
    this.tabs = [];
  }

  connectedCallback()
  {
    this.tabs = this.querySelectorAll("pm-tab");
    this.addEventListener("click", (e) =>
    {
      this.select(e.target.id);
    });
  }

  select(id)
  {
    this.tabs.forEach((tab) =>
    {
      tab._hide();
      if (tab.id === id)
        tab._show();
    });
  }
}

class PmTabs extends HTMLElement {
  constructor() {
    super();
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

  _show()
  {
    this.setAttribute("aria-selected", true);
    this.panel._show();
  }

  _hide()
  {
    this.removeAttribute("aria-selected");
    this.panel._hide();
  }
}

class PmPanels extends HTMLElement {
  constructor() {
    super();
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

  _show()
  {
    this.removeAttribute("hidden");
  }

  _hide()
  {
    this.setAttribute("hidden", true);
  }
}

customElements.define('pm-tab-panel', PmTabPanel);
customElements.define('pm-tab', PmTab);
customElements.define('pm-tabs', PmTabs);
customElements.define('pm-panels', PmPanels);
customElements.define('pm-panel', PmPanel);
