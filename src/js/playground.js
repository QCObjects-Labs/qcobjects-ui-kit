const WIDGET_TAGS = [
  "kit-card",
  "kit-counter",
  "kit-tabset",
  "kit-panel"
];

function shadowOf(qc) {
  const host = qc.querySelector(".shadowHost");
  return host && host.shadowRoot ? host.shadowRoot : null;
}

function oneLine(html, max = 180) {
  return html.trim().replace(/\s+/g, " ").slice(0, max);
}

function dumpTree(widget) {
  const lines = [];
  const visit = (node, depth) => {
    node.querySelectorAll("quick-component").forEach((qc) => {
      const kindClassName = qc.getAttribute("componentClass") ||
        (qc.getAttribute("name") ? "Component (base)" : "(none)");
      lines.push(
        `${"  ".repeat(depth)}<${qc.tagName.toLowerCase()} ` +
        `name="${qc.getAttribute("name")}" ` +
        `componentClass="${kindClassName}" ` +
        `loaded="${qc.getAttribute("loaded")}">`
      );
      const sr = shadowOf(qc);
      if (sr) {
        lines.push(`${"  ".repeat(depth)}  shadowRoot[${sr.innerHTML.length}ch]: ${oneLine(sr.innerHTML)}`);
        if (sr.querySelector("quick-component")) visit(sr, depth + 1);
      } else {
        lines.push(`${"  ".repeat(depth)}  (no shadow root yet)`);
      }
    });
  };
  visit(widget, 0);
  return lines.length ? lines.join("\n") : "(no quick-component found)";
}

function dumpAll() {
  let total = 0;
  document.querySelectorAll(".demo").forEach((demo) => {
    const tag = demo.getAttribute("data-widget");
    const widget = demo.querySelector(tag);
    const out = demo.querySelector(".dump");
    if (!widget || !out) return;
    out.textContent = dumpTree(widget);
    total++;
  });
  const status = document.getElementById("dumpStatus");
  if (status) status.textContent = `inspected ${total} widget tree(s) at ${new Date().toLocaleTimeString()}`;
}

function setLogLabel() {
  const on = window.logger && window.logger.debugEnabled === true;
  const btn = document.getElementById("logToggle");
  if (btn) {
    btn.textContent = on ? "Logger: ON" : "Logger: OFF";
    btn.classList.toggle("on", !!on);
  }
  const info = document.getElementById("logInfo");
  if (info) info.textContent = on
    ? "debug trace is printing to the browser console"
    : "debug trace hidden (logger.debugEnabled = false by default)";
}

function toggleLog() {
  if (window.logger) {
    window.logger.debugEnabled = !(window.logger.debugEnabled === true);
  }
  setLogLabel();
}

document.addEventListener("click", (event) => {
  const path = event.composedPath();
  const target = path[0];
  if (!target) return;
  const root = target.getRootNode();
  if (!(root instanceof ShadowRoot)) return;

  const action = target.closest("[data-action]");
  if (action) {
    const countEl = root.querySelector(".kit-count");
    if (countEl) {
      const current = parseInt(countEl.getAttribute("data-count") || countEl.textContent, 10) || 0;
      const next = action.getAttribute("data-action") === "inc" ? current + 1 : current - 1;
      countEl.textContent = next;
      countEl.setAttribute("data-count", next);
    }
    return;
  }

  const tab = target.closest(".kit-tabs [data-tab]");
  if (tab) {
    const panelKey = tab.getAttribute("data-tab");
    root.querySelectorAll(".kit-tabs .tab").forEach((btn) => {
      btn.classList.toggle("active", btn === tab);
    });
    root.querySelectorAll(".tab-panel").forEach((panel) => {
      const active = panel.getAttribute("data-panel") === panelKey;
      panel.classList.toggle("active", active);
    });
  }
});

const boot = () => {
  setLogLabel();
  dumpAll();
  const toolbar = document.getElementById("toolbar");
  if (toolbar) toolbar.hidden = false;

  const toggle = document.getElementById("logToggle");
  if (toggle) toggle.addEventListener("click", () => { toggleLog(); dumpAll(); });
  const redump = document.getElementById("redump");
  if (redump) redump.addEventListener("click", () => dumpAll());

  [1200, 2400, 3600, 5200].forEach((ms) => setTimeout(dumpAll, ms));
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}

window.__kit = { dumpAll, toggleLog };
export default { dumpAll, toggleLog };