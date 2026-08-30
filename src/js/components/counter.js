class Counter extends Component {
  name = "counter";
  tplsource = "default";
  tplextension = "tpl.html";
  data = {
    count: 7
  };
  done() {
    const [countEl] = this.hostElements(".kit-count");
    this.hostElements("[data-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const current = parseInt(this.data.count ?? countEl?.textContent, 10) || 0;
        const next = btn.getAttribute("data-action") === "inc" ? current + 1 : current - 1;
        this.data.count = next;
        if (countEl) countEl.textContent = next;
      });
    });
  }
}

Package("com.qcobjects.components.counter", [Counter]);
export default Counter;
