import Pen from "./Pen";

class ToolBox {

  constructor() {
    this._selectedTool = new Pen();
  }

  get selectedTool() {
    return this._selectedTool;
  }

}

export default ToolBox;