
document.addEventListener("DOMContentLoaded", () =>
{
  document.querySelectorAll("button").forEach((button) => 
  {
    button.addEventListener("click", buttonClickHandler);
  });
});

function buttonClickHandler(ev)
{
  const pmDialog = document.querySelector("pm-dialog");
  switch (ev.target.id) {
    case "basic":
      const data = {
        title: "My Title", 
        fields: {
          description: "My description"
        }
      };
      pmDialog.setData(data);
      pmDialog.showDialog();
      break;
    case "advanced":

      break;
    default:
      break;
  }
  
}