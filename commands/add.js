const { Message, SlashCommandBuilder, GuildDefaultMessageNotifications, InteractionWebhook } = require('discord.js');

const { email, password } = require('../config.json');
const fetch = import('node-fetch');

// const Keyv = require('keyv');
// const { host, user, password, datab } = require('../config.json');

const PocketBase = require('pocketbase/cjs')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('Add a new link to the database.')
        .addStringOption(option => option.setName('name').setDescription('The name of the proxy you want to add (Not Case Sensitive just spell it right)').setRequired(true)),
        async execute(interaction, args) {
            // Connect to the database
            let guildID = interaction.guild.id;
            // connect to the database and insert the link in a function
            let links = '';
            async function dbconnectandinsert(link) {
                const newdb = new PocketBase('http://127.0.0.1:8090');
                const authData = await newdb.admins.authViaEmail(`${email}`, `${password}`);
                // Get the guilds data
                const records = await newdb.records.getFullList('links');
                // Get how many guilds there are
                let linkss = records.length;
                // get the guilid
                let id = '';
                let i = 0;
                while (i < linkss) {
                    let getid = '';
                    // console.log(i);
                    getid = records[i].guildID;
                    let actualid = '';
                    if (getid == guildID) {
                        actualid = getid;
                        id = records[i].id;
                        // console.log(id);
                        break;
                    } else {
                    i ++
                    }}
                // grab previous links
                let previouslinks = '';
                let i2 = 0;
                while (i2 < linkss) {
                    let getid = '';
                    // console.log(i);
                    getid = records[i2].guildID;
                    let actualid = '';
                    if (getid == guildID) {
                        actualid = getid;
                        previouslinks = records[i2].links;
                        // console.log(previouslinks);
                        break;
                    } else {
                    i2 ++
                    }}
                    // get previous link id and add 1
                    let previouslinkid = '';
                    let i3 = 0;
                      // get num of how much links there are from json object
                        let num = '';
                        num = previouslinks.length;
                        // console.log(num);
                        // get the id of the last link
                        let i4 = 0;
                        while (i4 < num) {
                            let getid = '';
                            // console.log(i);
                            getid = previouslinks[i4].id;
                            let actualid = '';
                            if (i4 == num - 1) {
                                actualid = getid;
                                previouslinkid = actualid;
                                // console.log(previouslinkid);
                                break;
                            } else {
                            i4 ++
                            }}
                        let newlinkid = '';
                        // console.log(`previous link id: ${previouslinkid}`);
                        isNaN(previouslinkid) ? newlinkid = 1 : newlinkid = previouslinkid + 1;
                        // console.log(newlinkid);

                // add new link to previous links
               // console.log(previouslinks);
                let newlinks = '';
                let name = interaction.options.getString('name').toLowerCase();
                // filter spaces for dashes
                let name2 = name.replace(/ /g, '-');
                newlinks =  { "link": link, "id": newlinkid, "name": name2 };
                // combine previous links and new link
                let combinedlinks = '';
                // //combinedlinks = Object.assign(previouslinks, { newlinks });
                let stringify = JSON.stringify(previouslinks);
                let obj = JSON.parse(stringify);
                obj.push(newlinks);
                // combinedlinks = obj;
                // console.log(obj);
                const update = await newdb.records.update('links', id, { links: obj });
                return;
            }
            // interaction.reply('This command is currently under development!');
             // check if the guild is already in the database
                await interaction.reply('Checking if your setup...');
                const newdb = new PocketBase('http://127.0.0.1:8090');
                const authData = await newdb.admins.authViaEmail(`${email}`, `${password}`);
                // Get the guilds data
                const records = await newdb.records.getFullList('guilds');
                if (records.length === 0) {
                     return await interaction.followUp('Your guild is not in the database! Please run /get-started to add your guild to the database.');
                } else {
                // Get how many guilds there are
                let guilds = records.length;
                // get the guilid
                let id = '';
                let i = 0;
                while (i < guilds) {
                    let getid = '';
                    // console.log(i);
                    getid = records[i].guildID;
                    let actualid = '';
                    if (getid != guildID) {
                         return await interaction.followUp('This guild is not in the database. Please use the /get-started command to add it.');
                         // break;
                    } else if ( getid == guildID) {
                        break;
                    }
                }
            }
            let x = 0;
            let guildsr = records.length;
            while (x < guildsr) {
                let getroleid = ''
                getroleid = records[x].roleIDs;
                let roleidfilter = getroleid.replace('<@&', '')
                let roleidfilter2 = roleidfilter.replace('>', '')
                // console.log(roleidfilter2);
                // get roles the user has
                // roles.fetch();
                let roleids = await interaction.guild.roles.fetch(roleidfilter2);
               //  console.log(roleids);
                if (! await interaction.member.roles.cache.has(roleidfilter2)) {
                   // console.log(await interaction.member.roles.cache.has(roleidfilter2));
                    return await interaction.followUp('You do not have the required role to use this command!');
                } else if (await interaction.member.roles.cache.has(roleidfilter2)) {
                    break;
                }
                else {
                    x++
                }

            }
            await interaction.followUp({ content: 'Ok, what are the link(s) you want to add?' });
            await interaction.followUp({ content: 'Tip: You can add multiple links by separating them with a comma (,) with no space. (Timeout 1 minute)', ephemeral: true });
            const filter = m => m.author.id == interaction.user.id;
			const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 60000, errors: ['time'] });
			collector.on('collect', async (m) => {
                let links = m.content;
                let linkarray = links.split(',');
                let i = 0;
                // check to make sure there are no spaces in the links
                if (links.includes(' ')) {
                    // return await interaction.followUp({ content: 'Please do not include spaces in your links! Please re run the command and try again.'});
                    collector.stop('spaces');
                }
                else {
                while (i < linkarray.length) {
                    let link = linkarray[i];
                    if (link.startsWith('https://')) {
                        await interaction.followUp({ content: `Adding ${link} to the database!` });
                        // add link to the links variable
                        await interaction.followUp({ content: 'Added!' });
                        await dbconnectandinsert(link); 
                        i ++;
                    } else {
                        await interaction.followUp({ content: `Added https://${link} to the database!` });
                        i ++;
                    }
                }
            }
            });
            collector.on('end', async (collected, reason) => {
                if (reason == 'time') {
                    await interaction.followUp({ content: 'You took too long to respond! Please run the command again.', ephemeral: true });
                } else if (reason == 'spaces') {
                   await interaction.followUp({ content: 'Please do not include spaces in your links! Please re run the command and try again.', ephemeral: true });
                }
                //interaction.followUp(`Collected ${collected.size} items`);
            });
        }
}
