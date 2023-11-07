const field = document.querySelector('.animation-fall');

export function fillWithItems() {
  cleanField();

  const maxItemsNumber = window.innerWidth > 768 ? 20 : 10;
  for (let i = 0; i < maxItemsNumber; i++) {
    createFallingItem();
  }
}

function cleanField() {
  field.innerHTML = '';
}

function createFallingItem() {
  const container = document.createElement('div');
  const image = document.createElement('div');

  const minItemNumber = 1;
  const maxItemNumber = 6;
  const minItemSize = 50;
  const maxItemSize = 130;
  const minItemMargin = 5;
  const maxItemMargin = document.body.clientWidth - maxItemSize;

  const itemNumber = getRandomIntInclusive(minItemNumber, maxItemNumber);
  const itemSize = getRandomIntInclusive(minItemSize, maxItemSize);
  const itemMargin = 5 + getRandomIntInclusive(minItemMargin, maxItemMargin);

  const itemBrightness = itemSize > 100 ? 100 : itemSize;
  const animationDuration = 1000 / itemSize;
  const animationDelay = 500 / itemSize;

  container.classList.add('animation-fall-item');
  container.style.marginLeft = `${itemMargin}px`;
  container.style.marginTop = `-${itemSize}px`;
  container.style.width = container.style.height =`${itemSize}px`;
  container.style.zIndex = `${itemSize}`;
  container.style.animationDuration = `${(animationDuration)}s`;
  container.style.animationDelay = `${(animationDelay)}s`;

  image.classList.add('animation-fall-item__img', 'rotate');
  if (document.querySelector('.body').classList.contains('violet-theme')) {
    image.style.backgroundImage = `url("assets/decor/violet-theme/disc${itemNumber}.png")`;
  } else {
    image.style.backgroundImage = `url("assets/decor/disc${itemNumber}.png")`;
  }
  image.style.filter = `brightness(${itemBrightness}%)`;

  container.append(image);
  field.append(container);

  container.addEventListener('animationend', () => {
    container.remove();
    createFallingItem();
  })
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}