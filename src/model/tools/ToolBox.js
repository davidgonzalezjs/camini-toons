import Pen from "./Pen";
import SelectionTool from "./SelectionTool";

class ToolBox {

  constructor() {
    this._tools = [
      new Pen(),
      new SelectionTool()
    ];
    
    this.usePen();
  }

  get selectedTool() {
    return this._selectedTool;
  }

  get toolsNames() {
    return this._tools.map(tool => tool.name);
  }

  useToolNamed(aToolName) {
    this._selectedTool = this._tools.find(tool => tool.name === aToolName);
  }

  usePen() {
    this.useToolNamed('pen');
  }

  useSelectionTool() {
    this.useToolNamed('selectionTool');
  }

}

export default ToolBox;