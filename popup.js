document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("autoplayToggle");

  // 저장된 설정 불러오기
  chrome.storage.local.get(["autoplayEnabled"], (result) => {
    toggle.checked = result.autoplayEnabled !== false;
  });

  // 설정 변경 시 저장
  toggle.addEventListener("change", () => {
    chrome.storage.local.set({ autoplayEnabled: toggle.checked });
  });
});
