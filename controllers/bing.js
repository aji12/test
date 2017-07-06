'use strict'

const bot = require('../core/telegram')
const config = require('../data/config.json')
const request = require('request')
const utils = require('../core/utils')

function getBing (msg, query) {
  const lang = utils.getUserLang(msg)
  const limit = (msg.chat.type === 'private') ? 8 : 4

  if (!query) {
    bot.reply(msg, `${lang.bing.dlg[0]}.`)
    return
  }

  request({
    url: 'https://api.cognitive.microsoft.com/bing/v5.0/search?q=' + query + '&' + limit,
    method: 'GET',
    headers: {
      'Ocp-Apim-Subscription-Key': config.bing.KEY
    }
  }, (error, response, body) => {
    if (error) {
      bot.reply(msg, `API query failure: <code>${error.message}</code>`)
      return
    }
    if (response.statusCode !== 200) {
      bot.reply(msg, `<code>Error ${response.statusCode}: ${response.statusMessage}</code>`)
      return
    }

    const bbody = JSON.parse(body)
    const webPages = bbody.webPages ? bbody.webPages.value : 0

    if (webPages === 0) {
      bot.reply(msg, `${lang.bing.dlg[1]} <b>${query}</b>`)
      return
    }

    let bingo = []

    for (let i = 0; i < webPages.length; i++) {
      let link = webPages[i].displayUrl.replace(/ /, '%20')
      bingo.push('• <a href="' + link + '">' + utils.escapeHtml(webPages[i].name) + '</a>')
    }

    const subreddit = bingo.join('\n')
    const title = `<b>${lang.bing.dlg[2]} </b>${query}<b>:</b>`

    bot.reply(msg, `${title}\n${subreddit}`)
  })
}

bot.onText(/^[/!#](b|b (.+)|bing|bing (.+))$/, (msg, match) => {
  if (msg.reply_to_message) {
    getBing(msg, msg.reply_to_message.text)
  } else {
    getBing(msg, msg.text.replace(/^[/!#](b|bing) /, ''))
  }
})
