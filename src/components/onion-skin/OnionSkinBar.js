import {InputContainer, InputGroup, InputCell, Label, Input, ColorPicker} from '../input/Input';

export const OnionSkinBar = ({onionSkinSettings, onChange}) => {
  return (
    <InputContainer>
        <InputGroup>
            <InputCell>
                <Label>Color anterior</Label>
            </InputCell>

            <InputCell>
                <ColorPicker color={onionSkinSettings.beforeColor} onChange={color => onChange({...onionSkinSettings, beforeColor: color})}/>
            </InputCell>
        </InputGroup>

        <InputGroup>
            <InputCell>
                <Label>Color siguiente</Label>
            </InputCell>

            <InputCell>
                <ColorPicker color={onionSkinSettings.afterColor} onChange={color => onChange({...onionSkinSettings, afterColor: color})}/>
            </InputCell>
        </InputGroup>

        <InputGroup>
            <InputCell>
                <Label>Cuadros previos</Label>
            </InputCell>

            <InputCell>
                <Input type="number" min="0" value={onionSkinSettings.numberOfFramesBefore} onChange={event => onChange({...onionSkinSettings, numberOfFramesBefore: parseInt(event.target.value)})}/>
            </InputCell>    
        </InputGroup>

        <InputGroup>
            <InputCell>
                <Label>Color siguiente</Label>
            </InputCell>

            <InputCell>
                <Input type="number" min="0" value={onionSkinSettings.numberOfFramesAfter} onChange={event => onChange({...onionSkinSettings, numberOfFramesAfter: parseInt(event.target.value)})}/>
            </InputCell>
        </InputGroup>

        <InputGroup>
            <InputCell>
                <Label>Opacidad</Label>
            </InputCell>
            <InputCell>
                <Input type="number" min="0" value={onionSkinSettings.opacityStep} onChange={event => onChange({...onionSkinSettings, opacityStep: parseFloat(event.target.value)})}/>
            </InputCell>
        </InputGroup>
    </InputContainer>
  );
}