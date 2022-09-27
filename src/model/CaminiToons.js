import Optional from './Optional';
import ToolBox from './tools/ToolBox';

class CaminiToons {

  constructor(anAnimationDocument, aClock) {
    this._animationDocument = anAnimationDocument;
    this._toolBox = new ToolBox();
    this._clock = aClock;

    this._clock.registerListener(this);
    this._listener = Optional.empty();
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

  get onionSkinSettings() {
    return this._animationDocument.onionSkinSettings;
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
    this._listener.ifPresent(listener => listener.handlePlayBackUpdate());
  }

  deactivatePlayOnALoop() {
    this._animationDocument.deactivatePlayOnALoop();
    this._listener.ifPresent(listener => listener.handlePlayBackUpdate());
  }

  playAnimation() {
    this._animationDocument.playAnimation();
    this._listener.ifPresent(listener => listener.handlePlayBackUpdate());
  }

  stopAnimation() {
    this._animationDocument.stopAnimation();
    this._listener.ifPresent(listener => listener.handlePlayBackUpdate());
  }

  goToFrame(aFrameNumber) {
    this._animationDocument.goToFrame(aFrameNumber);
    this._listener.ifPresent(listener => listener.handleFrameChanged());
  }

  createFrameOnLayer(aLayerIndex) {
    this._animationDocument.createFrameOnLayer(aLayerIndex);
    this._listener.ifPresent(listener => listener.handleLayerUpdate());
  }

  deleteFrame({layerIndex, frameNumber}) {
    this._animationDocument.deleteFrameOnLayer({layerIndex, frameNumber});
    this.goToFrame(frameNumber);
    this._listener.ifPresent(listener => listener.handleLayerUpdate());
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
    this._listener.ifPresent(listener => listener.handleLayerUpdate());
  }

  activateLayer(aLayerIndex) {
    this._animationDocument.activateLayer(aLayerIndex);
    this._listener.ifPresent(listener => listener.handleLayerUpdate());
  }

  // Actions - Drawing
  createPath(aPathStyle) {
    return this._animationDocument.createPath(aPathStyle);
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

  useToolNamed(aToolName) {
    this.deselectAllDrawings();
    this._toolBox.useToolNamed(aToolName);
    this._listener.ifPresent(listener => listener.handleToolChanged(aToolName));
  }

  changePenStyle(newPenStyle) {
    this._toolBox.pen.changeStyleTo(newPenStyle);
    this._listener.ifPresent(listener => listener.handleToolChanged('pen'));
  }

  changeEraserStyle(newEraserStyle) {
    this._toolBox.eraser.changeStyleTo(newEraserStyle);
    this._listener.ifPresent(listener => listener.handleToolChanged('eraser'));
  }

  // Actions - Layers
  changeNameOfLayer(aLayerIndex, newLayerName) {
    this._animationDocument.changeNameOfLayer(aLayerIndex, newLayerName);
    this._listener.ifPresent(listener => listener.handleLayerNameChanged());
  }

  showLayer(aLayerIndex) {
    this._animationDocument.showLayer(aLayerIndex);
    this._listener.ifPresent(listener => listener.handleVisibilityClick());
  }

  hideLayer(aLayerIndex) {
    this._animationDocument.hideLayer(aLayerIndex);
    this._listener.ifPresent(listener => listener.handleVisibilityClick());
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
    this.selectedTool.handleKeyDown(anEvent, this);
  }

  tick() {
    this._animationDocument.tick();
  }

}

export default CaminiToons;