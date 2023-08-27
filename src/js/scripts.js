const { LetterCountHints } = require('./_letter-count-hints.js');
const { WordStartHints } = require('./_word-start-hints.js');
const { CombinedHints } = require('./_combined-hints.js');

const errorBar = document.getElementById('error');

function showError(errorMessage) {
  errorBar.innerText = errorMessage;
}

const textarea = document.querySelector('textarea');

textarea.value = `
4	5	6	7	8	10	Σ
A:	3	1	1	2	1	-	8
B:	1	3	1	-	1	1	7
C:	1	1	4	-	1	1	8
I:	1	1	-	-	-	-	2
L:	2	-	-	-	-	-	2
Σ:	8	6	6	2	3	2	27
Two letter list:

AB-2 AC-1 AL-2 AM-3 
BA-2 BI-4 BL-1 
CA-2 CL-2 CY-4 
IC-1 IL-1 
LA-1 LI-1 
`;
textarea.addEventListener('blur', () => {
  try {
    document.querySelector('main').innerHTML = '';
    const letterCountHints = new LetterCountHints(textarea.value);
    const wordStartHints = new WordStartHints(textarea.value);
    const combinedHints = new CombinedHints(letterCountHints, wordStartHints);
  } catch (exception) {
    console.log(exception);
    showError('Unable to parse hint! Please try again.');
  }
});
