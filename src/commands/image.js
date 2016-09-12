const request = require("request");
const cheerio = require('cheerio');
const querystring = require('querystring');
const utils = require('../utils.js');

module.exports = {
    deleteOriginal: true,
    //google search
    main: function(bot, msg, params, settings) {
        var args = params;
        safe_map = {
            1: "off",
            2: "medium",
            3: "high"
        };
        msg.channel.sendMessage("`Searching...`").then(message => {
            //
            // if (params.startsWith("/r/")) {
            //   let response = {},
            //           query = params,
            //           sort = "top",
            //           page = 1 + Math.floor(Math.random() * 10);
            //     query = query.replace(" ", "_");
            //     let apiURL = "https://api.imgur.com/3/gallery" + query + "/" + sort + "/" + page + "/";
            //     get_image(bot, message, apiURL, query, settings);
            //
            // } else {
            var key = settings.KEYS[settings.lastKey];
            // var safe_setting = safe_map[parseInt(thing.nsfw)];
            //var safe = (msg.channel.name.includes("nsfw") ? "off" : safe_setting);
            var page = 1 + Math.floor(Math.random() * 5) * 10;
            var url = "https://www.googleapis.com/customsearch/v1?key=" + key + "&cx=" + settings.config.googleSearchId + "&searchType=image&q=" + encodeURI(args) + "&alt=json&num=10&start=" + page;
            try {
                request(url, function(error, response, body) {
                    try {
                        var parsed = JSON.parse(body)['items'];
                        var rng = Math.floor(Math.random() * parsed.length);
                        message.edit("```Here is yours " + args + " " + msg.author.username + "-senpai```");
                        bot.sendMessage(msg.channel, parsed[rng]['link']);
                    } catch (err) {
                      bot.log(err);
                        request('https://www.google.com/search?tbm=isch&gs_l=img&q=' + encodeURI(args) + '&alt=json&num=50&start=' + page, function(error, response, body) {
                            if (!error && response.statusCode == 200) {
                                try {
                                    $ = cheerio.load(body);
                                    var imgs = $('.images_table').find('img');
                                    var rng = Math.floor(Math.random() * imgs.length);
                                    var src = imgs[rng].attribs.src;
                                    if (src) {
                                        message.edit("```Here is yours " + args + " " + msg.author.username + "-chan```");
                                        bot.sendMessage(msg.channel, src);
                                    } else {
                                        message.edit("`No results found!`");
                                    }
                                } catch (err) {
                                    bot.error(err)
                                    message.edit("`No results found!`");
                                }
                            } else {
                                message.edit("`No results found!`");
                            }
                        });
                    }
                });
            } catch (err) {
                message.edit("`No results found!`");
            }
            settings.toBeDeleted.set(msg.id, message.id);
            settings.lastKey += 1;
            if (settings.lastKey + 1 > settings.KEYS.length) settings.lastKey = 0;
              // }
        });
    },
    args: '<query>'
};

// imgur search
// main: function(bot, msg, settings) {
//     let response = {},
//         query = msg.content,
//         sort = "top",
//         page = 0;
//     if (query.startsWith("/r/")) {
//         query = query.replace(" ", "_");
//         let apiURL = "https://api.imgur.com/3/gallery" + query + "/" + sort + "/" + page + "/";
//         get_image(bot, msg, apiURL, query, settings);
//     } else {
//         query = query.replace(" ", "_");
//         page = 1 + Math.floor(Math.random() * 10);
//         let apiURL = "https://api.imgur.com/3/gallery/search/" + sort + "/" + page + "/?q=" + query;
//         get_image(bot, msg, apiURL, query, settings);
//     }
// },

//private functions

// function get_image(bot, msg, apiURL, query, settings) {
//     var baseRequest = request.defaults({
//         headers: {
//             'Authorization': 'Client-ID ' + settings.config.imgurClientId
//         }
//     });
//     baseRequest(apiURL, function(error, response, body) {
//         let tmp = JSON.parse(body);
//         if (tmp.data.length !== 0) {
//             response = tmp.data[Math.floor(Math.random() * (tmp.data.length))];
//             if (response.link != undefined) {
//                 let postedDate = new Date(0),
//                     temp = "";
//                 postedDate.setUTCSeconds(response.datetime);
//                 if (response.description != null) {
//                     temp = "\nDescription: " + response.description;
//                     temp = temp.replace(/.*?:\/\//g, "");
//                 }
//                 msg.edit("```I looked at darkest places in the Internet: " + args + " just for you " + msg.author.username + "-sama```");
//                 bot.sendMessage(msg.channel, "```image title: " + response.title + "```" + response.link);
//             } else bot.sendMessage(msg.channel, "no results")
//         } else bot.sendMessage(msg.channel, "no results");
//     })
// }
