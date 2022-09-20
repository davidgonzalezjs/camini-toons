import {subclassResponsibility} from '../errors'

import Optional from '../Optional';

import AnimationLayer from '../AnimationLayer';
import Frame from '../Frame';

import AnimationIdleState from './state/AnimationIdleState';
import AnimationPlayingState from './state/AnimationPlayingState';

class AnimationDocument {

  constructor({createFrameContent, hitTest}) {
    this._createFrameContent = createFrameContent;
    this._hitTestFunction = hitTest;

    this._selectedDrawings = [];
    this._animationLayers = [];
    this._currentFrameNumber = 1;
    this._state = new AnimationIdleState();

    this._listener = Optional.empty();

    this.createAnimationLayer();
  }

  createAnimationLayer() {
    const newLayer = new AnimationLayer({createFrameContent: () => this._createFrameContent()});

    this._animationLayers.push(newLayer);
    this._activeLayer = newLayer;
  }

  get activeLayer() {
    return this._activeLayer;
  }

  get currentFrameNumber() {
    return this._currentFrameNumber;
  }

  get lastFrameNumber() {
    return this.activeLayer.lastFrameNumber;
  }

  get framesDetails() {
    return this.activeLayer.framesDetails;
  }

  isAtLastFrame() {
    return this._currentFrameNumber === this.lastFrameNumber;
  }

  playAnimation() {
    this.goToFrame(1);
    this.startPlaying();
  }

  startPlaying() {
    this._currentFrameNumber = 0; // Aclaracion: se setea en 0 que para que arranque a reproducir el frame numero 1
    this._state = new AnimationPlayingState();
    this.activeLayer.startPlaying();
  }

  stopPlaying() {
    this._state = new AnimationIdleState();
    this.activeLayer.stopPlaying();
  }

  goToFrame(aFrameNumber) {
    this.deselectAllDrawings();
    this.activeLayer.showFrame(aFrameNumber);
    this._currentFrameNumber = aFrameNumber;

    this._listener.ifPresent(listener => listener.handleFrameChanged(aFrameNumber));
  }

  goToNextFrame() {
    this.goToFrame(this._currentFrameNumber + 1)
  }

  tick() {
    this._state.tickFor(this);
  }

  activateOnionSkin() {
    this.activeLayer.activateOnionSkin();
  }

  deactivateOnionSkin() {
    this.activeLayer.deactivateOnionSkin();
  }

  createFrame() {
    this.activeLayer.createFrame();
    this.goToFrame(this.activeLayer.lastFrameNumber);
  }

  hitTest(aPointToCheck) {
    const hitResult = this._hitTestFunction(aPointToCheck);
    
    return hitResult == null
      ? Optional.empty()
      : Optional.with(hitResult.item);
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
    this._listener = Optional.with(aListener);
  }

}

export default AnimationDocument;