'use strict'

const bot = require('../core/telegram')
const config = require('../core/config')
const escapeHtml = require('escape-html')
const request = require('request')
const utils = require('../core/utils')

function getBing (msg, query) {
  const limit = (msg.chat.type === 'private') ? 8 : 4

  if (!query) {
    bot.sendMessage(msg.chat.id, 'Sorry, I am only capable to search text queries.', utils.optionalParams(msg))
    return
  }

  request({
    url: 'https://api.cognitive.microsoft.com/bing/v5.0/search?q=' + query + '&' + limit,
    method: 'GET',
    headers: {
      'Ocp-Apim-Subscription-Key': config.BING
    }
  }, (error, res, body) => {
    if ((error) || !(body)) return console.log('Shit happens...')

    const bbody = JSON.parse(body)
    const webPages = bbody.webPages ? bbody.webPages.value : 0

    if (webPages === 0) {
      bot.sendMessage(msg.chat.id, `No results found for <b>${query}</b>`, utils.optionalParams(msg))
      return
    }

    let bingo = []

    for (let i = 0; i < webPages.length; i++) {
      let link = webPages[i].displayUrl.replace(/ /, '%20')
      bingo.push('• <a href="' + link + '">' + escapeHtml(webPages[i].name) + '</a>')
    }

    const subreddit = bingo.join('\n')
    const title = `<b>Bing results for</b> ${query}<b>:</b>`

    bot.sendMessage(msg.chat.id, `${title}\n${subreddit}`, utils.optionalParams(msg))
  })
}

bot.onText(/^[/!#](b|b (.+)|bing|bing (.+))/, (msg, match) => {
  if (msg.reply_to_message) {
    getBing(msg, msg.reply_to_message.text)
  } else {
    getBing(msg, msg.text.replace(/^[/!#](b|bing) /, ''))
  }
})
