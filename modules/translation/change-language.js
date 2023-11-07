import { appState } from '../../app-state.js';
import language from './languages.json' assert {type: 'json'};
import { showResultsMessage } from '../quiz/result.js';
import { quizState } from '../quiz/quiz-state.js';

export function createLanguageOptions() {
  const languageList = document.querySelector('.menu-lang-options');
  for (let key in language) {
    const languageListItem = document.createElement('li');
    languageListItem.id = key;
    languageListItem.textContent = language[key].name;
    languageListItem.classList.add('menu-lang-options__option');
    languageList.append(languageListItem);
  }
}

export function openLanguageOptions(e) {
  if (e.target.classList.contains('menu-lang')) {
    document.querySelector('.menu-lang-options').classList.toggle('menu-lang-options_active');
    const languages = document.getElementsByClassName('menu-lang-options__option');
    [...languages].forEach((element) => element.addEventListener('click', changeLanguage))
  }
}

export function changeLanguage(event) {
  if (event.target.id !== appState.language) {
    appState.language = event.target.id;
    document.querySelector('.menu-lang-options').classList.toggle('menu-lang-options_active');
    showCurrentLanguage();
    translateText();
  }
}

export function showCurrentLanguage() {
  const liveLanguageList = document.getElementsByClassName('menu-lang-options__option');
  [...liveLanguageList].forEach((element) => {
    element.classList.remove('menu-lang-options__option_active');
    }
  );

  document.querySelector(`#${appState.language}`).classList.add('menu-lang-options__option_active');
}

export function translateText() {
  document.querySelector('.logo__elem1').textContent = language[appState.language].logo.element1;
  document.querySelector('.logo__elem2').textContent = language[appState.language].logo.element2;
  document.querySelector('.questions-number__text1').textContent = language[appState.language].quiz.question;
  document.querySelector('.score__text').textContent = language[appState.language].quiz.score;
  document.querySelector('.question-player-song').textContent = language[appState.language].quiz.cover;
  document.querySelector('.year').textContent = language[appState.language].footer.year;
  document.querySelector('.info-rules-heading').textContent = language[appState.language].info.heading;
  document.querySelector('.info-rules-list__item1').textContent = language[appState.language].info.listItem1;
  document.querySelector('.info-rules-list__item2').textContent = language[appState.language].info.listItem2;
  document.querySelector('.info-rules-list__item3').textContent = language[appState.language].info.listItem3;

  if (!quizState.isClickableAnswer) {
    document.querySelector('.music-player-song__name').textContent = language[appState.language].quiz.instructions;
  }

  showResultsMessage();
}

document.querySelector('.menu-lang').addEventListener('click', openLanguageOptions);