import styled from 'styled-components';

import Row from '../Row';
import {Icon} from '../Icon';

import playIcon from '../../assets/timeline/play.svg';
import repeatIcon from '../../assets/timeline/repeat.svg';

const PlaybackIcon = styled(Icon)`
  width: 25px;
  height: 25px;
`;

const FrameRateInput = styled.input`
  margin: 3px;
  width: 20px;
  text-align: end;
`;

const PlayButton = (props) => <PlaybackIcon {...props} src={playIcon} />;
const RepeatButton = (props) => <PlaybackIcon {...props} src={repeatIcon} />;

const FrameRateDisplay = ({frameRate}) =>
  <div>
    <strong>Frame rate:</strong><FrameRateInput value={frameRate} /> fps
  </div>;

const PlaybackBarContainer = styled(Row)`
  padding: 5px;
  background-color: gold;
  align-items: center;
`;

export const PlaybackBar = ({frameRate, onPlay, onRepeat}) =>
    <PlaybackBarContainer>
        <PlayButton active onClick={onPlay} />
        <RepeatButton active onClick={onRepeat} />
        <FrameRateDisplay frameRate={frameRate} />
    </PlaybackBarContainer>;