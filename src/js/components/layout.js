class Layout extends Component {
  name = "layout";
  tplsource = "default";
  tplextension = "tpl.html";
  done() {
    const allQc = this._collectAllQuickComponents(document);
    const allLoaded = allQc.every((qc) => qc.getAttribute("loaded") === "true");
    window.__layoutReady = {
      firedAt: new Date().toLocaleTimeString(),
      allLoaded,
      total: allQc.length,
      loaded: allQc.filter((qc) => qc.getAttribute("loaded") === "true").length
    };
    if (typeof window.__onQcReady === "function") {
      window.__onQcReady(window.__layoutReady);
    }
  }
  _collectAllQuickComponents(root) {
    const result = [];
    const collect = (node) => {
      node.querySelectorAll("quick-component").forEach((qc) => {
        result.push(qc);
        const sr = qc.querySelector(".shadowHost")?.shadowRoot;
        if (sr) collect(sr);
      });
    };
    collect(root);
    return result;
  }
}

Package("com.qcobjects.components.layout", [Layout]);
export default Layout;
