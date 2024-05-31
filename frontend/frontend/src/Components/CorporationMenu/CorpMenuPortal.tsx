import CorpMenu from "./CorpMenu";
import ReactDOM from "react-dom";

const menuRoot = document.getElementById("nav-left");

const CorpMenuPortal = () => {
  if (!menuRoot) {
    return <></>;
  }
  return ReactDOM.createPortal(<CorpMenu />, menuRoot);
};

export { CorpMenuPortal };
