const escapeHtml = require('escape-html')
const locale = require('../core/locale.json')
const JsonDB = require('node-json-db')

let db = new JsonDB('db.json', true, false)

const Util = {};

Util.startsWith = function(string, what) {
  return string.slice(0, what.length) === what
};

Util.parseInline = function(message, commandName, options = {}) {
  options.noRequireTrigger = true;

  return this.parseCommand(message, commandName, options)
};

Util.escapeRegExp = function(str) {
  log.debug(`Escaping RegExp: ${str}`);
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
};

// http://stackoverflow.com/a/2117523
Util.makeUUID = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
  /[xy]/g,
  c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16)
  }
);

Util.buildUserName = function(user, parse) {
  let name = '';

  if (user.first_name) name += escapeHtml(user.first_name) + ' ';
  if (user.last_name) name += escapeHtml(user.last_name) + ' ';

  if (parse === 'html') {
    if (user.username) name = `<b>${name}</b> @${user.username} [<code>${user.id}</code>] `
  } else {
    if (user.username) name += `@${user.username} [${user.id}] `
  }

  return name.trim()
};

Util.buildChatName = function(chat, parse) {
  let name = '';

  if (chat.first_name) name += escapeHtml(chat.first_name) + ' ';
  if (chat.last_name) name += escapeHtml(chat.last_name) + ' ';
  if (chat.title) name = escapeHtml(chat.title) + ' ';

  if (parse === 'html') {
    if (chat.username) name = `<b>${name}</b> @${chat.username} [<code>${chat.id}</code>] `
  } else {
    if (chat.username) name += `@${chat.username} [${chat.id}] `
  }
  // if (chat.type) name += `(${chat.type}) `;

  return name.trim()
};

Util.getUserLang = function(msg) {
  let lang = locale.en

  try {
    db.reload()
    let dbLang = db.getData(`/${msg.from.id}/lang`)
    console.log('=======================', dbLang)
    lang = locale[`${dbLang}`]
  } catch (error) {
    console.error(error)
  }

  return lang
}

Util.optionalParams = function(msg) {
  const opts = {
    reply_to_message_id: msg.message_id,
    disable_web_page_preview: 'true',
    parse_mode: 'HTML'
  }
  return opts  
}

module.exports = Util;
