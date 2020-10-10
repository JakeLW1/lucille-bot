const { Command } = require("discord.js-commando")
const { getMusic } = require("../../messageHelpers")

module.exports = class extends Command {
    constructor (client) {
      super(client, {
        name: "banga",
        aliases: ["banger", "banging", "bangin"],
        group: "fun",
        memberName: "banga",
        description: "Logs user bangers",
        args: [],
        guildOnly: true,
      })
    }

    async run (msg, args) {
        const music = getMusic(msg);
        const currTrack = music.state.queue[0].youTubeTitle;
        if(!currTrack) {
            msg.channel.send("Hold your horses, you cunt")
            return
        }
        const checkEx = this.client.bangaTracker.checkForBanga(currTrack);
        if(args === "?") {
            msg.channel.send(`${this.findUsers(checkEx).join(", ")} think its a banger`)
            return;
        }
        if(!music.state.currentVideo.title) {
            msg.channel.send("No music is playing")
        } else {
            if(checkEx.length) {
                if (this.checkForUser(checkEx, msg)) {
                    msg.channel.send("You've already said this was a banger");
                } else {
                    this.client.bangaTracker.updateUsers(currTrack, msg.author.id)
                    msg.channel.send("Banger was in the DB, you've now been added onto the list")
                }
            } else {
                this.client.bangaTracker.writeBanga(currTrack, msg.author.id);
                msg.channel.send("Banger has been added to your profile")
            }
        }
    }

    checkForUser(user, mess) {
        let greg = false;
        user[0].users.map(e => {
            if(e === mess.author.id) greg = true; 
        })
        return greg
    }

    findUsers(banger) {
        const usrArr = []
        let username
        banger[0].users.map(e => {
            username = this.client.users.cache.get(e);
            if(username) {
                usrArr.push(username.username)
            }
        })
        return usrArr;
    }
}