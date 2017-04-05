'use strict';

const bot = require('../core/telegram');
const escapeHtml = require('escape-html');
const request = require('request');

bot.onText(/[\/!#](reddit|r) (.+)/, (msg, match) => {
  let limit = (msg.chat.type == 'private') ? 8 : 4;
  let sub = [];
  let input = `${match[2]}`;
  let title = `<b>Results for</b> ${input}:`;
  let url = `https://www.reddit.com/search.json?q=${input}&limit=${limit}`;

  if (input.match(/^r\//)) {
    title = `<b>${input}</b>`;
    url = `https://www.reddit.com/${input}/.json?limit=${limit}`;
  }

  request(url, function(error, response, body) {
    let json = JSON.parse(body);
    let reddit = json.data.children;
    
    for(let i = 0; i < reddit.length; i++) {
      sub.push('• <a href="https://redd.it/' + reddit[i].data.id + '">' + escapeHtml(reddit[i].data.title) + '</a>');
    }
    
    if (sub.length > 0) {
      let subreddit = sub.join('\n');
      bot.sendMessage(msg.chat.id, `${title}\n${subreddit}`, {disable_web_page_preview: 'true', parse_mode: 'HTML'});
    } else {
      bot.sendMessage(msg.chat.id, "There doesn't seem to be anything...", {reply_to_message_id: msg.message_id, disable_web_page_preview: 'true', parse_mode: 'HTML'});
    }
  });
});
