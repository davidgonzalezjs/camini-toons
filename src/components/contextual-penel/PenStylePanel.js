import Column from '../Column';
import Row from '../Row';
import {Label, Input, ColorPicker} from '../input/Input';

export function PenStylePanel({penStyle, onChange}) {
    
    return (
        <div>
            <h2>Lapiz</h2>
            <Column style={{gap: '10px'}}>
            <Row>
                <Label>Color</Label>
                <ColorPicker color={penStyle.strokeColor} onChange={color => onChange({strokeColor: color})} />
            </Row>
            <Row>
                <Label>Grosor</Label>
                <Input type="number" value={penStyle.strokeWidth} min="0.1" onChange={event => onChange({strokeWidth: event.target.value})} />
            </Row>
            <Row>
                <Label>Suavizado</Label>
                <Input type="number" value={penStyle.smoothing} min="0" onChange={event => onChange({smoothing: event.target.value})} />
            </Row>
        </Column>
        </div>
    )
}