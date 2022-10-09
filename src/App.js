import styled from 'styled-components';

import React, { useRef } from 'react';

import {useCaminiToons} from './useCaminiToons';

import caminiToonsLogo from './assets/Camini-Toons-logo.png';

import Column from './components/Column';
import Row from './components/Row';
import {ToolBoxBar} from './components/tool-box/ToolBoxBar';
import TimeLine from './components/time-line/TimeLine';
import {PlaybackBar} from './components/playback/PlaybackBar';
import {OnionSkinBar} from './components/onion-skin/OnionSkinBar';
import {CreateAnimationClipBar} from './components/create-animation-clip/CreateAnimationClipBar';
import {InsertAnimationClipBar} from './insert-animation-clip/InsertAnimationClipBar';
import Canvas from './components/Canvas';
import {PenStylePanel} from './components/contextual-penel/PenStylePanel';
import {EraserStylePanel} from './components/contextual-penel/EraserStylePanel';

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
    animationClipsDetails,
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

    eraserStyle,
    handleEraserStyleChanged,

    handleConvertFrameToKeyFrame,
    handleExtendFrameClick,
    handleCreateBefore,
    handleDeleteFrameClick,
    handleExtractToAnimationClipClick,
    handleInsertAnimationClick,

    onionSkinSettings,
    handleOnionSkinSettingsChange,
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
        onConvertFrameToKeyFrame={handleConvertFrameToKeyFrame}
        onExtendFrameClick={handleExtendFrameClick}
        onCreateBefore={handleCreateBefore}
        onDeleteFrameClick={handleDeleteFrameClick}
      />

      <Row>
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
        <OnionSkinBar onionSkinSettings={onionSkinSettings} onChange={handleOnionSkinSettingsChange}/>
        <CreateAnimationClipBar onAccept={handleExtractToAnimationClipClick} layersDetails={layersDetails}/>
        <InsertAnimationClipBar onAccept={handleInsertAnimationClick} animationClipsDetails={animationClipsDetails} layersDetails={layersDetails}/>
      </Row>

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
          <EraserStylePanel eraserStyle={eraserStyle} onChange={handleEraserStyleChanged} />
        </Column>
      </Row>
    </AppContainer>
  );
}

export default App;
