import Optional from "../Optional";
import Tool from "./Tool";

class Eraser extends Tool {
  
  constructor() {
    super();
    this._style = {radius: 30};
    this._area = Optional.empty();
  }

  get name() {
    return 'eraser';
  }

  get style() {
    return this._style;
  }

  changeStyleTo(newStyle) {
    this._style = newStyle;
  }

  handleMouseDown(anEvent, aCaminiToons) {
    const area = aCaminiToons.createCircle({center: anEvent.point, strokeColor: 'grey', ...this.style});
    this._area = Optional.with(area);

    this.eraseOn(aCaminiToons);
  }

  handleMouseMove(anEvent, aCaminiToons) {
    this._area.ifPresent(area => {
        area.position = anEvent.point;
        this.eraseOn(aCaminiToons);
    });
  }

  handleMouseUp(anEvent, aCaminiToons) {
    this._area.ifPresent(area => area.remove());
    this._area = Optional.empty();
  }

  handleKeyDown(anEvent) {
    
  }

  eraseOn(aCaminiToons) {
    const area = this._area.get();
    
    // TODO: corregir. Estoy rompiendo el encapsulamiento como un campeon por todos lados
    const container = aCaminiToons._animationDocument.activeLayer.visibleFrame._content;

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

  isCollidingWith(aDrawing) {
    const area = this._area.get();

    return aDrawing !== area && (area.intersects(aDrawing) || this.areaContainsAllPointsOf(aDrawing));
  }

  areaContainsAllPointsOf(aDrawing) {
    return aDrawing.segments.every(segment => this._area.get().contains(segment.point))
  }
  
}

export default Eraser;