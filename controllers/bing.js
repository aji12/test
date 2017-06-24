'use strict'

const axios = require('axios')
const bot = require('../core/telegram')
const config = require('../data/config.json')
const utils = require('../core/utils')

function getBing (msg, query) {
  const lang = utils.getUserLang(msg)
  const limit = (msg.chat.type === 'private') ? 8 : 4

  if (!query) {
    bot.sendMessage(msg.chat.id, `${lang.bing.dlg[0]}.`, utils.optionalParams(msg))
    return
  }

  axios.get('https://api.cognitive.microsoft.com/bing/v5.0/search?q=' + query + '&' + limit, {
    headers: {
      'Ocp-Apim-Subscription-Key': config.bing.KEY
    }
  }).then(response => {
    console.log(response)
    if (response.status !== 200) {
      bot.sendMessage(msg.chat.id, `<code>Error ${response.status}: ${response.statusText}</code>`, utils.optionalParams(msg))
      return
    }

    const webPages = response.data.webPages ? response.data.webPages.value : 0

    if (webPages === 0) {
      bot.sendMessage(msg.chat.id, `${lang.bing.dlg[1]} <b>${query}</b>`, utils.optionalParams(msg))
      return
    }

    let bingo = []

    for (let i = 0; i < webPages.length; i++) {
      let link = webPages[i].displayUrl.replace(/ /, '%20')
      bingo.push('• <a href="' + link + '">' + utils.escapeHtml(webPages[i].name) + '</a>')
    }

    const subreddit = bingo.join('\n')
    const title = `<b>${lang.bing.dlg[2]} </b>${query}<b>:</b>`

    bot.sendMessage(msg.chat.id, `${title}\n${subreddit}`, utils.optionalParams(msg))
  })
  .catch(error => {
    bot.sendMessage(msg.chat.id, `<code>${error}</code>`, utils.optionalParams(msg))
  })
}

bot.onText(/^[/!#](b|b (.+)|bing|bing (.+))$/, (msg, match) => {
  if (msg.reply_to_message) {
    getBing(msg, msg.reply_to_message.text)
  } else {
    getBing(msg, msg.text.replace(/^[/!#](b|bing) /, ''))
  }
})
