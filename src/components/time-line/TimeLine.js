import styled from 'styled-components';

import lockIcon from '../../assets/layer/lock.svg';
import onionIcon from '../../assets/layer/onion.svg';
import eyeIcon from '../../assets/layer/eye.svg';

import {Icon} from '../Icon'

import newFrameIcon from '../../assets/layer/new-frame.svg';

import Row from '../Row'
import Frame from './Frame'

const TimeLineRow = styled(Row)`
  height: 40px;
  align-items: stretch;
`;

const StyledLayer = styled(Row)`
  align-items: center;
  padding-left: 5px;
  padding-right: 5px;
  background-color: orange;
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


const Layer = ({index, name, isVisible, hasOnionSkinEnabled, onLayerNameChanged, onAddFrameClick, onVisibilityClick, onOnionSkinClick}) =>
  <StyledLayer>
    <Row>
      <LockButton />
      <VisibilityButton active={isVisible} onClick={onVisibilityClick}/>
      <OnionSkinButton active={hasOnionSkinEnabled} onClick={onOnionSkinClick}/>
    </Row>
    
    <LayerLabel value={name} onChange={event => onLayerNameChanged(index, event.target.value)}/>
    
    <AddFrameButton onClick={() => onAddFrameClick(name)} />
  </StyledLayer>


const Timeline = ({ layersDetails, onLayerNameChanged, onAddFrameClick, onVisibilityClick, onOnionSkinClick, onFrameClick }) => {
  return (
    <TimeLineRow>
      {layersDetails.map((layersDetail, index) =>
        <>
          <Layer
            index={index}
            name={layersDetail.name}
            isVisible={layersDetail.isVisible}
            hasOnionSkinEnabled={layersDetail.hasOnionSkinEnabled}
            onLayerNameChanged={onLayerNameChanged}
            onAddFrameClick={onAddFrameClick}
            onVisibilityClick={onVisibilityClick}
            onOnionSkinClick={onOnionSkinClick}
          />
          <FramesContainer>
            {layersDetail.frames.map(frame => <Frame onClick={() => onFrameClick(frame)}/>)}    
          </FramesContainer>
        </>
      )}
    </TimeLineRow>
  );
};

export default Timeline;