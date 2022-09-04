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

    Paper.view.draw();
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

}

export default PaperJSAnimationDocument;