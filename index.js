import { appState } from './app-state.js';

import { createLanguageOptions, showCurrentLanguage, translateText } from './modules/translation/change-language.js';
import { cleanTextContent, showAnswers, getMinMax, getMaxScore } from './modules/quiz/quiz.js';
import { showAnswerVolume } from './modules/quiz/answer.js'
import { showQuestionVolume } from './modules/quiz/question.js';
import { showPlayerList, showTrackVolume, showInitialTrackTime, showTrack } from './modules/gallery/gallery.js';
import { quizState } from './modules/quiz/quiz-state.js';
import { fillWithItems } from './modules/info/info.js';

const buttonsForAppTheme = document.querySelectorAll('.app-theme-button');

function setLocalStorage() {
  localStorage.setItem('coverlang', appState.language);
  localStorage.setItem('quizstate', JSON.stringify(quizState));
}

function checkLocalStorage() {
  if (localStorage.getItem('coverlang')) {
    appState.language = localStorage.getItem('coverlang');
  }
  if (localStorage.getItem('quizstate')) {
    const state = JSON.parse(localStorage.getItem('quizstate'));
    if (state.isGuessed) {
      quizState.question = ++state.question;
      quizState.questionNum = ++state.questionNum;
    } else {
      if(state.question) {
        quizState.question = state.question;
        quizState.questionNum = state.questionNum;
      }
    }
    quizState.scoreArr = state.scoreArr;
    quizState.totalScore = state.totalScore;
  }
  init();
}

function init() {
  createLanguageOptions();
  showCurrentLanguage();
  translateText();
  getMaxScore();
  showQuestionVolume();
  getMinMax();
  showAnswers();
  showAnswerVolume();
  cleanTextContent();
  showPlayerList();
  showTrackVolume();
  showInitialTrackTime();
  showTrack();
}

function changeTheme(event) {
  const ball = document.querySelector('.ball__img');
  const disc = document.querySelector('.question-img__disc');

  if (event.target.classList.contains('button-violet-theme')) {
    document.querySelector('.body').classList.add('violet-theme');
    ball.src = 'assets/decor/violet-theme/disco-ball.png';
    disc.src = 'assets/decor/violet-theme/disc1.png';
    fillWithItems();
  }

  buttonsForAppTheme.forEach((element) => {
    element.removeEventListener('click', changeTheme);
  })

  const preloader = document.querySelector('.preloader');
  preloader.classList.add('hide-preloader');
  setInterval(() => {
    preloader.classList.add('preloader-hidden');
  }, 2900);

}

window.addEventListener('DOMContentLoaded', () => {
  buttonsForAppTheme.forEach((element) => {
    element.addEventListener('click', changeTheme);
  })
})
window.addEventListener('load', () => {
  checkLocalStorage();
});
window.addEventListener('resize', fillWithItems);
window.addEventListener('beforeunload', setLocalStorage);
