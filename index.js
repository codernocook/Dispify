const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Collection, GatewayIntentBits, EmbedBuilder, ActivityType } = require('discord.js');
const { Player } = require("discord-player");

require('dotenv').config({path: "./settings.env"});
const token = process.env.TOKEN
const CLIENT_ID = process.env.CLIENT_ID

const fs = require('fs');
const path = require('path');
const { resolve } = require('path');
const rest = new REST({version: '10'}).setToken(token);

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates]});

// List of all commands
const commands = [];
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles)
{
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

// Add the player on the client
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
});

// Prevent bot from crashing
process.on('uncaughtException', function(err) {})

client.on("ready", async () => {
    function SetBotStatus() {
        client.user.setActivity(`Spotify`, { type: ActivityType.Listening, description: "https://dispify.vercel.app" });
        setTimeout(SetBotStatus, 3600000); // looping the set status
    }
    SetBotStatus(); // prevent from bot stoping show status
    // Deploy when discord bot run
    console.log("[Dispify]: Started bot.")
    await rest.put(Routes.applicationCommands(CLIENT_ID), {body: commands}).catch(err => console.log(err));
    console.log("[Dispify]: Deployed all command.")
});

// Dev debugger
/*
client.player.events.on('debug', async (queue, message) => {
    // Emitted when the player queue sends debug info
    // Useful for seeing what state the current queue is at
    console.log(`Player debug event: ${message}`);
});
*/
//-----------------------------------

// Player event
client.player.events.on("playerStart", (queue, track) => queue.metadata.channel.send({ embeds: [new EmbedBuilder().setDescription(`<:DispifySuccess:1033721502874484746> Now Playing **[${track.title}](${track.url})**.`).setColor(`Green`)] }))

client.player.events.on("playerFinish", async (queue, track) => {
    if (!queue) return;
    if (!queue.connection) await queue.play(track);
});
//-----------------------------------

client.on("interactionCreate", async interaction => {
    if(!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if(!command) return;

    try {
        await command.execute({client, interaction});
    }
    catch(error) {
        //console.log(error); // Disable if you don't like annoying error on the console
        await interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> Something went wrong with this command.`).setColor(`Red`)] }).catch(() => {
            interaction.channel.send({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> Something went wrong with this command.`).setColor(`Red`)] }).catch((err) => {console.log(err)})
        })

        throw error; // trigger the errorHandler
    }
});

client.login(token);