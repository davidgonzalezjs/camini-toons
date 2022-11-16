import styled from 'styled-components';

import React, { useRef } from 'react';

import {useCaminiToons} from './useCaminiToons';

import caminiToonsLogo from './assets/Camini-Toons-logo.png';

import Column from './components/Column';
import Row from './components/Row';
import {ToolBoxBar} from './components/tool-box/ToolBoxBar';
import TimeLine from './components/time-line/TimeLine';
import {PlaybackBar} from './components/playback/PlaybackBar';
import {SidePanel} from './components/side-panel/SidePanel';

import Canvas from './components/Canvas';

const AppContainer = styled(Column)`
  align-items: stretch;
  background-color: mediumpurple;
  height: 100vh;
`;

const AppLogo = () =>
  <img
    style={{margin: 'auto'}}
    width={'300px'}
    src={caminiToonsLogo}
    alt='Camini-Toons logo'
  />;

function App({createCaminiToons}) {
  const canvasRef = useRef(null);
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
      </Row>

      <Row>
        <button onClick={caminiToons.saveAnimationOnLocalStorage}>Guardar</button>
        <button onClick={caminiToons.deleteAnimationFromLocalStorage}>Borrar</button>
        <button onClick={caminiToons.saveToFile}>Guardar en archivo</button>

        <label>
          Abrir animación
          <input style={{display: 'none'}} type="file" accept=".animationDocument" onChange={(e) => caminiToons.loadFromFile(e.target.files[0])}/>
        </label>
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

        <SidePanel caminiToons={caminiToons}/>
      </Row>
    </AppContainer>
  );
}

export default App;
