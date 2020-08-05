require('dotenv').config();
const TOKEN = process.env.JARVIS;
const auth = require('./tokens.json');
const Discord = require('discord.js');
const bot = new Discord.Client();
const client = new Discord.Client();
const clients = [new Discord.Client(), new Discord.Client(), new Discord.Client(), new Discord.Client(), new Discord.Client(), new Discord.Client(), new Discord.Client()]
const origVC = ""; //test
const gotJumpedVC = ""; //test
//const origVC = ""; //prod
//const gotJumpedVC = ""; //prod
var run = true;
var exec = require('child_process').exec,
      child;

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
    bot.user.setPresence({
        game: {
            name: 'get jumped',
            type: "STREAMING",
            url: "https://www.twitch.tv/gambinothegawd/video/662703857"
        },
    });
});

bot.on('voiceStateUpdate', (oldMember, newMember) => {
    if (!oldMember.voiceChannel && newMember.voiceChannel) {
        console.log(newMember.user.username + " joined.");
        if (run == true && newMember.user.bot == false && newMember.voiceChannelID == origVC) {
	        run = false;
            newMember.setVoiceChannel(gotJumpedVC);
            client.on('ready', () => {
                const channel = client.channels.get(gotJumpedVC);
                if (!channel) return console.error("The channel does not exist!");
                channel.join().then(connection => {
                    console.log("Successfully connected.");
                    const dispatcher = connection.playFile('wegotem.mp3');
                    dispatcher.setVolume(0.1);
                    dispatcher.on('start', () => {
                        console.log('audio now playing!');
                    });
                    dispatcher.on('end', () => {
                        console.log('audio finished playing!');
                        for (var i = 0; i < clients.length; i++) {
                            const cli = clients[i];
                            cli.destroy();
                        }
                        client.destroy();
                        newMember.setVoiceChannel(origVC);
                        var testscript = exec('sh /home/pi/getJumped/stop.sh');

                        testscript.stdout.on('data', function (data) {
                            console.log(data);
                        });
        
                        testscript.stderr.on('data', function (data) {
                            console.log(data);
                        });
                    });
                    dispatcher.on('error', console.error);
                }).catch(e => {
                    console.error(e);
                });
            })

            for (var i = 0; i < clients.length; i++) {
                const cli = clients[i];
                cli.on('ready', () => {
                    const channel = cli.channels.get(gotJumpedVC);
                    if (!channel) return console.error("The channel does not exist!");
                    channel.join().then(connection => {
                        console.log("Successfully connected.");
                    }).catch(e => {
                        console.error(e);
                    });
                })
            }

            client.login(auth.Tokens[0]);
            for (var i = 1; i < clients.length; i++) {
                const cli = clients[i];
                cli.login(auth.Tokens[i]);
            }
        }

    } else if (oldMember.voiceChannel && newMember.voiceChannel) {
        if (!oldMember.deaf && newMember.deaf) {
            console.log(newMember.user.username + " deafened")
        } else if (oldMember.deaf && !newMember.deaf) {
            console.log(newMember.user.username + " un-deafened")
        } else if (!oldMember.mute && newMember.mute) {
            console.log(newMember.user.username + " muted")
        }
        else if (oldMember.mute && !newMember.mute) {
            console.log(newMember.user.username + " un-muted")
        }
        else {
            console.log(newMember.user.username + " has switched voice channels.");
        }
    } else if (oldMember.voiceChannel && !newMember.voiceChannel) {
        console.log(newMember.user.username + " has left the voice channel.");
    }
});

bot.login(TOKEN);
