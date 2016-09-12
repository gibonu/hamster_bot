'use strict';

// consts
const Discord = require("discord.js");
const fs = require('fs');
const chalk = require('chalk');
const _ = require("underscore");

// variables
var bot = new Discord.Client({
    autoReconnect: true,
    maxCachedMessages: 1
});
var interval;
var games = ['Boku no Pico', 'Overwatch as WidowBitch', 'Fashion Wars 2', 'Adventures of Swedish Hamstereater', 'Digimon WENT', 'with herself', 'Menstruation Strikes Back', 'Attack on Hentai', 'Communistic Capitalism 3', 'Starshoes', 'Overwatch as Sombra', 'League of Salt', 'Doritos and M-Dew', 'with King\'s Row', 'Condi Thief on Vale Guardian', 'Boobnado', 'Half-Life 3', 'Portal 3',
    'Living Story Season 6', 'Dank Souls', 'Danker Souls', 'Dankest Souls', 'Bloodmeme', 'Fix It Trump!', 'Heroes of My Storm', 'League of Salt', 'Cyka blyat', 'Ass Effect'
];

// commands
var settings = {};
if(process.env.ENV !== 'production'){
  const config = require('./config.json');
  settings.config = config;
} else {
  settings.config = {};
  settings.config.owners = JSON.parse(process.env.owners);
  settings.config.botToken = process.env.botToken;
  settings.config.googleSearchId = process.env.googleSearchId;
  settings.config.imgurClientId = process.env.imgurClientId;
  settings.config.imgurSecret = process.env.imgurSecret;
  settings.config.MALUser = process.env.MALUser;
  settings.config.MALPass = process.env.MALPass;
}

settings.cacheTime = 21600000;
settings.startuptime = new Date() / 1000;

settings.KEYS = fs.readFileSync(__dirname + '\/googleAPIkeys.txt').toString().split("\n");
settings.KEYS.splice(-1, 1);
settings.KEYS = shuffle(settings.KEYS);
settings.lastKey = 0;

settings.commands = {};
var commands = settings.commands;

commands.help = {};
commands.help.main = function(bot, msg) {
    fs.readFile(__dirname + '\/help.txt', 'utf8', function(err, data) {
        if (err) {
            return bot.error(err);
        }
        bot.sendMessage(msg.author, data);
    });
};

commands.reload = {};
commands.reload.main = function(bot, msg, args) {
    if (_.contains(settings.config.owners, msg.author.id)) {
        try {
            delete commands[args];
            delete require.cache[__dirname + '\/commands\/' + args + '.js']; // require caches files, to reload need to clear cache
            commands[args] = require(__dirname + '\/commands\/' + args + '.js');
            bot.sendMessage(msg.author, 'Reloaded ' + args);
        } catch (err) {
            bot.sendMessage(msg.author, "Command not found or error reloading\n`" + err.message + "`");
        }
    } else {bot.sendMessage(msg.author, 'You are not my master');}
};

commands.game = {};
commands.game.main = function(bot, msg, args) {
    var newGame = randomizeGame();
    try {
        bot.user.setStatus("online", {
            name: newGame
        });
        clearInterval(interval);
        bot.deleteMessage(msg);
        bot.log('Wanna play ' + newGame + ' with me');
    } catch (error) {
        bot.error(error)
    };
}

// functions
var loadCommands = function() {
    var files = fs.readdirSync(__dirname + '\/commands');
    for (let file of files) {
        if (file.endsWith('.js')) {
            commands[file.slice(0, -3)] = require(__dirname + '\/commands\/' + file);
            bot.log('loaded: ' + __dirname + '\/commands\/' + file);
        }
    }
    bot.log("———— All Commands Loaded! ————");
}

var checkCommand = function(msg, length, bot) {
    try {
        if (typeof msg.content.split('!')[length] !== 'undefined') {
            var msgContent = JSON.parse(JSON.stringify(msg.content));
            var command;
            var params;
            while (msgContent.charAt(0) === '!') {
                msgContent = msgContent.substr(1);
            }
            command = msgContent.split(' ')[0];
            params = msgContent.split(' ').splice(1).join(' ');
            try {
                commands[command].main(bot, msg, params, settings)
                if (commands[command].deleteOriginal) {
                    msg.delete();
                }
            } catch (err) {
                bot.error(err);
                bot.sendMessage(msg.channel, 'Command not known.');
            }
        }
    } catch (err) {
        bot.error(err.message);
    }
}

function shuffle(a) {
    for (var c, d, b = a.length; b;) d = Math.floor(Math.random() * b--), c = a[b], a[b] = a[d], a[d] = c;
    return a
};

var randomizeGame = function() {
    var game = games[Math.floor(Math.random() * games.length)];
    return game;
}

// bot actions
bot.login(settings.config.botToken);

bot.on('ready', () => {
    bot.log("———— Hamsters on duty! ————");
    bot.user.setStatus("online", {
        name: randomizeGame()
    });
    loadCommands();
    interval = setInterval(function() {
        bot.user.setStatus("online", {
            name: randomizeGame()
        });
    }, 3600000);
});

bot.on('message', function(msg) {
    if (msg.content.startsWith('!')) {
        checkCommand(msg, 1, bot);
    }
});

bot.on('disconnect', function(bot) {
    clearInterval(interval);
    bot.log("Disconnected!");
});

// wrappers
bot.error = function() {
    console.log(chalk.bgRed.white(`Error: `), ...arguments);
}
bot.log = function() {
    console.log(chalk.green(`Log: `), ...arguments);
};
bot.sendMessage = function(channel, response) {
    channel.sendMessage(response).catch(err => bot.error(err));
}
bot.deleteMessage = function(msg) {
    msg.delete();
}
