// TODO - WIP -- ON GOING

var TelegramBot = require('node-telegram-bot-api');

//bot-name: HeraBoBot
var token = "258085660:AAGIOy5jnMewJ3z1CtuYtZ3MS4Tu9L5A0U8"

// Setup polling way
var bot = new TelegramBot(token, {polling: true});
var url = "https://hera-bot.herokuapp.com/"

bot.setWebHook(url, crt)

bot.getMe().then(function (me) {
  console.log('Hi my name is %s!', me.username);
});

// Start new conversation
bot.onText(/\/start (.+)/, function (msg, match) {
  var fromId = msg.from.id;
  var resp = "Hey! Ciao!"

  bot.sendMessage(fromId, resp);
});

// Matches /echo [whatever]
bot.onText(/\/echo (.+)/, function (msg, match) {
  var fromId = msg.from.id;
  var resp = match[1];

  bot.sendMessage(fromId, resp);
});

// Matches /echo [whatever]
bot.onText(/\/get (.+)/, function (msg, match) {
  var fromId = msg.from.id;
  var resp = match[1];

  bot.sendMessage(fromId, resp);
});

// Any kind of message
// bot.on('message', function (msg) {
//   var chatId = msg.chat.id;
//   // photo can be: a file path, a stream or a Telegram file_id
//   var photo = 'cats.png';
//   bot.sendPhoto(chatId, photo, {caption: 'Lovely kittens'});
// });
