import Optional from './Optional';
import ToolBox from './tools/ToolBox';

import AnimationDocument from './animation-document/AnimationDocument';

class CaminiToons {

  constructor(anAnimationDocument, aClock) {
    this._animationDocument = anAnimationDocument;
    this._toolBox = new ToolBox();
    this._clock = aClock;

    this._clock.registerListener(this);
    this._listener = Optional.empty();

    this._shortCuts = {
      '.': () => this.goToNextFrame(),
      ',': () => this.goToPreviousFrame(),
      'v': () => this.useSelectionTool(),
      'y': () => this.usePen(),
      'e': () => this.useEraser(),
      'h': () => this.useHand(),
      'p': () => this.usePaintBucket(),
      't': () => this.useTransformationTool(),
      '*': () => this.createFrameOnLayer(this._animationDocument._activeLayerIndex), // TODO: se esta rompiendo el encapsulamiento
      '+': () => this.extendFrameOnLayer({layerIndex: this._animationDocument._activeLayerIndex, frameNumber: this.currentFrameNumber}), // TODO: se esta rompiendo el encapsulamiento
      '/': () => this.convertToKeyFrame({layerIndex: this._animationDocument._activeLayerIndex, frameNumber: this.currentFrameNumber}), // TODO: se esta rompiendo el encapsulamiento
      'l': () => this.createAnimationLayer()
    }
  }

  // Testing
  isPlaying() {
    return this._animationDocument.isPlaying();
  }

  isPlayingOnALoop() {
    return this._animationDocument.isPlayingOnALoop();
  }

  isVisibleLayer(aLayerIndex) {
    return this._animationDocument.isVisibleLayer(aLayerIndex);
  }

  // Accessing
  get selectedTool() {
    return this._toolBox.selectedTool;
  }

  get toolsNames() {
    return this._toolBox.toolsNames;
  }

  get penStyle() {
    return this._toolBox.pen.style;
  }

  get eraserStyle() {
    return this._toolBox.eraser.style;
  }

  get paintBucketStyle() {
    return this._toolBox.paintBucket.style;
  }

  get frameRate() {
    return this._clock.frameRate;
  }

  get currentFrameNumber() {
    return this._animationDocument.currentFrameNumber;
  }

  get lastFrameNumber() {
    return this._animationDocument.lastFrameNumber;
  }

  get layersDetails() {
    return this._animationDocument.layersDetails;
  }

  get flattenLayersDetails() {
    return this._animationDocument.flattenLayersDetails;
  }

  get animationClipsDetails() {
    return this._animationDocument.animationClipsDetails;
  }

  get onionSkinSettings() {
    return this._animationDocument.onionSkinSettings;
  }

  get currentFrameContent() {
    return this._animationDocument.currentFrameContent;
  }

  hitTest(aPointToCheck) {
    return this._animationDocument.hitTest(aPointToCheck);
  }
  
  // Actions - Timeline
  hasOnionSkinEnabledOnLayer(aLayerIndex) {
    return this._animationDocument.hasOnionSkinEnabledOnLayer(aLayerIndex);
  }

  activatePlayOnALoop() {
    this._animationDocument.activatePlayOnALoop();
    this._listener.ifPresent(listener => listener.handlePlayBackUpdated());
  }

  deactivatePlayOnALoop() {
    this._animationDocument.deactivatePlayOnALoop();
    this._listener.ifPresent(listener => listener.handlePlayBackUpdated());
  }

  playAnimation() {
    this._animationDocument.playAnimation();
    this._listener.ifPresent(listener => listener.handlePlayBackUpdated());
  }

  stopAnimation() {
    this._animationDocument.stopAnimation();
    this._listener.ifPresent(listener => listener.handlePlayBackUpdated());
  }

  goToFrame(aFrameNumber) {
    this._animationDocument.goToFrame(aFrameNumber);
    this._listener.ifPresent(listener => listener.handleFrameChanged());
  }

  goToNextFrame() {
    this.goToFrame(this.currentFrameNumber + 1);
  }

  goToPreviousFrame() {
    this.goToFrame(this.currentFrameNumber - 1);
  }

  createTransformationLayerContaining(layerIndex) {
    this._animationDocument.createTransformationLayerContaining(layerIndex);
    this._listener.ifPresent(listener => listener.handleLayerUpdated());
  }

  createKeyTransformationFrame({layerIndex, x}) {
    this._animationDocument.flattenLayers[layerIndex].createKeyFrameForXAtFrame(x);
    console.log(this._animationDocument.flattenLayers[layerIndex]._frames.x)
    this._listener.ifPresent(listener => listener.handleLayerUpdated());
  }

  changeKeyTransformationFrameValue({layerIndex, frameNumber, x}) {
    this._animationDocument.flattenLayers[layerIndex].changeKeyFrameValueForX({frameNumber, value: x});
    this._listener.ifPresent(listener => listener.handleLayerUpdated());
  }

  // createKeyFrameForXAtFrame(layerName, frameNumber) {
  //   this._animationDocument.createKeyFrameForXAtFrame(layerName, frameNumber);
  //   this._listener.ifPresent(listener => listener.handleLayerUpdated());
  // }

  changeKeyFrameValueForX({layerName, frameNumber, value}) {
    this._animationDocument.changeKeyFrameValueForX({layerName, frameNumber, value});
    this._listener.ifPresent(listener => listener.handleLayerUpdated());
  }

  createFrameOnLayer(aLayerIndex) {
    this._animationDocument.createFrameOnLayer(aLayerIndex);
    this._listener.ifPresent(listener => listener.handleLayerUpdated());
  }

  createFrameBefore({layerIndex, frameNumber}) {
    this._animationDocument.createFrameBefore({layerIndex, frameNumber});
    this._listener.ifPresent(listener => listener.handleLayerUpdated());
  }

  convertToKeyFrame({layerIndex, frameNumber}) {
    this._animationDocument.convertToKeyFrame({layerIndex, frameNumber});
    this._listener.ifPresent(listener => listener.handleLayerUpdated());
  }

  extendFrameOnLayer({layerIndex, frameNumber}) {
    this._animationDocument.extendFrameOnLayer({layerIndex, frameNumber});
    this._listener.ifPresent(listener => listener.handleLayerUpdated());
  }

  extractToAnimationClip({name, layerIndex, startFrameNumber, endFrameNumber}) {
    this._animationDocument.extractToAnimationClip({name, layerIndex, startFrameNumber, endFrameNumber});
    this._listener.ifPresent(listener => listener.handleLayerUpdated());
  }

  insertFrames({layerIndex, position, frames}) {
    this._animationDocument.insertFrames({layerIndex, position, frames});
    this._listener.ifPresent(listener => listener.handleLayerUpdated());  
  }

  insertAnimationClip({name, layerIndex, position}) {
    this._animationDocument.insertAnimationClip({name, layerIndex, position});
    this._listener.ifPresent(listener => listener.handleLayerUpdated());
  }

  deleteFrame({layerIndex, frameNumber}) {
    this._animationDocument.deleteFrameOnLayer({layerIndex, frameNumber});
    this.goToFrame(frameNumber);
    this._listener.ifPresent(listener => listener.handleLayerUpdated());
  }

  activateOnionSkinOnLayer(aLayerIndex) {
    this._animationDocument.activateOnionSkinOnLayer(aLayerIndex);
    this._listener.ifPresent(listener => listener.handleOnionSkinChanged());
  }

  deactivateOnionSkinOnLayer(aLayerIndex) {
    this._animationDocument.deactivateOnionSkinOnLayer(aLayerIndex);
    this._listener.ifPresent(listener => listener.handleOnionSkinChanged());
  }

  changeOnionSkinSettings(newOnionSkinSettings) {
    this._animationDocument.changeOnionSkinSettings(newOnionSkinSettings);
    this._listener.ifPresent(listener => listener.handleOnionSkinChanged());
  }

  changeFrameRateTo(aFrameRate) {
    this._clock.changeFrameRateTo(aFrameRate);
  }

  createAnimationLayer() {
    this._animationDocument.createAnimationLayer();
    this._listener.ifPresent(listener => listener.handleLayerUpdated());
  }

  activateLayer(aLayerIndex) {
    this._animationDocument.activateLayer(aLayerIndex);
    this._listener.ifPresent(listener => listener.handleLayerUpdated());
  }

  // Actions - Drawing
  createPath(aPathStyle) {
    const newPath = this._animationDocument.createPath(aPathStyle);
    this._listener.ifPresent(listener => listener.handleLayerUpdated());

    return newPath;
  }

  createCircle(circleSettings) {
    return this._animationDocument.createCircle(circleSettings);
  }

  deselectAllDrawings() {
    this._animationDocument.deselectAllDrawings();
  }

  selectDrawing(aDrawing) {
    this._animationDocument.selectDrawing(aDrawing);
  }

  deleteSelection() {
    this._animationDocument.deleteSelection();
  }

  moveDrawing(aDrawing, aDelta) {
    this._animationDocument.moveDrawing(aDrawing, aDelta);
  }

  // Actions - Tools
  usePen() {
    this.useToolNamed('pen');
  }

  useEraser() {
    this.useToolNamed('eraser');
  }

  useSelectionTool() {
    this.useToolNamed('selectionTool');
  }

  useHand() {
    this.useToolNamed('hand');
  }

  usePaintBucket() {
    this.useToolNamed('paintBucket'); 
  }

  useTransformationTool() {
    this.useToolNamed('transformationTool');
  }

  useToolNamed(aToolName) {
    this.deselectAllDrawings();
    this._toolBox.useToolNamed(aToolName);
    this._listener.ifPresent(listener => listener.handleToolChanged(aToolName));
  }

  changePenStyle(newPenStyle) {
    this._toolBox.pen.changeStyleTo(newPenStyle, this);
    this._listener.ifPresent(listener => listener.handleToolChanged('pen'));
  }

  changeEraserStyle(newEraserStyle) {
    this._toolBox.eraser.changeStyleTo(newEraserStyle, this);
    this._listener.ifPresent(listener => listener.handleToolChanged('eraser'));
  }

  changePaintBucketStyle(newPaintBucketStyle) {
    this._toolBox.paintBucket.changeStyleTo(newPaintBucketStyle);
    this._listener.ifPresent(listener => listener.handleToolChanged('paintBucket'));
  }

  // Actions - Layers
  moveAnimationLayersBy(aDeltaPoint) {
    this._animationDocument.moveAnimationLayersBy(aDeltaPoint);
  }

  changeNameOfLayer(aLayerIndex, newLayerName) {
    this._animationDocument.changeNameOfLayer(aLayerIndex, newLayerName);
    this._listener.ifPresent(listener => listener.handleChangeLayerName());
  }

  showLayer(aLayerIndex) {
    this._animationDocument.showLayer(aLayerIndex);
    this._listener.ifPresent(listener => listener.handleToggleVisibility());
  }

  hideLayer(aLayerIndex) {
    this._animationDocument.hideLayer(aLayerIndex);
    this._listener.ifPresent(listener => listener.handleToggleVisibility());
  }

  // 
  registerListener(aListener) {
    this._listener = Optional.with(aListener);
    this._animationDocument.registerListener(aListener);
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

  handleKeyDown(anEvent) {
    Optional.fromNullable(this._shortCuts[anEvent.key]).ifPresent(shortCutCommand => shortCutCommand());
    
    this.selectedTool.handleKeyDown(anEvent, this);
  }

  tick() {
    this._animationDocument.tick();
  }


  // PUBLIC - Serializacion
  serializeAnimationDocument() {
    return this._animationDocument.serialize(); 
  }
 
  deserializeAnimationDocument(aSerializedAnimationDocument) {
    const animationDocument = AnimationDocument.from(
      aSerializedAnimationDocument,
      {
        createFrameContent: this._animationDocument._createFrameContent,
        createPath: this._animationDocument._createPath,
        createCircle: this._animationDocument._createCircle,
        frameContentDeserializer: this._animationDocument._frameContentDeserializer,
        hitTest: this._animationDocument._hitTestFunction
      }
    );
    
    this._animationDocument = animationDocument;
    
    this.goToFrame(1);
    this._listener.ifPresent(listener => listener.handleLayerUpdated()); // TODO: cambiar por animationDocumentUpdated
  }

}

export default CaminiToons;