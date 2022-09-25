import Optional from "../Optional";
import Tool from "./Tool";

class Pen extends Tool {
  
  constructor() {
    super();

    this._style = {
      strokeCap: 'round',
      strokeColor: "black",
      strokeWidth: 3,
      smoothing: 3
    }
    
    this._currentPath = Optional.empty();
  }

  get name() {
    return 'pen';
  }

  get style() {
    return {...this._style};
  }

  changeStyleTo(newStyle) {
    this._style = {...this._style, ...newStyle};
  }

  handleMouseDown(anEvent, aCaminiToons) {
    const newPath = aCaminiToons.createPath(this._style);
    newPath.add(anEvent.point);

    this._currentPath = Optional.with(newPath);
  }

  handleMouseMove(anEvent, aCaminiToons) {
    this._currentPath.ifPresent(path => path.add(anEvent.point))
  }

  handleMouseUp(anEvent, aCaminiToons) {
    this._currentPath.ifPresent(path => path.simplify(this.style.smoothing));
    this._currentPath = Optional.empty();
  }

  handleKeyDown(anEvent) {
    
  }
  
}

export default Pen;