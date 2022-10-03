import styled from 'styled-components';

import lockIcon from '../../assets/layer/lock.svg';
import onionIcon from '../../assets/layer/onion.svg';
import eyeIcon from '../../assets/layer/eye.svg';

import {Icon} from '../Icon'

import newFrameIcon from '../../assets/layer/new-frame.svg';

import Column from '../Column'
import Row from '../Row'
import {Frame} from './Frame'

import {useContextMenu} from '../context-menu/useContextMenu';

const LayersContainer = styled(Column)`
  //height: 40px;
  align-items: stretch;
`;

const StyledLayer = styled(Row)`
  align-items: center;
  padding-left: 5px;
  padding-right: 5px;
  background-color: ${props => props.isActive ? '#FFFF00' : 'orange'};
  gap: 5px;
  width: 320px;
  border: 2px solid darkorange;
`;

const FramesContainer = styled(Row)`
  flex-grow: 1;
  background-color: lightgreen;
  border: 1px solid darkgreen;
`;

const LayerIcon = styled(Icon)`
  opacity: ${props => props.active ?  1 : 0.4 };
  width: 25px;
  height: 25px;
`;

const VisibilityButton = (props) => <LayerIcon {...props} src={eyeIcon} />
const LockButton = () => <LayerIcon src={lockIcon} />;
const OnionSkinButton = (props) => <LayerIcon {...props} src={onionIcon} />;

const AddFrameButton = (props) => <LayerIcon {...props} active src={newFrameIcon} />;

const LayerLabel = styled.input`
  flex-grow: 1;
  width: 90px;
  border: none;
  background-color: inherit;
  filter: brightness(120%);
`;

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

const FrameContextMenu = ({onConvertToKeyFrame, onExtendClick, onDeleteFrameClick}) => {
  const {position, showMenu, contextMenuTarget} = useContextMenu({
    onRightClick: event => event.target.dataset.type === 'FRAME'
  });

  const handleConvertToKeyFrame = () => onConvertToKeyFrame({
    layerIndex: parseInt(contextMenuTarget.dataset.layerIndex),
    frameNumber: parseInt(contextMenuTarget.dataset.frameNumber)
  });

  const handleExtend = () => onExtendClick({
    layerIndex: parseInt(contextMenuTarget.dataset.layerIndex),
    frameNumber: parseInt(contextMenuTarget.dataset.frameNumber)
  });

  const handleDelete = () => onDeleteFrameClick({
    layerIndex: parseInt(contextMenuTarget.dataset.layerIndex),
    frameNumber: parseInt(contextMenuTarget.dataset.frameNumber)
  });
  
  return (
    <FrameContextMenuContainer show={showMenu} position={position}>
      <Button onClick={handleConvertToKeyFrame}>Convertir en cuadro clave</Button>
      <Button onClick={handleExtend}>Extender cuadro</Button>
      <Button onClick={handleDelete}>Borrar cuadro</Button>
    </FrameContextMenuContainer>
  );
};

const Layer = ({index, name, isActive, isVisible, hasOnionSkinEnabled, onLayerNameChanged, onAddFrameClick, onVisibilityClick, onOnionSkinClick}) =>
  <StyledLayer isActive={isActive}>
    <Row>
      <LockButton />
      <VisibilityButton active={isVisible} onClick={() => onVisibilityClick(index)}/>
      <OnionSkinButton active={hasOnionSkinEnabled} onClick={() => onOnionSkinClick(index)}/>
    </Row>
    
    <LayerLabel value={name} onChange={event => onLayerNameChanged(index, event.target.value)}/>
    
    <AddFrameButton onClick={() => onAddFrameClick(index)} />
  </StyledLayer>


const Timeline = ({
  currentFrameNumber,
  lastFrameNumber,
  layersDetails,
  onLayerClick,
  onLayerNameChanged,
  onAddFrameClick,
  onVisibilityClick,
  onOnionSkinClick,
  onFrameClick,
  onCreateLayerClick,

  onConvertFrameToKeyFrame,
  onExtendFrameClick,
  onDeleteFrameClick
}) => {
  return (
    <>
      <FrameContextMenu
        onConvertToKeyFrame={onConvertFrameToKeyFrame}
        onExtendClick={onExtendFrameClick}
        onDeleteFrameClick={onDeleteFrameClick}
      />
      
      <div>
        <button onClick={onCreateLayerClick}>Crear capa</button>
      </div>
      
      <LayersContainer>
        {layersDetails.map((layersDetail, layerIndex) =>
          <Row onClick={() => onLayerClick(layerIndex)}>
            <Layer
              index={layerIndex}
              name={layersDetail.name}
              isActive={layersDetail.isActive}
              isVisible={layersDetail.isVisible}
              hasOnionSkinEnabled={layersDetail.hasOnionSkinEnabled}
              onLayerNameChanged={onLayerNameChanged}
              onAddFrameClick={onAddFrameClick}
              onVisibilityClick={onVisibilityClick}
              onOnionSkinClick={onOnionSkinClick}
            />
            <FramesContainer>
              {layersDetail.frames.map(frame =>
                <Frame
                  data-type={'FRAME'}
                  data-layer-index={layerIndex}
                  data-frame-number={frame.number}
                  isCurrentFrame={frame.number === currentFrameNumber}
                  isEmpty={frame.isEmpty}
                  isKeyFrame={frame.isKeyFrame}
                  onClick={() => onFrameClick({layerIndex, frameNumber: frame.number})}
                />)}
              
              {new Array(lastFrameNumber - layersDetail.frames.length)
                .fill()
                .map((_, index) => {
                  const frame = {number: layersDetail.frames.length + index + 1};
                  return <Frame
                            isCurrentFrame={frame.number === currentFrameNumber}
                            isEmpty={true}
                            isNonExistingFrame={true}
                            onClick={() => onFrameClick({layerIndex, frameNumber: frame.number})}
                          />;
                })}
            </FramesContainer>
          </Row>
        )}
      </LayersContainer>
    </>
  );
};

export default Timeline;