const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Show the help info and commands!"),
	execute: async ({ client, interaction }) => {
        interaction.reply({ embeds: [new EmbedBuilder().setDescription(`Prefix: / (use interaction command)\nPlay: [song/playlist/search] [track/playlist/search] (to play a track or playlist)\nPause: to pause current playing track.\nResume: continue play the current track\nPing: Get ping bot (Pong!)\nLeave: Leave the voice channel`).setColor(`Blue`)] })
	},
}
