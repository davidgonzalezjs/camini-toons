import {CreateAnimationClipBar} from './CreateAnimationClipBar';
import {InsertAnimationClipBar} from './InsertAnimationClipBar';

export const AnimationClipsLibrary = ({caminiToons}) =>
  <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
    <CreateAnimationClipBar
      onAccept={caminiToons.handleExtractToAnimationClip}
      layersDetails={caminiToons.layersDetails}
    />
    <InsertAnimationClipBar
      onAccept={caminiToons.handleInsertAnimation}
      animationClipsDetails={caminiToons.animationClipsDetails}
      layersDetails={caminiToons.layersDetails}
    />
  </div>;