import {useState} from 'react';
import styled, {css} from 'styled-components';

import Row from '../Row';
import {Card} from '../Card';

import {OnionSkinBar} from '../onion-skin/OnionSkinBar';

import {PenStylePanel} from '../contextual-penel/PenStylePanel';
import {EraserStylePanel} from '../contextual-penel/EraserStylePanel';
import {PaintBucketStylePanel} from '../contextual-penel/PaintBucketStylePanel';
import {LayerTransformationPanel} from '../contextual-penel/LayerTransformationPanel';

import {AnimationClipsLibrary} from '../animation-clips-library/AnimationClipsLibrary';


const panels = {
    tools: 'tools',
    library: 'library',
    onionSkins: 'onionSkins'
}

const Tab = styled.button`
    padding: 20px;

    border: none;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;

    ${props => !props.isActive && css`margin-top: 5px;`}

    background-color: ${props => props.isActive ? 'lightblue' : 'lightsteelblue'};
    color: ${props => props.isActive ? 'black' : 'grey'};

    font-weight: bold;
`;

const ToolsSettings = ({caminiToons}) =>
    <>
        {caminiToons.selectedToolName === 'pen' && <PenStylePanel penStyle={caminiToons.penStyle} onChange={caminiToons.handleChangePenStyle}/>}
        {caminiToons.selectedToolName === 'eraser' && <EraserStylePanel eraserStyle={caminiToons.eraserStyle} onChange={caminiToons.handleChangeEraserStyle} />}
        {caminiToons.selectedToolName === 'paintBucket' && <PaintBucketStylePanel paintBucketStyle={caminiToons.paintBucketStyle} onChange={caminiToons.handleChangePaintBucketStyle} />}
        {caminiToons.selectedToolName === 'layerTransformationTool' && <LayerTransformationPanel caminiToons={caminiToons} />}  
    </>;

export const SidePanel = ({caminiToons}) => {
    const [currentPanel, setCurrentPanel] = useState(panels.tools);
    
    const showToolsSettings = () => setCurrentPanel(panels.tools);
    const showLibrary = () => setCurrentPanel(panels.library);
    const showOnionSkinsSettings = () => setCurrentPanel(panels.onionSkins);

    return (
    <Card style={{alignItems: 'stretch'}}>
      <Row style={{gap: '5px', justifyContent: 'center'}}>
        <Tab isActive={currentPanel === panels.tools} onClick={showToolsSettings}>Configuración de herramientas</Tab>
        <Tab isActive={currentPanel === panels.library} onClick={showLibrary}>Biblioteca</Tab>
        <Tab isActive={currentPanel === panels.onionSkins} onClick={showOnionSkinsSettings}>Onion skins</Tab>
      </Row>
      
      <Card style={{backgroundColor: 'lightblue', flexGrow: 1, marginTop: 0, gap: '10px', minWidth: '500px', padding: '10px'}}>
        {currentPanel === panels.tools && <ToolsSettings caminiToons={caminiToons} />}
        {currentPanel === panels.library && <AnimationClipsLibrary caminiToons={caminiToons}/>}
        {currentPanel === panels.onionSkins && <OnionSkinBar onionSkinSettings={caminiToons.onionSkinSettings} onChange={caminiToons.handleChangeOnionSkinSettings}/>}
      </Card>
    </Card>
  );
}