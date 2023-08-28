const { memoryController } = require('./_memory-controller.js');
const { eventController } = require('./_event-controller.js');
const { createElement } = require('./_utils.js');

class LetterCountHints {
  constructor() {
    const lines = memoryController
      .getRawInput()
      .trim()
      .split('\n\n')[0]
      .split('\n')
      .map(line => line.trim());

    const wordLengths = lines[0]
      .split('\t')
      .filter(wordLength => wordLength !== 'Σ')
      .map(wordLength => parseInt(wordLength, 10));

    this.hints = [];
    for (const line of lines.slice(1)) {
      if (line.startsWith('Σ')) break;
      const startingLetter = line.split(':')[0];
      const counts = line.split('\t').slice(1, -1);
      for (let i = 0; i < counts.length; i++) {
        const count = counts[i];
        if (count === '-') continue;
        this.hints.push(
          new Hint(startingLetter, wordLengths[i], parseInt(count))
        );
      }
    }
    this.render();
  }

  render() {
    this.element = createElement(
      'section',
      'letter-count-hints',
      document.querySelector('main')
    );

    const wordLengths = new Set(this.hints.map(hint => hint.wordLength));
    this.element.style.gridTemplateColumns = `repeat(${
      wordLengths.size + 1
    }, 1fr)`;
    createElement('span', [], this.element);
    for (const wordLength of wordLengths) {
      const element = createElement('span', [], this.element);
      element.innerText = wordLength;
    }

    const startingLetters = new Set(
      this.hints.map(hint => hint.startingLetter)
    );
    for (const startingLetter of startingLetters) {
      const element = createElement('span', [], this.element);
      element.innerHTML = startingLetter;

      const wordLengthToHintMap = Object.fromEntries(
        this.hints
          .filter(hint => hint.startingLetter === startingLetter)
          .map(hint => [hint.wordLength, hint])
      );
      for (const wordLength of wordLengths) {
        const element = createElement('span', [], this.element);
        if (wordLength in wordLengthToHintMap) {
          element.append(wordLengthToHintMap[wordLength].element);
        } else {
          element.innerText = '-';
        }
      }
    }
  }
}

class Hint {
  /**
   *
   * @param {string} startingLetter  letter that the word starts with
   * @param {number} wordLength number of letters in the word
   * @param {number} count number of words that start with the letter and has the
   *                  word length
   */
  constructor(startingLetter, wordLength, count) {
    this.startingLetter = startingLetter;
    this.wordLength = wordLength;
    this.count = count;
    this.element = createElement('span', 'counter');

    const self = this;
    function setCount() {
      const foundWordsCount = memoryController
        .getFoundWords()
        .filter(
          foundWord =>
            foundWord.startingLetters.startsWith(self.startingLetter) &&
            foundWord.wordLength === self.wordLength
        ).length;
      const count = self.count - foundWordsCount;
      if (count <= 0) {
        self.element.innerText = '-';
        self.element.classList.add('zero');
      } else {
        self.element.innerText = count;
        self.element.classList.remove('zero');
      }
    }
    setCount();
    eventController.addFoundWordListener(() => setCount());
  }
}

module.exports = { LetterCountHints };
