require('dotenv').config();
const TOKEN = process.env.JARVIS;
const auth = require('./tokens.json');
const Discord = require('discord.js');
const bot = new Discord.Client();
const client = new Discord.Client();
const clients = [new Discord.Client(), new Discord.Client(), new Discord.Client(), new Discord.Client(), new Discord.Client(), new Discord.Client(), new Discord.Client()]
const voiceChanneltoCompare = ""; //test
//const voiceChanneltoCompare = ""; //prod

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('voiceStateUpdate', (oldMember, newMember) => {
    if (!oldMember.voiceChannel && newMember.voiceChannel) {
        console.log(newMember.user.username + " joined.");
        if (newMember.user.bot == false && newMember.voiceChannelID == voiceChanneltoCompare) {
            for (var i = 1; i < auth.Tokens.length; i++) {
                const cli = clients[i - 1];
                cli.on('ready', () => {
                    const channel = cli.channels.get(voiceChanneltoCompare);
                    if (!channel) return console.error("The channel does not exist!");
                    channel.join().then(connection => {
                        console.log("Successfully connected.");
                    }).catch(e => {
                        console.error(e);
                    });
                })
                cli.login(auth.Tokens[i]);
            }

            client.on('ready', () => {
                const channel = client.channels.get(voiceChanneltoCompare);
                if (!channel) return console.error("The channel does not exist!");
                channel.join().then(connection => {
                    console.log("Successfully connected.");
                    const dispatcher = connection.playFile('wegotem.mp3');
                    dispatcher.setVolume(0.1);
                    dispatcher.on('start', () => {
                        console.log('audio.mp3 is now playing!');
                    });
                    dispatcher.on('end', () => {
                        console.log('audio.mp3 has finished playing!');
                        client.destroy();
                        for (var i = 0; i < clients.length; i++) {
                            const cli = clients[i];
                            cli.destroy();

                        }
                    });
                    dispatcher.on('error', console.error);
                }).catch(e => {
                    console.error(e);
                });
            })
            client.login(auth.Tokens[0]);
        }

    } else if (oldMember.voiceChannel && newMember.voiceChannel) {
        if ((!oldMember.deaf && newMember.deaf) || (!oldMember.mute && newMember.mute)) {
            console.log(newMember.user.username + " deafened")
        } else if ((oldMember.deaf && !newMember.deaf) || (oldMember.mute && !newMember.mute)) {
            console.log(newMember.user.username + " un-deafened")
        } else {
            console.log(newMember.user.username + " has switched voice channels.");
        }
    } else if (oldMember.voiceChannel && !newMember.voiceChannel) {
        console.log(newMember.user.username + " has left the voice channel.");
    }
});

bot.login(TOKEN);
