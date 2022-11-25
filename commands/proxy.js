const { Message, SlashCommandBuilder, GuildDefaultMessageNotifications, InteractionWebhook, DMChannel, EmbedBuilder  } = require('discord.js');
const { email, password } = require('../config.json');
const PocketBase = require('pocketbase/cjs')
const {setTimeout} = require ('timers/promises');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('proxy')
        .setDescription('Get a proxy')
        .addStringOption(option =>
            option.setName('name')
            .setDescription('The name of the proxy site')
            .setRequired(true)
            .setAutocomplete(true)),
    async autocomplete (interaction) {
        try {
        let guildid = interaction.guild.id;
        let userid = interaction.user.id;
        const focusedValue = interaction.options.getFocused();
        // init db
        const db = new PocketBase('http://127.0.0.1:8090');
        const authData = await db.admins.authViaEmail(`${email}`, `${password}`);
        // get the guild id from the command
        const guildscount = await db.records.getFullList('links');
        const check = await await db.records.getFullList('links', parseInt(guildscount.length), {
            filter: `guildID = ${guildid}`,
        });
        // get names of all the links in the json object
        let linknames = [];
        for (let i = 0; i < check[0].links.length; i++) {
            linknames.push(check[0].links[i].name);
        }
        // console.log(linknames);
        // filter out duplicate names
        let unique = [...new Set(linknames)];
        // remove base from the array
        unique.splice(unique.indexOf('base'), 1);
        // console.log(unique);
        // console.log(check[0].links.length);
        const choices = unique;
        const filtered = choices.filter(choice => choice.startsWith(focusedValue));
        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
        );


        } catch (error) {
            // console.log(error);
        }
    },
    async execute(interaction, args, client) {
        try {
         await interaction.reply({content: "Getting proxy...", ephemeral: true});
        async function start() {
        if (!interaction.inGuild()) {
            return interaction.followUp({ content: 'You can\'t use this command in DMs'});
        }
        // get the user id from the command
        let userid = interaction.user.id;
        // get the guild id from the command
        let guildid = interaction.guild.id;
        let ownerid = interaction.guild.ownerId;
        // get the name of the proxy from the command
        let name = interaction.options.getString('name');
        let nouses;
        // console.log('userid: ' + userid);
        // check if the user is already in the database
        const pdb = new PocketBase('http://127.0.0.1:8090');
        const authData = await pdb.admins.authViaEmail(`${email}`, `${password}`);
        await interaction.followUp({content: 'Checking if the server is setup...', ephemeral: true});
        const guildscount = await pdb.records.getFullList('guilds');
        const check = await await pdb.records.getFullList('guilds', parseInt(guildscount.length), {
            filter: `guildID = ${guildid}`,
        });
        if (check.length == 0) {
            await interaction.followUp({content: 'This server is not setup! Ask the server owner to run /get-started', ephemeral: true});
            return;
        } else {
        //console.log(check);
        
                const records = await pdb.records.getFullList('users');
                await interaction.followUp({content: 'Checking if you are already in the database...', ephemeral: true });
                let i = 0;
                let usercheck = '';
                let usercheckid = '';
                let usercheckguild = '';
                let usercheckuses = '';
                let count = records.length;
                // check if user is in the database
                if (ownerid == userid) {
                    await interaction.followUp({ content: 'You are the owner of this server! You should not need links!', ephemeral: true });
                } else {
                    // check if user is in the database with pocketbase filtering
                    // get count of records in the database
                    const idofuser = await pdb.records.getFullList('users', parseInt(count), {
                        filter: `iduser = ${userid} && idguild = ${guildid}`,
                        // add a second filter
                    
                        // sort: '-created,title',
                    });
                    // console.log(idofuser);
                    if (idofuser.length == 0) {
                        // if user is not in the database, add them
                        await interaction.followUp({ content: 'You are not in the database! Adding you now...', ephemeral: true });
                        const newrecord = await pdb.records.create('users', {
                            iduser: `${userid}`,
                            idguild: `${guildid}`,
                            uses: 0,
                            owner: false
                        });
                        const usedlink = await pdb.records.create('linkused', {
                            userID: `${userid}`,
                            guildID: `${guildid}`,
                            link: 'none',
                        });
                        // declare all the variables
                        await interaction.followUp({ content: 'Added you to the database!', ephemeral: true });
                        return start();
                    } else {
                        await interaction.followUp({ content: 'You are already in the database! Getting your info...', ephemeral: true });
                    }
                    // await setTimeout(1200);
                    try {
                    // get the json data of the links
                    const guildscount = await pdb.records.getFullList('links');
                    const links = await await pdb.records.getFullList('links', parseInt(guildscount.length), {
                        filter: `guildID = ${guildid}`,
                    });
                    // console.log(links);
                    // get the json datat of the links
                    let linknames = [];
                    for (let i = 0; i < links[0].links.length; i++) {
                        linknames.push(links[0].links[i].name);
                    }
                    // remove base from the array
                    linknames.splice(linknames.indexOf('base'), 1);
                    // console.log(linknames);
                    // check if the name of the proxy is in the array
                    if (linknames.includes(name)) {
                        await interaction.followUp({ content: 'Getting your proxy...', ephemeral: true });
                        // get the links from the json object based off of the name
                        let link = [];
                        for (let i = 0; i < links[0].links.length; i++) {
                            if (links[0].links[i].name == name) {
                                link.push(links[0].links[i].link);
                            }
                        }
                        // get guild data
                        const guildscount = await pdb.records.getFullList('guilds');
                        const guild = await await pdb.records.getFullList('guilds', parseInt(guildscount.length), {
                            filter: `guildID = ${guildid}`,
                        });
                        // get the uses from the database
                        // remove duplicates from the array
                        let unique = [...new Set(link)];
                        // console.log(unique);
                        // get a random link from the array that never needs to be the same
                        let random;
                        function rand() { random = unique[Math.floor(Math.random() * unique.length)]; }
                        rand();
                        // console.log(random);
                        // get the number of uses from the database
                        let uses = idofuser[0].numberofuses;
                        if (uses === guild[0].usesallowed) {
                            return await interaction.followUp({ content: 'You have reached the max uses for this server!', ephemeral: true });
                        }
                        // add one to the number of uses
                        let newuses = uses + 1;
                        // update the number of uses in the database
                        const update = await pdb.records.update('users', idofuser[0].id, {
                            numberofuses: newuses
                        });
                        // send the link to the user
                        // make embed
                        const embed = new EmbedBuilder() 
                        .setColor(0x0099FF)
                        .setTitle('Your Proxy')
                        // .setURL('https://motortruck1221.tech')
                        .setAuthor({ name: 'Natant Proxy Bot', url: 'https://github.com/natant-network/proxybot' })
                        //iconURL: 'https://i.imgur.com/AfFp7pu.png',
                        .addFields(
                            { name: 'Proxy', value: `${random}` },
                            { name: 'Uses', value: `${newuses}/${guild[0].usesallowed}` },
                            { name: 'Server ID', value: `${guild[0].guildID}` },
                            { name: 'Thanks for using Natant Proxy Bot!', value: 'If you have any questions, join the support server!' + '\n' + 'https://dsc.gg/natantnetwork' },
                            // { name: 'Made by', value: 'Natant Network \n And MotorTruck1221#3803' },
                        )
                        .setFooter({ text: 'Made by Natant Network \n And MotorTruck1221#3803' })
                        //.setTimestamp()
                        .setThumbnail('https://i.imgur.com/AfFp7pu.png')
                        //.setDescription('Made By MotorTruck1221#3803')
                        // get used link with pocketbase
                        const usedlinkcount = await pdb.records.getFullList('linkused');
                        const usedlink = await await pdb.records.getFullList('linkused', parseInt(usedlinkcount.length), {
                            filter: `userID = ${userid} && guildID = ${guildid}`,
                        });
                        // get the last used link from the database with multiple filters
                        const lastusedlink = await pdb.records.getFullList('linkused', parseInt(usedlinkcount.length), {
                            filter: `userID = ${userid} && guildID = ${guildid}`,
                        });
                        let lastlink = lastusedlink[0].link;
                        if (lastlink === 'none') {
                            // update the used link
                            const update = await pdb.records.update('linkused', lastusedlink[0].id, {
                                link: random
                            });
                        } else if (lastlink == random) {
                            // if the last link is the same as the new link, get a new link until it is different
                            while (lastlink == random) {
                                rand();
                            }
                        } 
                        // update the used link
                        const updated = await pdb.records.update('linkused', lastusedlink[0].id, {
                            link: random
                        });

                        await interaction.followUp({ embeds: [embed], ephemeral: true });
                        // dm the user the link
                       interaction.member.send({ embeds: [embed] });
                    } else {
                        await interaction.followUp({ content: 'That proxy does not exist!', ephemeral: true });
                        return;
                    }
                
                } catch (error) {
                    console.log(error);
                    // if the reason for the error is that numberofuses cannot be read because it is undefined, rerun the function
                    // start();
                }
    }
                }
        }
        start(); 
        } catch (error) {
            console.log(error);
        }
    }
    }