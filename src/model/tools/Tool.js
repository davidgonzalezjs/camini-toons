import { subclassResponsibility } from "../errors";

class Tool {

  get name() {
    subclassResponsibility();
  }

  handleMouseDown(anEvent, aCaminiToons) {
    subclassResponsibility();    
  }

  handleMouseMove(anEvent, aCaminiToons) {
    subclassResponsibility();
  }

  handleMouseUp(anEvent, aCaminiToons) {
    subclassResponsibility();
  }

}

export default Tool;