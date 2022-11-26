import Optional from './Optional';

class Clock {

  constructor({ frameRate }) {
    this._frameRate = frameRate;
    this._listener = Optional.empty();
  }

  get frameRate() {
    return this._frameRate;
  }

  get frameDurationInSeconds() {
    return 1 / this.frameRate;
  }

  changeFrameRateTo(aFrameRate) {
    this._frameRate = aFrameRate;
  }

  registerListener(aListener) {
    this._listener = Optional.with(aListener);
  }

  onTimePass(elapsedTimeInSeconds) {
    if (this.isNewFrame(elapsedTimeInSeconds)) {
      this.tick(elapsedTimeInSeconds);
    }
  }

  isNewFrame(elapsedTimeInSeconds) {
    this._lastFrameAnimationTime = this._lastFrameAnimationTime || elapsedTimeInSeconds;
    
    return elapsedTimeInSeconds > this._lastFrameAnimationTime + this.frameDurationInSeconds;
  }

  tick(elapsedTimeInSeconds) {
    this._listener.ifPresent(listener => listener.tick());
    this._lastFrameAnimationTime = elapsedTimeInSeconds;
  }

}

export default Clock;