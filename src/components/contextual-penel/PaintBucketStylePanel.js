import {InputContainer, InputGroup, InputCell, Label, Input, ColorPicker} from '../input/Input';


export function PaintBucketStylePanel({paintBucketStyle, onChange}) {
    return (
        <>
            <h2>Tarro de pintura</h2>
            <InputContainer>
                <InputGroup>
                    <InputCell>
                        <Label>Color de relleno</Label>
                    </InputCell>

                    <InputCell>
                        <ColorPicker color={paintBucketStyle.fillColor} onChange={color => onChange({fillColor: color})} />
                    </InputCell>
                </InputGroup>
            </InputContainer>
        </>
    )
}