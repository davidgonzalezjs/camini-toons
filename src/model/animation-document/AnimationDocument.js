import {subclassResponsibility} from '../errors'

class AnimationDocument {

  constructor() {
    this._selectedDrawings = [];
  }

  get activeLayer() {
    return subclassResponsibility();
  }

  createFrame() {
    this.deselectAllDrawings();
    this.activeLayer.createFrame();
  }

  goToFrame(aFrameNumber) {
    this.deselectAllDrawings();
    this.activeLayer.goToFrame(aFrameNumber);
  }

  hitTest(aPointToCheck) {
    subclassResponsibility();
  }

  createPath(aPathStyle) {
    subclassResponsibility();
  }

  deselectAllDrawings() {
    this._selectedDrawings.forEach(drawing => drawing.deselect());
    this._selectedDrawings = [];
  }

  selectDrawing(aDrawing) {
    aDrawing.select();
    this._selectedDrawings.push(aDrawing); 
  }

  deleteSelection() {
    this._selectedDrawings.forEach(item => item.remove());
  }

  moveDrawing(aDrawing, aDelta) {
    aDrawing.position = aDrawing.position.add(aDelta);
  }

  registerListener(aListener) {
    this._listener = aListener;
  }
  
  onMouseDown(anEvent) {
    this._listener.handleMouseDown(anEvent);
  }

  onMouseMove(anEvent) {
    this._listener.handleMouseMove(anEvent);
  }

  onMouseUp(anEvent) {
    this._listener.handleMouseUp(anEvent);
  }

  onKeyDown(anEvent) {
    this._listener.handleKeyDown(anEvent);
  }

}

export default AnimationDocument;