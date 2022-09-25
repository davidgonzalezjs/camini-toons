import styled from 'styled-components';

import lockIcon from '../../assets/layer/lock.svg';
import onionIcon from '../../assets/layer/onion.svg';
import eyeIcon from '../../assets/layer/eye.svg';

import {Icon} from '../Icon'

import newFrameIcon from '../../assets/layer/new-frame.svg';

import Column from '../Column'
import Row from '../Row'
import {Frame} from './Frame'

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


const Timeline = ({ currentFrameNumber, lastFrameNumber, layersDetails, onLayerClick, onLayerNameChanged, onAddFrameClick, onVisibilityClick, onOnionSkinClick, onFrameClick, onCreateLayerClick }) => {
  return (
    <>
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
              {layersDetail.frames.map(frame => <Frame isCurrentFrame={frame.number === currentFrameNumber} onClick={() => onFrameClick({layerIndex, frameNumber: frame.number})}/>)}
              {new Array(lastFrameNumber - layersDetail.frames.length)
                .fill()
                .map((_, index) => {
                  const frame = {number: layersDetail.frames.length + index + 1};
                  return <Frame isCurrentFrame={frame.number === currentFrameNumber} isEmpty={true} onClick={() => onFrameClick({layerIndex, frameNumber: frame.number})}/>;
                })}
            </FramesContainer>
          </Row>
        )}
      </LayersContainer>
    </>
  );
};

export default Timeline;