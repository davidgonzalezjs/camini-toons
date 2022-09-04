import Paper from 'paper';

import AnimationDocument from './AnimationDocument';

class PaperJSAnimationDocument extends AnimationDocument {

  constructor(anHTMLCanvas) {
    super()
    Paper.setup(anHTMLCanvas);
    
    Paper.view.onMouseDown = (event) => this.onMouseDown(event);
    Paper.view.onMouseDrag = (event) => this.onMouseMove(event);
    Paper.view.onMouseUp = (event) => this.onMouseUp(event);

    Paper.view.draw();
  }

  createPath(style) {
    const path = new Paper.Path();
    path.style = {...path.style, ...style};
    return path;
  }

}

export default PaperJSAnimationDocument;