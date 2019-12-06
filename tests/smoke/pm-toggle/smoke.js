function requestInfo(e)
{
  const dialog = document.querySelector("pm-dialog");
  const description = e.target.description;
  dialog.showDialog(e.target.text, {description});
}

document.querySelector("pm-toggle").addEventListener("info", requestInfo);
