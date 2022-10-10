import styled from 'styled-components';

import Column from '../Column'

import {useContextMenu} from '../context-menu/useContextMenu';

const FrameContextMenuContainer = styled(Column)`
  padding: 10px;
  border: 2px solid grey;
  border-radius: 10px;
  background-color: darkgrey;

  position: absolute;
  left: ${props => props.position.x}px;
  top: ${props => props.position.y}px;
  
  display: ${props => props.show ? 'flex' : 'none'};
`;

const Button = styled.button`
  padding: 5px;
  font-size: 1em;
`;

export const FrameContextMenu = ({caminiToons}) => {
    const {position, showMenu, contextMenuTarget} = useContextMenu({
      onRightClick: event => event.target.dataset.type === 'FRAME'
    });
  
    const handleConvertToKeyFrame = () => caminiToons.handleConvertToKeyFrame({
      layerIndex: parseInt(contextMenuTarget.dataset.layerIndex),
      frameNumber: parseInt(contextMenuTarget.dataset.frameNumber)
    });
  
    const handleExtend = () => caminiToons.handleExtendFrameOnLayer({
      layerIndex: parseInt(contextMenuTarget.dataset.layerIndex),
      frameNumber: parseInt(contextMenuTarget.dataset.frameNumber)
    });
  
    const handleCreateBefore = () => caminiToons.handleCreateBefore({
      layerIndex: parseInt(contextMenuTarget.dataset.layerIndex),
      frameNumber: parseInt(contextMenuTarget.dataset.frameNumber)
    });
  
    const handleDelete = () => caminiToons.handleDeleteFrame({
      layerIndex: parseInt(contextMenuTarget.dataset.layerIndex),
      frameNumber: parseInt(contextMenuTarget.dataset.frameNumber)
    });
    
    return (
      <FrameContextMenuContainer show={showMenu} position={position}>
        <Button onClick={handleConvertToKeyFrame}>Convertir en cuadro clave</Button>
        <Button onClick={handleExtend}>Extender cuadro</Button>
        <Button onClick={handleCreateBefore}>Insertar cuadro antes</Button>
        <Button onClick={handleDelete}>Borrar cuadro</Button>
      </FrameContextMenuContainer>
    );
  };
  