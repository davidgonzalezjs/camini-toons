import Column from '../Column';
import Row from '../Row';
import {Label, Input} from '../input/Input';

export function LayerTransformationPanel({caminiToons}) {
    // TODO: CORREGIR ESTO. ES UN ASCO
    const layerIndex = 0;
    const currentFrameNumber = caminiToons.model.currentFrameNumber;

    const transformationLayer = caminiToons.model._animationDocument._layers[layerIndex];
    
    const entryForX = transformationLayer._frames.x[currentFrameNumber - 1];

    const handleXChange = (newValue) => {
        caminiToons.model.changeKeyTransformationFrameValue({
            layerIndex,
            frameNumber: currentFrameNumber,
            x: newValue
        });
    };

    return (
        <div>
            <h2>Transformaciones</h2>
            <Column style={{gap: '10px'}}>
            <Row>
                {entryForX != null
                    ?
                    <>
                        <Label>x</Label>
                        <Input
                            type="number"
                            value={entryForX.value}
                            onChange={event => handleXChange(parseInt(event.target.value))}
                        />
                    </>
                    : <></>}
            </Row>
        </Column>
        </div>
    )
}