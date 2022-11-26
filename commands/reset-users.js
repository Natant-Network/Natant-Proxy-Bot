const { Message, SlashCommandBuilder, GuildDefaultMessageNotifications, InteractionWebhook, DMChannel, EmbedBuilder  } = require('discord.js');
const { email, password, url } = require('../config.json');
const PocketBase = require('pocketbase/cjs')
const {setTimeout} = require ('timers/promises');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reset-users')
        .setDescription('Reset all users in the database.'),
    async execute(interaction, args) {
        if (!interaction.inGuild()) {
            return interaction.reply({ content: 'You can\'t use this command in DMs'});
        }
        // auth with pocketbase
        const client = new PocketBase(`${url}`);
        const authData = await client.admins.authWithPassword(`${email}`, `${password}`);
        // get guild id
        let guildID = interaction.guild.id;
        let guildata = await client.collection('guilds').getFullList();
        let gdata = await client.collection('guilds').getFullList(parseInt(guildata.length), {
            filter: `guildID = ${guildID}`,
        }
        );
        if (gdata.length == 0) {
            return interaction.reply({ content: 'Guild not found in database. Please ask the server owner to run /get-started', ephemeral: true});
        }
        // check if the user has the correct role based on the role id
        let roleID = gdata[0].roleIDs;
        // remove <@&>
        roleID = roleID.replace('<@&', '');
        roleID = roleID.replace('>', '');
        
        let role = interaction.guild.roles.cache.get(roleID);
        if (!interaction.member.roles.cache.has(roleID)) {
            return interaction.reply({ content: `You need the correct roles to use this command.`, ephemeral: true});
        }
        await interaction.reply({ content: 'Resetting all users in the database. This may take a while.', ephemeral: true});
        // get all users 
        let userdata = await client.collection('users').getFullList();
        let udata = await client.collection('users').getFullList(parseInt(userdata.length), {
            filter: `idguild = ${guildID}`,
        });
        // stirngify the data
        let data = JSON.stringify(udata);
        // parse the data
        let parsed = JSON.parse(data);
        //console.log(parsed);
        // remove the data from the json object if it contains owner = 'true'
        for (let i = 0; i < parsed.length; i++) {
            if (parsed[i].owner == 'true') {
                parsed.splice(i, 1);
            } 
            if (parsed.length === 0) {
                return interaction.followUp({ content: 'There are not users in the database to reset.', ephemeral: true});
            }
            // remove all users in the database.
            await client.collection('users').delete( parsed[i].id);
            await interaction.followUp({ content: 'Reset All Users', ephemeral: true });
        }
        // get data from linkused
        let linkuseddata = await client.collection('linkused').getFullList();
        let linkused = await client.collection('linkused').getFullList( parseInt(linkuseddata.length), {
            filter: `guildID = ${guildID}`,
        });
        // console.log(linkused);
        // loop through the data and delete it
        for (let i = 0; i < linkused.length; i++) {
            await client.collection('linkused').delete( linkused[i].id);
        }


        
}
}