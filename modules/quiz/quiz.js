import audioLibrary from '../../music.json' assert {type: 'json'};
import language from '../translation/languages.json' assert {type: 'json'};

import { appState } from '../../app-state.js';
import { quizState } from './quiz-state.js';

import { playSignalAudio } from '../signals/player.js';
import { rightSound, wrongSound } from '../signals/sounds.js';
import { stopAudioOnSwitch } from '../../switch-page.js';
import { endQuiz } from './result.js';
import { questionAudio, stopQuestionAudio } from './question.js';
import { answerAudio, playAnswerAudio, stopAnswerAudio } from './answer.js';
import { makeClickable, addListenersForElements } from '../utils/utils.js';

const nextQuestionButton = document.querySelector('.button-next');
const answerTimeContainer = document.querySelector('.music-player__current');
const answerDurationContainer = document.querySelector('.music-player__length');
const questionTimeContainer = document.querySelector('.question-player__current');
const questionDurationContainer = document.querySelector('.question-player__length');
const answerContainer = document.querySelector('.music');
const questionCurrentNumber = document.querySelector('.questions-number__current');
const questionsTotalNumber = document.querySelector('.questions-number__total');
const questionsCounterSlash = document.querySelector('.questions-number__text2');
const scoreContainer = document.querySelector('.score__value');
const answerTitle = document.querySelector('.music-player-song__name');
const questionTitle = document.querySelector('.question-player-song');

function makeNotClickable() {
  document.querySelector('.options').classList.add('not-clickable');
  document.querySelector('.question-player__progress-bar').classList.add('not-clickable');
  document.querySelector('.music-player__progress-bar').classList.add('not-clickable');
  answerContainer.classList.add('not-clickable');
} 

export function getMinMax() {
  const min = 1;
  const max = audioLibrary[quizState.question].length - 1;
  getRandomIntInclusive(min, max);
}

function getRandomIntInclusive(min, max) {
  while (quizState.answersArr.length < max) {
    let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    fillAnswersArr(randomNum);
  }
}

function fillAnswersArr(randomNum) {
  if (!quizState.answersArr.includes(randomNum)) {
    quizState.answersArr.push(randomNum);
  }
}

export function showAnswers() {
  const answers = document.querySelector('.options-list');
  const answer = 'options-list__item';
  answers.innerHTML = '';
  quizState.answersArr.forEach((element) => {
    const listItem = document.createElement('li');
    answers.append(listItem);
    listItem.classList.add(answer);
    listItem.id = audioLibrary[quizState.question][element].id;
    listItem.textContent = audioLibrary[quizState.question][element].name;
  })
  const listItems = document.querySelectorAll('.' + answer);
  addListenersForElements(listItems, checkAnswer);
}

function checkAnswer(event) {
  const right = 'options-list__item_right';
  const wrong = 'options-list__item_wrong';

  quizState.songId = +event.target.id;

  if (event.target.id === '1') {
    showAnswer();
    if (!event.target.classList.contains(right)) {
      playSignalAudio(rightSound);
      activateNextQuestionButton();
      quizState.isGuessed = true;
      addCurrPoints();
    }
    if (quizState.isPlayQuestion) {
      stopQuestionAudio();
    }
    event.target.classList.add(right);
  } else {
    showAnswer();
    if (!event.target.classList.contains(wrong) && quizState.isGuessed === false) {
      playSignalAudio(wrongSound);
      subtractFromCurrPoints();
      event.target.classList.add(wrong);
    }
  }
  answerAudio.currentTime = 0;
  quizState.answerAudioCurrentTime = answerAudio.currentTime;
  if (quizState.isPlayAnswer) {
    stopAnswerAudio();
    playAnswerAudio();
  }
  quizState.isClickableAnswer = true;
  makeClickable(answerContainer);
}

function showAnswer() {
  answerTimeContainer.textContent = appState.audioInitialTime;
  answerTitle.textContent = audioLibrary[quizState.question][quizState.songId].name;
}

function countQuestions() {
  quizState.questionNum++;
  showQuestionNum();
}

function showQuestionNum() {
  questionCurrentNumber.textContent = quizState.questionNum;
}

function addCurrPoints() {
  quizState.scoreArr.push(quizState.currPoints);
  getTotalScore();
  checkLastQuestion();
}

function checkLastQuestion() {
  if (quizState.scoreArr.length === audioLibrary.length) {
    endQuiz();
  }
}

function subtractFromCurrPoints() {
  quizState.currPoints--;
}

function getTotalScore() {
  quizState.totalScore = quizState.scoreArr.reduce((a, b) => a + b);
  scoreContainer.textContent = quizState.totalScore;
}

function activateNextQuestionButton() {
  if (quizState.questionNum < audioLibrary.length) {
    nextQuestionButton.addEventListener('click', showNextQuestion);
    nextQuestionButton.classList.add('button-next__img_active');
  }
}

function deactivateNextQuestionButton() {
  nextQuestionButton.removeEventListener('click', showNextQuestion);
  nextQuestionButton.classList.remove('button-next__img_active');
}

function showNextQuestion() {
  quizState.question++;
  countQuestions();
  restoreInitialQuestionState()
}

export function cleanQuiz() {
  quizState.question = 0;
  quizState.questionNum = 1;
  quizState.scoreArr = [];
  quizState.totalScore = 0;
  showQuestionNum();
  restoreInitialQuestionState();
}

function restoreInitialQuestionState() {
  quizState.answersArr = [];
  quizState.currPoints = 5;
  quizState.isGuessed = false;
  quizState.isClickableAnswer = false;
  questionAudio.currentTime = 0;
  quizState.questionAudioCurrentTime = questionAudio.currentTime;
  answerAudio.currentTime = 0;
  quizState.answerAudioCurrentTime = answerAudio.currentTime;

  getMinMax();
  showAnswers();
  deactivateNextQuestionButton();
  stopAudioOnSwitch();
  makeNotClickable();
  cleanTextContent();
}

export function cleanTextContent() {
  answerTitle.textContent = language[appState.language].quiz.instructions;
  questionTitle.textContent = language[appState.language].quiz.cover;
  scoreContainer.textContent = quizState.totalScore;
  questionCurrentNumber.textContent = quizState.questionNum;
  questionTimeContainer.textContent = appState.audioInitialTime;
  questionDurationContainer.textContent = appState.audioInitialTime;
  answerTimeContainer.textContent = appState.audioInitialTime;
  answerDurationContainer.textContent = appState.audioInitialTime;
  questionsTotalNumber.textContent = audioLibrary.length;
  questionsCounterSlash.textContent = '/';
}

export function getMaxScore() {
  const maxScore = audioLibrary.length * quizState.currPoints;
  quizState.maxScore = maxScore;
}