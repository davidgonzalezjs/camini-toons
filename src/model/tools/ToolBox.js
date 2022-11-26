import Eraser from "./Eraser";
import Hand from "./Hand";
import Pen from "./Pen";
import SelectionTool from "./SelectionTool";
import PaintBucket from "./PaintBucket";
import LayerTransformationTool from "./LayerTransformationTool";

class ToolBox {

  constructor() {
    this._tools = [
      new Pen(),
      new Eraser(),
      new SelectionTool(),
      new Hand(),
      new PaintBucket(),
      new LayerTransformationTool()
    ];
    
    this.usePen();
  }

  get selectedTool() {
    return this._selectedTool;
  }

  get pen() {
    return this.toolNamed('pen'); 
  }

  get eraser() {
    return this.toolNamed('eraser');
  }

  get paintBucket() {
    return this.toolNamed('paintBucket');
  }

  get layerTransformationTool() {
    return this.toolNamed('layerTransformationTool');
  }

  get toolsNames() {
    return this._tools.map(tool => tool.name);
  }

  toolNamed(aToolName) {
    return this._tools.find(tool => tool.name === aToolName);
  }

  useToolNamed(aToolName) {
    if (this._selectedTool) { this._selectedTool.clear() };
    this._selectedTool = this.toolNamed(aToolName);
  }

  usePen() {
    this.useToolNamed('pen');
  }

  useEraser() {
    this.useToolNamed('eraser');
  }

  useSelectionTool() {
    this.useToolNamed('selectionTool');
  }

  useHandTool() {
    this.useToolNamed('hand');
  }

  usePaintBucket() {
    this.useToolNamed('paintBucket');
  }

}

export default ToolBox;