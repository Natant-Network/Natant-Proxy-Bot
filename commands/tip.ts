import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import getTips from '../lib/tips';

export const data = new SlashCommandBuilder()
  .setName('tip')
  .setDescription('Get a helpful tip');

const tips = getTips([
  'You can also view these tips in /help'
]);

export async function run(client: any, interaction: ChatInputCommandInteraction) {
  const tip = tips[Math.floor(Math.random() * tips.length)];
  interaction.reply({ content: tip, ephemeral: true });
}