import { appState } from './app-state.js';
import { quizState } from './modules/quiz/quiz-state.js';

import { stopQuestionAudio } from './modules/quiz/question.js';
import { stopAnswerAudio } from './modules/quiz/answer.js';
import { playQuizAgain } from './modules/quiz/result.js';
import { useBurgerIcon } from './menu.js';

import { playSignalAudio } from './modules/signals/player.js';
import { flipSound } from './modules/signals/sounds.js';

import { galleryState } from './modules/gallery/gallery-state.js';
import { stopTrack } from './modules/gallery/gallery.js';

const liveNavigation = document.getElementsByClassName('menu-item');
for (let i = 0; i < liveNavigation.length; i++) {
  liveNavigation[i].addEventListener('click', switchPage);
}

export function switchPage(e) {
  const quiz = document.querySelector('.quiz');
  const gallery = document.querySelector('.gallery');
  const info = document.querySelector('.info');
  const livePages = document.getElementsByClassName('app-sections');

  [...livePages].forEach((element) => element.classList.remove('section_active'));

  if (e.target.classList.contains('menu__quiz')) {
    quiz.classList.add('section_active');
  }
  if (e.target.classList.contains('menu__gallery')) {
    gallery.classList.add('section_active');
  }
  if (e.target.classList.contains('menu__info')) {
    info.classList.add('section_active');
  }

  stopAudioOnSwitch();
  playSignalAudio(flipSound);

  if (appState.isResultsOpen) {
    appState.isResultsOpen = false;
    playQuizAgain();
  }

  if (appState.isBurgerOpen) {
    useBurgerIcon();
  }
}

export function stopAudioOnSwitch() {
  if (quizState.isPlayQuestion) {
    stopQuestionAudio();
  }
  if (quizState.isPlayAnswer) {
    stopAnswerAudio();
  }
  if (galleryState.isPlayTrack) {
    stopTrack();
  }
}