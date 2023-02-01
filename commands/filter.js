const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { AudioFilters } = require("discord-player");

const filtername = AudioFilters.filters;

module.exports = {
	data: new SlashCommandBuilder()
		.setName("filter")
		.setDescription("Play a song from Spotify.")
		.addSubcommand(subcommand =>
			subcommand
				.setName("set")
				.setDescription("Set a filter to the queue.")
				.addStringOption(option =>
					option.setName("option").setDescription("Filter name you want to set.").setRequired(true)
				)
		)
        .addSubcommand(subcommand =>
			subcommand
				.setName("remove")
				.setDescription("Remove the current filter.")
                .addStringOption(option =>
					option.setName("option").setDescription("Filter name you want to remove.").setRequired(true)
				)
		)
        .addSubcommand(subcommand =>
			subcommand
				.setName("destroy")
				.setDescription("Remove all the filter in a queue.")
		),
	execute: async ({ client, interaction }) => {
       // Get the queue for the server
		const queue = client.player.getQueue(interaction.guildId)

        // Check if the queue is empty
		if (!queue)
		{
			await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> There are no song in the queue!`).setColor(`Green`)] })
			return;
		}

        if (interaction.options.getSubcommand() === "set") {
            let option = interaction.options.getString("option").toLowerCase(); // the option for set command
            // Specific filter name
            if (option === "8d") {
                option = "8D";
            }

            //Check if the filter is vaild | Total: 33 filters
            if (AudioFilters.has(option)) {
                //Set filter for the song
                if (option === "8D") {
                    queue.setFilters({ "8D" : true});
                } else if (option === "bassboost") {
                    queue.setFilters({ "bassboost" : true});
                } else if (option === "bassboost_high") {
                    queue.setFilters({ "bassboost_high" : true});
                } else if (option === "bassboost_low") {
                    queue.setFilters({ "bassboost_low" : true});
                } else if (option === "chorus") {
                    queue.setFilters({ "chorus" : true});
                } else if (option === "chorus2d") {
                    queue.setFilters({ "chorus2d" : true});
                } else if (option === "chorus3d") {
                    queue.setFilters({ "chorus3d" : true});
                } else if (option === "compressor") {
                    queue.setFilters({ "compressor" : true});
                } else if (option === "dim") {
                    queue.setFilters({ "dim" : true});
                } else if (option === "earrape") {
                    queue.setFilters({ "earrape" : true});
                } else if (option === "expander") {
                    queue.setFilters({ "expander" : true});
                } else if (option === "fadein") {
                    queue.setFilters({ "fadein" : true});
                } else if (option === "flanger") {
                    queue.setFilters({ "flanger" : true});
                } else if (option === "gate") {
                    queue.setFilters({ "gate" : true});
                } else if (option === "haas") {
                    queue.setFilters({ "haas" : true});
                } else if (option === "karaoke") {
                    queue.setFilters({ "karaoke" : true});
                } else if (option === "mcompand") {
                    queue.setFilters({ "mcompand" : true});
                } else if (option === "mono") {
                    queue.setFilters({ "mono" : true});
                } else if (option === "mstlr") {
                    queue.setFilters({ "mstlr" : true});
                } else if (option === "mstrr") {
                    queue.setFilters({ "mstrr" : true});
                } else if (option === "nightcore") {
                    queue.setFilters({ "nightcore" : true});
                } else if (option === "normalizer") {
                    queue.setFilters({ "normalizer" : true});
                } else if (option === "normalizer2") {
                    queue.setFilters({ "normalizer2" : true});
                } else if (option === "phaser") {
                    queue.setFilters({ "phaser" : true});
                } else if (option === "pulsator") {
                    queue.setFilters({ "pulsator" : true});
                } else if (option === "reverse") {
                    queue.setFilters({ "reverse" : true});
                } else if (option === "softlimiter") {
                    queue.setFilters({ "softlimiter" : true});
                } else if (option === "subboost") {
                    queue.setFilters({ "subboost" : true});
                } else if (option === "surrounding") {
                    queue.setFilters({ "surrounding" : true});
                } else if (option === "treble") {
                    queue.setFilters({ "treble" : true});
                } else if (option === "tremolo") {
                    queue.setFilters({ "tremolo" : true});
                } else if (option === "vaporwave") {
                    queue.setFilters({ "vaporwave" : true});
                } else if (option === "vibrato") {
                    queue.setFilters({ "vibrato" : true});
                }
                                    
                // send back message
                await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifySuccess:1033721502874484746> Add filter \`${option}\` to the playlist.`).setColor(`Green`)] })
            } else {
                interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> You send a invaild filter name. You can check the filter name from here:\n**https://discord-player.js.org/docs/main/master/typedef/QueueFilters**`).setColor(`Red`)] });
            }
        } else if (interaction.options.getSubcommand() === "remove") {
            let option = interaction.options.getString("option").toLowerCase(); // the option for set command
            //Check if the filter is vaild | Total: 33 filters
            if (option === "8d") {
                option = "8D";
            }

            if (AudioFilters.has(option)) {
                //Set filter for the song
                if (option === "8D") {
                    queue.setFilters({ "8D" : false});
                } else if (option === "bassboost") {
                    queue.setFilters({ "bassboost" : false});
                } else if (option === "bassboost_high") {
                    queue.setFilters({ "bassboost_high" : false});
                } else if (option === "bassboost_low") {
                    queue.setFilters({ "bassboost_low" : false});
                } else if (option === "chorus") {
                    queue.setFilters({ "chorus" : false});
                } else if (option === "chorus2d") {
                    queue.setFilters({ "chorus2d" : false});
                } else if (option === "chorus3d") {
                    queue.setFilters({ "chorus3d" : false});
                } else if (option === "compressor") {
                    queue.setFilters({ "compressor" : false});
                } else if (option === "dim") {
                    queue.setFilters({ "dim" : false});
                } else if (option === "earrape") {
                    queue.setFilters({ "earrape" : false});
                } else if (option === "expander") {
                    queue.setFilters({ "expander" : false});
                } else if (option === "fadein") {
                    queue.setFilters({ "fadein" : false});
                } else if (option === "flanger") {
                    queue.setFilters({ "flanger" : false});
                } else if (option === "gate") {
                    queue.setFilters({ "gate" : false});
                } else if (option === "haas") {
                    queue.setFilters({ "haas" : false});
                } else if (option === "karaoke") {
                    queue.setFilters({ "karaoke" : false});
                } else if (option === "mcompand") {
                    queue.setFilters({ "mcompand" : false});
                } else if (option === "mono") {
                    queue.setFilters({ "mono" : false});
                } else if (option === "mstlr") {
                    queue.setFilters({ "mstlr" : false});
                } else if (option === "mstrr") {
                    queue.setFilters({ "mstrr" : false});
                } else if (option === "nightcore") {
                    queue.setFilters({ "nightcore" : false});
                } else if (option === "normalizer") {
                    queue.setFilters({ "normalizer" : false});
                } else if (option === "normalizer2") {
                    queue.setFilters({ "normalizer2" : false});
                } else if (option === "phaser") {
                    queue.setFilters({ "phaser" : false});
                } else if (option === "pulsator") {
                    queue.setFilters({ "pulsator" : false});
                } else if (option === "reverse") {
                    queue.setFilters({ "reverse" : false});
                } else if (option === "softlimiter") {
                    queue.setFilters({ "softlimiter" : false});
                } else if (option === "subboost") {
                    queue.setFilters({ "subboost" : false});
                } else if (option === "surrounding") {
                    queue.setFilters({ "surrounding" : false});
                } else if (option === "treble") {
                    queue.setFilters({ "treble" : false});
                } else if (option === "tremolo") {
                    queue.setFilters({ "tremolo" : false});
                } else if (option === "vaporwave") {
                    queue.setFilters({ "vaporwave" : false});
                } else if (option === "vibrato") {
                    queue.setFilters({ "vibrato" : false});
                }

                // send back message
                await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifySuccess:1033721502874484746> Remove filter \`${option}\` in the playlist.`).setColor(`Green`)] })
            } else {
                interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> You send a invaild filter name. You can check the filter name from here:\n**https://discord-player.js.org/docs/main/master/typedef/QueueFilters**`).setColor(`Red`)] });
            }
        } else if (interaction.options.getSubcommand() === "destroy") {
            // set all the filter to 
            queue.setFilters({ "8D" : false});
            queue.setFilters({ "bassboost" : false});
            queue.setFilters({ "bassboost_high" : false});
            queue.setFilters({ "bassboost_low" : false});
            queue.setFilters({ "chorus" : false});
            queue.setFilters({ "chorus2d" : false});
            queue.setFilters({ "chorus3d" : false});
            queue.setFilters({ "compressor" : false});
            queue.setFilters({ "dim" : false});
            queue.setFilters({ "earrape" : false});
            queue.setFilters({ "expander" : false});
            queue.setFilters({ "fadein" : false});
            queue.setFilters({ "flanger" : false});
            queue.setFilters({ "gate" : false});
            queue.setFilters({ "haas" : false});
            queue.setFilters({ "karaoke" : false});
            queue.setFilters({ "mcompand" : false});
            queue.setFilters({ "mono" : false});
            queue.setFilters({ "mstlr" : false});
            queue.setFilters({ "mstrr" : false});
            queue.setFilters({ "nightcore" : false});
            queue.setFilters({ "normalizer" : false});
            queue.setFilters({ "normalizer2" : false});
            queue.setFilters({ "phaser" : false});
            queue.setFilters({ "pulsator" : false});
            queue.setFilters({ "reverse" : false});
            queue.setFilters({ "softlimiter" : false});
            queue.setFilters({ "subboost" : false});
            queue.setFilters({ "surrounding" : false});
            queue.setFilters({ "treble" : false});
            queue.setFilters({ "tremolo" : false});
            queue.setFilters({ "vaporwave" : false});
            queue.setFilters({ "vibrato" : false});

            //send back message
            await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifySuccess:1033721502874484746> Remove all filter from the playlist.`).setColor(`Green`)] })
        }
	},
}
