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
import {PenStylePanel} from './components/contextual-penel/PenStylePanel';

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
    lastFrameNumber,
    layersDetails,
    isPlaying,
    isPlayingOnALoop,

    handleToolIconClicked,
    handleCreateFrame,
    handleFrameClick,
    handlePlayAnimation,
    handleStopAnimation,
    handleRepeatAnimation,
    handleVisibilityClick,
    handleOnionSkinClick,
    handleFrameRateChange,
    handleLayerClick,
    handleLayerNameChanged,
    handleCreateLayerClick,

    penStyle,
    handlePenStyleChanged,

    handleDeleteFrameClick
  } = useCaminiToons(canvasRef, createCaminiToons);

  const canvasWidth = 1280;
  const canvasHeight = 720;

  return (
    <AppContainer>
      <Row>
        <AppLogo />
      </Row>
      
      <TimeLine
        currentFrameNumber={currentFrameNumber}
        lastFrameNumber={lastFrameNumber}
        layersDetails={layersDetails}
        onLayerClick={handleLayerClick}
        onLayerNameChanged={handleLayerNameChanged}
        onAddFrameClick={handleCreateFrame}
        onVisibilityClick={handleVisibilityClick}
        onOnionSkinClick={handleOnionSkinClick}
        onFrameClick={handleFrameClick}
        onCreateLayerClick={handleCreateLayerClick}
        onDeleteFrameClick={handleDeleteFrameClick}
      />

      <PlaybackBar
        currentFrameNumber={currentFrameNumber}
        frameRate={frameRate}
        isPlaying={isPlaying}
        isPlayingOnALoop={isPlayingOnALoop}
        onFrameRateChage={handleFrameRateChange}
        onPlay={handlePlayAnimation}
        onStop={handleStopAnimation}
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
          <PenStylePanel penStyle={penStyle} onChange={handlePenStyleChanged}/>
        </Column>
      </Row>
    </AppContainer>
  );
}

export default App;
