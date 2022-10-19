import Optional from "../Optional";

import Tool from "./Tool";

class Hand extends Tool {

  get name() {
    return 'hand';
  }

  constructor() {
    super();
    this._isGrabbing = false;
  }

  handleMouseDown(anEvent, aCaminiToons) {
    aCaminiToons.deselectAllDrawings();

    this._isGrabbing = true;
  }

  handleMouseMove(anEvent, aCaminiToons) {
    if (this._isGrabbing) {
        aCaminiToons.moveAnimationLayersBy(anEvent.delta);  
    }
  }

  handleMouseUp(anEvent, aCaminiToons) {
    this._isGrabbing = false;
  }

}

export default Hand;