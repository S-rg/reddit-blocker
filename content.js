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

  function buildOverlay() {
    const overlay = document.createElement("div");
    overlay.id = "rsb-overlay";
    overlay.innerHTML = `
      <div class="rsb-card">
        <h1>Feed blocked</h1>
        <p>Scrolling Reddit feeds is off.</p>
        <form class="rsb-search">
          <input type="search" name="q" placeholder="Search Reddit" autocomplete="off" />
          <button type="submit">Search</button>
        </form>
      </div>`;
    overlay.querySelector("form").addEventListener("submit", (e) => {
      e.preventDefault();
      const q = overlay.querySelector("input").value.trim();
      if (q) location.href = `/search/?q=${encodeURIComponent(q)}`;
    });
    return overlay;
  }

  function syncOverlay() {
    const existing = document.getElementById("rsb-overlay");
    if (blocked && !existing) {
      document.documentElement.appendChild(buildOverlay());
    } else if (!blocked && existing) {
      existing.remove();
    }
  }

  function update() {
    const shouldBlock = isFeed(location.pathname);
    if (shouldBlock !== blocked) {
      blocked = shouldBlock;
      document.documentElement.classList.toggle("rsb-blocked", blocked);
      if (blocked) window.scrollTo(0, 0);
    }
    syncOverlay();
  }

  const opts = { passive: false, capture: true };
  window.addEventListener("wheel", blockEvent, opts);
  window.addEventListener("touchmove", blockEvent, opts);
  window.addEventListener("keydown", blockEvent, opts);

  window.addEventListener("popstate", update);
  setInterval(update, 400);

  update();
})();
