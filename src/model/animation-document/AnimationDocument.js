import {subclassResponsibility} from '../errors'

import Optional from '../Optional';

import AnimationLayer from '../AnimationLayer';

import AnimationIdleState from './state/AnimationIdleState';
import AnimationPlayingState from './state/AnimationPlayingState';

class AnimationDocument {

  constructor({createFrameContent, hitTest}) {
    this._createFrameContent = createFrameContent;
    this._hitTestFunction = hitTest;

    this._selectedDrawings = [];
    this._animationLayers = [];
    this._currentFrameNumber = 1;
    this._isPlayingOnALoop = false;
    this._state = new AnimationIdleState();

    this._listener = Optional.empty();

    this._activeLayerIndex = 0;
    this.createAnimationLayer();
  }

  createAnimationLayer() {
    const newLayer = new AnimationLayer({name: `Capa ${this._animationLayers.length + 1}`, createFrameContent: () => this._createFrameContent()});

    this._animationLayers.push(newLayer);
    //this._activeLayerIndex = this._animationLayers.length - 1;

    this.goToFrame(this._currentFrameNumber);
  }

  get activeLayerIndex() {
    return this._activeLayerIndex;
  }

  get activeLayer() {
    return this._animationLayers[this._activeLayerIndex];
  }

  get currentFrameNumber() {
    return this._currentFrameNumber;
  }

  get lastFrameNumber() {
    return this._animationLayers.reduce((lastFrameNumber, layer) => Math.max(lastFrameNumber, layer.lastFrameNumber), 0);
  }

  get layersDetails() {
    return this._animationLayers.map((animationLayer, index) => ({
      ...animationLayer.details,
      isActive: index === this._activeLayerIndex
    }));
  }

  hasVisibleFrameAt({layerIndex, frameNumber}) {
    return this._animationLayers[layerIndex].isVisibleFrame(frameNumber);
  }

  isAtLastFrame() {
    return this._currentFrameNumber === this.lastFrameNumber;
  }

  isPlaying() {
    return this._state.isPlaying();
  }

  isPlayingOnALoop() {
    return this._isPlayingOnALoop;
  }

  isVisibleLayer(aLayerIndex) {
    return this._animationLayers[aLayerIndex].isVisible();
  }

  hasOnionSkinEnabledOnLayer(aLayerIndex) {
    return this._animationLayers[aLayerIndex].hasOnionSkinEnabled();
  }

  activatePlayOnALoop() {
    this._isPlayingOnALoop = true;
  }

  deactivatePlayOnALoop() {
    this._isPlayingOnALoop = false;
  }

  playAnimation() {
    this.goToFrame(1);
    this.startPlaying();
  }

  stopAnimation() {
    this.stopPlaying();
    this.goToFrame(1);
  }

  startPlaying() {
    this._currentFrameNumber = 0; // Aclaracion: se setea en 0 que para que arranque a reproducir el frame numero 1
    this._state = new AnimationPlayingState();
    this._animationLayers.forEach(layer => layer.startPlaying());  // TODO: escribir test verificando esto
  }

  stopPlaying() {
    this._state = new AnimationIdleState();
    this._animationLayers.forEach(layer => layer.stopPlaying()); // TODO: escribir test verificando esto
    this._listener.ifPresent(listener => listener.handlePlayBackUpdate());
  }

  activateLayer(aLayerIndex) {
    this._activeLayerIndex = aLayerIndex; // TODO: agregar test
    this._animationLayers[aLayerIndex].activateFrame();
  }

  goToFrame(aFrameNumber) {
    this.deselectAllDrawings();
    this._animationLayers.forEach(layer => layer.showFrame(aFrameNumber));
    this._currentFrameNumber = aFrameNumber;

    this._listener.ifPresent(listener => listener.handleFrameChanged(aFrameNumber));
  }

  goToNextFrame() {
    this.goToFrame(this._currentFrameNumber + 1)
  }

  tick() {
    this._state.tickFor(this);
  }

  activateOnionSkinOnLayer(layerIndex) {
    this._animationLayers[layerIndex].activateOnionSkin();
  }

  deactivateOnionSkinOnLayer(layerIndex) {
    this._animationLayers[layerIndex].deactivateOnionSkin();
  }

  createFrameOnLayer(aLayerIndex) {
    this._activeLayerIndex = aLayerIndex; // TODO: agregar test
    
    this.activeLayer.createFrame();
    this.goToFrame(this.activeLayer.lastFrameNumber);
  }

  deleteFrameOnLayer({layerIndex, frameNumber}) {
    this._animationLayers[layerIndex].deleteFrame(frameNumber);
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

  changeNameOfLayer(aLayerIndex, newLayerName) {
    this._animationLayers[aLayerIndex].changeNameTo(newLayerName);
  }

  showLayer(aLayerIndex) {
    this._animationLayers[aLayerIndex].show();
  }

  hideLayer(aLayerIndex) {
    this._animationLayers[aLayerIndex].hide();
  }

  changeActiveLayerTo(aLayerIndex) {
    this._activeLayerIndex = aLayerIndex;
  }

  registerListener(aListener) {
    this._listener = Optional.with(aListener);
  }

}

export default AnimationDocument;