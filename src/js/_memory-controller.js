const LOCAL_STORAGE_KEY = 'bee-buddy';

/**
 * @typedef {Object} Cookie
 * @property {string} rawInput
 * @property {string} middleLetter
 * @property {FoundWord[]} foundWords
 */

/**
 * @typedef {Object} FoundWord
 * @property {string} startingLetters
 * @property {number} wordLength
 */

/**
 * Controller that handles caching data in local memory using HTML local
 * storage.
 */
class MemoryController {
  #localStorageCache;

  constructor() {
    this.#retrieveLocalStorage();
  }

  /** @returns {string} rawInput */
  getRawInput = () => this.#localStorageCache.rawInput;

  /** @param {string} rawInput */
  updateRawInput(rawInput) {
    this.#localStorageCache = {
      rawInput: rawInput.trim(),
      middleLetter: '',
      foundWords: [],
    };
    this.#updateLocalStorage();
  }

  /** @returns {string} middleLetter */
  getMiddleLetter = () => this.#localStorageCache.middleLetter;

  /** @param {string} middleLetter */
  updateMiddleLetter(middleLetter) {
    this.#localStorageCache.middleLetter = middleLetter;
    this.#updateLocalStorage();
  }

  /** @returns {FoundWord[]} list of found words */
  getFoundWords = () => this.#localStorageCache.foundWords;

  /** @param {FoundWord} foundWord found word to add */
  addFoundWord(foundWord) {
    this.#localStorageCache.foundWords.push(foundWord);
    this.#updateLocalStorage();
  }

  /** @param {FoundWord} foundWord found word to remove */
  removeFoundWord(foundWord) {
    this.#localStorageCache.foundWords.splice(
      this.#localStorageCache.foundWords.indexOf(foundWord),
      1
    );
    this.#updateLocalStorage();
  }

  /** Retrieves cookie from local storage and stores it in memory cache. */
  #retrieveLocalStorage() {
    const localStorageValue = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    this.#localStorageCache =
      localStorageValue === null
        ? { rawInput: '', middleLetter: '', foundWords: [] }
        : JSON.parse(localStorageValue);
  }

  /** Updates the local storage using the modified memory cache. */
  #updateLocalStorage() {
    window.localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify(this.#localStorageCache)
    );
  }
}

const memoryController = new MemoryController();
module.exports = { memoryController };
