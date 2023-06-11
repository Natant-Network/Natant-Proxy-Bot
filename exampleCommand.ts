import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('example')
  .setDescription('Example Command');

export async function run(client: any, interaction: ChatInputCommandInteraction) {
  interaction.reply('Example Command');
}