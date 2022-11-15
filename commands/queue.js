const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Shows songs in the list!")
        .addSubcommand(subcommand =>
			subcommand
				.setName("list")
				.setDescription("Shows first 10 songs in the queue.")
		)
        .addSubcommand(subcommand =>
			subcommand
				.setName("page")
				.setDescription("Turn to selected page in the queue.")
				.addStringOption(option =>
					option.setName("position").setDescription("Position of page.").setRequired(true)
				)
		),
    execute: async ({ client, interaction }) => {
        if (interaction.options.getSubcommand() === "list") {
            const queue = client.distube.getQueue(interaction)

            // check if there are songs in the queue
            if (!queue) {
                await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:SpoticordError:1033721529084694598> There are no songs in the queue!`).setColor(`Red`)] });
                return;
            }
            const queuearray = queue.songs
                .map((song, i) => `${i === 0 ? 'Playing:' : `${i}.`} ${song.name} - \`${song.formattedDuration}\``)
                .join('\n')
            const queueString = queue.songs.slice(0, 10).map((song, i) => {
                return `${i}) [${song.duration}] ${song.name} - <@${song.member.id}>`
            }).join("\n")
            
            const currentSong = queue.songs[0]
            interaction.reply({ embeds: [new EmbedBuilder().setDescription(`**Currently Playing:**\n` + (currentSong ? `[${currentSong.duration}] ${currentSong.name} - <@${currentSong.member.id}>` : "None") + `\n\n**Queue:**\n${queueString}`).setFooter({text: "Page: 1"}).setColor(`Green`)] })
        }
        else if (interaction.options.getSubcommand() === "page") {
            const queue = client.distube.getQueue(interaction)

            // check if there are songs in the queue
            if (!queue) {
                await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:SpoticordError:1033721529084694598> There are no songs in the queue!`).setColor(`Red`)] });
                return;
            }
            if (!Number(interaction.options.getString("position"))) return;

            const queueString = queue.songs.slice(((Number(interaction.options.getString("position")) - 1) * 10), ((Number(interaction.options.getString("position")) - 1) * 10) + 10).map((song, i) => {
                return `${i + ((Number(interaction.options.getString("position")) - 1) * 10)}) [${song.duration}] ${song.name} - <@${song.member.id}>`
            }).join("\n")
            const currentSong = queue.songs[0]
            interaction.reply({ embeds: [new EmbedBuilder().setDescription(`**Currently Playing:**\n` + (currentSong ? `[${currentSong.duration}] ${currentSong.name} - <@${currentSong.member.id}>` : "None") + `\n\n**Queue:**\n${queueString}`).setFooter({text: `Page: ${Number(interaction.options.getString("position"))}`}).setColor(`Green`)] })
        }
    }
}