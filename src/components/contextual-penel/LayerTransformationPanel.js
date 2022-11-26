import Column from '../Column';
import Row from '../Row';
import {Label, Input} from '../input/Input';

export function LayerTransformationPanel({caminiToons}) {
    // TODO: CORREGIR ESTO. ES UN ASCO y se rompe el encapsulamiento por todos lados
    const activeLayerIndex = caminiToons.model._animationDocument._activeLayerIndex;
    const currentFrameNumber = caminiToons.model.currentFrameNumber;

    const layer = caminiToons.model._animationDocument.flattenLayers[activeLayerIndex];
    
    if (!layer.isTransformationLayer()) {
        return <></>
    }
    
    const handleXChange = (newValue) => {
        caminiToons.model.changeTransformationKeyFrameValue({
            layerIndex: activeLayerIndex,
            frameNumber: currentFrameNumber,
            x: newValue
        });
    };

    const handleYChange = (newValue) => {
        caminiToons.model.changeTransformationKeyFrameValue({
            layerIndex: activeLayerIndex,
            frameNumber: currentFrameNumber,
            y: newValue
        });
    };

    const entryForX = layer._frames.x[currentFrameNumber - 1];
    const entryForY = layer._frames.y[currentFrameNumber - 1];

    return (
        <div>
            <h2>Transformaciones</h2>
            <Column style={{gap: '10px'}}>
                {entryForX != null
                    ?
                    <Row>
                        <Label>x</Label>
                        <Input
                            type="number"
                            value={entryForX.value}
                            onChange={event => handleXChange(parseInt(event.target.value))}
                        />
                    </Row>
                    : <></>}
                
                {entryForY != null
                    ?
                    <Row>
                        <Label>y</Label>
                        <Input
                            type="number"
                            value={entryForY.value}
                            onChange={event => handleYChange(parseInt(event.target.value))}
                        />
                    </Row>
                    : <></>}
            </Column>
        </div>
    )
}