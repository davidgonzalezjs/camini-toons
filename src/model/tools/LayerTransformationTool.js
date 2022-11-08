import Tool from "./Tool";

class LayerTransformationTool extends Tool {

  get name() {
    return 'layerTransformationTool';
  }

  constructor() {
    super();
    this._isActive = false;
  }

  handleMouseDown(anEvent, aCaminiToons) {
    this._isActive = true;
  }

  handleMouseMove(anEvent, aCaminiToons) {
    if (this._isActive) {
        const layerIndex = aCaminiToons._animationDocument._activeLayerIndex;
        const activeLayer = aCaminiToons._animationDocument.findLayerByIndex(layerIndex);
        const frameNumber = aCaminiToons.currentFrameNumber;

        if (!activeLayer.isTransformationLayer()) return;
        
        aCaminiToons.createKeyTransformationFrame({
          layerIndex,
          x: frameNumber
        });
        
        aCaminiToons.changeKeyTransformationFrameValue({
          layerIndex,
          frameNumber,
          x: activeLayer._frames.x[frameNumber - 1].value + anEvent.delta.x
        });

        aCaminiToons.goToFrame(frameNumber);
    }
  }

  handleMouseUp(anEvent, aCaminiToons) {
    this._isActive = false;
  }

}

export default LayerTransformationTool;