import audioLibrary from '../../music.json' assert {type: 'json'};
import { galleryState } from './gallery-state.js';
import { appState } from '../../app-state.js';
import {
  getNewVolumeWidth,
  getChangedVolume,
  getMaxTrackIndex,
  getMaxTrackGroupIndex,
  getChangedAudioProgress,
  detectTrackAudioDuration,
  getNewProgressWidth,
  switchVolume,
  showAudioCurrentTime,
  switchPlayButton,
  toggleAudio,
  makeClickable,
  addListenersForElements,
  rotateDisc
} from '../utils/utils.js';

const playTrackButton = document.querySelector('.gallery-player__play');
const trackAudioProgress = document.querySelector('.gallery-player__progress');
const trackProgressBar = document.querySelector('.gallery-player__progress-bar');
const trackVolumeContainer = document.querySelector('.gallery-player__volume');
const trackVolumeBar = document.querySelector('.gallery-player__volume-bar');
const trackTimeContainer = document.querySelector('.gallery-player__current');
const trackDurationContainer = document.querySelector('.gallery-player__length');
const trackDisc = document.querySelector('.gallery-player-picture-container__img');
const activatedTrack = document.querySelector('.gallery-player__play');
const trackVolumeProgress = document.querySelector('.gallery-player__volume-line');
const trackNameContainer = document.querySelector('.gallery-player-track__name');

const trackAudio = new Audio();
 
export function showPlayerList() {
  const list = document.querySelector('.gallery-player-music-list');
  audioLibrary.forEach((item, itemIndex) => {
    item.forEach((innerItem, innerItemIndex) => {
      const listItem = document.createElement('li');
      if (innerItemIndex > 0) {
        list.append(listItem);
        listItem.textContent = innerItem.name;
        listItem.id = `track-${itemIndex}-${innerItemIndex}`;
      }
      if (itemIndex === 0 && innerItemIndex === 1) {
        highlightCurrentTrack(listItem);
      }
    })
  })
  addListenersForTracks();
}

function getPlayerList() {
  const trackListItems = document.querySelectorAll('.gallery-player-music-list > li');
  return trackListItems;
}

function addListenersForTracks() {
  const trackListItems = getPlayerList();
  addListenersForElements(trackListItems, detectTrack);
} 

function detectTrack (event) {
  const array = event.target.id.split('-');
  galleryState.groupIndex = +array[1];
  galleryState.trackIndex = +array[2];
  highlightCurrentTrack(event.target);

  if (!galleryState.isPlayTrack) {
    galleryState.trackAudioCurrentTime = 0;
    playTrack();
  } else if (galleryState.isPlayTrack) {
    stopTrack();
    galleryState.trackAudioCurrentTime = 0;
    playTrack();
  }
}

function highlightCurrentTrack(element) {
  const trackListItems = getPlayerList();
  trackListItems.forEach((item) => {
    item.classList.remove('active-track');
    item.addEventListener('click', detectTrack);
  })
  element.classList.add('active-track');
  element.removeEventListener('click', detectTrack);
}

function playTrack() {
  galleryState.isPlayTrack = true;
  trackAudio.src = audioLibrary[galleryState.groupIndex][galleryState.trackIndex].audio;
  trackAudio.currentTime = galleryState.trackAudioCurrentTime;
  trackAudio.play();
  switchPlayButton(activatedTrack);
  rotateDisc(trackDisc);
  showTrack();
  showTrackAudioProgress();
  detectTrackAudioDuration(trackAudio, galleryState.trackAudioDuration, trackDurationContainer);
  makeClickable(trackProgressBar);
}

export function stopTrack() {
  galleryState.isPlayTrack = false;
  galleryState.trackAudioCurrentTime = trackAudio.currentTime;
  trackAudio.pause();
  switchPlayButton(activatedTrack);
  rotateDisc(trackDisc);
}

function toggleTrackAudio() {
  toggleAudio(galleryState.isPlayTrack, playTrack, stopTrack);
}

export function showTrack() {
  trackNameContainer.textContent = audioLibrary[galleryState.groupIndex][galleryState.trackIndex].name;
}

function showTrackAudioProgress() {
  trackAudioProgress.style.width = getNewProgressWidth(trackAudio.currentTime, trackAudio.duration);
  showAudioCurrentTime(trackTimeContainer, trackAudio.currentTime);
  setTimeout(showTrackAudioProgress, 500);
}

function changeTrackAudioProgress(event) {
  const changedProgress = getChangedAudioProgress(event, trackAudio.duration);
  trackAudio.currentTime = changedProgress;
  galleryState.trackAudioCurrentTime = trackAudio.currentTime;
}

function playNextTrack() {
  trackAudio.currentTime = 0;
  stopTrack();
  detectNextTrack();
  playTrack();
}

function detectNextTrack() {
  const maxTrackGroupIndex = getMaxTrackGroupIndex(audioLibrary);
  const maxTrackIndex = getMaxTrackIndex(audioLibrary[galleryState.groupIndex]);

  if (galleryState.trackIndex === maxTrackIndex && galleryState.groupIndex === maxTrackGroupIndex) {
    galleryState.groupIndex = 0;
    galleryState.trackIndex = 1;
  } else if (galleryState.trackIndex === maxTrackIndex) {
    galleryState.groupIndex = galleryState.groupIndex + 1;
    galleryState.trackIndex = 1;
  } else {
    galleryState.trackIndex = galleryState.trackIndex + 1;
  }

  const nextTrack = document.querySelector(`#track-${galleryState.groupIndex}-${galleryState.trackIndex}`);
  highlightCurrentTrack(nextTrack);
}

function switchTrackVolume(event) {
  switchVolume(event.currentTarget, trackAudio);
}

function changeTrackVolume(event) {
  galleryState.trackAudioVolume = getChangedVolume(event);
  showTrackVolume();
}

export function showTrackVolume() {
  trackAudio.volume = galleryState.trackAudioVolume;
  trackVolumeProgress.style.width = getNewVolumeWidth(trackAudio.volume);
}

export function showInitialTrackTime() {
  trackDurationContainer.textContent = appState.audioInitialTime;
  trackTimeContainer.textContent = appState.audioInitialTime;
}

playTrackButton.addEventListener('click', toggleTrackAudio);
trackProgressBar.addEventListener('click', changeTrackAudioProgress);
trackAudio.addEventListener('ended', playNextTrack);
trackVolumeContainer.addEventListener('click', switchTrackVolume);
trackVolumeBar.addEventListener('click', changeTrackVolume);