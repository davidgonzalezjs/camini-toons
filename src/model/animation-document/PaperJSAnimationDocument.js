import Paper from 'paper';

import AnimationDocument from './AnimationDocument';
import Optional from '../Optional';


class PaperJSAnimationDocument extends AnimationDocument {

  constructor(anHTMLCanvas) {
    super()
    Paper.setup(anHTMLCanvas);
    
    Paper.view.onMouseDown = (event) => this.onMouseDown(event);
    Paper.view.onMouseDrag = (event) => this.onMouseMove(event);
    Paper.view.onMouseUp = (event) => this.onMouseUp(event);
    Paper.view.onKeyDown = (event) => this.onKeyDown(event);
    
    const layerPrototype = Object.getPrototypeOf(Paper.project.activeLayer);
    extendLayerPrototype(layerPrototype);

    Paper.project.activeLayer.initializeFrames();

    Paper.view.draw();
  }

  createFrame() {
    this.deselectAllDrawings();
    Paper.project.activeLayer.createFrame();
  }

  goToFrame(aFrameNumber) {
    Paper.project.activeLayer.goToFrame(aFrameNumber);
  }

  createPath(style) {
    const path = new Paper.Path();
    path.style = {...path.style, ...style};
    return path;
  }

  hitTest(aPointToCheck) {
    const hitResult = Paper.project.hitTest(aPointToCheck);
    
    return hitResult == null
      ? Optional.empty()
      : Optional.with(hitResult.item);
  }

  deselectAllDrawings() {
    Paper.project.deselectAll();
  }

  selectDrawing(aDrawing) {
    aDrawing.selected = true;
  }

  deleteSelection() {
    Paper.project.selectedItems.forEach(item => item.remove());
  }

  moveDrawing(aDrawing, aDelta) {
    aDrawing.position = aDrawing.position.add(aDelta);
  }

}

function extendLayerPrototype(layerPrototype) {
  layerPrototype.initializeFrames = function() {
    this.frames = [this._children];
  }

  layerPrototype.createFrame = function() {
    this.hideCurrentFrame();
    
    const newChildren = [];
    this.frames.push(newChildren);

    this._children = newChildren;
  }

  layerPrototype.goToFrame = function(aFrameNumber) {
    this.hideCurrentFrame()
    this.changeCurrentFrame(aFrameNumber);
    this.showCurrentFrame();
  }

  layerPrototype.hideCurrentFrame = function() {
    this.children.forEach(item => item.visible = false);
  }

  layerPrototype.showCurrentFrame = function() {
    this.children.forEach(item => item.visible = true);
  }

  layerPrototype.changeCurrentFrame = function(aFrameNumber) {
    this._children = this.frames[aFrameNumber];
  }
  
}


export default PaperJSAnimationDocument;