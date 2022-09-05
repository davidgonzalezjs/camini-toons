import React, { useRef, useState, useEffect } from 'react';

import Row from './components/Row';
import {ToolBoxBar} from './components/tool-box/ToolBoxBar';
import TimeLine from './components/time-line/TimeLine';
import Canvas from './components/Canvas';

function App({createCaminiToons}) {
  const canvasRef = useRef(null)
  const [caminiToons, setCaminiToons] = useState();
  const [toolsNames, setToolsNames] = useState([]);
  const [selectedToolName, setSelectedToolName] = useState('pen');
  const [frames, setFrames] = useState([{number: 0}]);

  useEffect(() => {
    const newCaminiToons = createCaminiToons(canvasRef.current);
    
    setCaminiToons(newCaminiToons);
    setSelectedToolName(newCaminiToons.selectedTool.name);
    setToolsNames(newCaminiToons.toolsNames);
  }, [createCaminiToons]);

  const canvasWidth = 1280;
  const canvasHeight = 720;

  const handleToolIconClicked = aToolName => {
    caminiToons.useToolNamed(aToolName);
    setSelectedToolName(aToolName);
  };

  const handleCreateFrame = (layerName) => {
    caminiToons.createFrame();
    setFrames([...frames, {number: frames.length}]);
  };

  const handleFrameClick = frame => {
    caminiToons.goToFrame(frame.number);
  };

  return (
    <div>
      <TimeLine
        frames={frames}
        onAddFrameClick={handleCreateFrame}
        onFrameClick={handleFrameClick}
      />

      <Row>
        <ToolBoxBar
          selectedToolName={selectedToolName}
          toolsNames={toolsNames}
          onToolIconClicked={handleToolIconClicked}
        />

        <Canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          selectedToolName={selectedToolName}
        />
      </Row>
    </div>
  );
}

export default App;
