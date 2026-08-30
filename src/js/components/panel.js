class Panel extends Component {
  name = "panel";
  tplsource = "default";
  tplextension = "tpl.html";
  data = {
    bearer: "QCObjects Labs"
  };
}

Package("com.qcobjects.components.panel", [Panel]);
export default Panel;