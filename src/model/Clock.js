class Clock {

  constructor({ frameRate }) {
    this._frameRate = frameRate;
  }

  get frameDurationInSeconds() {
    return 1 / this._frameRate;
  }

  tick(elapsedTimeInSeconds, newFrameHandler) {
    if (this.isNewFrame(elapsedTimeInSeconds)) {
        newFrameHandler();    
        this._lastFrameAnimationTime = elapsedTimeInSeconds;
    }
  }

  isNewFrame(elapsedTimeInSeconds) {
    this._lastFrameAnimationTime = this._lastFrameAnimationTime || elapsedTimeInSeconds;
    
    return elapsedTimeInSeconds > this._lastFrameAnimationTime + this.frameDurationInSeconds;
  }

}

export default Clock;