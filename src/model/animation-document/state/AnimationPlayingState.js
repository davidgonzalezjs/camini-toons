class AnimationPlayingState {

  tickFor(anAnimationDocument) {
    if (anAnimationDocument.isPlayingOnALoop()) {
      if (anAnimationDocument.isAtLastFrame()) {
        anAnimationDocument.goToFrame(1);
      }
      else {
        anAnimationDocument.goToNextFrame();
      }
    }
    else {
      if (anAnimationDocument.isAtLastFrame()) {
        anAnimationDocument.stopPlaying();
      }
      else {
        anAnimationDocument.goToNextFrame();
      }
    }
  }

  
}

export default AnimationPlayingState;