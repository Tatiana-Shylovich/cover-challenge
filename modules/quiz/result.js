import language from '../translation/languages.json' assert {type: 'json'};

import { appState } from '../../app-state.js';
import { quizState } from './quiz-state.js';

import { cleanQuiz } from './quiz.js';

const replayButton = document.querySelector('.result-container__button');

export function endQuiz() {
  appState.isResultsOpen = true;
  document.querySelector('.result').classList.add('section_active');
  showResultsMessage();
}

export function showResultsMessage() {
  if (appState.isResultsOpen) {
    const resultMessageParts = [
      language[appState.language].result.part1,
      quizState.totalScore,
      language[appState.language].result.part2,
      quizState.maxScore,
      language[appState.language].result.part3,
    ];
    document.querySelector('.result-container__text').textContent = resultMessageParts.join('');
  }
}

export function playQuizAgain() {
  closeResults();
  cleanQuiz(); 
}

export function closeResults() {
  document.querySelector('.result').classList.remove('section_active');
}

replayButton.addEventListener('click', playQuizAgain);