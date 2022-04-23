const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, agaiOnptions} = require('./options')

const token = '5385616769:AAEA66HiaEb75viOZUkHZuKMIS90cgVtVNU'

const bot = new TelegramApi(token, { polling: true })

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать!`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    console.log(chats[chatId]);
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'начальное приветствие' },
        { command: '/info', description: 'Получить информацию о пользователе' },
        { command: '/game', description: 'Игра угадай цифру' },
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp')
            return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот`)
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`)
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз')
    })

    bot.on('callback_query', async msg => {        
        const data = msg.data;
        const chatId = msg.message.chat.id;        
        console.log(data);
        if(data === '/again') {
            return startGame(chatId);
        }      
        if(data == chats[chatId]) {
            return await bot.sendMessage(chatId, `Поздравляю ты отгадал цифру ${chats[chatId]}`, agaiOnptions)
        } else {
            return await bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, agaiOnptions)
        }
        //bot.sendMessage(chatId, `Ты выбрал цифру ${data}`)
    })
}

start()