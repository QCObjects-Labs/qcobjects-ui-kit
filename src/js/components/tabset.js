class Tabset extends Component {
  name = "tabset";
  tplsource = "default";
  tplextension = "tpl.html";
  done() {
    const tabs = this.hostElements(".tab");
    const panels = this.hostElements(".tab-panel");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const key = tab.getAttribute("data-tab");
        tabs.forEach((b) => b.classList.toggle("active", b === tab));
        panels.forEach((p) => p.classList.toggle("active", p.getAttribute("data-panel") === key));
      });
    });
  }
}

Package("com.qcobjects.components.tabset", [Tabset]);
export default Tabset;
