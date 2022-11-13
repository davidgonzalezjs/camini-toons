import styled, {css} from 'styled-components';

import {Card} from '../Card'

import {useContextMenu} from '../context-menu/useContextMenu';

const FrameContextMenuContainer = styled(Card)`
  position: absolute;
  left: ${props => props.position.x}px;
  top: ${props => props.position.y}px;
  
  display: ${props => props.show ? 'flex' : 'none'};

  padding: 2px;

  background-color: darkgrey;

  & > * {
    width: 100%;

    &:hover {
      background-color: burlywood;
    }
  }
`;

const Button = styled.button`
  padding: 5px;
  font-size: 1em;
  text-align: left;
  ${props => props.noBorder && css`border: none`}
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

    const handleCreateTransformationLayer = () => caminiToons.handleCreateTransformationLayerContaining(
      parseInt(contextMenuTarget.dataset.layerIndex)
    );
    
    return (
      <FrameContextMenuContainer show={showMenu} position={position}>
        <Button noBorder onClick={handleConvertToKeyFrame}>Convertir en cuadro clave</Button>
        <Button noBorder onClick={handleExtend}>Extender cuadro</Button>
        <Button noBorder onClick={handleCreateBefore}>Insertar cuadro antes</Button>
        <Button noBorder onClick={handleDelete}>Borrar cuadro</Button>
        <hr/>
        <Button noBorder onClick={handleCreateTransformationLayer}>Crear capa de transformación</Button>
      </FrameContextMenuContainer>
    );
  };
  