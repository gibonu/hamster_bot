'use strict';
const request = require('request');
const iso = require('iso-639-1');
const querystring = require("querystring");

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
                let translated = body.match(/^\[\[\[".+?",/)[0];
                translated = translated.substring(4, translated.length - 2);
                msg.channel.sendMessage("```\nTranslated:\n" + translated + "\n```");
            } catch (err) {
                msg.channel.sendMessage("`Input was invalid`");
            }
        });
    },
    help: 'template'
};
