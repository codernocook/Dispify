const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Collection, GatewayIntentBits, EmbedBuilder, ActivityType } = require('discord.js');
const { Player } = require("discord-player")

const fs = require('fs');
const path = require('path');
const { resolve } = require('path');


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
    client.user.setActivity(`Spotify`, { type: ActivityType.Listening })
    // Get all ids of the servers
    const rest = new REST({version: '10'}).setToken(process.env.TOKEN);
    rest.put(Routes.applicationCommand(process.env.CLIENT_ID), 
        {body: commands})
        .catch(console.error);
});

client.on("interactionCreate", async interaction => {
    if(!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if(!command) return;

    try
    {
        await command.execute({client, interaction});
    }
    catch(error)
    {
        console.error(error);
        //await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`Something went wrong with this command!`).setColor(`Red`)] })
    }
});

client.login(process.env.TOKEN);
