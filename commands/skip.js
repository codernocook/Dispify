const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips the current song")
        .addSubcommand(subcommand =>
			subcommand
				.setName("first")
				.setDescription("Skip to next song.")
		)
        .addSubcommand(subcommand =>
			subcommand
				.setName("number")
				.setDescription("Skip to track position.")
				.addStringOption(option => option.setName("number").setDescription("Skip to track position.").setRequired(true))
		),
	execute: async ({ client, interaction }) => {
        // Get the queue for the server
		const queue = client.player.getQueue(interaction.guildId)

        // If there is no queue, return
		if (!queue)
        {
            await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:SpoticordError:1033601680387887125> There are no song in the queue!`).setColor(`Red`)] })
            return;
        }

        const currentSong = queue.current

        // Get subCommand of song
        if (interaction.options.getSubcommand() === "number") {
            let position = interaction.options.getString("number")
            const queueSongNumber = queue.tracks.map((song, i) => {return i;})

            if (!position) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:SpoticordError:1033601680387887125> Invaild Position, please type vaild position.`).setColor(`Red`)] });
            if (!Number(position)) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:SpoticordError:1033601680387887125> Invaild Position, please type vaild position.`).setColor(`Red`)] });
            if ((Number(position)) > queueSongNumber) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:SpoticordError:1033601680387887125> Invaild Position, please type vaild position.`).setColor(`Red`)] });
            queue.skip(Number(position))
            interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:SpoticordSuccess:1033601653749862491> Skipped **[${currentSong.title}](${currentSong.url})**!`).setColor(`Green`)] })
		}
        else if (interaction.options.getSubcommand() === "first") {
            // Skip the current song
            queue.skip()

            // Return an embed to the user saying the song has been skipped
            interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:SpoticordSuccess:1033601653749862491> Skipped **[${currentSong.title}](${currentSong.url})**!`).setColor(`Green`)] })
        }
	},
}
