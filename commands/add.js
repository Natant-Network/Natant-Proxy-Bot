const { Message, SlashCommandBuilder, GuildDefaultMessageNotifications, InteractionWebhook } = require('discord.js');

const { email, password, url } = require('../config.json');
const {setTimeout} = require ('timers/promises');
const fetch = import('node-fetch');
const axios = require('axios');
// const Keyv = require('keyv');
// const { host, user, password, datab } = require('../config.json');

const PocketBase = require('pocketbase/cjs')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')    
		.setDescription('Add a proxy link to the database')
        .addStringOption(option =>
			option.setName('name')
				.setDescription('The name of the proxy site (not case sensitive just spell it correctly)')
                .setRequired(true)
				.setAutocomplete(true))
        .addStringOption(option =>
            option.setName('link')
            .setDescription('Link to add to the database')
            .setRequired(true)),
        async autocomplete (interaction) {
            try {
            let guildid = interaction.guild.id;
            let userid = interaction.user.id;
            const focusedValue = interaction.options.getFocused();
            // init db
            const db = new PocketBase(`${url}`);
            const authData = await db.admins.authWithPassword(`${email}`, `${password}`);
            // get the guild id from the command
            const guildscount = await db.collection('links').getFullList();
            const check = await await db.collection('links').getFullList(parseInt(guildscount.length), {
                filter: `guildID = ${guildid}`,
            });
            // check if the guild is in the database
            // get names of all links in the database json
            // get names of all the links in the json object
            let linknames = [];
            for (let i = 0; i < check[0].links.length; i++) {
                linknames.push(check[0].links[i].name);
            }
            console.log(linknames);
            // filter out duplicate names
            let unique = [...new Set(linknames)];
            // remove base from the array
            unique.splice(unique.indexOf('base'), 1);
            console.log(unique);
            // console.log(check[0].links.length);
		    const choices = unique;
		    const filtered = choices.filter(choice => choice.startsWith(focusedValue));
		    await interaction.respond(
		    	filtered.map(choice => ({ name: choice, value: choice })),
		    );
            } catch (error) {
                console.log(error);
            }
        },
        async execute(interaction) {
            if (!interaction.inGuild()) {
                return interaction.reply({ content: 'You can\'t use this command in DMs'});
            }
            try { 
            interaction.reply({ content: 'Checking if you have the required role...', ephemeral: true });
            let guildID = interaction.guild.id;
            let userID = interaction.user.id;
            // init db
            const db = new PocketBase(`${url}`)
            const authData = await db.admins.authWithPassword(`${email}`, `${password}`);
            // get the guild id from the command
            const guildscount = await db.collection('guilds').getFullList();
            const check = await await db.collection('guilds').getFullList( parseInt(guildscount.length), {
                filter: `guildID = ${guildID}`,
            });
            // get the role id from the database
            let roleid = check[0].roleIDs
            // remove <@& and > from the role id
            let role = roleid.replace('<@&', '').replace('>', '');
            // get all roles from the user
            let roles = interaction.member.roles.cache.map(role => role.id);
            // check if the user has the role
            let hasrole = roles.includes(role);
            //console.log(hasrole);
            if (hasrole == true) {
                let name = interaction.options.getString('name');
                let namel = name.toLowerCase();
                let link = interaction.options.getString('link');
                if (link.includes(' ')) {
                    interaction.followUp({ content: 'The link you provided cannot contain spaces', ephemeral: true });
                    return;
                } else if (link.includes(',')) {
                    interaction.followUp({ content: 'The link you provided cannot contain commas', ephemeral: true });
                    return;
                }
                // check if the link is valid
                try {
                    interaction.followUp({ content: 'Checking if the link is valid...', ephemeral: true });
                    await axios.get(`${link}`);
                    interaction.followUp({ content: 'The link is valid!', ephemeral: true });
                    // check if the link is a duplicate
                    const guildscount = await db.collection('links').getFullList();
                    const check = await await db.collection('links').getFullList(parseInt(guildscount.length), {
                        filter: `guildID = ${guildID}`,
                    });
                    // get names of all links in the database json
                    // get names of all the links in the json object
                    let linknames = [];
                    for (let i = 0; i < check[0].links.length; i++) {
                        linknames.push(check[0].links[i].name);
                    }
                    // filter out duplicate names
                    let unique = [...new Set(linknames)];
                    // remove base from the array
                    unique.splice(unique.indexOf('base'), 1);
                    // get all links in the database
                    let links = [];
                    for (let i = 0; i < check[0].links.length; i++) {
                        links.push(check[0].links[i].link);
                    }
                    console.log(links);
                    // if the link is in the list of links
                    if (links.includes(link)) {
                        interaction.followUp({ content: 'The link is already in the database!', ephemeral: true });
                        return;
                    }
                } catch (error) {
                    interaction.followUp({ content: 'The link you provided is not valid', ephemeral: true });
                    return;
                }
                // get the links from the database
                const guildscount = await db.collection('links').getFullList();
                const check = await await db.collection('links').getFullList(parseInt(guildscount.length), {
                    filter: `guildID = ${guildID}`,
                });
                let linknum = check[0].links.length;
                // // check if the link url already exists
                // let linkexists = false;
                // for (let i = 0; i < linknum; i++) {
                //     if (check[0].links[i].link == link) {
                //         linkexists = true;
                //         interaction.followUp({ content: 'The link you provided already exists in the database', ephemeral: true });
                //         return;
                //     } else {
                //         linkexists = false;
                //        // interaction.followUp({ content: 'The link you provided does not exist in the database ', ephemeral: true });
                //     }
                // }
                // allow the user to add multiple links with commas and put them in an array
                // let links = link.split(',');

                // // check if spaces are in the link
                // if (link.includes(' ')) {
                //     interaction.followUp({ content: 'The link(s) you provided cannot contain spaces', ephemeral: true });
                //     return;
                // }

                // increase the link number by 1
                let linknumber = linknum;
                // if null then set to 1
                if (linknumber == null) {
                    linknumber = 1;
                } else {
                    linknumber = linknumber + 1;
                }
                // get the actual id of the db
                let id = check[0].id;
                // get the old json object
                let oldjson = check[0].links;
                // add the new link to the json object
                oldjson.push({ id: linknumber - 1 , name: namel, link: link });
                // update the database
                const update = await db.collection('links').update( id, {
                    links: oldjson,
                });
                interaction.followUp({ content: 'The link(s) have been added to the database', ephemeral: true });
            } else {
                return interaction.followUp({ content: 'You do not have the required role to use this command', ephemeral: true });
            }
        } catch (error) {
            console.log(error);
            interaction.followUp({ content: 'An error occured or this server is not setup yet', ephemeral: true });
        }
    }
    };