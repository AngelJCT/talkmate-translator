
/**
 * @typedef {Object} ChatMessage
 * @property {string} id
 * @property {'user'|'bot'} sender
 * @property {string} text
 * @property {string} [image]
 */

export const MessageSender = Object.freeze({
  USER: 'user',
  BOT: 'bot',
});

export const ChatMode = Object.freeze({
  LEARN: 'learn',
  TRANSLATE: 'translate',
});
