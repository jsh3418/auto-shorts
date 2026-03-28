# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AutoShorts is a Chrome Extension (Manifest V3) that automatically advances to the next YouTube Shorts video when the current one finishes playing. Users can toggle the feature on/off via a popup.

## Architecture

- **manifest.json** — Extension manifest (MV3). Declares the content script for `youtube.com/shorts/*` and the popup.
- **content.js** — Content script injected into YouTube Shorts pages. Observes the progress bar (`aria-valuenow` on `.ytPlayerProgressBarDragContainer`) via MutationObserver. When progress reaches 90% then drops below 5% (indicating a loop restart), it dispatches an `ArrowDown` keydown event to navigate to the next Short. Also watches `<title>` mutations to re-attach the observer on SPA navigation.
- **popup.html / popup.js** — Extension popup with a single toggle checkbox. Persists state in `chrome.storage.local` under the key `autoplayEnabled`.

## Development

No build step. Load the repository as an unpacked extension in `chrome://extensions` (enable Developer Mode). Reload the extension after code changes.

## Notes

- The codebase uses Korean for user-facing error messages and console logs.
- `chrome.storage.local` is the shared state mechanism between the popup and the content script via `chrome.storage.onChanged`.
