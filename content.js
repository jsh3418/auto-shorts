let isEnabled = true;
let currentVideo = null;
let hasTriggeredNext = false;
let videoCheckInterval = null;

chrome.storage.local.get(["autoplayEnabled"], (result) => {
  isEnabled = result.autoplayEnabled !== false;
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.autoplayEnabled) {
    isEnabled = changes.autoplayEnabled.newValue;
  }
});

const isShorts = () => location.pathname.startsWith("/shorts/");

const onTimeUpdate = () => {
  if (!isEnabled || hasTriggeredNext || !currentVideo) return;
  const { duration, currentTime } = currentVideo;
  if (duration > 0 && duration - currentTime < 0.3) {
    hasTriggeredNext = true;
    handleNextAction();
  }
};

const cleanupVideo = () => {
  if (currentVideo) {
    currentVideo.removeEventListener("timeupdate", onTimeUpdate);
    currentVideo = null;
  }
  if (videoCheckInterval) {
    clearInterval(videoCheckInterval);
    videoCheckInterval = null;
  }
};

const attachToVideo = (video) => {
  if (video === currentVideo) return;
  if (currentVideo) {
    currentVideo.removeEventListener("timeupdate", onTimeUpdate);
  }
  currentVideo = video;
  hasTriggeredNext = false;
  video.addEventListener("timeupdate", onTimeUpdate);
};

const findActiveVideo = () => {
  const videos = document.querySelectorAll("video");
  for (const v of videos) {
    if (v.src && !v.paused && v.duration > 0) {
      return v;
    }
  }
  for (const v of videos) {
    if (v.src && v.duration > 0) {
      return v;
    }
  }
  return null;
};

const startVideoCheck = () => {
  if (videoCheckInterval) clearInterval(videoCheckInterval);

  videoCheckInterval = setInterval(() => {
    if (!isShorts()) {
      cleanupVideo();
      return;
    }

    const video = findActiveVideo();
    if (video && video !== currentVideo) {
      attachToVideo(video);
    }
  }, 1000);
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

const onNavigate = () => {
  hasTriggeredNext = false;
  if (isShorts()) {
    startVideoCheck();
  } else {
    cleanupVideo();
  }
};

document.addEventListener("yt-navigate-finish", onNavigate);

let lastUrl = location.href;
setInterval(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    onNavigate();
  }
}, 1000);

if (isShorts()) {
  startVideoCheck();
}
