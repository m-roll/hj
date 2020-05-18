export default class AnimationController {
  constructor(...animationReceivers) {
    this.animationReceivers = animationReceivers;
    this.animationStartTimestamp = +new Date();
    requestAnimationFrame(this._animate.bind(this));
  }
  _animate(timestamp) {
    let absTimestamp = this.animationStartTimestamp + timestamp;
    this.animationReceivers.forEach((receiver) => {
      receiver.animate(absTimestamp);
    });
    requestAnimationFrame(this._animate.bind(this));
  }
}