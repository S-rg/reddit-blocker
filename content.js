(() => {
  const SORTS = "(?:hot|new|top|rising|controversial|best)";

  const FEED_PATTERNS = [
    new RegExp(`^/(?:${SORTS})?/?$`),
    new RegExp(`^/r/[^/]+(?:/${SORTS})?/?$`),
  ];

  function isFeed(pathname) {
    return FEED_PATTERNS.some((re) => re.test(pathname));
  }

  const SCROLL_KEYS = new Set([
    "ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " ", "j", "k",
  ]);

  function isTyping(target) {
    if (!target) return false;
    const tag = target.tagName;
    return (
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      tag === "SELECT" ||
      target.isContentEditable
    );
  }

  const blockEvent = (e) => {
    if (!blocked) return;
    if (e.type === "keydown") {
      if (isTyping(e.target) || !SCROLL_KEYS.has(e.key)) return;
    }
    e.preventDefault();
  };

  let blocked = false;

  function showBanner(show) {
    let banner = document.getElementById("rsb-banner");
    if (show && !banner && document.body) {
      banner = document.createElement("div");
      banner.id = "rsb-banner";
      banner.textContent = "Feed scrolling blocked";
      document.body.appendChild(banner);
      setTimeout(() => banner && banner.remove(), 2500);
    } else if (!show && banner) {
      banner.remove();
    }
  }

  function update() {
    const shouldBlock = isFeed(location.pathname);
    if (shouldBlock === blocked) return;
    blocked = shouldBlock;
    document.documentElement.classList.toggle("rsb-blocked", blocked);
    if (blocked) window.scrollTo(0, 0);
    showBanner(blocked);
  }

  const opts = { passive: false, capture: true };
  window.addEventListener("wheel", blockEvent, opts);
  window.addEventListener("touchmove", blockEvent, opts);
  window.addEventListener("keydown", blockEvent, opts);

  window.addEventListener("popstate", update);
  setInterval(update, 400);

  update();
  document.addEventListener("DOMContentLoaded", () => {
    if (blocked) showBanner(true);
  });
})();
