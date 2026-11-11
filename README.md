# Reddit Feed Scroll Blocker

A browser extension that stops scrolling on Reddit feeds but lets you read individual posts normally, so that you aren't inconvenienced by not being able to access useful answers, etc.

| Page | Scrolling |
|---|---|
| `reddit.com/` (and `/best`, `/hot`, `/new`, …) | blocked |
| `/r/<sub>/` (and `/r/<sub>/top`, `/new`, …), `/r/all`, `/r/popular` | blocked |
| `/r/<sub>/comments/...` (a single post) | allowed |
| Search, user profiles, settings, etc. | allowed |

## Install (Chrome / Edge / Brave)

1. Open `chrome://extensions`
2. Turn on **Developer mode** (top right)
3. Click **Load unpacked** and pick this folder

## Install (Firefox, temporary)

1. Open `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on…** and pick `manifest.json`

## Customizing

Edit `FEED_PATTERNS` in `content.js` to change which pages are blocked, then click the reload icon on the extension card.