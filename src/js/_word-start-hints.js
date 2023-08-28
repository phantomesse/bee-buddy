const { memoryController } = require('./_memory-controller.js');
const { eventController } = require('./_event-controller.js');
const { createElement } = require('./_utils.js');

class WordStartHints {
  constructor() {
    const lines = memoryController
      .getRawInput()
      .trim()
      .split('\n\n')[1]
      .split('\n');
    this.hints = lines
      .map(line => line.trim().split(' '))
      .flat()
      .map(hintStr => {
        const hintArr = hintStr.split('-');
        return new Hint(hintArr[0], parseInt(hintArr[1]));
      });
    this.render();
  }

  render() {
    this.element = createElement(
      'section',
      'word-start-hints',
      document.querySelector('main')
    );

    const startingLetterToHints = {};
    for (const hint of this.hints) {
      const startingLetter = hint.startingLetters.split('')[0];
      if (!(startingLetter in startingLetterToHints)) {
        startingLetterToHints[startingLetter] = [];
      }
      startingLetterToHints[startingLetter].push(hint);
    }

    for (const startingLetter in startingLetterToHints) {
      const section = document.createElement('div');
      section.append(
        ...startingLetterToHints[startingLetter].map(hint => hint.element)
      );
      this.element.append(section);
    }
  }
}

class Hint {
  /**
   * @param {string} startingLetters two letters that the word starts with
   * @param {number} count number of words that start with the two letters
   */
  constructor(startingLetters, count) {
    this.startingLetters = startingLetters;
    this.count = count;

    this.element = createElement('div', 'word-start-hint');

    this.startingLettersElement = createElement(
      'span',
      'starting-letters',
      this.element
    );
    this.startingLettersElement.innerText = this.startingLetters;

    this.countElement = createElement('span', 'counter', this.element);

    const self = this;
    function setCount() {
      const foundWordsCount = memoryController
        .getFoundWords()
        .filter(
          foundWord => foundWord.startingLetters === self.startingLetters
        ).length;
      const count = self.count - foundWordsCount;
      if (count <= 0) {
        self.countElement.innerText = '-';
        self.startingLettersElement.classList.add('zero');
        self.countElement.classList.add('zero');
      } else {
        self.countElement.innerText = count;
        self.startingLettersElement.classList.remove('zero');
        self.countElement.classList.remove('zero');
      }
    }
    setCount();
    eventController.addFoundWordListener(() => setCount());
  }
}

module.exports = { WordStartHints };
