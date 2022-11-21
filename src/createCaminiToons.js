import Paper from 'paper';

import Clock from './model/Clock';
import AnimationDocument from "./model/animation-document/AnimationDocument";
import CaminiToons from "./model/CaminiToons";

window.paper = Paper;

export function createCaminiToons(anHTMLCanvas) {
  preparePaperJSProyect(Paper, anHTMLCanvas);
  extendPathPrototype(Paper);
  extendLayerPrototype(Paper);

  const clock = new Clock({frameRate: 6});
  const animationDocument = createAnimationDocument(Paper);
  
  const caminiToons = new CaminiToons(animationDocument, clock);

  prepareListeners(Paper, clock, caminiToons);

  return caminiToons;
}

function preparePaperJSProyect(Paper, anHTMLCanvas) {
  Paper.setup(anHTMLCanvas);
  Paper.project.activeLayer.remove();
  Paper.view.draw();
}

function createAnimationDocument(Paper) {
  return new AnimationDocument({
    createFrameContent: () => new Paper.Layer(),
    hitTest: (aPointToCheck) => Paper.project.hitTest(aPointToCheck),
    createPath(style) {
      const path = new Paper.Path();
      path.style = {...path.style, ...style};
      return path;
    },
    createCircle(circleSettings) {
      return new Paper.Path.Circle(circleSettings);
    },
    frameContentDeserializer: content => Paper.importJSON(content),
    importImage(url, onImageImported) {
      const lowerCaseURL = url.toLowerCase();

      if (lowerCaseURL.endsWith('.svg')) {
        Paper.project.importSVG(url, image => {
          image.hide();
          image.remove();
          
          onImageImported(image);
        })
      }
      else if (lowerCaseURL.endsWith('.png') || lowerCaseURL.endsWith('.jpg')) {
        const image = new Paper.Raster(url)

        image.onLoad =() => {
          image.remove();
          image.position = Paper.view.center;

          onImageImported(image);
        };
      }
    }
  });
}

function prepareListeners(Paper, clock, caminiToons) {
  Paper.view.onFrame = (event) => clock.onTimePass(event.time);

  Paper.view.onMouseLeave = (event) => caminiToons.handleMouseLeave(event);
  Paper.view.onMouseEnter = (event) => caminiToons.handleMouseEnter(event);
  Paper.view.onMouseDown = (event) => caminiToons.handleMouseDown(event);
  Paper.view.onMouseMove = (event) => caminiToons.handleMouseMove(event);
  Paper.view.onMouseUp = (event) => caminiToons.handleMouseUp(event);
  Paper.view.onKeyDown = (event) => caminiToons.handleKeyDown(event);
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

  pathPrototype.removeFillColor = function() {
    this.fillColor = new paper.Color(0, 0, 0, 0);
    console.log(this.fillColor)
  }
}

function extendLayerPrototype(paper) {
  const pathPrototype = paper.Layer.prototype;
  
  pathPrototype.serialize = function() {
    return this.exportJSON({asString: false})
  }
}