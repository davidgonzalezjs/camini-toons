import Pen from './tools/Pen'
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

  // Actions
  createPath(aPathStyle, anInitialPosition) {
    return this._animationDocument.createPath(aPathStyle)
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