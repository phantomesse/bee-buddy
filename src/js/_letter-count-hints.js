const { createElement } = require('./_utils.js');

class LetterCountHints {
  /** @param {string} rawInput */
  constructor(rawInput) {
    const lines = rawInput
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
        this.hints.push(new Hint(startingLetter, wordLengths[i], count));
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
  }
}

module.exports = { LetterCountHints };
