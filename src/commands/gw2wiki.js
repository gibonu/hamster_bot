'use strict';
let request = require('request-promise'),
    toMarkdown = require("to-markdown")

module.exports = {
    main: function(bot, msg, params, settings) {
        let apiURL = "https://wiki.guildwars2.com/api.php";
        try {
            let options = {
                method: "GET",
                uri: apiURL,
                qs: {
                    action: "query",
                    list: "search",
                    format: "json",
                    srsearch: params,
                    srwhat: "nearmatch"
                },
                json: true
            }
            request(options).then(response => {
                if (response.query.search.length > 0) return response;
                else throw new Error('not found');
            }).then(response => {
                let options = {
                    method: "GET",
                    uri: apiURL,
                    qs: {
                        action: "parse",
                        page: response.query.search[0].title,
                        format: "json",
                        redirects: true,
                        prop: "text"
                    },
                    json: true
                }
                return request(options);
            }).then(response => {
                if (response.parse.text["*"]) {
                    let text = response.parse.text["*"];
                    const title = response.parse.title;

                    // Construct message
                    text = htmlToMessage(text).split("\n")[0].trim();
                    const url = encodeURI(`https://wiki.guildwars2.com/wiki/${title}`);
                    if (text) text += "\n\n" + 'More at: ' +url;
                    else text = "Wiki: "+ title +" "+ url;

                    bot.sendMessage(msg.channel, text);
                }
            })
        } catch (err) {
            bot.error(err)
        }
    }
}

function htmlToMessage(html) {
    return toMarkdown(html, {
        converters: [{ // Convert various stuff to plain-text
            filter: ["a", "small"],
            replacement: (innerHTML, node) => innerHTML
        }, { // Filter out all unwanted tags
            filter: node => !node.nodeName.match(/^(b|strong|i|em|s|del|p)$/i),
            replacement: (innerHTML, node) => ""
        }]
    });
}
