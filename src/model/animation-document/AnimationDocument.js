import {subclassResponsibility} from '../errors'


import Clock from '../Clock';
import AnimationIdleState from './state/AnimationIdleState';
import AnimationPlayingState from './state/AnimationPlayingState';

class AnimationDocument {

  constructor() {
    this._selectedDrawings = [];
    this._currentFrameNumber = 1;

    this._clock = new Clock({frameRate: 6});
    this._state = new AnimationIdleState();
  }

  get activeLayer() {
    return subclassResponsibility();
  }

  get currentFrameNumber() {
    return this._currentFrameNumber;
  }

  get lastFrameNumber() {
    return this.activeLayer.frames.length;
  }

  isAtLastFrame() {
    return this._currentFrameNumber === this.lastFrameNumber;
  }

  playAnimation() {;
    this.goToFrame(1);
    this._currentFrameNumber = 0; // Aclaracion: se setea en 0 que para que arranque a reproducir el frame numero 1
    this._state = new AnimationPlayingState();
  }

  stopPlaying() {
    this._state = new AnimationIdleState();
  }

  createFrame() {
    this.activeLayer.createFrame();
    this.goToFrame(this._currentFrameNumber + 1);
  }

  goToFrame(aFrameNumber) {
    this.deselectAllDrawings();
    this.activeLayer.goToFrame(aFrameNumber);
    this._currentFrameNumber = aFrameNumber;
  }

  goToNextFrame() {
    this.goToFrame(this._currentFrameNumber + 1)
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
    this._selectedDrawings = [];
  }

  moveDrawing(aDrawing, aDelta) {
    aDrawing.moveBy(aDelta);
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

  onFrame(anEvent) {
    this._clock.tick(anEvent.time, () => this._state.onFrame(this));
  }

}

export default AnimationDocument;