/**
 * @param {string} tagName
 * @param {string | string[]} classNames
 * @param {HTMLElement} [parentElement] optional parent element to append this element to
 */
function createElement(tagName, classNames, parentElement) {
  const element = document.createElement(tagName);
  if (typeof classNames === 'string') {
    element.className = classNames;
  } else {
    element.classList.add(...classNames);
  }
  if (parentElement) parentElement.append(element);
  return element;
}

/**
 * @param {string} word e.g. "AR**Y*"
 * @returns {HTMLElement}
 */
function createWordElement(word) {
  const element = createElement('div', 'potential-word');
  for (let i = 0; i < word.length; i++) {
    const options = {};
    const letter = word[i];
    if (i < 2) options.startingLetter = letter;
    else if (letter !== '*') options.middleLetter = letter;
    createLetterBlockElement(element, options);
  }
  return element;
}

/**
 * @typedef {Object} LetterBlockElementOptions
 * @property {string} startingLetter
 * @property {string} middleLetter
 */

/**
 *
 * @param {HTMLElement} potentialWordElement
 * @param {LetterBlockElementOptions} options
 * @returns {HTMLElement}
 */
function createLetterBlockElement(potentialWordElement, options = {}) {
  const letter = options.startingLetter || options.middleLetter;
  const classNames = ['letter-block'];
  if (options.startingLetter) classNames.push('starting-letter');
  if (options.middleLetter) classNames.push('middle-letter');
  const element = createElement('span', classNames, potentialWordElement);
  if (letter) element.innerText = letter;
  return element;
}

module.exports = { createElement, createWordElement };
