const { eventController } = require('./_event-controller');
const { LetterCountHints } = require('./_letter-count-hints');
const { memoryController } = require('./_memory-controller');
const { createElement, createWordElement } = require('./_utils');
const { WordStartHints } = require('./_word-start-hints');

/**
 * Shows words in the form of letter blocks.
 */
class PotentialWordHints {
  /**
   * @param {LetterCountHints} letterCountHints
   * @param {WordStartHints} wordStartHints
   */
  constructor(letterCountHints, wordStartHints) {
    const middleLetter = memoryController.getMiddleLetter();
    const startingLettersList = new Set(
      wordStartHints.hints.map(hint => hint.startingLetters)
    );
    this.hints = [];
    for (const startingLetters of startingLettersList) {
      const wordLengthHints = letterCountHints.hints.filter(
        hint => hint.startingLetter === startingLetters.charAt(0)
      );
      const wordLengths = wordLengthHints.map(hint => hint.wordLength);
      for (const wordLength of wordLengths) {
        const wordStartCount = wordStartHints.hints.find(
          hint => hint.startingLetters === startingLetters
        ).count;
        const letterCountCount = wordLengthHints.find(
          hint => hint.wordLength === wordLength
        ).count;
        this.hints.push(
          new Hint(
            startingLetters,
            wordLength,
            middleLetter,
            wordStartCount,
            letterCountCount
          )
        );
      }
    }
    this.render();
  }

  render() {
    this.element = createElement(
      'section',
      'potential-word-hints',
      document.querySelector('main')
    );

    for (const hint of this.hints) {
      this.element.append(hint.element);
    }
  }
}

class Hint {
  /**
   * @param {string} startingLetters two letters that the word starts with
   * @param {number} wordLength number of letters in the word
   * @param {string} middleLetter
   */
  constructor(
    startingLetters,
    wordLength,
    middleLetter,
    wordStartCount,
    letterCountCount
  ) {
    this.startingLetters = startingLetters;
    this.wordLength = wordLength;

    this.element = createElement('div', 'potential-words');
    const heading = createElement('label', [], this.element);
    heading.innerText = `${this.startingLetters} words with length ${this.wordLength}`;

    const potentialWords = [];
    for (
      let middleLetterIndex = startingLetters.includes(middleLetter) ? -1 : 0;
      middleLetterIndex < wordLength - startingLetters.length;
      middleLetterIndex++
    ) {
      let word = '';
      for (let i = 0; i < wordLength; i++) {
        if (i < startingLetters.length) {
          word += startingLetters[i];
        } else if (i === middleLetterIndex + startingLetters.length) {
          word += middleLetter;
        } else {
          word += '*';
        }
      }
      potentialWords.push(word);
    }

    for (const word of potentialWords) {
      this.element.append(createWordElement(word));
    }

    const self = this;
    function hideIfFound() {
      const foundWords = memoryController.getFoundWords();
      const foundWordsMatchingStartingLettersCount = foundWords.filter(
        foundWord => foundWord.startingLetters === self.startingLetters
      ).length;
      const foundWordsMatchingWordLengthCount = foundWords.filter(
        foundWord =>
          foundWord.startingLetters.charAt(0) ===
            self.startingLetters.charAt(0) &&
          foundWord.wordLength === self.wordLength
      ).length;
      self.element.classList.toggle(
        'hidden',
        foundWordsMatchingStartingLettersCount >= wordStartCount ||
          foundWordsMatchingWordLengthCount >= letterCountCount
      );
    }
    hideIfFound();
    eventController.addFoundWordListener(() => hideIfFound());
  }
}

module.exports = { PotentialWordHints };
