let isEnabled = true;

chrome.storage.local.get(["autoplayEnabled"], (result) => {
  isEnabled = result.autoplayEnabled !== false;
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.autoplayEnabled) {
    isEnabled = changes.autoplayEnabled.newValue;
    if (!isEnabled && window.currentObserver) {
      window.currentObserver.disconnect();
    } else if (isEnabled) {
      waitForElement(observeProgress);
    }
  }
});

const observeProgress = () => {
  if (!isEnabled) return;

  let hasReached90Percent = false;
  const target = document.querySelector(
    '[role="slider"][aria-label="탐색 슬라이더"]'
  );

  if (!target) {
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
        const value = parseInt(target.getAttribute("aria-valuenow"));

        if (value >= 90) {
          hasReached90Percent = true;
        } else if (value < 5 && hasReached90Percent) {
          hasReached90Percent = false;
          handleNextAction();
        }
      }
    });
  });

  window.currentObserver = observer;
  observer.observe(target, { attributes: true });
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
    const target = document.querySelector(
      '[role="slider"][aria-label="탐색 슬라이더"]'
    );
    if (target) {
      if (window.currentObserver) {
        window.currentObserver.disconnect();
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

document.addEventListener("DOMContentLoaded", () => {
  waitForElement(observeProgress);
});

const urlObserver = new MutationObserver((mutations) => {
  setTimeout(() => waitForElement(observeProgress), 500);
});

urlObserver.observe(document.querySelector("title"), {
  subtree: true,
  characterData: true,
  childList: true,
});
