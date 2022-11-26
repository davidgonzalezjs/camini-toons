import styled from 'styled-components';

import Row from '../Row'

import lockIcon from '../../assets/layer/lock.svg';
import onionIcon from '../../assets/layer/onion.svg';
import eyeIcon from '../../assets/layer/eye.svg';

import {Icon} from '../Icon'

import newFrameIcon from '../../assets/layer/new-frame.svg';


const VisibilityButton = (props) => <LayerIcon {...props} src={eyeIcon} />
const LockButton = () => <LayerIcon src={lockIcon} />;
const OnionSkinButton = (props) => <LayerIcon {...props} src={onionIcon} />;

const AddFrameButton = (props) => <LayerIcon {...props} active src={newFrameIcon} />;

const LayerIcon = styled(Icon)`
  opacity: ${props => props.active ?  1 : 0.4 };
  width: 25px;
  height: 25px;
`;

const LayerLabel = styled.input`
  flex-grow: 1;
  width: 90px;
  border: none;
  background-color: inherit;
  filter: brightness(120%);
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

export const Layer = ({index, layersDetails, onLayerNameChanged, onAddFrameClick, onVisibilityClick, onOnionSkinClick}) =>
  <StyledLayer isActive={layersDetails.isActive} data-type={'LAYER'}>
    <Row>
      <LockButton />
      <VisibilityButton active={layersDetails.isVisible} onClick={() => onVisibilityClick(index)}/>
      <OnionSkinButton active={layersDetails.hasOnionSkinEnabled} onClick={() => onOnionSkinClick(index)}/>
    </Row>
    
    <LayerLabel value={layersDetails.name} onChange={event => onLayerNameChanged(index, event.target.value)}/>
    
    <AddFrameButton onClick={() => onAddFrameClick(index)} />
  </StyledLayer>