
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
      const title = "My Title";
      const data = {
        description: "My description"
      };
      pmDialog.showDialog(title, data);
      break;
    }
    case "advanced-btn":
    {
      const pmDialog = document.querySelector("#advanced");
      const title = "Advanced";
      const data = {
        domain: "Domain name",
        name: "Cookie name",
        value: "Cookie value",
        path: "Cookie path",
        expirationDate: "2030-05-15",
        expirationTime: "17:00",
        hostOnly: true,
        httpOnly: false,
        secure: true,
        session: true,
        storeId: 1
      };
      pmDialog.showDialog(title, data);
      break;
    }
    case "prompt-btn":
    {
      const pmDialog = document.querySelector("#prompt");
      const title = "Promt dialog";
      pmDialog.showDialog(title);
      break;
    }
  }
  
}