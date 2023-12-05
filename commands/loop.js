const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueueRepeatMode } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("loop")
		.setDescription("Loop (on/off) to loop your song")
        .addSubcommand(subcommand =>
            subcommand
                .setName("on")
                .setDescription("Set loop mode to true.")
                .addStringOption(option =>
                    option.setName("type").setDescription("There are three types: track/song, queue, autoplay. Default the option is \"track\"").setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("off")
                .setDescription("Set loop mode to false.")
        ),
	execute: async ({ client, interaction }) => {
        // Defer reply to prevent many command make bot crash
        await interaction.deferReply();

        // Make sure the user is inside a voice channel
		if (!interaction.member.voice.channel) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> You must join a voice channel to use the command.`).setColor(`Red`)] });

        // Get the current queue
		const queue = client.player.nodes.get(interaction.guildId)

		if (!queue) {
			await interaction.editReply({
				embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> There are no song in the queue!`).setColor(`Red`)]
			})
			return;
		}
        
        // Loop
        if (interaction.options.getSubcommand() === "on") {
            // Check type
            let typeof_loopMode = interaction.options.getString("type")?.toString().toLowerCase().replace(" ", "") || "track";
            let loopMode_parsed = QueueRepeatMode.TRACK;

            // Support older js version (Traditional method)
            switch(typeof_loopMode) {
                case "track": loopMode_parsed = QueueRepeatMode.TRACK; break;
                case "song": loopMode_parsed = QueueRepeatMode.TRACK; break;
                case "track/song": loopMode_parsed = QueueRepeatMode.TRACK; break;
                case "queue": loopMode_parsed = QueueRepeatMode.QUEUE; break;
                case "autoplay": loopMode_parsed = QueueRepeatMode.AUTOPLAY; break;
                default:
                    return interaction.editReply({
                        embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> Not a vaild type of loop.`).setColor(`Red`)]
                    });
            }
            
            if (queue && queue["metadata"] && queue["metadata"]["looped"] === false && queue["metadata"]["loopMode"] !== loopMode_parsed) {
                queue["metadata"]["looped"] = true;
                queue.setRepeatMode(loopMode_parsed);
                interaction.editReply({
                    embeds: [new EmbedBuilder().setDescription(`<:DispifySuccess:1033721502874484746> Set the loop mode to \`on\`, type: \`${typeof_loopMode}\`.`).setColor(`Green`)]
                });
            } else {
                interaction.editReply({
                    embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> Cannot set loop mode to \`on\`. Check if the queue is already looping.`).setColor(`Red`)]
                });
            }
        } else if (interaction.options.getSubcommand() === "off") {
            if (queue && queue["metadata"] && queue["metadata"]["looped"] === true && queue["metadata"]["loopMode"] !== loopMode_parsed) {
                queue["metadata"]["looped"] = false;
                queue.setRepeatMode(QueueRepeatMode.OFF);
                interaction.editReply({
                    embeds: [new EmbedBuilder().setDescription(`<:DispifySuccess:1033721502874484746> Set the loop mode to \`off\`, type: \`${typeof_loopMode}\`.`).setColor(`Green`)]
                });
            } else {
                interaction.editReply({
                    embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> Cannot set loop mode \`off\`. Check if the queue is not looping.`).setColor(`Red`)]
                });
            }
        }
	},
}
