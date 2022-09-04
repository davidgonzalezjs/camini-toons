import Optional from "../Optional";

import Tool from "./Tool";

class SelectionTool extends Tool {

  get name() {
    return 'selectionTool';
  }

  constructor() {
    super();
    this._grabedDrawing = Optional.empty();
  }

  handleMouseDown(anEvent, aCaminiToons) {
    aCaminiToons.deselectAllDrawings();
    
    aCaminiToons
      .hitTest(anEvent.point)
      .ifPresent(aDrawing => {
        aCaminiToons.selectDrawing(aDrawing);
        this.startGrabing(aDrawing);
      });
  }

  handleMouseMove(anEvent, aCaminiToons) {
    this._grabedDrawing.ifPresent(drawing =>
      aCaminiToons.moveDrawing(drawing, anEvent.delta)
    );
  }

  handleMouseUp(anEvent, aCaminiToons) {
    this.stopGrabingDrawing();
  }

  handleKeyDown(anEvent, aCaminiToons) {
    if (anEvent.key === 'delete') aCaminiToons.deleteSelection();
  }

  startGrabing(aDrawing) {
    this._grabedDrawing = Optional.with(aDrawing); 
  }

  stopGrabingDrawing() {
    this._grabedDrawing = Optional.empty();
  }

}

export default SelectionTool;