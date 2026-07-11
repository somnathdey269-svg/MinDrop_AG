// Tiny postMessage protocol between the story overlay and the app iframe.
// Parent asks the iframe to watch a selector; iframe posts its live rect
// (in a 390x844 design viewport) whenever it changes.
//
// Same-origin iframe — no origin lock needed, but we still tag every
// message with a "source" so we ignore anything else.

export const TOUR_SRC = "mindrop-tour" as const;
export const TOUR_VIEWPORT_W = 390;
export const TOUR_VIEWPORT_H = 844;

export type TourRect = {
  x: number;
  y: number;
  w: number;
  h: number;
  vw: number;
  vh: number;
};

export type TourToIframe =
  | { source: typeof TOUR_SRC; type: "watch"; selector: string | null }
  | { source: typeof TOUR_SRC; type: "ping" };

export type TourFromIframe =
  | { source: typeof TOUR_SRC; type: "rect"; selector: string; rect: TourRect | null }
  | { source: typeof TOUR_SRC; type: "ready" };

/**
 * Script injected into the app when the URL carries ?tour=1.
 * Listens for "watch" requests and posts live rect updates for the
 * selector back to the parent. Retries selector lookup while pages hydrate.
 * Also refreshes on resize + DOM mutation.
 */
export const TOUR_IFRAME_SCRIPT = `
(function(){
  if (window.__mindropTourInstalled) return;
  window.__mindropTourInstalled = true;
  var SRC = "${TOUR_SRC}";
  var currentSelector = null;
  var currentEl = null;
  var ro = null;
  var mo = null;
  var pollTimer = null;

  function send(msg){
    try { window.parent && window.parent.postMessage(msg, "*"); } catch(_) {}
  }
  function measure(){
    if (!currentSelector) return;
    var el = currentEl && document.body.contains(currentEl)
      ? currentEl
      : document.querySelector(currentSelector);
    if (!el) {
      send({ source: SRC, type: "rect", selector: currentSelector, rect: null });
      return;
    }
    if (el !== currentEl) {
      currentEl = el;
      try { ro && ro.disconnect(); } catch(_){}
      try {
        ro = new ResizeObserver(function(){ measure(); });
        ro.observe(el);
      } catch(_){}
    }
    var r = el.getBoundingClientRect();
    var vw = window.innerWidth, vh = window.innerHeight;
    // Clip to visible viewport so tall lists don't spill outside the phone.
    var left = Math.max(0, r.left);
    var top = Math.max(0, r.top);
    var right = Math.min(vw, r.right);
    var bottom = Math.min(vh, r.bottom);
    if (right <= left || bottom <= top) {
      send({ source: SRC, type: "rect", selector: currentSelector, rect: null });
      return;
    }
    send({
      source: SRC,
      type: "rect",
      selector: currentSelector,
      rect: {
        x: left, y: top, w: right - left, h: bottom - top,
        vw: vw, vh: vh,
      },
    });

  }
  function startPoll(){
    if (pollTimer) return;
    pollTimer = setInterval(function(){
      if (!currentSelector) return;
      if (!currentEl || !document.body.contains(currentEl)) measure();
    }, 300);
  }
  window.addEventListener("message", function(ev){
    var d = ev && ev.data;
    if (!d || d.source !== SRC) return;
    if (d.type === "watch") {
      currentSelector = d.selector || null;
      currentEl = null;
      try { ro && ro.disconnect(); } catch(_){}
      ro = null;
      if (currentSelector) { measure(); startPoll(); }
    } else if (d.type === "ping") {
      send({ source: SRC, type: "ready" });
    }
  });
  window.addEventListener("resize", function(){ measure(); });
  window.addEventListener("scroll", function(){ measure(); }, true);
  try {
    mo = new MutationObserver(function(){ if (currentSelector && !currentEl) measure(); });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  } catch(_){}
  send({ source: SRC, type: "ready" });
})();
`;
