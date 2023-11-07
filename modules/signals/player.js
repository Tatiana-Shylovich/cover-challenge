export function playSignalAudio(signal) {
  const signalAudio = new Audio();
  signalAudio.volume = 1;
  signalAudio.src = signal;
  signalAudio.currentTime = 0;
  signalAudio.play();
}