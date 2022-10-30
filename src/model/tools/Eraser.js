import Optional from "../Optional";
import Tool from "./Tool";

class Eraser extends Tool {
  
  constructor() {
    super();
    this._style = {radius: 30};
  }

  get name() {
    return 'eraser';
  }

  handleMouseDown(anEvent, aCaminiToons) {
    super.handleMouseDown(anEvent, aCaminiToons);
    this.eraseOn(aCaminiToons);
  }

  handleMouseMove(anEvent, aCaminiToons) {
    super.handleMouseMove(anEvent, aCaminiToons);
    this.eraseOn(aCaminiToons);
  }

  eraseOn(aCaminiToons) {
    if (!this._isActive) return;

    const area = this._area.get();
    
    const container = aCaminiToons.currentFrameContent;

    container.children
        .filter(item => this.isCollidingWith(item))
        .forEach(collidingItem => {
            const compoundPath = collidingItem.subtract(area, {insert: false, trace: false});
            
            collidingItem.remove();
            
            if (compoundPath.children) {
                container.addChildren(compoundPath.children);
                compoundPath.remove();
            }
        });
    
    container.children.forEach(aDrawing => {
        if ((aDrawing.segments.length === 0) ||
            (aDrawing.segments.length === 2 && aDrawing.segments[0].point.getDistance(aDrawing.segments[0]) < 1)) {
            aDrawing.remove()
        }
    })
  }
  
  createArea(aPosition, aCaminiToons) {
    const area = aCaminiToons.createCircle({center: aPosition, strokeColor: 'grey', ...this.style})
    this._area = Optional.fromNullable(area);
  }

  isCollidingWith(aDrawing) {
    const area = this._area.get();

    return aDrawing !== area && (area.intersects(aDrawing) || this.areaContainsAllPointsOf(aDrawing));
  }

  areaContainsAllPointsOf(aDrawing) {
    return aDrawing.segments.every(segment => this._area.get().contains(segment.point))
  }
  
}

export default Eraser;