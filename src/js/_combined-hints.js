const { LetterCountHints } = require('./_letter-count-hints.js');
const { memoryController } = require('./_memory-controller.js');
const { createElement } = require('./_utils.js');
const { WordStartHints } = require('./_word-start-hints.js');

class CombinedHints {
  /**
   * @param {LetterCountHints} letterCountHints
   * @param {WordStartHints} wordStartHints
   */
  constructor(letterCountHints, wordStartHints) {
    const middleLetter = memoryController.getMiddleLetter();
    for (const wordStartHint of wordStartHints.hints) {
      const startingLetter = wordStartHint.startingLetters.charAt(0);
      const wordLengths = letterCountHints.hints
        .filter(hint => hint.startingLetter === startingLetter)
        .map(hint => hint.wordLength);
      const hint = new Hint(
        middleLetter,
        wordStartHint.startingLetters,
        wordLengths,
        wordStartHint.count
      );
    }
  }
}

class Hint {
  /**
   * @param {string} middleLetter letter that is required in the word
   * @param {string} startingLetters two letters that the word starts with
   * @param {number[]} wordLengths number of letters in the word
   * @param {number} count number of words that fit into this criteria
   */
  constructor(middleLetter, startingLetters, wordLengths, count) {
    this.startingLetters = startingLetters;
    this.wordLengths = wordLengths;
    this.count = count;

    this.element = createElement(
      'div',
      'combined-hint',
      document.querySelector('main')
    );
    this.element.innerHTML =
      '<h2>' + this.startingLetters + ' (' + count + ') </h2>';

    for (const wordLength of wordLengths) {
      // Create variations with the middle letter in one of the empty spaces.
      const potentialWords = [];
      for (
        let middleLetterIndex = this.startingLetters.includes(middleLetter)
          ? -1
          : 0;
        middleLetterIndex < wordLength - this.startingLetters.length;
        middleLetterIndex++
      ) {
        let word = this.startingLetters;
        for (let i = 0; i < wordLength - this.startingLetters.length; i++) {
          word += i === middleLetterIndex ? middleLetter : '*';
        }
        potentialWords.push(word);
      }

      const wordLengthSectionElement = createElement(
        'div',
        'potential-words',
        this.element
      );
      for (let potentialWord of potentialWords) {
        wordLengthSectionElement.append(
          this.createPotentialWordElement(potentialWord)
        );
      }
    }
  }

  /**
   * @param {string} word e.g. "AR**Y*"
   * @returns {HTMLElement}
   */
  createPotentialWordElement(word) {
    const element = createElement('div', 'potential-word');
    for (let i = 0; i < word.length; i++) {
      const options = {};
      const letter = word[i];
      if (i < 2) options.startingLetter = letter;
      else if (letter !== '*') options.middleLetter = letter;
      this.createLetterBlockElement(element, options);
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
  createLetterBlockElement(potentialWordElement, options = {}) {
    const letter = options.startingLetter || options.middleLetter;
    const classNames = ['letter-block'];
    if (options.startingLetter) classNames.push('starting-letter');
    if (options.middleLetter) classNames.push('middle-letter');
    const element = createElement('span', classNames, potentialWordElement);
    if (letter) element.innerText = letter;
    return element;
  }
}

module.exports = { CombinedHints };
