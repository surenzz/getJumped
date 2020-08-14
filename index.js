require('dotenv').config();
const TOKEN = process.env.JARVIS;
const BEN_10 = process.env.BEN_10;
const SHOTGUN = process.env.SHOTGUN;
const auth = require('./tokens.json');
const Discord = require('discord.js');
const bot = new Discord.Client();
const activeGuild = "";
const origVC = "";
const gotJumpedVC = "";
const stonedVC = "";
const gotShotVC = "";
var run = true;

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}`);
    bot.user.setPresence({
        game: {
            name: 'get jumped',
            type: "STREAMING",
            url: "https://www.twitch.tv/"
        },
    });
});

bot.on("message", message => {
    if (message) {
        if (message.content == "!unbruh") {
            try {
                const role = message.guild.roles.find((role) => role.name === "BRUH");
                role.members.forEach((member) => {
                    member.removeRole(role);
                    console.log(member.user.username + " unbruh");
                    message.react('🗿');
                });
            } catch (error) {}
        }
    }
});

bot.on('voiceStateUpdate', async (oldMember, newMember) => {
    if (newMember.guild.id != activeGuild){
        return;
    }
    if (!oldMember.voiceChannel && newMember.voiceChannel) {
        console.log(newMember.user.username + " joined");
    } else if (oldMember.voiceChannel && !newMember.voiceChannel) {
        console.log(newMember.user.username + " has left the voice channel");
    } else if (oldMember.voiceChannel != newMember.voiceChannel && newMember.user.bot == false) {
        console.log(newMember.user.username + " has switched voice channels");

        if (newMember.voiceChannelID == gotShotVC) {
            console.log(newMember.user.username + " got shot")
            const musicPlayer2 = new Discord.Client();
            musicPlayer2.on('ready', async () => {
                const channel2 = musicPlayer2.channels.get(gotShotVC);
                if (!channel2) return console.error("The channel does not exist");
                const connection2 = await channel2.join();
                const dispatcher2 = connection2.playFile('gotshot.mp3', {
                    volume: 1.5
                });
                dispatcher2.on('start', () => {
                    console.log('audio now playing');
                });
                dispatcher2.on('end', () => {
                    console.log('audio finished playing');
                    musicPlayer2.destroy();
                });
                dispatcher2.on('error', console.error);
            })
            musicPlayer2.login(SHOTGUN);
        }

        if (newMember.voiceChannelID == stonedVC) {
            console.log(newMember.user.username + " got stoned");
            const role = newMember.guild.roles.find((role) => role.name === "BRUH");
            newMember.addRoles([role.id]).catch(console.error);
        }

        if (newMember.voiceChannelID == gotJumpedVC && run) {
            console.log(newMember.user.username + " got jumped");
            run = false;

            const clients = [];
            for (var i = 0; i < auth.Tokens.length; i++) {
                const client = new Discord.Client();
                const index = i;
                client.on('ready', async () => {
                    try {
                        const channel = await client.channels.get(gotJumpedVC);
                        await channel.join();
                        console.log("successful: " + index);
                    } catch (e) {
                        console.log(e);
                    }
                })
                clients.push(client);
            }

            const musicPlayer = new Discord.Client();
            musicPlayer.on('ready', async () => {
                const channel = musicPlayer.channels.get(gotJumpedVC);
                if (!channel) return console.error("The channel does not exist");
                const connection = await channel.join();
                const dispatcher2 = connection2.playFile('gotshot.mp3', {
                    volume: 0.1
                });
                dispatcher.on('start', () => {
                    console.log('audio now playing');
                });
                dispatcher.on('end', () => {
                    console.log('audio finished playing');
                    for (var i = 0; i < clients.length; i++) {
                        const cli = clients[i];
                        cli.destroy();
                    }
                    musicPlayer.destroy();
                    if (newMember.voiceChannel.id == gotJumpedVC) {
                        newMember.setVoiceChannel(origVC).catch(console.error);
                    }
                    run = true;
                });
                dispatcher.on('error', console.error);
            })

            for (var i = 0; i < auth.Tokens.length; i++) {
                clients[i].login(auth.Tokens[i]);
            }
            musicPlayer.login(BEN_10);
        }
    }
});

bot.login(TOKEN);
