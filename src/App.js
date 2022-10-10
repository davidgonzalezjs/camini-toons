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
import Canvas from './components/Canvas';
import {PenStylePanel} from './components/contextual-penel/PenStylePanel';
import {EraserStylePanel} from './components/contextual-penel/EraserStylePanel';
import {AnimationClipsLibrary} from './components/animation-clips-library/AnimationClipsLibrary';

const AppContainer = styled(Column)`
  align-items: stretch;
  background-color: mediumpurple;
`;

const AppLogo = () =>
  <img
    style={{margin: 'auto'}}
    width={'300px'}
    src={caminiToonsLogo}
    alt='Camini-Toons logo'
  />;

function App({createCaminiToons}) {
  const canvasRef = useRef(null)
  const caminiToons = useCaminiToons(canvasRef, createCaminiToons);

  const canvasWidth = 1280;
  const canvasHeight = 720;

  return (
    <AppContainer>
      <Row>
        <AppLogo />
      </Row>
      
      <TimeLine caminiToons={caminiToons}/>

      <Row>
        <PlaybackBar caminiToons={caminiToons}/>
        <OnionSkinBar onionSkinSettings={caminiToons.onionSkinSettings} onChange={caminiToons.handleChangeOnionSkinSettings}/>
      </Row>

      <Row>
        <ToolBoxBar
          selectedToolName={caminiToons.selectedToolName}
          toolsNames={caminiToons.toolsNames}
          onToolIconClicked={caminiToons.handleChangeTool}
        />

        <Canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          selectedToolName={caminiToons.selectedToolName}
        />

        <Column style={{backgroundColor: 'lightBlue', flexGrow: 1}}>
          <PenStylePanel penStyle={caminiToons.penStyle} onChange={caminiToons.handleChangePenStyle}/>
          <EraserStylePanel eraserStyle={caminiToons.eraserStyle} onChange={caminiToons.handleChangeEraserStyle} />
          <AnimationClipsLibrary caminiToons={caminiToons}/>
        </Column>
      </Row>
    </AppContainer>
  );
}

export default App;
