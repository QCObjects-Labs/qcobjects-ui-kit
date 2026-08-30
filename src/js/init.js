import * as QCObjects from "qcobjects";
import "./components/card";
import "./components/counter";
import "./components/statchip";
import "./components/tabset";
import "./components/panel";
import "./playground";

RegisterWidgets(
  "kit-card",
  "kit-counter",
  "kit-statchip",
  "kit-tabset",
  "kit-panel"
);

CONFIG.set("sourceType", "module");
CONFIG.set("componentsBasePath", "templates/components/");
CONFIG.set("tplextension", "tpl.html");

export default {};