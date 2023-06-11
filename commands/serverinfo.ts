import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('serverinfo')
  .setDescription('Get info about the current server');

export async function run(client: any, interaction: ChatInputCommandInteraction) {
  interaction.reply('This command is not finished!');
}