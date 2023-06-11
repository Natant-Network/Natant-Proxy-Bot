import {
  EmbedBuilder,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  AutocompleteInteraction
} from 'discord.js';
import guildModel from '../schema/guild';
import type { GuildLink } from '../types';

export const data = new SlashCommandBuilder()
  .setName('link')
  .setDescription('Add / remove a link')
  .setDefaultMemberPermissions('8')
  .setDMPermission(false)
  .addSubcommand(command => command
    .setName('add')
    .setDescription('Add a link')
    .addStringOption(option => option
      .setName('category')
      .setDescription('The category to add the link to')
      .setRequired(true)
      .setAutocomplete(true)
    )
    .addStringOption(option => option
      .setName('link')
      .setDescription('The link to add')
      .setRequired(true)
    )
  )
  .addSubcommand(command => command
    .setName('remove')
    .setDescription('Remove a link')
    .addStringOption(option => option
      .setName('link')
      .setDescription('The link to remove')
      .setRequired(true)
      .setAutocomplete(true)
    )
  );

export async function run(client: any, interaction: ChatInputCommandInteraction) {
  try {
    // @ts-ignore
    const category: string = interaction.options.getString('category');
    const link: string = interaction.options.getString('link', true);
    const doc = await guildModel.findOne({
      GuildId: interaction.guild?.id
    });
    if(!doc) return interaction.reply({
      content: client.messages.get('ERR_SERVER_NOT_FOUND_ADMIN'),
      ephemeral: true
    });
    const subcommand: string = interaction.options.getSubcommand();

    if(subcommand == 'add') {
      if(!doc.types.includes(category)) return interaction.reply({
        content: `Invalid category \`${category}\``,
        ephemeral: true
      });

      if(link.length > 50) {
        return interaction.reply({
          content: `Max character count for a link is 50 (got ${link.length})!`,
          ephemeral: true
        });
      }
      doc.links.push({
        type: category,
        domain: link
      });
      await doc.save();
      const embed = new EmbedBuilder()
        .setDescription(`✅ Added link \`${link}\` to category \`${category}\``)
      interaction.reply({ embeds: [embed], ephemeral: true });
    } else if(subcommand == 'remove') {
      const i: number = findIndex(doc.links, {
        type: category,
        domain: link
      })
      doc.links.splice(i, 1);
      await doc.save();
      const embed = new EmbedBuilder()
        .setDescription(`✅ Removed link \`${link}\``);
      interaction.reply({ embeds: [embed], ephemeral: true });
    }
  } catch (error) {
    console.error(error);
  }
}

export async function autocomplete(client: any, interaction: AutocompleteInteraction) {
  const doc = await guildModel.findOne({ GuildId: interaction.guild?.id });
  if(!doc) return interaction.respond([]);
  const input = interaction.options.getFocused(true);
  var data: string[] = [];
  if(input.name == 'link') {
    data = doc.links.map(link => link.domain).filter(domain => domain.startsWith(input.value));
  } else if(input.name == 'category') {
    data = doc.types.filter(type => type.startsWith(input.value));
  }
  interaction.respond(
    data.map(type => ({ name: type, value: type }))
  );
}

function findIndex(domains: Array<GuildLink>, e: GuildLink): number {
  let i = 0;
  while (i < domains.length) {
    if (domains[i].domain == e.domain && domains[i].type == e.type) return i;
    i++;
  }
  return 0;
};