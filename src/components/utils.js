function registerActionListener(target, component, callback)
{
  target.addEventListener("keyup", function(ev)
  {
    onKeyUp(ev, component, callback);
  }, false);

  target.addEventListener("click", function(ev)
  {
    onClick(ev, component, callback);
  }, false);
};

function onKeyUp(ev, component, callback)
{
  const root = ev.target.getRootNode();
  const key = ev.key;
  const activeElem = root.activeElement;
  let actions = null;

  switch (key)
  {
    case " ":
    case "Enter":
      actions = activeElem.dataset.keyAction;
      break;
    case "Delete":
    case "Backspace":
      actions = activeElem.dataset.keyDelete;
      break;
    case "ArrowUp":
      actions = activeElem.dataset.keyUp;
      break;
    case "ArrowDown":
      actions = activeElem.dataset.keyDown;
      break;
    case "ArrowRight":
      actions = activeElem.dataset.keyRight;
      break;
    case "ArrowLeft":
      actions = activeElem.dataset.keyLeft;
      break;
    case "Escape":
      actions = activeElem.dataset.keyQuite;
      break;
  }

  if (!actions)
    return;

  // TODO: Fix duplication
  ev.preventDefault;
  actions.split(",").forEach(function(action)
  {
    callback.call(component, action, activeElem);
  });
}

function onClick(ev, component, callback)
{
  let element = ev.target;
  let actions = null;

  while (true)
  {
    if (element == this)
      break;

    if (element.hasAttribute("data-action"))
    {
      actions = element.getAttribute("data-action");
      break;
    }

    element = element.parentElement;
  }

  if (!actions)
    return;

  ev.preventDefault;
  actions.split(",").forEach(function(action)
  {
    callback.call(component, action, element);
  });
}

function getMsg(id)
{
  // Mock data
  const data = 
  {
    "btn-txt": "Label text",
    "btn-desc": "Longer, more informative description of the toggle button",
    "cookieDialog_domain": "Domain",
    "cookieDialog_name": "Name",
    "cookieDialog_value": "Value",
    "cookieDialog_path": "Path",
    "cookieDialog_expDate": "Exp. date",
    "cookieDialog_expTime": "Exp. time",
    "cookieDialog_hostOnyl": "Host only",
    "cookieDialog_httpOnyl": "HTTP only",
    "cookieDialog_secure": "Secure",
    "cookieDialog_session": "Session",
    "cookieDialog_storeId Store": "ID",
    "cookieDialog_add": "Add",
    "cookieDialog_update": "Update",
    "cookieDialog_delete": "Delete",
    "cookieDialog_cancel": "Cancel",
    "cookieDialog_deleteAll_msg": "You are about to delete all cookies, are you sure ?"
  };

  return data[id] || id;
}

function initI18n(rootElement)
{
  rootElement.querySelectorAll("[data-i18n]").forEach(function(node)
  {
    node.textContent = getMsg(node.dataset.i18n);
  });
}

function deepCopy(object)
{
  return JSON.parse(JSON.stringify(object));
}

/**
 * Currently Constructable Stylesheets are only supported in Chrome 73+, for the
 * browsers that do not support them importing the style into shadowDom should
 * be done by appending a child element.
 */
class ConstructableCSS
{
  /**
   * Initialize CSSStyleSheet element
   * @param {String} css Style Sheet string
   */
  constructor(css)
  {
    this.sheet = null;
    try
    {
      this.sheet = new CSSStyleSheet();
      this.sheet.replaceSync(css);
    }
    catch(e)
    {
      const style = document.createElement("style");
      style.textContent = css;
      this.sheet = style;
    }
  }
  /**
   * Import styles into Shadow DOM
   * @param shadowRoot Shadow DOM root
   * @param sheet      StyleSheet to be used for loading into shadowDom
   */
  load(shadowRoot)
  {
    if (this.sheet instanceof CSSStyleSheet)
      shadowRoot.adoptedStyleSheets = [this.sheet];
    else
      shadowRoot.appendChild(this.sheet.cloneNode(true));
  }
}

export {registerActionListener, deepCopy, getMsg, initI18n, ConstructableCSS};
