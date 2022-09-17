class AnimationPlayingState {

  tickFor(anAnimationDocument) {
    if (anAnimationDocument.isAtLastFrame()) {
      anAnimationDocument.stopPlaying();
    }
    else {
      anAnimationDocument.goToNextFrame();
    }
  }

  
}

export default AnimationPlayingState;