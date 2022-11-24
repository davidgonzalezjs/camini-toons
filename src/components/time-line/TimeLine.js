import styled from 'styled-components';

import {Button} from '../input/Input';
import {Card} from '../Card';
import Row from '../Row';
import {Layer} from './Layer';
import {Frame} from './Frame';

import {FrameContextMenu} from './FrameContextMenu';

const LayersContainer = styled(Card)`
  align-items: stretch;
`;

const FramesContainer = styled(Row)`
  flex-grow: 1;
  background-color: lightgreen;
  border: 1px solid darkgreen;
`;

const Timeline = ({caminiToons}) => {
  return (
    <>
      <FrameContextMenu caminiToons={caminiToons}/>

      <div>
        <Button onClick={caminiToons.handleCreateLayerClick}>Crear capa</Button>
      </div>
      
      <LayersContainer>
        {caminiToons.layersDetails.map((layersDetail, layerIndex) => {
          const LayerRow = layersDetail.type === 'TransformationLayer' ? TransformationLayerRow : AnimationLayerRow;
          
          return (
            <LayerRow
              layerIndex={layerIndex}
              layersDetail={layersDetail}
              caminiToons={caminiToons}
              onClick={() => caminiToons.handleActivateLayer(layerIndex)}
            />
          );
        })}
      </LayersContainer>
    </>
  );
};

function TransformationLayerRow({layerIndex, layersDetail, caminiToons, onClick}) {
  return (
    <Row onClick={onClick}>
      <Layer
        index={layerIndex}
        layersDetails={layersDetail}
        onLayerNameChanged={caminiToons.handleChangeLayerName}
        onAddFrameClick={caminiToons.handleCreateFrame}
        onVisibilityClick={caminiToons.handleToggleVisibility}
        onOnionSkinClick={caminiToons.handleToggleOnionSkin}
      />
      {/* <div>{JSON.stringify(layersDetail.frames.x)}</div> */}
      <FramesContainer>
        {layersDetail.frames.x.map(frame =>
          <Frame
            data-type={'FRAME'}
            data-layer-index={layerIndex}
            data-frame-number={frame.number}
            
            isCurrentFrame={frame.number === caminiToons.currentFrameNumber}
            isEmpty={frame.isEmpty} // TODO: ver que hacer con esto para capa de transformacion
            isKeyFrame={frame.isKeyFrame}
            isTransformationFrame={true}
            
            onClick={() => caminiToons.handleGoToFrame({layerIndex, frameNumber: frame.number})}
          />)}
        
        {new Array(caminiToons.lastFrameNumber - layersDetail.frames.x.length)
          .fill()
          .map((_, index) => {
            const frame = {number: layersDetail.frames.x.length + index + 1};
            
            return <Frame
                      data-type={'FRAME'}
                      data-layer-index={layerIndex}
                      data-frame-number={frame.number}
                      
                      isCurrentFrame={frame.number === caminiToons.currentFrameNumber}
                      isEmpty={true}
                      isKeyFrame={false}
                      isNonExistingFrame={true}
                      isTransformationFrame={true}
            
                      onClick={() => caminiToons.handleGoToFrame({layerIndex, frameNumber: frame.number})}
                    />;
          })}
      </FramesContainer>
    </Row>
  );
}

function AnimationLayerRow({layerIndex, layersDetail, caminiToons, onClick}) {
  return (
    <Row onClick={onClick}>
      <Layer
        data-type={'LAYER'}
        index={layerIndex}
        layersDetails={layersDetail}
        onLayerNameChanged={caminiToons.handleChangeLayerName}
        onAddFrameClick={caminiToons.handleCreateFrame}
        onVisibilityClick={caminiToons.handleToggleVisibility}
        onOnionSkinClick={caminiToons.handleToggleOnionSkin}
      />
      <FramesContainer>
        {layersDetail.frames.map(frame =>
          <Frame
            data-type={'FRAME'}
            data-layer-index={layerIndex}
            data-frame-number={frame.number}
            isCurrentFrame={frame.number === caminiToons.currentFrameNumber}
            isEmpty={frame.isEmpty}
            isKeyFrame={frame.isKeyFrame}
            isAnimationClip={frame.isAnimationClip}
            onClick={() => caminiToons.handleGoToFrame({layerIndex, frameNumber: frame.number})}
          />)}
        
        {new Array(caminiToons.lastFrameNumber - layersDetail.frames.length)
          .fill()
          .map((_, index) => {
            const frame = {number: layersDetail.frames.length + index + 1};
            return <Frame
                      isCurrentFrame={frame.number === caminiToons.currentFrameNumber}
                      isEmpty={true}
                      isNonExistingFrame={true}
                      onClick={() => caminiToons.handleGoToFrame({layerIndex, frameNumber: frame.number})}
                    />;
          })}
      </FramesContainer>
    </Row>
  );
}

export default Timeline;