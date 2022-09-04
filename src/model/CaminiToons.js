import ToolBox from './tools/ToolBox';

class CaminiToons {

  constructor(anAnimationDocument) {
    anAnimationDocument.registerListener(this);

    this._animationDocument = anAnimationDocument;
    this._toolBox = new ToolBox();
  }

  // Accessing
  get selectedTool() {
    return this._toolBox.selectedTool;
  }

  get toolsNames() {
    return this._toolBox.toolsNames;
  }

  // Actions
  createPath(aPathStyle) {
    return this._animationDocument.createPath(aPathStyle);
  }

  usePen() {
    this._toolBox.usePen();
  }

  useSelectionTool() {
    this._toolBox.useSelectionTool();
  }

  useToolNamed(aToolName) {
    this._toolBox.useToolNamed(aToolName);
  }

  // Event handling
  handleMouseDown(anEvent) {
    this.selectedTool.handleMouseDown(anEvent, this);
  }

  handleMouseMove(anEvent) {
    this.selectedTool.handleMouseMove(anEvent, this);
  }

  handleMouseUp(anEvent) {
    this.selectedTool.handleMouseUp(anEvent, this);
  }

}

export default CaminiToons;