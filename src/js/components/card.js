class Card extends Component {
  name = "card";
  tplsource = "default";
  tplextension = "tpl.html";
  data = {
    tag: "smart widget",
    title: "The Card component",
    body: "This markup is a plain .tpl.html file, fetched over HTTP and rendered into a native shadow root — no componentClass needed for the external-template pattern."
  };
}

Package("com.qcobjects.components.card", [Card]);
export default Card;