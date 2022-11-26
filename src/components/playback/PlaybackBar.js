import styled from 'styled-components';

import {CardRow} from '../Card';
import {Icon} from '../Icon';

import playIcon from '../../assets/timeline/play.svg';
import stopIcon from '../../assets/timeline/stop.png';
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
const StopButton = (props) => <PlaybackIcon {...props} src={stopIcon} />;
const RepeatButton = (props) => <PlaybackIcon {...props} src={repeatIcon} />;

const FrameRateDisplay = ({frameRate, onFrameRateChage}) =>
  <div>
    <strong>Frame rate:</strong><FrameRateInput value={frameRate} onChange={onFrameRateChage} /> fps
  </div>;

const PlaybackBarContainer = styled(CardRow)`
  padding: 5px;
  background-color: gold;
`;

export const PlaybackBar = ({caminiToons}) =>
    <PlaybackBarContainer row>
        <PlayButton active={!caminiToons.isPlaying} onClick={caminiToons.handlePlayAnimation} />
        <StopButton active={caminiToons.isPlaying} onClick={caminiToons.handleStopAnimation} />
        <RepeatButton active={caminiToons.isPlayingOnALoop} onClick={caminiToons.handleRepeatAnimation} />
        <FrameRateDisplay frameRate={caminiToons.frameRate} onFrameRateChage={event => caminiToons.handleChangeFrameRate(parseInt(event.target.value))} />
        <div>
          <strong>Frame actual: </strong>{caminiToons.currentFrameNumber}
        </div>
    </PlaybackBarContainer>;