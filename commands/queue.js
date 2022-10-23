const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Shows first 10 songs in the queue!"),

    execute: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId)

        // check if there are songs in the queue
        if (!queue || !queue.playing)
        {
            await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:SpoticordError:1033721529084694598> There are no songs in the queue!`).setColor(`Red`)] });
            return;
        }

        // Get the first 10 songs in the queue
        const queueString = queue.tracks.slice(0, 10).map((song, i) => {
            return `${i}) [${song.duration}] ${song.title} - <@${song.requestedBy.id}>`
        }).join("\n")

        // Get the current song
        const currentSong = queue.current
        interaction.reply({ embeds: [new EmbedBuilder().setDescription(`**Currently Playing**\n` + (currentSong ? `[${currentSong.duration}] ${currentSong.title} - <@${currentSong.requestedBy.id}>` : "None") + `\n\n**Queue**\n${queueString}`).setColor(`Green`)] })
    }
}
