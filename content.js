const YT_PLAYER_PROGRESS_BAR_DRAG_CONTAINER =
  ".ytPlayerProgressBarDragContainer";

let isEnabled = true;
let currentObserver = null;

chrome.storage.local.get(["autoplayEnabled"], (result) => {
  isEnabled = result.autoplayEnabled === true;
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.autoplayEnabled) {
    isEnabled = changes.autoplayEnabled.newValue;
    if (!isEnabled && currentObserver) {
      currentObserver.disconnect();
    } else if (isEnabled) {
      waitForElement(observeProgress);
    }
  }
});

const observeProgress = () => {
  if (!isEnabled) return;

  let hasReached90Percent = false;
  const ytbProgressBar = document.querySelector(
    YT_PLAYER_PROGRESS_BAR_DRAG_CONTAINER
  );

  if (!ytbProgressBar) {
    alert(
      "문제가 생겼습니다. 개발자에게 문의해주세요. email: albert5428@gmail.com"
    );
    return;
  }

  const observer = new MutationObserver((mutations) => {
    if (!isEnabled) return;

    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "aria-valuenow"
      ) {
        const value = parseInt(ytbProgressBar.getAttribute("aria-valuenow"));

        if (value >= 90) {
          hasReached90Percent = true;
        } else if (value < 5 && hasReached90Percent) {
          hasReached90Percent = false;
          handleNextAction();
        }
      }
    });
  });

  currentObserver = observer;
  observer.observe(ytbProgressBar, { attributes: true });
};

const handleNextAction = () => {
  const arrowDownEvent = new KeyboardEvent("keydown", {
    key: "ArrowDown",
    code: "ArrowDown",
    keyCode: 40,
    which: 40,
    bubbles: true,
    cancelable: true,
  });

  document.dispatchEvent(arrowDownEvent);
};

const waitForElement = (callback, maxAttempts = 10) => {
  let attempts = 0;

  const tryObserve = () => {
    const ytbProgressBar = document.querySelector(
      YT_PLAYER_PROGRESS_BAR_DRAG_CONTAINER
    );
    if (ytbProgressBar) {
      if (currentObserver) {
        currentObserver.disconnect();
      }
      callback();
    } else if (attempts < maxAttempts) {
      attempts++;
      console.log(`슬라이더 감지 시도 ${attempts}번째...`);
      setTimeout(tryObserve, 1000);
    } else {
      console.log("슬라이더 감지 실패");
    }
  };

  tryObserve();
};

waitForElement(observeProgress);

const urlObserver = new MutationObserver((mutations) => {
  setTimeout(() => waitForElement(observeProgress), 500);
});

urlObserver.observe(document.querySelector("title"), {
  subtree: true,
  characterData: true,
  childList: true,
});
