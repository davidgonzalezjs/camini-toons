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

const VisibilityButton = () => <LayerIcon src={eyeIcon} active />
const LockButton = () => <LayerIcon src={lockIcon} />;
const OnionSkinButton = () => <LayerIcon src={onionIcon} />;

const AddFrameButton = (props) => <LayerIcon {...props} active src={newFrameIcon} />;

const LayerLabel = styled.p`
  flex-grow: 1;
`;


const Layer = ({name, onAddFrameClick}) =>
  <StyledLayer>
    <Row>
      <LockButton />
      <VisibilityButton />
      <OnionSkinButton />
    </Row>
    
    <LayerLabel>{name}</LayerLabel>
    
    <AddFrameButton onClick={() => onAddFrameClick(name)} />
  </StyledLayer>


const Timeline = ({ frames, onAddFrameClick, onFrameClick }) => {
  return (
    <TimeLineRow>
      <Layer name={'Layer 1'} onAddFrameClick={onAddFrameClick} />
      <FramesContainer>
        {frames.map(frame => <Frame onClick={() => onFrameClick(frame)}/>)}    
      </FramesContainer>
    </TimeLineRow>
  );
};

export default Timeline;