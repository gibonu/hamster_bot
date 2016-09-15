'use strict';
const request = require('request');
const iso = require('iso-639-1');
const querystring = require("querystring");
const _ = require("underscore");

module.exports = {
    deleteOriginal: false,
    main: function(bot, msg, params, settings) {
        let args = params.replace(/"/g, '');
        let toLang = args.split(' ')[args.split(' ').length - 1];
        toLang = iso.getCode(toLang) == '' ? toLang : iso.getCode(toLang);
        args = args.replace((" " + args.split(' ')[args.split(' ').length - 1]), '')
        args = querystring.escape(args);
        let fromlang = 'auto';
        let gurl = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" + fromlang + "&tl=" + toLang + "&ie=UTF-8&dt=t&q=" + args;
        request(gurl, function(error, response, body) {
            try {
                let result = "";
                let translated = body.match(/\[".+?",/g);
                console.log(translated.length);
                for (var i = 0; i < translated.length - 1; i++) {
                    var tmp = translated[i].substring(2, translated[i].length - 2);
                    result += tmp;
                }
                msg.channel.sendMessage("```\nTranslated:\n" + result + "\n```");
            } catch (err) {
                msg.channel.sendMessage("`Input was invalid`");
            }
        });
    },
    help: 'template'
};
