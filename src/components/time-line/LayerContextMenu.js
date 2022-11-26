import styled, {css} from 'styled-components';

import {Card} from '../Card'

import {useContextMenu} from '../context-menu/useContextMenu';

const LayerContextMenuContainer = styled(Card)`
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

export const LayerContextMenu = ({caminiToons}) => {
    const {position, showMenu, contextMenuTarget} = useContextMenu({
      onRightClick: event => event.target.dataset.type === 'LAYER'
    });
  
    const createTransformationLayer = () => caminiToons.handleCreateTransformationLayerContaining(
      parseInt(contextMenuTarget.dataset.layerIndex)
    );
    
    return (
      <LayerContextMenuContainer show={showMenu} position={position}>
        <Button noBorder onClick={createTransformationLayer}>Agregar transformación</Button>
      </LayerContextMenuContainer>
    );
  };
  