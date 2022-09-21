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
  isOnionSkinEnabled() {
    return this._animatinoLayer.hasOnionSkinEnabled();
  }

  // Accessing
  get selectedTool() {
    return this._toolBox.selectedTool;
  }

  get toolsNames() {
    return this._toolBox.toolsNames;
  }

  get frameRate() {
    return this._clock.frameRate;
  }

  get currentFrameNumber() {
    return this._animationDocument.currentFrameNumber;
  }

  get layersDetails() {
    return this._animationDocument.layersDetails;
  }

  hitTest(aPointToCheck) {
    return this._animationDocument.hitTest(aPointToCheck);
  }
  
  // Actions - Timeline
  playAnimation() {
    this._animationDocument.playAnimation();
  }

  goToFrame(aFrameNumber) {
    this._animationDocument.goToFrame(aFrameNumber);
    this._listener.ifPresent(listener => listener.handleFrameChanged());
  }

  createFrame() {
    this._animationDocument.createFrame();
    this._listener.ifPresent(listener => listener.handleFrameCreated());
  }

  activateOnionSkin() {
    this._animationDocument.activateOnionSkin();
    this._listener.ifPresent(listener => listener.handleOnionSkinChanged());
  }

  deactivateOnionSkin() {
    this._animationDocument.deactivateOnionSkin();
    this._listener.ifPresent(listener => listener.handleOnionSkinChanged())
  }

  changeFrameRateTo(aFrameRate) {
    this._clock.changeFrameRateTo(aFrameRate);
  }

  // Actions - Drawing
  createPath(aPathStyle) {
    return this._animationDocument.createPath(aPathStyle);
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

  useSelectionTool() {
    this.useToolNamed('selectionTool');
  }

  useToolNamed(aToolName) {
    this.deselectAllDrawings();
    this._toolBox.useToolNamed(aToolName);
    this._listener.ifPresent(listener => listener.handleToolChanged(aToolName));
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