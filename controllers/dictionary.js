'use strict'

const axios = require('axios')
const bot = require('../core/telegram')
const config = require('../data/config.json')
const utils = require('../core/utils')

function getDescription (msg, word, source, target) {
  const lang = utils.getUserLang(msg)
  let url = 'https://od-api.oxforddictionaries.com/api/v1/entries/'
  const input = encodeURIComponent(word)

  if (source && target) {
    url = url + source + '/' + input + '/translations=' + target
  } else {
    url = 'https://od-api.oxforddictionaries.com/api/v1/entries/' + 'en/' + input
  }

  axios.get(url, {
    headers: {
      'app_id': config.oxford.ID,
      'app_key': config.oxford.KEY
    }
  }).then(response => {
    console.log(response)
    if (response.status !== 200) {
      let message = response.statusText
      message = (response.status !== 404) ? `${lang.dictionary.dlg[0]} "${word}"` : message
      message = (response.status !== 500) ? `${lang.dictionary.dlg[1]}` : message

      bot.sendMessage(msg.chat.id, `<code>Error ${response.status}: ${message}</code>`, utils.optionalParams(msg))
      return
    }
    const title = utils.escapeHtml(response.data.results[0].word)
    let results = response.data.results[0].lexicalEntries
    let oxford = []
    const max = (results.length > 4) ? 4 : results.length

    if (source && target) {
      for (let i = 0; i < max; i++) {
        let trans = results[i].entries[0].senses
        for (let n = 0; n < trans.length; n++) {
          if (trans[n].translations) {
            oxford.push(trans[n].translations[0].text)
          }
        }
      }
      oxford = '<i>' + utils.escapeHtml(oxford.join(', ')) + '</i>'
    } else {
      if (results[0].derivativeOf) {
        const derivative = results[0].derivativeOf[0].text
        oxford.push(`➜ ${lang.dictionary.dlg[2]} <a href="https://en.oxforddictionaries.com/definition/${derivative}">${derivative}</a>`)
      } else {
        for (let i = 0; i < max; i++) {
          let sense = response.data.results[0].lexicalEntries[i].entries[0].senses[0]
          if (sense.definitions) {
            oxford.push('• ' + sense.definitions[0])
          } else {
            oxford.push('• ' + sense.crossReferences[0].text)
          }
        }
      }
      oxford = oxford.join('\n')
    }
    oxford = (results.length === 1) ? oxford.replace(/^• /, '') : oxford
    bot.sendMessage(msg.chat.id, '<b>' + title + '</b>\n' + oxford, utils.optionalParams(msg))
  })
  .catch(error => {
    bot.sendMessage(msg.chat.id, `<code>${error}</code>`, utils.optionalParams(msg))
  })
}

bot.onText(/^[/!#](d|dict|dictionary) (.+)/, (msg, match) => {
  getDescription(msg, `${match[2]}`.toLowerCase())
})

bot.onText(/^[/!#](t|trans|translate) (en|es|ro|ms|id)-(en|es|ro|ms|id) (.+)/, (msg, match) => {
  // https://developer.oxforddictionaries.com/documentation/languages
  const source = `${match[2]}`
  const target = `${match[3]}`

  if (source !== target) getDescription(msg, `${match[4]}`.toLowerCase(), source, target)
})
