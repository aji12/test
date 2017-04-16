'use strict'

const bot = require('../core/telegram')
const escapeHtml = require('escape-html')
const config = require('../core/config')
const utils = require('../core/utils')
const Bing = require('node-bing-api')({ accKey: config.BING })

function getBing (msg, query) {
  if (!config.BING) {
    bot.sendMessage(config.SUDO, "bing.js requires an API key, and you haven't got one configured!")
    return
  }

  const limit = (msg.chat.type === 'private') ? 8 : 4

  if (!query) {
    bot.sendMessage(msg.chat.id, 'Sorry, I am only capable to search text queries.', utils.optionalParams(msg))
    return
  }

  Bing.web(query, {
    count: limit  // Number of results (max 50)
  }, function (error, res, body) {
    if (error) return console.log('Shit happens...')

    const webPages = body.webPages ? body.webPages.value : 0

    if (webPages === 0) {
      bot.sendMessage(msg.chat.id, `No results found for <b>${query}</b>`, utils.optionalParams(msg))
      return
    }

    let bingo = []

    for (let i = 0; i < webPages.length; i++) {
      bingo.push('• <a href="' + webPages[i].displayUrl + '">' + escapeHtml(webPages[i].name) + '</a>')
    }

    let subreddit = bingo.join('\n')
    const title = `<b>Bing results for</b> ${query}<b>:</b>`

    bot.sendMessage(msg.chat.id, `${title}\n${subreddit}`, utils.optionalParams(msg))
  })
}

bot.onText(/^[/!#](b|bing)/, (msg) => {
  if (!msg.reply_to_message) { return }
  const query = msg.reply_to_message.text
  getBing(msg, query)
})

bot.onText(/^[/!#](b|bing) /, (msg) => {
  const query = msg.text.replace(/^[/!#](b|bing) /, '')
  getBing(msg, query)
})
