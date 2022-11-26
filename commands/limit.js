const { Message, SlashCommandBuilder, GuildDefaultMessageNotifications, InteractionWebhook, DMChannel, EmbedBuilder  } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('limit')
        .setDescription('Set the limit of proxies'),
    async execute(interaction) {
        let embed = new EmbedBuilder();
        embed.setTitle('Limit');
        //embed.setDescription('This command is currently under development');
        embed.addFields({
            name: 'Under Development',
            value: 'This command is currently under development',
            inline: false
        },
        {
            name: 'Want to donate?',
            value: 'You can donate to help support the development of this bot',
            inline: false
        },
        {
            name: 'To Donate, join the server and open a ticket',
            value: 'https://dsc.gg/natantnetwork',
            inline: false
        } 
        );
        embed.setColor('#ff0000');
        await interaction.reply({ embeds: [embed], ephemeral: true});
    },
};
