const TelegramApi = require('node-telegram-bot-api');
const {gameOptions,againOptions} = require('./options')

const token = '5922118448:AAH17dbglCR28Fz3HgMDYQwgbnSFLmTiAnA';

const bot = new TelegramApi(token, {
    polling: true
});

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'теперь я загадаю цифру от 0 до 9, и ты должен его угадать');
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    console.log(chats)
    await bot.sendMessage(chatId ,'Отгадывай', gameOptions);
}


const start = () => {

    bot.setMyCommands([
        {command: "/start" , description: "начальное приветствие"},
        {command: "/info" , description: "получить информацию о пользователе"},
        {command: "/game" , description: "игра угадай цифру"},
    ]);

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            return bot.sendMessage(chatId, `Добро пожаловать в бота!`);
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`);
        }
        if(text === '/game'){
         return startGame(chatId);  
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз');
    });

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again'){
            return startGame(chatId)
        }

        if(data == chats[chatId]){
            return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions);
        } else {
            return bot.sendMessage(chatId, `К сожилению ты не угадал, бот загадал цифру ${chats[chatId]} `, againOptions);
        }
    })

}
start();


