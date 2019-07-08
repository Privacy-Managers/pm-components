function registerActionListener(target, callback)
{
  target.addEventListener("keyup", function(ev)
  {
    onKeyUp(ev, callback);
  }, false);

  target.addEventListener("click", function(ev)
  {
    onClick(ev, callback);
  }, false);
};

function onKeyUp(ev, callback)
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
    callback(action, activeElem);
  });
}

function onClick(ev, callback)
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
    callback(action, element);
  });
}

export {registerActionListener};
