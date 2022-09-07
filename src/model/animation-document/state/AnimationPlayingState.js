class AnimationPlayingState {

  onFrame(anAnimationDocument) {
    if (anAnimationDocument.isAtLastFrame()) {
      anAnimationDocument.stopPlaying();
    }
    else {
      anAnimationDocument.goToNextFrame();
    }
  }

  
}

export default AnimationPlayingState;