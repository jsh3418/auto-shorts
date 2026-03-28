let isEnabled = true;
let currentVideo = null;
let hasTriggeredNext = false;

chrome.storage.local.get(["autoplayEnabled"], (result) => {
  isEnabled = result.autoplayEnabled !== false;
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.autoplayEnabled) {
    isEnabled = changes.autoplayEnabled.newValue;
  }
});

const onTimeUpdate = () => {
  if (!isEnabled || hasTriggeredNext || !currentVideo) return;
  const { duration, currentTime } = currentVideo;
  if (duration > 0 && duration - currentTime < 0) {
    hasTriggeredNext = true;
    handleNextAction();
  }
};

const setupVideo = () => {
  const video = document.querySelector("video");
  if (!video) return;

  if (video === currentVideo) return;

  if (currentVideo) {
    currentVideo.removeEventListener("timeupdate", onTimeUpdate);
  }

  currentVideo = video;
  hasTriggeredNext = false;
  video.addEventListener("timeupdate", onTimeUpdate);
};

const handleNextAction = () => {
  document.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "ArrowDown",
      code: "ArrowDown",
      keyCode: 40,
      which: 40,
      bubbles: true,
      cancelable: true,
    }),
  );
};

const waitForVideo = (maxAttempts = 10) => {
  let attempts = 0;
  const tryFind = () => {
    if (document.querySelector("video")) {
      setupVideo();
    } else if (attempts < maxAttempts) {
      attempts++;
      setTimeout(tryFind, 1000);
    }
  };
  tryFind();
};

waitForVideo();

// SPA 네비게이션 감지: 다음 쇼츠로 이동 시 video 엘리먼트 재설정
const titleObserver = new MutationObserver(() => {
  hasTriggeredNext = false;
  setTimeout(waitForVideo, 500);
});

titleObserver.observe(document.querySelector("title"), {
  subtree: true,
  characterData: true,
  childList: true,
});
