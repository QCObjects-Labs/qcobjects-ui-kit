class Counter extends Component {
  name = "counter";
  tplsource = "default";
  tplextension = "tpl.html";
  data = {
    count: 7
  };
}

Package("com.qcobjects.components.counter", [Counter]);
export default Counter;