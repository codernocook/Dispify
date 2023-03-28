const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
        data: new SlashCommandBuilder().setName("help").setDescription("Show the help info and commands!"),
        execute: async ({ client, interaction }) => {
                interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`Prefix: / (use interaction command).\nPlay: [song/playlist/search] [track/playlist/search] (to play a track or playlist).\nPause: to pause current playing track.\nResume: continue play the current track.\nVolume [value] to change volume of the music.\nPing: Get ping bot (Pong!).\nSkip [first/number] | First: Skip to next song. | Number: Skip to track position.\nQueue [list/page] | List: Show First 10 songs in the queue. | Page: Turn to selected page in the list.\nLeave: Leave the voice channel.\nVersion: 2.0.0\nSupport Server: https://Dispify.vercel.app/invite/\nHelp page: https://Dispify.vercel.app/help/`).setColor(`Blue`)] })
        },
}