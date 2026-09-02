/**
 * Global broken-image guard.
 *
 * Any <img> that fails to load — or that points at an obviously invalid source
 * (empty, "null", "undefined") — is hidden instead of rendering the browser's
 * broken-image placeholder.
 */

const HIDDEN_ATTR = "data-broken-image";

const isInvalidSrc = (src: string | null) => {
  if (!src) return true;
  const value = src.trim();
  if (!value) return true;
  if (value === "null" || value === "undefined") return true;
  return /\/(null|undefined)$/.test(value);
};

const hide = (img: HTMLImageElement) => {
  if (img.getAttribute(HIDDEN_ATTR) === "true") return;
  img.setAttribute(HIDDEN_ATTR, "true");
  img.style.display = "none";
};

const reveal = (img: HTMLImageElement) => {
  if (img.getAttribute(HIDDEN_ATTR) !== "true") return;
  img.removeAttribute(HIDDEN_ATTR);
  img.style.removeProperty("display");
};

const check = (img: HTMLImageElement) => {
  if (isInvalidSrc(img.getAttribute("src"))) {
    hide(img);
    return;
  }
  // Already finished loading and failed (naturalWidth 0 after complete).
  if (img.complete && img.naturalWidth === 0) {
    hide(img);
    return;
  }
  reveal(img);
};

export function installImageGuard() {
  if (typeof window === "undefined") return;
  if ((window as unknown as Record<string, boolean>).__imageGuardInstalled) return;
  (window as unknown as Record<string, boolean>).__imageGuardInstalled = true;

  // Capture phase: error events from <img> do not bubble.
  window.addEventListener(
    "error",
    (event) => {
      const target = event.target as HTMLElement | null;
      if (target instanceof HTMLImageElement) hide(target);
    },
    true
  );

  window.addEventListener(
    "load",
    (event) => {
      const target = event.target as HTMLElement | null;
      if (target instanceof HTMLImageElement) check(target);
    },
    true
  );

  const scan = (root: ParentNode) => {
    root.querySelectorAll?.("img").forEach((img) => check(img as HTMLImageElement));
  };

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "attributes" && mutation.target instanceof HTMLImageElement) {
        check(mutation.target);
        continue;
      }
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLImageElement) check(node);
        else if (node instanceof HTMLElement) scan(node);
      });
    }
  });

  const start = () => {
    scan(document);
    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["src"],
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
}
