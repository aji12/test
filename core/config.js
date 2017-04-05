module.exports = {
    // MongoDB database link. Let it empty if using openshift.
    MONGO_URI: process.env.MONGODB_URL || '',
    // Your authorization token from the @botfather. Is string and quoted.
    BOT_TOKEN: process.env.BOT_TOKEN || '',
    // Bots ID number. It is numbers before colon in bots token.
    BOT_ID: process.env.BOT_ID || '',
    // Bot owner ID number.
    SUDO: process.env.SUDO || '',
    // The channel, group, or user to send error reports to.
    LOG_CHANNEL: process.env.LOG_CHANNEL || ''
};
