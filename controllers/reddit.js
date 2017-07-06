'use strict'

const bot = require('../core/telegram')
const request = require('request')
const utils = require('../core/utils')

bot.onText(/^[/!#](r|reddit) (.+)/, (msg, match) => {
  const lang = utils.getUserLang(msg)
  // Returns 8 results if in private, and 4 if in groups
  const limit = (msg.chat.type === 'private') ? 8 : 4
  // If no r/ in front of the query, search reddit for query
  let input = `${match[2]}`
  let title = `<b>${lang.reddit.dlg[0]} -</b> ${input}:`
  let url = `https://www.reddit.com/search.json?q=${input}&limit=${limit}`

  // If there is r/ in front of the query, get the query
  if (input.match(/^r\//)) {
    // Clean up the query from unwanted characters
    input = input.replace(/^.+\//, '')
    title = `<b>r/${input}</b>`
    url = `https://www.reddit.com/r/${input}/.json?limit=${limit}`
  }

  request(url, (error, response, body) => {
    if (error) {
      bot.reply(msg, `API query failure: <code>${error.message}</code>`)
      return
    }
    if (response.statusCode !== 200) {
      bot.reply(msg, `<code>${response.statusMessage}</code>`)
      return
    }

    const jeddit = JSON.parse(body)
    const reddit = jeddit.data.children
    let sub = []

    if (reddit.length === 0) {
      if (body.data.facets) {
        bot.reply(msg, `${lang.reddit.dlg[1]}`)
        return
      } else {
        bot.reply(msg, `${lang.reddit.dlg[2]}`)
        return
      }
    }
    for (let i = 0; i < reddit.length; i++) {
      sub.push('• <a href="https://redd.it/' + reddit[i].data.id + '">' + utils.escapeHtml(reddit[i].data.title) + '</a>')
    }

    let subreddit = sub.join('\n')

    bot.reply(msg, `${title}\n${subreddit}`)
  })
})
