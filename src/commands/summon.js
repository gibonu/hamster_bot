let getName = require('../utils.js').getName;

module.exports = {
    deleteOriginal: true,
    main: (bot, msg, params, settings) => {
        var request = params;
        var user = null;
        var tmp = getName(msg, request);
        var mentions = mapMentions(msg);
        if (mentions.length > 0 || tmp) {
            mentions.length > 0 ? user = mentions[0] : user = tmp.user;
            if(typeof user === 'object'){
              var rand = Math.floor(Math.random()*11);
              getSummoningMsg(bot, msg, rand, user, settings);
            } else {
              bot.sendMessage(msg.channel, '**' + msg.author.username + '** has not enough mana to perform summoning of '+ params);
            }
        } else bot.sendMessage(msg.channel, "Hey look, **" + msg.author.username + "** just appeared!");
    }
}

function mapMentions(msg){
  var mentions = [];
  msg.mentions.users.map(function(user) {
      mentions.push(user);
  });
  return mentions;
}

function getSummoningMsg(bot, msg, seed, user, settings){
  switch (seed) {
    case 0: bot.sendMessage(msg.channel, "I summon thee " + user + "!"); break;
    case 1: bot.sendMessage(msg.channel, user + ", get in there."); break;
    case 2: bot.sendMessage(msg.channel, "Still alive, " + user + "?"); break;
    case 3: bot.sendMessage(msg.channel, "Haruhi wished you never existed, " + user + " so what are you still doing here?"); break;
    case 4: bot.sendMessage(msg.channel, "Found you, " + user + ". You look better on Tinder."); break;
    case 5: bot.sendMessage(msg.channel, "Play with my King's Row " + user + "."); break;
    case 6: bot.sendMessage(msg.channel, "My " + user + "-shake brings all boys to the yard."); break;
    case 7: bot.sendMessage(msg.channel, "By the rules of CAPITALISM, I buy you, " + user + "."); break;
    case 8: bot.sendMessage(msg.channel, "Yes, the evidence speaks for itself. It proves how useless you are, " + user + "."); break;
    case 9: bot.sendMessage(msg.channel, "GET YOUR ASS BACK IN THERE " + user + "!"); break;
    case 10: bot.sendMessage(msg.channel, "Cameras add 5 kilograms? How many of them are on you, " + user + "?"); break;
  }
}
