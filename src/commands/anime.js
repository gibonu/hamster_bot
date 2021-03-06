'use strict';
let request = require('request'),
    xml2js = require('xml2js'),
    fix = require('entities')

module.exports = {
    main: (bot, msg, content, settings) => {
        let auth = "Basic " + new Buffer(settings.config.MALUser + ":" + settings.config.MALPass).toString("base64");
        let baseRequest = request.defaults({
            headers: {
                authorization: auth
            }
        });
        let anime = content.split(" ").join("+");
        let apiURL = "http://myanimelist.net/api/anime/search.xml?q=" + anime;
        let entry;
        try {
            baseRequest(apiURL, function(error, response, body) {
                if (response.statusCode == 200) {
                    xml2js.parseString(body, function(err, result) {
                        if(result.anime.entry.length > 5){
                          bot.sendMessage(msg.channel, 'Please define your inquiry. I found too many matches relating to ' + content + '. Returning first match: ');
                          let animeString = printAnimeEntry(result.anime.entry[0]);
                          bot.sendMessage(msg.channel, animeString);
                          return 0;
                        }
                        for (entry in result.anime.entry) {
                            let animeString = printAnimeEntry(result.anime.entry[entry]);
                            bot.sendMessage(msg.channel, animeString);
                        }
                    });
                } else bot.sendMessage(msg.channel, "No anime found for: \"**" + content + "**\"");
            })
        } catch (err) {
            bot.error(err)
        }
    }
}

function printAnimeEntry(entry){
  var animeString = "";
  var synopsis = entry.synopsis.toString();
  synopsis = synopsis.replace(/<br \/>/g, " ");
  synopsis = synopsis.replace(/\[(.{1,10})\]/g, "");
  synopsis = synopsis.replace(/\r?\n|\r/g, " ");
  synopsis = synopsis.replace(/\[(i|\/i)\]/g, "*");
  synopsis = synopsis.replace(/\[(b|\/b)\]/g, "**");
  synopsis = fix.decodeHTML(synopsis);
  if (synopsis.length > 1000) {
      synopsis = synopsis.substring(0, 1000);
      synopsis += "...";
  }
  animeString += "__**" + entry.title + "**__ - __**" + entry.english + "**__ • *" + entry.start_date + "*  to *" + entry.end_date + "*\n";
  animeString += "\n**Type:** *" + entry.type + "*  **Episodes:** *" + entry.episodes + "*  **Score:** *" + entry.score + "*";
  animeString += "\n" + synopsis;
  animeString += "\n**<http://myanimelist.net/anime/" + entry.id + "/>**";
  return animeString;
}
