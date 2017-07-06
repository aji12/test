'use strict'

const bot = require('../core/telegram')
const request = require('request')
const utils = require('../core/utils')

bot.onText(/^[/!#](cash|currency) (\d+) ([a-z]{3}) to ([a-z]{3})/, (msg, match) => {
  const lang = utils.getUserLang(msg)
  let amount = match[2]
  let from = match[3]
  let to = match[4]
  let url = 'https://www.google.com/finance/converter'
  url = `${url}?from=${from}&to=${to}&a=${amount}`

  request(url, (error, response, body) => {
    if (error) { return console.log('=> currecy.js: Connection error') }

    let currency = lang.currency.dlg[0]
    let valas = body.match(/currency_converter_result>(.+)/)

    if (valas) {
      valas = valas[1].replace(/<\/?.*?>/g, '')
      from = from.toUpperCase()
      to = to.toUpperCase()
      // Node.js seems to not fully support intl
      // At least it can divide number into three digits groups
      amount = Number(amount).toLocaleString()
      let result = valas.match(/= (\d+)/)
      result = Number(result[1]).toLocaleString()
      const timestamp = utils.formatMsgDate(msg, true)
      currency = `<b>${amount} ${from} = ${result} ${to}</b>`
      currency += `\n\n${timestamp} UTC\n${lang.dialog.source}: Google Finance`
    }
    bot.reply(msg, currency)
  })
})
