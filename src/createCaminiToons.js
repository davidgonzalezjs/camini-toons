import Paper from 'paper';

import Clock from './model/Clock';
import PaperJSAnimationDocument from "./model/animation-document/PaperJSAnimationDocument";
import CaminiToons from "./model/CaminiToons";


export function createCaminiToons(anHTMLCanvas) {
  Paper.setup(anHTMLCanvas);
  Paper.view.draw();

  const clock = new Clock({frameRate: 6});
  const animationDocument = new PaperJSAnimationDocument(Paper);
  const caminiToons = new CaminiToons(animationDocument, clock);

  Paper.view.onFrame = (event) => clock.onTimePass(event.time);

  Paper.view.onMouseDown = (event) => caminiToons.handleMouseDown(event);
  Paper.view.onMouseDrag = (event) => caminiToons.handleMouseMove(event);
  Paper.view.onMouseUp = (event) => caminiToons.handleMouseUp(event);
  Paper.view.onKeyDown = (event) => caminiToons.handleKeyDown(event);

  return caminiToons;
}