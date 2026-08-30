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