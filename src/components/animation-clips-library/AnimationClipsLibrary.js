import {CreateAnimationClipBar} from './CreateAnimationClipBar';
import {InsertAnimationClipBar} from './InsertAnimationClipBar';

export const AnimationClipsLibrary = ({caminiToons}) =>
  <>
    <CreateAnimationClipBar
      onAccept={caminiToons.handleExtractToAnimationClip}
      layersDetails={caminiToons.layersDetails}
    />
    <InsertAnimationClipBar
      onAccept={caminiToons.handleInsertAnimation}
      animationClipsDetails={caminiToons.animationClipsDetails}
      layersDetails={caminiToons.layersDetails}
    />
  </>;