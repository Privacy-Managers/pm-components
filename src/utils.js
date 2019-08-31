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
  const root = ev.target.shadowRoot || document;
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
    "btn-desc": "Longer, more informative description of the toggle button"
  };

  return data[id] || id;
}

function deepCopy(object)
{
  return JSON.parse(JSON.stringify(object));
}

export {registerActionListener, deepCopy, getMsg};
