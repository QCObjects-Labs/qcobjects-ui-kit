class Layout extends Component {
  name = "layout";
  tplsource = "default";
  tplextension = "tpl.html";
  done() {
    const allLoaded = [...document.querySelectorAll("quick-component")].every(
      (qc) => qc.getAttribute("loaded") === "true"
    );
    window.__layoutReady = {
      firedAt: new Date().toLocaleTimeString(),
      allLoaded,
      total: document.querySelectorAll("quick-component").length,
      loaded: document.querySelectorAll('quick-component[loaded="true"]').length
    };
    if (typeof window.__onQcReady === "function") {
      window.__onQcReady(window.__layoutReady);
    }
  }
}

Package("com.qcobjects.components.layout", [Layout]);
export default Layout;
