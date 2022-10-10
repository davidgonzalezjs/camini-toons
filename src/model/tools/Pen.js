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
    };
    
    this._currentPath = Optional.empty();
  }

  get name() {
    return 'pen';
  }

  handleMouseDown(anEvent, aCaminiToons) {
    super.handleMouseDown(anEvent, aCaminiToons);
    this.startDrawing(anEvent.point, aCaminiToons);
  }

  handleMouseMove(anEvent, aCaminiToons) {
    super.handleMouseMove(anEvent, aCaminiToons);
    this.continueDrawing(anEvent.point);
  }

  handleMouseUp(anEvent, aCaminiToons) {
    super.handleMouseUp(anEvent, aCaminiToons);
    this.finishDrawing();
  }

  createArea(aPosition, aCaminiToons) {
    const area = aCaminiToons.createCircle({center: aPosition, ...this.style})
    this._area = Optional.fromNullable(area);
  }

  startDrawing(aPoint, aCaminiToons) {
    const newPath = aCaminiToons.createPath(this._style);
    newPath.add(aPoint);

    this._currentPath = Optional.with(newPath);
  }

  continueDrawing(aPoint) {
    this._currentPath.ifPresent(path => path.add(aPoint))
  }
  
  finishDrawing() {
    this._currentPath.ifPresent(path => path.simplify(this.style.smoothing));
    this._currentPath = Optional.empty();
  }
}

export default Pen;