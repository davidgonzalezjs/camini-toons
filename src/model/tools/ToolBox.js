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

  get pen() {
    return this.toolNamed('pen'); 
  }

  get toolsNames() {
    return this._tools.map(tool => tool.name);
  }

  toolNamed(aToolName) {
    return this._tools.find(tool => tool.name === aToolName);
  }

  useToolNamed(aToolName) {
    this._selectedTool = this.toolNamed(aToolName);
  }

  usePen() {
    this.useToolNamed('pen');
  }

  useSelectionTool() {
    this.useToolNamed('selectionTool');
  }

}

export default ToolBox;