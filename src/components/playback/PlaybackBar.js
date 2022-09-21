import styled from 'styled-components';

import Row from '../Row';
import {Icon} from '../Icon';

import playIcon from '../../assets/timeline/play.svg';
import repeatIcon from '../../assets/timeline/repeat.svg';

const PlaybackIcon = styled(Icon)`
  width: 25px;
  height: 25px;
`;

const FrameRateInput = styled.input.attrs({ type: 'number' })`
  margin: 3px;
  width: 40px;
  text-align: end;
`;

const PlayButton = (props) => <PlaybackIcon {...props} src={playIcon} />;
const RepeatButton = (props) => <PlaybackIcon {...props} src={repeatIcon} />;

const FrameRateDisplay = ({frameRate, onFrameRateChage}) =>
  <div>
    <strong>Frame rate:</strong><FrameRateInput value={frameRate} onChange={onFrameRateChage} /> fps
  </div>;

const PlaybackBarContainer = styled(Row)`
  padding: 5px;
  background-color: gold;
  align-items: center;
`;

export const PlaybackBar = ({currentFrameNumber, frameRate, isPlayingOnALoop, onFrameRateChage, onPlay, onRepeat}) =>
    <PlaybackBarContainer>
        <PlayButton active onClick={onPlay} />
        <RepeatButton active={isPlayingOnALoop} onClick={onRepeat} />
        <FrameRateDisplay frameRate={frameRate} onFrameRateChage={onFrameRateChage} />
        <div>
          <strong>Frame actual: </strong>{currentFrameNumber}
        </div>
    </PlaybackBarContainer>;