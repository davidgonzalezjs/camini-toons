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

  createPath(aPathStyle) {
    subclassResponsibility();
  }

}

export default AnimationDocument;