document.addEventListener("DOMContentLoaded", () =>
{
  document.querySelector("pm-tab-panel").select("main-tab");
  document.querySelector("pm-tab-panel").addEventListener("tabChange", ({detail}) =>
  {
    console.log(detail);
  });
});