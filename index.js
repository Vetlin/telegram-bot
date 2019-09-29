process.env["NTBA_FIX_319"] = 1
console.log('Server running');
const TelegramBot = require('node-telegram-bot-api');
const model = require('./src/model');
const config = require('./src/config');

const bot = new TelegramBot(config.token, { polling: true });

bot.onText(/\//, async (data, match) => {
    let result = await model.run(data, match)
    bot.sendMessage(result.chatId, result.message);
});