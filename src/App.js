import React, { useRef, useState, useEffect } from 'react';

import Row from './components/Row';
import {ToolBoxBar} from './components/tool-box/ToolBoxBar';
import Canvas from './components/Canvas';

function App({createCaminiToons}) {
  const canvasRef = useRef(null)
  const [caminiToons, setCaminiToons] = useState();
  const [toolsNames, setToolsNames] = useState([]);
  const [selectedToolName, setSelectedToolName] = useState('pen');

  useEffect(() => {
    const newCaminiToons = createCaminiToons(canvasRef.current);
    
    setCaminiToons(newCaminiToons);
    setSelectedToolName(newCaminiToons.selectedTool.name);
    setToolsNames(newCaminiToons.toolsNames);
  }, []);

  const canvasWidth = 1280;
  const canvasHeight = 720;

  const handleToolIconClicked = aToolName => {
    caminiToons.useToolNamed(aToolName);
    setSelectedToolName(aToolName);
  }

  return (
    <Row>
      <ToolBoxBar selectedToolName={selectedToolName} toolsNames={toolsNames} onToolIconClicked={handleToolIconClicked} />
      <Canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} selectedToolName={selectedToolName}/>
    </Row>
  );
}

export default App;
