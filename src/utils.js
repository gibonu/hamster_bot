exports.getName = (msg, name) => {
    try {
        var users = [];
        if (!name) return null;
        else {
            let nameRegex = new RegExp('^'+name+'$', "i");
            msg.channel.guild.members.map(function(member) {
                users.push(member);
            })
            for (var k in users) {
                if (users[k].user.username.match(nameRegex)) {
                    return users[k];
                }
            }
            return 'user does not exist';
        }
    } catch (e) {
        console.log(e);
    }
}
