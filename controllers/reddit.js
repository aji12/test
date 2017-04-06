'use strict';

const bot = require('../core/telegram');
const escapeHtml = require('escape-html');
const request = require('request');

bot.onText(/^[\/!#](reddit|r) (.+)/, (msg, match) => {
  // Returns 8 results if in private, and 4 if in groups
  let limit = (msg.chat.type == 'private') ? 8 : 4;
  let sub = [];
  // If no r/ in front of the query, search reddit for query
  let input = `${match[2]}`;
  let title = `<b>Results for</b> ${input}:`;
  let url = `https://www.reddit.com/search.json?q=${input}&limit=${limit}`;

  // If there is r/ in front of the query, get the query
  if (input.match(/^r\//)) {
    // Clean up the query from unwanted characters
    input = input.replace(/^.+\//, '');
    title = `<b>r/${input}</b>`;
    url = `https://www.reddit.com/r/${input}/.json?limit=${limit}`;
  }

  request(url, function(error, response, body) {
    let json = JSON.parse(body);
    let reddit = json.data.children;

    for(let i = 0; i < reddit.length; i++) {
      sub.push('• <a href="https://redd.it/' + reddit[i].data.id + '">' + escapeHtml(reddit[i].data.title) + '</a>');
    }

    if (sub.length > 0) {
      let subreddit = sub.join('\n');

      bot.sendMessage(msg.chat.id, `${title}\n${subreddit}`, {
        disable_web_page_preview: 'true', parse_mode: 'HTML'
      });
    } else {
      bot.sendMessage(msg.chat.id, "There doesn't seem to be anything...", {
        disable_web_page_preview: 'true',
        parse_mode: 'HTML'
      });
    }
  });
});
