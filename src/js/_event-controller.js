const _FOUND_WORD_EVENT_NAME = 'found-word';

class EventController {
  constructor() {}

  addFoundWordListener(listener) {
    document.body.addEventListener(_FOUND_WORD_EVENT_NAME, listener);
  }

  dispatchFoundWordEvent() {
    document.body.dispatchEvent(new CustomEvent(_FOUND_WORD_EVENT_NAME));
  }
}

const eventController = new EventController();
module.exports = { eventController };
