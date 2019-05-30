document.addEventListener("DOMContentLoaded", () =>
{
  const settingList = document.querySelector("setting-list");
  settingList.addEventListener("change", () =>
  {
    // TODO: Doesn't return value
    console.log(settingList.isEnabled);
  });
});