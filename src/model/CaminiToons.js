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

  // Accessing
  hitTest(aPointToCheck) {
    return this._animationDocument.hitTest(aPointToCheck);
  }
  
  // Actions
  createPath(aPathStyle) {
    return this._animationDocument.createPath(aPathStyle);
  }

  deselectAllDrawings() {
    this._animationDocument.deselectAllDrawings();
  }

  selectDrawing(aDrawing) {
    this._animationDocument.selectDrawing(aDrawing);
  }

  usePen() {
    this.useToolNamed('pen');
  }

  useSelectionTool() {
    this.useToolNamed('selectionTool');
  }

  useToolNamed(aToolName) {
    this.deselectAllDrawings();
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