module.exports = {
    main: function(bot, msg, params, settings) {
      try{
        let entries = params.split(', ');
        let noOfEntries = entries.length;
        let rng = Math.floor(Math.random() * noOfEntries);

        bot.sendMessage(msg.channel, "Aaaand the winner is... " + entries[rng] + ". Congrats!");
      } catch(err){
        bot.log(err);
        bot.sendMessage(msg.channel, "Oops, something went wrong");
      }
    }
}
