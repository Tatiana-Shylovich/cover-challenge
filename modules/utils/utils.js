export function convertDuration(duration) {
  const minutes = Math.trunc(duration / 60);
  const seconds = Math.floor(duration) < 60 ? Math.floor(duration) : Math.floor(duration % 60);
  const convertedDuration = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  return convertedDuration;
}
export function getNewVolumeWidth(value) {
  const newWidth = (value * 100) + '%';
  return newWidth;
}

export function getNewProgressWidth(time, duration) {
  const newWidth = (time * 100 / duration) + '%';
  return newWidth;
}

export function getChangedVolume(event) {
  const barWidth = window.getComputedStyle(event.currentTarget).width;
  const newVolume = event.offsetX / parseInt(barWidth, 10);
  return newVolume;
}

export function getMaxTrackIndex(trackGroup) {
  const maxTrackIndex = trackGroup.length - 1;
  return maxTrackIndex;
}

export function getMaxTrackGroupIndex(groupsOfTracks) {
  const maxTrackGroupIndex = groupsOfTracks.length - 1;
  return maxTrackGroupIndex;
}

export function getChangedAudioProgress(event, audioDuration) {
  const progressBarWidth = window.getComputedStyle(event.currentTarget).width;
  const newProgress = event.offsetX / parseInt(progressBarWidth, 10) * audioDuration;
  return newProgress;
}

export function detectTrackAudioDuration(track, duration, element) {
  track.onloadeddata = function() {
    duration = this.duration;
    showTrackAudioDuration(element, duration);
  }
}

function showTrackAudioDuration(element, duration) {
  element.textContent = convertDuration(duration);
}

export function switchVolume(button, track) {
  const className = 'volume-off';
  track.muted = !track.muted;
  if (track.muted) {
    button.classList.add(className);
  } else {
    button.classList.remove(className);
  }
}

export function showAudioCurrentTime(container, currentTime) {
  container.textContent = convertDuration(currentTime);
}

export function rotateDisc(element) {
  element.classList.toggle('rotate');
}

export function switchPlayButton(element) {
  element.classList.toggle('pause');
}

export function toggleAudio(stateValue, action1, action2) {
  if (!stateValue) {
    action1();
  } else if (stateValue) {
    action2();
  }
}

export function makeClickable(...elements) {
  elements.forEach((element) => {
    element.classList.remove('not-clickable');
  })
}

export function addListenersForElements(elements, action) {
  elements.forEach((element) => {
    element.addEventListener('click', action);
  })
} 
