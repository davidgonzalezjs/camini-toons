import Column from '../Column';
import Row from '../Row';
import {Label, Input} from '../input/Input';

export function EraserStylePanel({eraserStyle, onChange}) {
    
    return (
        <div>
            <h2>Goma de borrar</h2>
            <Column style={{gap: '10px'}}>
            <Row>
                <Label>Grosor</Label>
                <Input type="number" value={eraserStyle.radius} min="0.1" onChange={event => onChange({radius: event.target.value})} />
            </Row>
        </Column>
        </div>
    )
}