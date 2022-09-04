import React, { useRef, useEffect } from 'react';

import Column from './components/Column'
import Canvas from './components/Canvas'
import CaminiToons from './model/CaminiToons';
import PaperJSAnimationDocument from './model/animation-document/PaperJSAnimationDocument';

function App() {
  const canvasRef = useRef(null)
  
  useEffect(() => {
    const animationDocument = new PaperJSAnimationDocument(canvasRef.current);
    new CaminiToons(animationDocument)
  }, []);

  const canvasWidth = 1280;
  const canvasHeight = 720;

  return (
    <Column>
      <div>
        <Canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
      </div>
    </Column>
  );
}

export default App;
