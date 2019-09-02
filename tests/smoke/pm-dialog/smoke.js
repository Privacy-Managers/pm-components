
document.addEventListener("DOMContentLoaded", () =>
{
  document.querySelectorAll("button").forEach((button) => 
  {
    button.addEventListener("click", buttonClickHandler);
  });
});

function buttonClickHandler(ev)
{
  switch (ev.target.id) {
    case "basic-btn":
    {
      const pmDialog = document.querySelector("#basic");
      const data = {
        title: "My Title", 
        fields: {
          description: "My description"
        }
      };
      pmDialog.setData(data);
      pmDialog.showDialog();
      break;
    }
    case "advanced-btn":
    {
      const pmDialog = document.querySelector("#advanced");
      const data = {
        title: "My Title", 
        fields: {
          description: "My description"
        }
      };
      pmDialog.setData(data);
      pmDialog.showDialog();
      break;
    }
    case "prompt-btn":
    {
      const pmDialog = document.querySelector("#prompt");
      const data = {
        title: "My Title", 
        fields: {
          description: "My description"
        }
      };
      pmDialog.setData(data);
      pmDialog.showDialog();
      break;
    }
  }
  
}