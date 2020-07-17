export default function AnimationController(...animationReceivers) {
  let animationStartTimestamp = +new Date();
  requestAnimationFrame(_animate);
  function _animate(timestamp) {
    let absTimestamp = animationStartTimestamp + timestamp;
    animationReceivers.forEach((receiver) => {
      receiver.animate(absTimestamp);
    });
    requestAnimationFrame(_animate);
  }
}