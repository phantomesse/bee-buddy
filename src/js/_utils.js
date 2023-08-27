/**
 * @param {string} tagName
 * @param {string | string[]} classNames
 * @param {HTMLElement} [parentElement] optional parent element to append this element to
 */
function createElement(tagName, classNames, parentElement) {
  const element = document.createElement(tagName);
  if (typeof classNames === 'string') {
    element.className = classNames;
  } else {
    element.classList.add(...classNames);
  }
  if (parentElement) parentElement.append(element);
  return element;
}

module.exports = { createElement };
