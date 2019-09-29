process.env["NTBA_FIX_319"] = 1
const TelegramBot = require('node-telegram-bot-api');
const model = require('./src/model');
const config = require('./src/config');

const bot = new TelegramBot(config.token, { polling: true });

bot.onText(/\//, async (data, match) => {
    let result = await model.run(data, match)
    bot.sendMessage(result.chatId, result.message);
});

// bot.onText(/\/liveall/, (msg) => {
//     const chatId = msg.chat.id;
//     request('', { json: true }, (err, res, body) => {
//         if (err) bot.sendMessage(chatId, 'Произошла некоторая ошибка, попробуйте позже');

//         let curr = '';
//         let metal = '';
//         for (let cur of body) {
//             if (metalArr.includes(cur.r030)) {
//                 metal[cur.txt] = cur.rate;
//                 //metal += `${cur.txt} - ${cur.rate} \n`
//             } else {
//                 curr[cur.txt] = cur.rate;
//                 //curr += `${cur.txt} - ${cur.rate} \n`;
//             }
//         }
//         console.log(curr);

//         let text = `Валюты:\n`;
//         for (let key in curr) {
//             text += `${key} - ${curr[key]}\n`;
//         }

//         text += `\nМеталы:\n`
//         for (let key in metal) {
//             text += `${key} - ${metal[key]}\n`;
//         }

//         bot.sendMessage(chatId, text);

        
//     });
// });