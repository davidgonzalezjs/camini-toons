import Optional from "../Optional";
import Tool from "./Tool";

class PaintBucket extends Tool {
  
  constructor() {
    super();

    this._style = {
      fillColor: 'green'
    };
  }

  get name() {
    return 'paintBucket';
  }

  handleMouseDown(anEvent, aCaminiToons) {
    super.handleMouseDown(anEvent, aCaminiToons);
    
    const container = aCaminiToons.currentFrameContent;

    const match = container.getItems({
      match: (item) => item.contains(anEvent.point)
    });

    match.reverse().slice(0, 1).map(aDrawing => {
      aDrawing.style.fillColor = this._style.fillColor;
      aDrawing.style.fillColor.alpha = 1;
    });
  }

  createArea(aPosition, aCaminiToons) {
  }

}

export default PaintBucket;