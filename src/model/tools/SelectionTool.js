import Tool from "./Tool";

class SelectionTool extends Tool {

  get name() {
    return 'selectionTool';
  }

  handleMouseDown(anEvent, aCaminiToons) {
    aCaminiToons.deselectAllDrawings();
    
    aCaminiToons
      .hitTest(anEvent.point)
      .ifPresent(aDrawing => aCaminiToons.selectDrawing(aDrawing));
  }

  handleMouseMove(anEvent, aCaminiToons) {
  }

  handleMouseUp(anEvent, aCaminiToons) {
  }

}

export default SelectionTool;