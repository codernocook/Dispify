const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Collection, GatewayIntentBits, EmbedBuilder, ActivityType } = require('discord.js');
const { Distube } = require("distube");

//Distube plugin (need)!
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');

const fs = require('fs');
const path = require('path');
const { resolve } = require('path');
const rest = new REST({version: '10'}).setToken(process.env.TOKEN);

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
client.distube = new DisTube(client, {
    leaveOnStop: false,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
    plugins: [
      new SpotifyPlugin({
        emitEventsAfterFetching: true
      }),
      new SoundCloudPlugin(),
    ]
  })

client.on("ready", async () => {
    client.user.setActivity(`Spotify`, { type: ActivityType.Listening })
    // Deploy when discord bot run
    const guild_ids = client.guilds.cache.map(guild => guild.id);

    for (const guildId of guild_ids) {
        rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId), {body: commands}).catch(console.error);
    }
});

client.on("guildCreate", async (guildcreate) => {
    rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildcreate.id), {body: commands}).catch(console.error);
})

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

client.login(process.env.TOKEN);
