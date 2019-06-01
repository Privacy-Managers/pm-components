document.addEventListener("DOMContentLoaded", () =>
{
  const settingList = document.querySelector("setting-list");
  settingList.addEventListener("change", () =>
  {
    console.log(settingList.isEnabled());
  });
});
