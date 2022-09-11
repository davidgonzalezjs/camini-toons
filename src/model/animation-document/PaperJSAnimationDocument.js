import AnimationDocument from './AnimationDocument';
import Optional from '../Optional';


class PaperJSAnimationDocument extends AnimationDocument {

  constructor(paper) {
    super();
    this._paper = paper;

    extendPathPrototype(this._paper);
    extendLayerPrototype(this._paper);

    this._paper.project.activeLayer.initializeFrames();
  }

  get activeLayer() {
    return this._paper.project.activeLayer;
  }

  createPath(style) {
    const path = new this._paper.Path();
    path.style = {...path.style, ...style};
    return path;
  }

  hitTest(aPointToCheck) {
    const hitResult = this._paper.project.hitTest(aPointToCheck);
    
    return hitResult == null
      ? Optional.empty()
      : Optional.with(hitResult.item);
  }

}

function extendLayerPrototype(paper) {
  const layerPrototype = Object.getPrototypeOf(paper.project.activeLayer)
  
  layerPrototype.initializeFrames = function() {
    this.frames = [this._children];
  }

  layerPrototype.createFrame = function() {
    this.hideCurrentFrame();
    
    const newChildren = [];
    this.frames.push(newChildren);

    this._children = newChildren;
  }

  layerPrototype.numberOfFrames = function() {
    return this.frames.length;
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
    this._children = this.frames[aFrameNumber - 1];
  }
  
}

function extendPathPrototype(paper) {
  const pathPrototype = paper.Path.prototype;
  
  pathPrototype.deselect = function() {
    this.selected = false;
  }

  pathPrototype.select = function() {
    this.selected = true;
  }

  pathPrototype.moveBy = function(aDelta) {
    this.position = this.position.add(aDelta);
  }
}


export default PaperJSAnimationDocument;