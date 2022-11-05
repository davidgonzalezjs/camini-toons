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

    this._selectedDrawings = [];
    this._animationLayers = [];
    this._currentFrameNumber = 1;
    this._isPlayingOnALoop = false;
    this._state = new AnimationIdleState();

    this._onionSkinSettings = {beforeColor: 'red', afterColor: 'green', numberOfFramesBefore: 3, numberOfFramesAfter: 3, opacityStep: 0.22};

    this._listener = Optional.empty();

    this._activeLayerIndex = 0;
    this.createAnimationLayer();

    this._animationClips = [];
  }

  // Accessing - layers
  get activeLayerIndex() {
    return this._activeLayerIndex;
  }

  get activeLayer() {
    return this._animationLayers[this._activeLayerIndex];
  }

  get layersDetails() {
    return this._animationLayers.map((animationLayer, index) => ({
      ...animationLayer.details,
      isActive: index === this._activeLayerIndex
    }));
  }

  // Accessing - frames
  get currentFrameNumber() {
    return this._currentFrameNumber;
  }

  get lastFrameNumber() {
    return this._animationLayers.reduce((lastFrameNumber, layer) => Math.max(lastFrameNumber, layer.lastFrameNumber), 0);
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
    return this._animationLayers.includes(aLayer);
  }

  isVisibleLayer(aLayerIndex) {
    return this._animationLayers[aLayerIndex].isVisible();
  }

  // Testing - frames
  hasVisibleFrameAt({layerIndex, frameNumber}) {
    return this._animationLayers[layerIndex].isVisibleFrame(frameNumber);
  }

  isKeyFrame({layerIndex, frameNumber}) {
    return this._animationLayers[layerIndex].isKeyFrame(frameNumber);
  }

  // Testing - onion skins
  hasOnionSkinEnabledOnLayer(aLayerIndex) {
    return this._animationLayers[aLayerIndex].hasOnionSkinEnabled();
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
    const targetLayerIndex = this._animationLayers.findIndex(layer => layer.isNamed(layerName));
    const targetLayer = this._animationLayers[targetLayerIndex];

    const transformationLayer = new TransformationLayer();
    transformationLayer.addChild(targetLayer);
    
    this._animationLayers.splice(targetLayerIndex, 1, transformationLayer);

    return transformationLayer;
  }

  // TODO: escribir test
  createKeyFrameForXAtFrame(layerName, frameNumber) {
    this._animationLayers.find(layer => layer.isNamed(layerName)).createKeyFrameForXAtFrame(frameNumber);
  }

  // TODO: escribir test
  changeKeyFrameValueForX({layerName, frameNumber, value}) {
    this._animationLayers.find(layer => layer.isNamed(layerName)).changeKeyFrameValueForX({frameNumber, value});
  }

  moveAnimationLayersBy(aDeltaPoint) {
    this._animationLayers.forEach(animationLayer => animationLayer.moveBy(aDeltaPoint));
  }

  // TODO: testear
  // createTransformationLayer() {
  //   const newLayer = new TransformationLayer(`Capa ${this._animationLayers.length + 1}`);

  //   this._animationLayers.push(newLayer);

  //   this.goToFrame(this.currentFrameNumber);
  // }

  createAnimationLayer(props = {}) {
    const newLayer = new AnimationLayer({
      name: props.name || `Capa ${this._animationLayers.length + 1}`,
      createFrameContent: () => this._createFrameContent()
    });

    this._animationLayers.push(newLayer);
    
    this.goToFrame(this.currentFrameNumber);

    return newLayer;
  }

  activateLayer(aLayerIndex) {
    this._activeLayerIndex = aLayerIndex; // TODO: agregar test
    this._animationLayers[aLayerIndex].activateFrame();
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

  goToFrame(aFrameNumber) {
    const targetFrame =
      aFrameNumber < 1
      ? 1 
      : aFrameNumber > this.lastFrameNumber
        ? this.lastFrameNumber 
        : aFrameNumber;

    this.deselectAllDrawings();

    this._currentFrameNumber = targetFrame;
    this._animationLayers.forEach(layer => layer.showFrame(targetFrame));
    
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
    this._animationLayers[layerIndex].extendFrame(frameNumber);
  }

  convertToKeyFrame({layerIndex, frameNumber}) {
    this._animationLayers[layerIndex].convertToKeyFrame(frameNumber);
  }

  insertFrames({layerIndex, position, frames}) {
    this._animationLayers[layerIndex].insertFrames(frames, {position});
  } 

  insertAnimationClip({name, layerIndex, position}) {
    const animationClip = this._animationClips.find(animationClip => animationClip.isNamed(name));

    this.insertFrames({layerIndex, position, frames: animationClip.frames});
  }
  
  extractToAnimationClip({name, layerIndex, startFrameNumber, endFrameNumber}) {
    const animationClip = this._animationLayers[layerIndex].extractToAnimationClip({name, startFrameNumber, endFrameNumber});
    
    this._animationClips.push(animationClip);
  }

  deleteFrameOnLayer({layerIndex, frameNumber}) {
    this._animationLayers[layerIndex].deleteFrame(frameNumber);
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
    this._animationLayers[layerIndex].activateOnionSkin(this.onionSkinSettings);
  }

  deactivateOnionSkinOnLayer(layerIndex) {
    this._animationLayers[layerIndex].deactivateOnionSkin();
  }

  changeOnionSkinSettings(newOnionSkinSettings) { // TODO: agregar test
    this._animationLayers
      .filter(layer => layer.hasOnionSkinEnabled())
      .forEach(layer => layer.activateOnionSkin(newOnionSkinSettings));
    
    this._onionSkinSettings = newOnionSkinSettings;
  }

  // PRIVATE - actions - animation
  startPlaying() {
    this._currentFrameNumber = 0; // Aclaracion: se setea en 0 que para que arranque a reproducir el frame numero 1
    this._state = new AnimationPlayingState();
    this._animationLayers.forEach(layer => layer.startPlaying());  // TODO: escribir test verificando esto
  }

  stopPlaying() {
    this._state = new AnimationIdleState();
    this._animationLayers.forEach(layer => layer.stopPlaying()); // TODO: escribir test verificando esto
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
      layers: this._animationLayers.map(animationLayer => animationLayer.serialize())
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

    animationDocument._animationLayers = layers.map(aSerializedAnimationLayer =>
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