'use strict'

const axios = require('axios')
const bot = require('../core/telegram')
const FeedParser = require('feedparser')
const utils = require('../core/utils')
let results = []

bot.onText(/^[/!#](hn|hackernews)$/, (msg) => {
  const feedUrl = 'https://news.ycombinator.com/rss'
  const limit = (msg.chat.type === 'private') ? 8 : 4
  const feedparser = new FeedParser([feedUrl])

  axios.get(feedUrl, {
    responseType: 'stream'
  }).then(response => {
    if (response.status !== 200) {
      bot.sendMessage(msg.chat.id, `<code>Error ${response.status}: ${response.statusText}</code>`, utils.optionalParams(msg))
      return
    }
    response.data.pipe(feedparser)
  })
  .catch(error => {
    bot.sendMessage(msg.chat.id, `<code>${error}</code>`, utils.optionalParams(msg))
  })

  feedparser.on('error', function (error) {
    bot.sendMessage(msg.chat.id, 'FeedParser error.', utils.optionalParams(msg))
  })

  feedparser.on('readable', function () {
    let item
    let _entries = []

    while (item = this.read()) {
      _entries.push(results.push('• [<a href="' + item['rss:comments']['#'] + '">' + item.summary.match(/\d+/) + '</a>] <a href="' + item.link + '">' + item.title + '</a>'))
    }

    return _entries
  })

  feedparser.on('end', function () {
    const output = results.slice(0, limit).join('\n')
    bot.sendMessage(msg.chat.id, '<b>Hacker News</b>\n' + output, utils.optionalParams(msg))
  })
})
