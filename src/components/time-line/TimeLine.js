import styled from 'styled-components';

import {Card} from '../Card';
import Column from '../Column';
import Row from '../Row';
import {Layer} from './Layer'
import {Frame} from './Frame'
import {FrameContextMenu} from './FrameContextMenu'

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
        <button onClick={caminiToons.handleCreateLayerClick}>Crear capa</button>
      </div>
      
      <LayersContainer>
        {caminiToons.layersDetails.map((layersDetail, layerIndex) => {
          const LayerRow = layersDetail.type === 'TransformationLayer' ? TransformationLayerRow : AnimationLayerRow;
          
          return <LayerRow layerIndex={layerIndex} layersDetail={layersDetail} caminiToons={caminiToons} onClick={() => caminiToons.handleActivateLayer(layerIndex)}/>
        }
          
          // {layersDetail.type !== 'TransformationLayer'
          //   ? <AnimationLayerRow layerIndex={layerIndex} layersDetail={layersDetail} caminiToons={caminiToons} onClick={() => caminiToons.handleActivateLayer(layerIndex)}/>
          //   : <TransformationLayerRow layerIndex={layerIndex} layersDetail={layersDetail} caminiToons={caminiToons}/>}
        )}
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
      <FramesContainer>
        <Frame
          isCurrentFrame={false}
          isEmpty={true}
          isNonExistingFrame={true}
          onClick={() => caminiToons.handleGoToFrame({layerIndex, frameNumber: 1})}
        />
      </FramesContainer>
      
      {/* {
        <AnimationLayerRow layerIndex={layerIndex} layersDetail={layersDetail} caminiToons={caminiToons} onClick={() => caminiToons.handleActivateLayer(layerIndex)}/>
      } */}

    {/* {layersDetail.children.map((child, childIndex) => <AnimationLayerRow layerIndex={childIndex} layersDetail={child} caminiToons={caminiToons}/>)} */}
    {/* <div>
      <div>Capa de transformacion</div>
      <div>{JSON.stringify(layersDetail)}</div>
      {layersDetail.children.map((child, childIndex) => <AnimationLayerRow layerIndex={childIndex} layersDetail={child} caminiToons={caminiToons}/>)}
    </div> */}
    </Row>
  );
}

function AnimationLayerRow({layerIndex, layersDetail, caminiToons, onClick}) {
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