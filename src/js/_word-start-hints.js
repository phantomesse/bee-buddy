const { createElement } = require('./_utils.js');

class WordStartHints {
  /** @param {string} rawInput */
  constructor(rawInput) {
    const lines = rawInput.trim().split('\n\n')[1].split('\n');
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
    const startingLetterToHints = {};
    for (const hint of this.hints) {
      const startingLetter = hint.startingLetters.split('')[0];
      if (!(startingLetter in startingLetterToHints)) {
        startingLetterToHints[startingLetter] = [];
      }
      startingLetterToHints[startingLetter].push(hint);
    }

    this.element = createElement(
      'section',
      'word-start-hints',
      document.querySelector('main')
    );
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

    this.countElement = createElement('span', 'count', this.element);
    this.countElement.innerText = this.count;
  }
}

module.exports = { WordStartHints };
