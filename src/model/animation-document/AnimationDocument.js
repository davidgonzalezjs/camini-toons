import Optional from '../Optional';

import AnimationLayer from '../AnimationLayer';
import {TransformationLayer} from '../TransformationLayer'
import {AnimationClip} from '../AnimationClip';
import RegularFrame from "../frames/RegularFrame";

import AnimationIdleState from './state/AnimationIdleState';
import AnimationPlayingState from './state/AnimationPlayingState';

class AnimationDocument {

  constructor({
    createFrameContent,
    createPath,
    createCircle,
    frameContentDeserializer,
    hitTest
  }) {
    this._createFrameContent = createFrameContent;
    this._createPath = createPath;
    this._createCircle = createCircle;
    
    this._hitTestFunction = hitTest;

    this._frameContentDeserializer = frameContentDeserializer;

    this._listener = Optional.empty();

    this._selectedDrawings = [];
    
    this._onionSkinSettings = {beforeColor: 'red', afterColor: 'green', numberOfFramesBefore: 3, numberOfFramesAfter: 3, opacityStep: 0.22};

    this._state = new AnimationIdleState();
    this._isPlayingOnALoop = false;

    this._currentFrameNumber = 1;
    this._activeLayerIndex = 0;

    this._layers = [];
    this._animationClips = [];

    this.createAnimationLayer();
  }

  // Accessing - layers
  get activeLayerIndex() {
    return this._activeLayerIndex;
  }

  get activeLayer() {
    return this.findLayerByIndex(this._activeLayerIndex);
  }

  get layersDetails() {
    return this._layers.map((animationLayer, index) => ({
      ...animationLayer.details,
      isActive: index === this._activeLayerIndex
    }));
  }

  // Accessing - frames
  get currentFrameNumber() {
    return this._currentFrameNumber;
  }

  get lastFrameNumber() {
    return this._layers.reduce(
      (lastFrameNumber, layer) => Math.max(lastFrameNumber, layer.lastFrameNumber),
      0
    );
  }

  get currentFrameContent() {
    return this.activeLayer.visibleFrame._content;
  }

  // Accessing - animation clips
  get animationClipsDetails() {
    return this._animationClips.map(animationClip => ({
      name: animationClip.name
    }));
  }

  // Accessing - onion skins
  get onionSkinSettings() {
    return this._onionSkinSettings;
  }

  // Testing - animation
  isAtLastFrame() {
    return this.currentFrameNumber === this.lastFrameNumber;
  }

  isPlaying() {
    return this._state.isPlaying();
  }

  isPlayingOnALoop() {
    return this._isPlayingOnALoop;
  }

  // Testing - layers
  hasChild(aLayer) {
    return this._layers.includes(aLayer);
  }

  isVisibleLayer(aLayerIndex) {
    return this.findLayerByIndex(aLayerIndex).isVisible();
  }

  // Testing - frames
  hasVisibleFrameAt({layerIndex, frameNumber}) {
    return this.findLayerByIndex(layerIndex).isVisibleFrame(frameNumber);
  }

  isKeyFrame({layerIndex, frameNumber}) {
    return this.findLayerByIndex(layerIndex).isKeyFrame(frameNumber);
  }

  // Testing - onion skins
  hasOnionSkinEnabledOnLayer(aLayerIndex) {
    return this.findLayerByIndex(aLayerIndex).hasOnionSkinEnabled();
  }

  // Actions - animation
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

  // Actions - layers
  createTransformationLayerContaining(layerName) {
    const targetLayer = this.findLayerByName(layerName);

    const transformationLayer = new TransformationLayer();
    transformationLayer.addChild(targetLayer);
    
    this.replaceLayerWithIndex(targetLayer, transformationLayer);

    return transformationLayer;
  }

  // TODO: escribir test
  createKeyFrameForXAtFrame(layerName, frameNumber) {
    this.findLayerByName(layerName).createKeyFrameForXAtFrame(frameNumber);
  }

  // TODO: escribir test
  changeKeyFrameValueForX({layerName, frameNumber, value}) {
    this.findLayerByName(layerName).changeKeyFrameValueForX({frameNumber, value});
  }

  moveAnimationLayersBy(aDeltaPoint) {
    this._layers.forEach(layer => layer.moveBy(aDeltaPoint));
  }

  createAnimationLayer(props = {}) {
    const newLayer = new AnimationLayer({
      name: props.name || `Capa ${this._layers.length + 1}`,
      createFrameContent: () => this._createFrameContent()
    });

    this._layers.push(newLayer);
    
    this.goToFrame(this.currentFrameNumber);

    return newLayer;
  }

  activateLayer(aLayerIndex) {
    this._activeLayerIndex = aLayerIndex; // TODO: agregar test
    this.findLayerByIndex(aLayerIndex).activateFrame();
  }

  changeNameOfLayer(aLayerIndex, newLayerName) {
    this.findLayerByIndex(aLayerIndex).changeNameTo(newLayerName);
  }

  showLayer(aLayerIndex) {
    this.findLayerByIndex(aLayerIndex).show();
  }

  hideLayer(aLayerIndex) {
    this.findLayerByIndex(aLayerIndex).hide();
  }

  goToFrame(aFrameNumber) {
    const targetFrame =
      aFrameNumber < 1
      ? 1 
      : aFrameNumber > this.lastFrameNumber
        ? this.lastFrameNumber 
        : aFrameNumber;

    this.deselectAllDrawings();

    this._currentFrameNumber = targetFrame;
    this._layers.forEach(layer => layer.showFrame(targetFrame));
    
    this._listener.ifPresent(listener => listener.handleFrameChanged(targetFrame));
  }

  goToNextFrame() {
    this.goToFrame(this._currentFrameNumber + 1);
  }

  goToPreviousFrame() {
    this.goToFrame(this._currentFrameNumber - 1);
  }

  createFrameOnLayerAtFrame({layerIndex, frameNumber}) {
    this._activeLayerIndex = layerIndex; // TODO: agregar test
    
    //this.activeLayer.hideVisibleFrame();
    this.activeLayer.createFrameAt(frameNumber);
    this.goToFrame(frameNumber);
  }

  createFrameOnLayer(layerIndex) {
    this.createFrameOnLayerAtFrame({layerIndex, frameNumber: this.activeLayer.lastFrameNumber + 1})  
  }

  createFrameBefore({layerIndex, frameNumber}) {
    this.createFrameOnLayerAtFrame({layerIndex, frameNumber});
  }

  extendFrameOnLayer({layerIndex, frameNumber}) {
    this.findLayerByIndex(layerIndex).extendFrame(frameNumber);
  }

  convertToKeyFrame({layerIndex, frameNumber}) {
    this.findLayerByIndex(layerIndex).convertToKeyFrame(frameNumber);
  }

  insertFrames({layerIndex, position, frames}) {
    this.findLayerByIndex(layerIndex).insertFrames(frames, {position});
  } 

  insertAnimationClip({name, layerIndex, position}) {
    const animationClip = this._animationClips.find(animationClip => animationClip.isNamed(name));

    this.insertFrames({layerIndex, position, frames: animationClip.frames});
  }
  
  extractToAnimationClip({name, layerIndex, startFrameNumber, endFrameNumber}) {
    const animationClip = this.findLayerByIndex(layerIndex).extractToAnimationClip({name, startFrameNumber, endFrameNumber});
    
    this._animationClips.push(animationClip);
  }

  deleteFrameOnLayer({layerIndex, frameNumber}) {
    this.findLayerByIndex(layerIndex).deleteFrame(frameNumber);
  }

  // Actions - drawings
  hitTest(aPointToCheck) {
    const hitResult = this._hitTestFunction(aPointToCheck);
    
    return hitResult == null
      ? Optional.empty()
      : Optional.with(hitResult.item);
  }

  createPath(style) {
    const path = this._createPath();
    path.style = {...path.style, ...style};
    return path;
  }

  createCircle(circleSettings) {
    return this._createCircle(circleSettings);
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

  // Actions - onion skins
  activateOnionSkinOnLayer(layerIndex) {
    this.findLayerByIndex(layerIndex).activateOnionSkin(this.onionSkinSettings);
  }

  deactivateOnionSkinOnLayer(layerIndex) {
    this.findLayerByIndex(layerIndex).deactivateOnionSkin();
  }

  changeOnionSkinSettings(newOnionSkinSettings) { // TODO: agregar test
    this._layers
      .filter(layer => layer.hasOnionSkinEnabled())
      .forEach(layer => layer.activateOnionSkin(newOnionSkinSettings));
    
    this._onionSkinSettings = newOnionSkinSettings;
  }

  // PRIVATE - accessing - layers
  findLayerByName(layerName) {
    return this._layers.find(layer => layer.isNamed(layerName))
  }

  findLayerByIndex(aLayerIndex) {
    return this._layers[aLayerIndex];
  }

  findLayerIndexFor(aLayer) {
    return this._layers.findIndex(layer => layer === aLayer);
  }

  // PRIVATE - actions - layers
  replaceLayerWithIndex(targetLayer, newLayer) {
    const targetLayerIndex = this.findLayerIndexFor(targetLayer);
    
    this._layers.splice(targetLayerIndex, 1, newLayer);
  }

  // PRIVATE - actions - animation
  startPlaying() {
    this._currentFrameNumber = 0; // Aclaracion: se setea en 0 que para que arranque a reproducir el frame numero 1
    this._state = new AnimationPlayingState();
    this._layers.forEach(layer => layer.startPlaying());  // TODO: escribir test verificando esto
  }

  stopPlaying() {
    this._state = new AnimationIdleState();
    this._layers.forEach(layer => layer.stopPlaying()); // TODO: escribir test verificando esto
    this._listener.ifPresent(listener => listener.handlePlayBackUpdated());
  }

  // PRIVATE - actions - listeners
  tick() {
    this._state.tickFor(this);
  }

  registerListener(aListener) {
    this._listener = Optional.with(aListener);
  }

  // PUBLIC - Serializacion
  serialize() {
    return {
      _currentFrameNumber: this.currentFrameNumber,
      _isPlayingOnALoop: this._isPlayingOnALoop,
      animationClips: this._animationClips.map(animationClip => animationClip.serialize()),
      layers: this._layers.map(animationLayer => animationLayer.serialize())
    };
  }

  static from(aSerializedAnimationDocument, animationDocumentProps) {
    const {_currentFrameNumber, _isPlayingOnALoop, layers, animationClips} = aSerializedAnimationDocument;

    const animationDocument = new this(animationDocumentProps);
    
    animationDocument._animationClips = animationClips.map(({name, frames}) =>
      new AnimationClip(
        name,
        frames.map(_frame => new RegularFrame(animationDocumentProps.frameContentDeserializer(_frame._content), {isKeyFrame: _frame._isKeyFrame})))
    );

    animationDocument._layers = layers.map(aSerializedAnimationLayer =>
      AnimationLayer.from(
        aSerializedAnimationLayer,
        animationDocumentProps.createFrameContent,
        animationDocumentProps.frameContentDeserializer,
        animationDocument._animationClips
      )
    );
    
    animationDocument._currentFrameNumber = _currentFrameNumber;
    animationDocument._isPlayingOnALoop = _isPlayingOnALoop;
    
    return animationDocument;
  }

}

export default AnimationDocument;