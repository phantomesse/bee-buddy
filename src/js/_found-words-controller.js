const { eventController } = require('./_event-controller.js');
const { memoryController } = require('./_memory-controller.js');
const { createElement, createWordElement } = require('./_utils.js');

/** Handles adding and removing found words. */
class FoundWordsController {
  constructor(letterCountHints, wordStartHints) {
    this.foundWordsContainer = document.querySelector('.found-words');
    this.foundWordsContainer.innerHTML = '';

    this.renderAddButton(letterCountHints, wordStartHints);
    const foundWords = memoryController.getFoundWords();
    for (const foundWord of foundWords) {
      this.addFoundWord(foundWord);
    }
  }

  addFoundWord(foundWord) {
    const foundWordElement = createElement('div', 'found-word');
    let word = foundWord.startingLetters;
    for (
      let i = 0;
      i < foundWord.wordLength - foundWord.startingLetters.length;
      i++
    ) {
      word += '*';
    }
    foundWordElement.append(createWordElement(word));

    const foundWordRemoveButton = createElement('button', [], foundWordElement);
    foundWordRemoveButton.innerText = '×';
    foundWordRemoveButton.addEventListener('click', e => {
      e.preventDefault();
      memoryController.removeFoundWord(foundWord);
      eventController.dispatchFoundWordEvent();
      foundWordElement.remove();
    });

    this.addFoundWordElement.insertAdjacentElement(
      'beforebegin',
      foundWordElement
    );
  }

  renderAddButton(letterCountHints, wordStartHints) {
    this.addFoundWordElement = createElement(
      'div',
      'add-found-word',
      this.foundWordsContainer
    );

    const startingLettersSelectorElement = createElement(
      'select',
      'starting-letters-select',
      this.addFoundWordElement
    );
    const startingLettersList = new Set(
      wordStartHints.hints.map(hint => hint.startingLetters)
    );
    for (const startingLetters of startingLettersList) {
      const option = createElement(
        'option',
        [],
        startingLettersSelectorElement
      );
      option.innerText = startingLetters;
    }

    // TODO: Update word length options based on selected starting letters.
    const wordLengthSelectorElement = createElement(
      'select',
      'word-length-select',
      this.addFoundWordElement
    );
    const wordLengths = new Set(
      letterCountHints.hints.map(hint => hint.wordLength)
    );
    for (const wordLength of wordLengths) {
      const option = createElement('option', [], wordLengthSelectorElement);
      option.innerText = wordLength;
    }

    const addFoundWordButton = createElement(
      'button',
      [],
      this.addFoundWordElement
    );
    addFoundWordButton.innerText = '+';
    const self = this;
    addFoundWordButton.addEventListener('click', e => {
      e.preventDefault();

      const startingLetters = startingLettersSelectorElement.value;
      const wordLength = parseInt(wordLengthSelectorElement.value);
      const foundWord = {
        startingLetters: startingLetters,
        wordLength: wordLength,
      };
      memoryController.addFoundWord(foundWord);
      self.addFoundWord(foundWord);
      eventController.dispatchFoundWordEvent();
    });
  }
}

module.exports = { FoundWordsController };
