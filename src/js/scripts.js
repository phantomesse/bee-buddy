const { LetterCountHints } = require('./_letter-count-hints.js');
const { WordStartHints } = require('./_word-start-hints.js');
const { memoryController } = require('./_memory-controller.js');
const { FoundWordsController } = require('./_found-words-controller.js');
const { PotentialWordHints } = require('./_potental-word-hints.js');

const rawInputElement = document.getElementById('raw-input');
const rawInputSubmitButton = document.getElementById('raw-input-submit');
const middleLetterRadioElements = document.querySelectorAll(
  'input[name=middle-letter]'
);

// Set raw input and middle letter values from memory.
rawInputElement.value = memoryController.getRawInput();
const middleLetter = memoryController.getMiddleLetter();
if (middleLetter !== '') {
  for (const radioElement of middleLetterRadioElements) {
    if (radioElement.getAttribute('checked')) {
      radioElement.removeAttribute('checked');
    }
    if (radioElement.value === middleLetter) {
      radioElement.setAttribute('checked', true);
      document
        .querySelector('input[name=middle-letter]:checked + label')
        .scrollIntoView({ behavior: 'instant', inline: 'center' });
    }
  }
}

if (rawInputElement.value !== '') updateHints();

// Update memory when raw input and middle letter changes.
rawInputSubmitButton.addEventListener('click', e => {
  e.preventDefault();
  memoryController.updateRawInput(rawInputElement.value);
  updateHints();
});
for (const radioElement of middleLetterRadioElements) {
  radioElement.addEventListener('change', () => {
    const middleLetter = document.querySelector(
      'input[name=middle-letter]:checked'
    ).value;
    memoryController.updateMiddleLetter(middleLetter);
    updateHints();
  });
}

function updateHints() {
  // Clear existing hints.
  document.querySelector('main').innerHTML = '';

  try {
    const letterCountHints = new LetterCountHints();
    const wordStartHints = new WordStartHints();
    new PotentialWordHints(letterCountHints, wordStartHints);
    new FoundWordsController(letterCountHints, wordStartHints);
  } catch (exception) {
    showErrorBar('Unable to parse hint! Please try again.');
    console.log(exception);
  }
}

/** @param {string} errorMessage */
function showErrorBar(errorMessage) {
  const errorBar = document.getElementById('error');
  errorBar.innerText = errorMessage;
  errorBar.classList.remove('hidden');
}

function hideErrorBar() {
  const errorBar = document.getElementById('error');
  errorBar.innerText = '';
  errorBar.className = 'hidden';
}

// try {
//   document.querySelector('main').innerHTML = '';
//   const rawInput = getRawInput();
//   const combinedHints = new CombinedHints(
//     getMiddleLetter(),
//     letterCountHints,
//     wordStartHints
//   );

//   cookieController.updateHints({
//     rawInput: rawInput,
//     middleLetter: getMiddleLetter(),
//   });
// } catch (exception) {
//   console.log(exception);
//   showError('Unable to parse hint! Please try again.');
// }
// // });
