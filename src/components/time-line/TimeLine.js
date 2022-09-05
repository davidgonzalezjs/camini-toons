import styled from 'styled-components';

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
  width: 200px;
  border: 1px solid crimson;
  background-color: orange;
`;

const LayerLabel = styled.p`
  flex-grow: 1;
`;

const Layer = ({name, onAddFrameClick}) =>
  <StyledLayer>
    <LayerLabel>{name}</LayerLabel>
    <button onClick={() => onAddFrameClick(name)}>Add frame</button>
  </StyledLayer>

const Timeline = ({ frames, onAddFrameClick, onFrameClick }) => {
  return (
    <TimeLineRow>
      <Layer name={'Layer 1'} onAddFrameClick={onAddFrameClick} />
      <Row>
        {frames.map(frame => <Frame onClick={() => onFrameClick(frame)}/>)}    
      </Row>
    </TimeLineRow>
  );
};

export default Timeline;