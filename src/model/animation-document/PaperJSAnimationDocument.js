import AnimationDocument from './AnimationDocument';

class PaperJSAnimationDocument extends AnimationDocument {

  constructor(paper) {
    super({
      createFrameContent: () => new paper.Layer(),
      hitTest: (aPointToCheck) => paper.project.hitTest(aPointToCheck)
    });
  
    extendPathPrototype(paper);
    this._paper = paper;
  }

  createPath(style) {
    const path = new this._paper.Path();
    path.style = {...path.style, ...style};
    return path;
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