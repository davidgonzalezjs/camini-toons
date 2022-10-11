import {InputContainer, InputGroup, InputCell, Label, Input, ColorPicker} from '../input/Input';


export function PenStylePanel({penStyle, onChange}) {
    return (
        <>
            <h2>Lapiz</h2>
            <InputContainer>
                <InputGroup>
                    <InputCell>
                        <Label>Color de linea</Label>
                    </InputCell>

                    <InputCell>
                        <ColorPicker color={penStyle.strokeColor} onChange={color => onChange({strokeColor: color})} />
                    </InputCell>
                </InputGroup>

                <InputGroup>
                    <InputCell>
                        <Label>Grosor</Label>
                    </InputCell>

                    <InputCell>
                        <Input type="number" value={penStyle.strokeWidth} min="0.1" onChange={event => onChange({strokeWidth: event.target.value})} />
                    </InputCell>
                </InputGroup>

                <InputGroup>
                    <InputCell>
                        <Label>Suavizado</Label>
                    </InputCell>
                    
                    <InputCell>
                        <Input type="number" value={penStyle.smoothing} min="0" onChange={event => onChange({smoothing: event.target.value})} />
                    </InputCell>
                </InputGroup>
            </InputContainer>
        </>
    )
}