import Row from '../Row';
import {Label, Input, ColorPicker} from '../input/Input';

export const OnionSkinBar = ({onionSkinSettings, onChange}) => {
  return (
    <Row>
        <Row>
            <Label>Color anterior</Label>
            <ColorPicker color={onionSkinSettings.beforeColor} onChange={color => onChange({...onionSkinSettings, beforeColor: color})}/>
        </Row>
        <Row>
            <Label>Color siguiente</Label>
            <ColorPicker color={onionSkinSettings.afterColor} onChange={color => onChange({...onionSkinSettings, afterColor: color})}/>
        </Row>

        <Row>
            <Label>Cuadros previos</Label>
            <Input type="number" min="0" value={onionSkinSettings.numberOfFramesBefore} onChange={event => onChange({...onionSkinSettings, numberOfFramesBefore: parseInt(event.target.value)})}/>
        </Row>

        <Row>
            <Label>Color siguiente</Label>
            <Input type="number" min="0" value={onionSkinSettings.numberOfFramesAfter} onChange={event => onChange({...onionSkinSettings, numberOfFramesAfter: parseInt(event.target.value)})}/>
        </Row>

        <Row>
            <Label>Opacidad</Label>
            <Input type="number" min="0" value={onionSkinSettings.opacityStep} onChange={event => onChange({...onionSkinSettings, opacityStep: parseFloat(event.target.value)})}/>
        </Row>
    </Row>
  );
}