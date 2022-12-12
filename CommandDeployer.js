// this is an script to make other work use deploy() function
// deploy(commandinfo) to deploy
// this module will make the bot command appear forever don't need old deploy method (anti deploy bypass)

// require the eris client
/* The bot deploy docs
    const send = {
        ["name"]
        ["description"]
        ["option"]
    }
*/
const testf = [{"f": "F"}, {"f": "F"}]

const { CommandClient } = require('eris')
const token = process.env.token // put the bot token here or change the env name
const DeployerClient = new CommandClient(`Bot ${token}`, { intents: ['guilds'], maxShards: 'auto',restMode: true })

async function deployprocess(info) {
    // Register the discord command, forever
    DeployerClient.on('ready', async () => {
        await DeployerClient.bulkEditCommands([info[0]])
    })
    DeployerClient.connect();
}

module.exports = {
    deploy(info) {
        // split the info
        for (const i of info["name"]) {
            let infosplit = i // create this varible cuz [i] not allowed to run at the same time
            //start deploy the split value
            deployprocess(infosplit)
        }
    }
}
