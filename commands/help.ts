import { ChatInputCommandInteraction, SlashCommandBuilder, ContextMenuCommandBuilder, EmbedBuilder } from 'discord.js';
import getTips from '../lib/tips';
import type { SlashCommand } from '../types';

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('help me what do I do');

const tips = getTips([
  'You can also view these tips by running /tip'
])

export async function run(client: any, interaction: ChatInputCommandInteraction) {
  const fields = [];
  const commandData = client.commands.map((c: any) => c.data);
  const slashCommandData = commandData
    .filter((command: any) => command instanceof SlashCommandBuilder)
    .map((c: SlashCommand) => `\`${c.name}\``);

  const contextCommandData = commandData
    .filter((command: any) => command instanceof ContextMenuCommandBuilder)
    .map((c: SlashCommand) => `\`${c.name}\``);

  fields.push({
    name: 'Total Commands',
    value: commandData.length.toString()
  })

  fields.push({
    name: 'Slash Commands',
    value: slashCommandData.join(' ')
  });

  fields.push({
    name: 'Context Menu Commands',
    value: contextCommandData.join(' ')
  });

  const tip = tips[Math.floor(Math.random() * tips.length)];
  const embed = new EmbedBuilder()
  .setTitle('Help')
  .setDescription(
`Welcome to Link Master! This bot uses [Slash Commands](https://discord.com/blog/welcome-to-the-new-era-of-discord-apps),
so you can press / to view the commands you can use from
_all_ the bots on this server!\n\n${tip}`)
  .addFields(fields);
  
  interaction.reply({ embeds: [embed] });
}