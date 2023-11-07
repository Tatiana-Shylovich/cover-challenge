import { appState } from './app-state.js';

const burgerIcon = document.querySelector('.burger-icon');
const menu = document.querySelector('.menu');

export function useBurgerIcon() {
  const burgerLine = document.querySelectorAll('.burger-icon__line');

  if (appState.isBurgerOpen) {
    appState.isBurgerOpen = false;
    document.querySelector('.menu-lang-options').classList.remove('menu-lang-options_active');
  } else {
    appState.isBurgerOpen = true;
  }

  burgerLine.forEach((element) => element.classList.toggle('active-line'));
  menu.classList.toggle('menu_active');
};

function showActiveMenuItem(e) {
  const liveMenu = document.getElementsByClassName('menu-item');

  if (e.target.classList.contains('menu-item')) {
    [...liveMenu].forEach((element) => element.classList.remove('menu-item_active'));
    e.target.classList.add('menu-item_active');

    if (appState.isBurgerOpen) {
    useBurgerIcon();
    }
  }
}

burgerIcon.addEventListener('click', useBurgerIcon);
menu.addEventListener('click', showActiveMenuItem);