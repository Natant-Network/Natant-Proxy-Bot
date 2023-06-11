import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import guildModel from '../schema/guild';

export const data = new SlashCommandBuilder()
  .setName('list')
  .setDescription('List links (up to 2048 characters)')
  .setDefaultMemberPermissions('8')
  .setDMPermission(false);

export async function run(client: any, interaction: CommandInteraction) {
  const doc = await guildModel.findOne({ GuildId: interaction.guild?.id });
  if (!doc) return interaction.reply({
    content: client.messages.get('ERR_SERVER_NOT_FOUND_ADMIN'),
    ephemeral: true
  });
  const res = [];
  for(const link of doc?.links || []) {
    res.push(`${link.domain} - ${link.type}`);
  }

  res.join('\n');

  const embed = new EmbedBuilder()
    .setTitle('Links')
    .setDescription(res.join('\n').slice(0, 2048));
  interaction.reply({ embeds: [embed], ephemeral: true });
}