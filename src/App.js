import styled from 'styled-components';

import React, { useRef } from 'react';

import {useCaminiToons} from './useCaminiToons';

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
  
  const {
    toolsNames,
    selectedToolName,
    frameRate,
    currentFrameNumber,
    layersDetails,

    handleToolIconClicked,
    handleCreateFrame,
    handleFrameClick,
    handlePlayAnimation,
    handleRepeatAnimation,
    handleVisibilityClick,
    handleOnionSkinClick,
    handleFrameRateChange,
    handleLayerNameChanged
  } = useCaminiToons(canvasRef, createCaminiToons);

  const canvasWidth = 1280;
  const canvasHeight = 720;

  return (
    <AppContainer>
      <Row>
        <AppLogo />
      </Row>
      
      <TimeLine
        layersDetails={layersDetails}
        onLayerNameChanged={handleLayerNameChanged}
        onAddFrameClick={handleCreateFrame}
        onVisibilityClick={handleVisibilityClick}
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
