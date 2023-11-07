import audioLibrary from '../../music.json' assert {type: 'json'};
import { quizState } from './quiz-state.js';
import { stopAnswerAudio } from './answer.js';
import {
  switchVolume,
  getNewVolumeWidth,
  getChangedVolume,
  getChangedAudioProgress,
  getNewProgressWidth,
  detectTrackAudioDuration,
  showAudioCurrentTime,
  switchPlayButton,
  toggleAudio,
  makeClickable,
  rotateDisc } from '../utils/utils.js';

const questionProgressBar = document.querySelector('.question-player__progress-bar');
const questionVolumeContainer = document.querySelector('.question-player__volume');
const questionVolumeBar = document.querySelector('.question-player__volume-bar');
const questionTimeContainer = document.querySelector('.question-player__current');
const questionDurationContainer = document.querySelector('.question-player__length');
const activatedQuestion = document.querySelector('.question-player__play');
const questionDisc = document.querySelector('.question-img__disc');
const questionAudioProgress = document.querySelector('.question-player__progress');
const questionVolumeProgress = document.querySelector('.question-player__volume-line');
const answersList = document.querySelector('.options');

export const questionAudio = new Audio();

function playQuestionAudio() {
  quizState.isPlayQuestion = true;
  questionAudio.src = audioLibrary[quizState.question][0].cover;
  questionAudio.currentTime = quizState.questionAudioCurrentTime;
  questionAudio.play();

  if (quizState.isPlayAnswer) {
    stopAnswerAudio();
  }

  switchPlayButton(activatedQuestion);
  rotateDisc(questionDisc);
  showQuestionAudioProgress();
  detectTrackAudioDuration(questionAudio, quizState.questionAudioDuration, questionDurationContainer);
  makeClickable(answersList, questionProgressBar);
}

export function stopQuestionAudio() {
  quizState.isPlayQuestion = false;
  quizState.questionAudioCurrentTime = questionAudio.currentTime;
  questionAudio.pause();
  switchPlayButton(activatedQuestion);
  rotateDisc(questionDisc);
  showQuestionAudioProgress();
}

function toggleQuestionAudio() {
  toggleAudio(quizState.isPlayQuestion, playQuestionAudio, stopQuestionAudio);
}

function playQuestionAgain() {
  questionAudio.currentTime = 0;
  quizState.questionAudioCurrentTime = questionAudio.currentTime;
  stopQuestionAudio();
  playQuestionAudio();
}

function showQuestionAudioProgress() {
  questionAudioProgress.style.width = getNewProgressWidth(questionAudio.currentTime, questionAudio.duration);
  showAudioCurrentTime(questionTimeContainer, questionAudio.currentTime);
  setTimeout(showQuestionAudioProgress, 500);
}

function changeQuestionAudioProgress(event) {
  const changedProgress = getChangedAudioProgress(event, questionAudio.duration);
  questionAudio.currentTime = changedProgress;
  quizState.questionAudioCurrentTime = questionAudio.currentTime;
}

function switchQuestionVolume(event) {
  switchVolume(event.currentTarget, questionAudio);
}

function changeQuestionVolume(event) {
  const changedVolume = getChangedVolume(event);
  questionAudio.volume = changedVolume;
  questionVolumeProgress.style.width = getNewVolumeWidth(changedVolume);
}

export function showQuestionVolume() {
  questionAudio.volume = quizState.questionAudioVolume;
  questionVolumeProgress.style.width = getNewVolumeWidth(questionAudio.volume);
}

activatedQuestion.addEventListener('click', toggleQuestionAudio);
questionAudio.addEventListener('ended', playQuestionAgain);
questionProgressBar.addEventListener('click', changeQuestionAudioProgress);
questionVolumeContainer.addEventListener('click', switchQuestionVolume);
questionVolumeBar.addEventListener('click', changeQuestionVolume);