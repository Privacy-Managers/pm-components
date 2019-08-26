
document.addEventListener("DOMContentLoaded", () =>
{
  document.querySelector("pm-dialog").setData({title: "My Title", fields: {description: "My description"}});
  document.querySelector("pm-dialog").showDialog();
});