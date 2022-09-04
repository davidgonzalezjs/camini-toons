class Pen {
  
  constructor() {
    this._style = {
      strokeCap: 'round',
      strokeColor: "black",
      strokeWidth: 3
    }
    
  	this._simplification = 3;
    this._currentPath = null;
  }

  handleMouseDown(anEvent, aCaminiToons) {
  	this._currentPath = aCaminiToons.createPath(this._style);
    this._currentPath.add(anEvent.point);
  }

  handleMouseMove(anEvent, aCaminiToons) {
    if (this._currentPath) this._currentPath.add(anEvent.point);
  }

  handleMouseUp(anEvent, aCaminiToons) {
  	this._currentPath.simplify(this._simplification);
    this._currentPath = null;
  }
  
}

export default Pen;