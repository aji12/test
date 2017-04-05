'use strict';

const Tgfancy = require('tgfancy');
const config = require('./config');
const moment = require('moment');
const rangi = require('rangi');

const bot = new Tgfancy(config.BOT_TOKEN, {
    tgfancy: {
        openshiftWebHook: true,
    },
});;

bot.getMe().then(me => {
    console.log(rangi.cyan(`Bot Is Running => ${me.username}`));
    bot.sendMessage(config.SUDO, `<b>Bot Started!</b>\n<code>${moment().format('YYYY-MM-DD HH.mm.ss')}</code>`, {parse_mode: 'HTML'});
});

module.exports = bot;
