# AutoShorts

YouTube Shorts 영상이 끝나면 자동으로 다음 영상으로 넘어가주는 Chrome 확장 프로그램입니다.

> 🚀 **[Chrome 웹 스토어에서 설치하기](https://chromewebstore.google.com/detail/ghlhjhnkoblmdmhlocedondppfeididi)**

## 주요 기능

- YouTube Shorts 재생이 끝나면 자동으로 다음 Short로 이동
- 팝업에서 On/Off 토글 지원
- 설정은 `chrome.storage.local`에 저장되어 브라우저 재시작 후에도 유지

## 설치 방법

### 일반 사용자

[Chrome 웹 스토어](https://chromewebstore.google.com/detail/ghlhjhnkoblmdmhlocedondppfeididi)에서 **Chrome에 추가** 버튼을 눌러 설치합니다.

### 개발자 (로컬 설치)

1. 이 저장소를 클론하거나 ZIP으로 다운로드합니다.
2. Chrome 주소창에 `chrome://extensions` 를 입력해 확장 프로그램 페이지로 이동합니다.
3. 우측 상단의 **개발자 모드**를 활성화합니다.
4. **압축해제된 확장 프로그램을 로드합니다** 버튼을 클릭하고 이 프로젝트 폴더를 선택합니다.

## 사용 방법

1. [YouTube Shorts](https://www.youtube.com/shorts) 페이지로 이동합니다.
2. 브라우저 툴바의 AutoShorts 아이콘을 클릭합니다.
3. 토글을 켜면 영상이 끝날 때마다 자동으로 다음 Short로 넘어갑니다.

## 프로젝트 구조

- `manifest.json` — Manifest V3 설정 파일
- `content.js` — Shorts 페이지에 주입되는 콘텐츠 스크립트 (영상 종료 감지 및 `ArrowDown` 이벤트 디스패치)
- `popup.html` / `popup.js` — 확장 프로그램 팝업 UI 및 토글 로직

## 개발

별도의 빌드 과정이 없습니다. 코드 수정 후 `chrome://extensions` 페이지에서 확장 프로그램을 **새로고침**하면 변경 사항이 반영됩니다.
