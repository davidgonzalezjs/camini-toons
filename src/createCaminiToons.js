import PaperJSAnimationDocument from "./model/animation-document/PaperJSAnimationDocument";
import CaminiToons from "./model/CaminiToons";


export function createCaminiToons(anHTMLCanvas) {
  const animationDocument = new PaperJSAnimationDocument(anHTMLCanvas);
  return new CaminiToons(animationDocument);
}