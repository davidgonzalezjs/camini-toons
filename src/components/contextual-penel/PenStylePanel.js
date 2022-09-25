import styled from 'styled-components';

import Column from '../Column';
import Row from '../Row';

const Label = styled.label`
    width: 90px;
`;

const Input = styled.input`
    width: 90px;
`;

const ColorInput = styled(Input)`
    padding: 0;
    margin: 3px;
    border: none;
`;

export function PenStylePanel({penStyle, onChange}) {
    
    return (
        <div>
            <h2>Lapiz</h2>
            <Column style={{gap: '10px'}}>
            <Row>
                <Label>Color</Label>
                <ColorInput type="color" value={penStyle.strokeColor} onChange={event => onChange({strokeColor: event.target.value})} />
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