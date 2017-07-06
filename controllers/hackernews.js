'use strict'

const bot = require('../core/telegram')
const FeedParser = require('feedparser')
const request = require('request')

bot.onText(/^[/!#](hn|hackernews)$/, (msg) => {
  const feedUrl = 'https://news.ycombinator.com/rss'
  const feedparser = new FeedParser([feedUrl])
  const limit = (msg.chat.type === 'private') ? 8 : 4
  const req = request(feedUrl)
  let results = []

  req.on('error', function (error) {
    if (error) {
      bot.reply(msg, 'Request error.')
    }
  })

  req.on('response', function (res) {
    const stream = this

    if (res.statusCode !== 200) {
      bot.reply(msg, 'Bad status code.')
    } else {
      stream.pipe(feedparser)
    }
  })

  feedparser.on('error', function (error) {
    if (error) {
      bot.reply(msg, 'FeedParser error.')
    }
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
    bot.reply(msg, '<b>Hacker News</b>\n' + output)
  })
})
