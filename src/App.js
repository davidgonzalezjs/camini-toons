import styled from 'styled-components';

import React, { useRef, useState, useEffect } from 'react';

import caminiToonsLogo from './assets/Camini-Toons-logo.png';

import Column from './components/Column';
import Row from './components/Row';
import {ToolBoxBar} from './components/tool-box/ToolBoxBar';
import TimeLine from './components/time-line/TimeLine';
import {PlaybackBar} from './components/playback/PlaybackBar';
import Canvas from './components/Canvas';

const AppContainer = styled(Column)`
  align-items: stretch;
  background-color: mediumpurple;
`;

const AppLogo = () =>
  <img
    style={{margin: 'auto'}}
    width={'300px'}
    src={caminiToonsLogo}
  />;

function App({createCaminiToons}) {
  const canvasRef = useRef(null)
  const [caminiToons, setCaminiToons] = useState();
  const [toolsNames, setToolsNames] = useState([]);
  const [selectedToolName, setSelectedToolName] = useState('pen');
  const [frames, setFrames] = useState([{number: 1}]);
  const [frameRate, setFrameRate] = useState(6);
  const [currentFrameNumber, setCurrentFrameNumber] = useState(1);

  useEffect(() => {
    const newCaminiToons = createCaminiToons(canvasRef.current);
    window.caminiToons = newCaminiToons;
    setCaminiToons(newCaminiToons);
    setSelectedToolName(newCaminiToons.selectedTool.name);
    setToolsNames(newCaminiToons.toolsNames);
    setFrameRate(newCaminiToons.frameRate);
    setCurrentFrameNumber(newCaminiToons.currentFrameNumber);
  }, [createCaminiToons]);

  const canvasWidth = 1280;
  const canvasHeight = 720;

  const handleToolIconClicked = aToolName => {
    caminiToons.useToolNamed(aToolName);
    setSelectedToolName(aToolName);
  };

  const handleCreateFrame = (layerName) => {
    caminiToons.createFrame();
    setFrames(caminiToons.framesDetails);
    setCurrentFrameNumber(caminiToons.currentFrameNumber);
  };

  const handleFrameClick = frame => {
    caminiToons.goToFrame(frame.number);
    setCurrentFrameNumber(caminiToons.currentFrameNumber);
  };

  const handlePlayAnimation = () => {
    caminiToons.playAnimation();
  };

  const handleRepeatAnimation = () => {

  };

  const handleOnionSkinClick = () => {
    // TODO: se rompe el encapsulamiento
    const layer = caminiToons._animationDocument.activeLayer; 
    if (layer.hasOnionSkinEnabled()) {
      layer.deactivateOnionSkin();
    }
    else {
      layer.activateOnionSkin();
    }
  };

  const handleFrameRateChange = (anEvent) => {
    const newFrameRate = parseInt(anEvent.target.value);
    
    if (!isNaN(newFrameRate) && newFrameRate > 0) {
      caminiToons.changeFrameRateTo(newFrameRate);
      setFrameRate(newFrameRate);
    }
  };

  return (
    <AppContainer>
      <Row>
        <AppLogo />
      </Row>
      
      <TimeLine
        frames={frames}
        onAddFrameClick={handleCreateFrame}
        onOnionSkinClick={handleOnionSkinClick}
        onFrameClick={handleFrameClick}
      />

      <PlaybackBar
        currentFrameNumber={currentFrameNumber}
        frameRate={frameRate}
        onFrameRateChage={handleFrameRateChange}
        onPlay={handlePlayAnimation}
        onRepeat={handleRepeatAnimation}
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

        <Column style={{backgroundColor: 'lightBlue', flexGrow: 1}}>
          
        </Column>
      </Row>
    </AppContainer>
  );
}

export default App;
