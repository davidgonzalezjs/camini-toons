import {subclassResponsibility} from '../errors'

class AnimationDocument {

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

  hitTest(aPointToCheck) {
    subclassResponsibility();
  }

  createPath(aPathStyle) {
    subclassResponsibility();
  }

  deselectAllDrawings() {
    subclassResponsibility();
  }

  selectDrawing(aDrawing) {
    subclassResponsibility();
  }

  deleteSelection() {
    subclassResponsibility();
  }

  moveDrawing() {
    subclassResponsibility();
  }

}

export default AnimationDocument;