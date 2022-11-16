import { subclassResponsibility } from "../errors";
import Optional from "../Optional";

class Tool {

  constructor() {
    this._area = Optional.empty();
    this._style = {};
    this._isActive = false;
  }

  get style() {
    return {...this._style};
  }

  get name() {
    subclassResponsibility('name');
  }

  handleMouseDown(anEvent, aCaminiToons) {
    this.activate();
    this.updateArea(anEvent.point, aCaminiToons); 
  }

  handleMouseMove(anEvent, aCaminiToons) {
    this.updateArea(anEvent.point, aCaminiToons);
  }

  handleMouseUp(anEvent, aCaminiToons) {
    this.deactivate();
    this.updateArea(anEvent.point, aCaminiToons);
  }

  handleKeyDown(anEvent) {
    
  }

  activate() {
    this._isActive = true;
  }

  deactivate() {
    this._isActive = false;
  }

  clear() {
    this._area.ifPresent(area => area.remove());
    this._area = Optional.empty();
  }

  changeStyleTo(newStyle, aCaminiToons) {
    this._style = {...this._style, ...newStyle};

    this._area.ifPresent(area => {
      const position = area.position;
      this.clear();
      this.createArea(position, aCaminiToons);
    });
  }

  updateArea(newPosition, aCaminiToons) {
    if (!this._area.isPresent()) {
      this.createArea(newPosition, aCaminiToons);
    }
    else {
      this._area.get().position = newPosition;
    }
  }

  createArea(position, aCaminiToons) {
    subclassResponsibility('createArea');
  }

}

export default Tool;