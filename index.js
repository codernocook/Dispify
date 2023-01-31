const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Collection, GatewayIntentBits, EmbedBuilder, ActivityType } = require('discord.js');
const { Player } = require("discord-player")

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
for(const file of commandFiles)
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
})

client.on("ready", async () => {
    client.user.setActivity(`Spotify`, { type: ActivityType.Listening, description: "https://dispify.vercel.app" })
    // Deploy when discord bot run
    rest.put(Routes.applicationCommand(CLIENT_ID), {body: commands}).catch(console.error);
});

client.player.on("trackStart", (queue, track) => queue.metadata.channel.send({ embeds: [new EmbedBuilder().setDescription(`<:DispifySuccess:1033721502874484746> Now Playing **[${track.title}](${track.url})**.`).setColor(`Green`)] }))

client.on("interactionCreate", async interaction => {
    if(!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if(!command) return;

    try {
        await command.execute({client, interaction});
    }
    catch(error) {
        console.error(error);
        //await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`Something went wrong with this command!`).setColor(`Red`)] })
    }
});

client.login(token);