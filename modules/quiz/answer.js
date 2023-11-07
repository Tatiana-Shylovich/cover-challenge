import audioLibrary from '../../music.json' assert {type: 'json'};
import { quizState } from './quiz-state.js';
import { stopQuestionAudio } from './question.js';
import { 
  getChangedVolume,
  switchVolume,
  getNewVolumeWidth,
  getNewProgressWidth,
  getChangedAudioProgress,
  detectTrackAudioDuration,
  showAudioCurrentTime,
  switchPlayButton,
  toggleAudio,
  makeClickable } from '../utils/utils.js';

const answerTimeContainer = document.querySelector('.music-player__current');
const answerDurationContainer = document.querySelector('.music-player__length');
const activatedAnswer = document.querySelector('.music-player__play');
const answerAudioProgress = document.querySelector('.music-player__progress');
const answerProgressBar = document.querySelector('.music-player__progress-bar');
const answerVolumeContainer = document.querySelector('.music-player__volume');
const answerVolumeBar = document.querySelector('.music-player__volume-bar');
const answerVolumeProgress = document.querySelector('.music-player__volume-line');

export const answerAudio = new Audio();

export function playAnswerAudio() {
  quizState.isPlayAnswer = true;
  answerAudio.src = audioLibrary[quizState.question][quizState.songId].audio;
  answerAudio.currentTime = quizState.answerAudioCurrentTime;
  answerAudio.play();

  if(quizState.isPlayQuestion) {
    stopQuestionAudio();
  }

  switchPlayButton(activatedAnswer);
  showAnswerAudioProgress();
  detectTrackAudioDuration(answerAudio, quizState.answerAudioDuration, answerDurationContainer);
  makeClickable(answerProgressBar);
}

export function stopAnswerAudio() {
  quizState.isPlayAnswer = false;
  quizState.answerAudioCurrentTime = answerAudio.currentTime;
  answerAudio.pause();
  switchPlayButton(activatedAnswer);
  showAnswerAudioProgress();
}

function toggleAnswerAudio() {
  toggleAudio(quizState.isPlayAnswer, playAnswerAudio, stopAnswerAudio);
}

function playAnswerAgain() {
  stopAnswerAudio();
  quizState.answerAudioCurrentTime = 0;
  playAnswerAudio();
}

function showAnswerAudioProgress() {
  answerAudioProgress.style.width = getNewProgressWidth(answerAudio.currentTime, answerAudio.duration);
  showAudioCurrentTime(answerTimeContainer, answerAudio.currentTime);
  setTimeout(showAnswerAudioProgress, 500);
}

function changeAnswerAudioProgress(event) {
  const changedProgress = getChangedAudioProgress(event, answerAudio.duration);
  answerAudio.currentTime = changedProgress;
  quizState.answerAudioCurrentTime = answerAudio.currentTime;
}

function switchAnswerVolume(event) {
  switchVolume(event.currentTarget, answerAudio);
}

export function showAnswerVolume() {
  answerAudio.volume = quizState.answerAudioVolume;
  answerVolumeProgress.style.width = getNewVolumeWidth(answerAudio.volume);
}

function changeAnswerVolume(event) {
  const changedVolume = getChangedVolume(event);
  answerAudio.volume = changedVolume;
  answerVolumeProgress.style.width = getNewVolumeWidth(changedVolume);
}

activatedAnswer.addEventListener('click', toggleAnswerAudio);
answerVolumeContainer.addEventListener('click', switchAnswerVolume);
answerVolumeBar.addEventListener('click', changeAnswerVolume);
answerProgressBar.addEventListener('click', changeAnswerAudioProgress);
answerAudio.addEventListener('ended', playAnswerAgain);