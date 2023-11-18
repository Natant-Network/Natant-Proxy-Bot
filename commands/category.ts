import {
  ChatInputCommandInteraction,
  AutocompleteInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} from "discord.js";
import { guildModel } from "../lib/schema.js";
import { ClientMessages } from "../lib/messages.js";

export const data = new SlashCommandBuilder()
  .setName("category")
  .setDescription("Add / remove a category")
  .setDefaultMemberPermissions("8")
  .setDMPermission(false)
  .addSubcommand(command => command
    .setName("add")
    .setDescription("Add a category")
    .addStringOption(option => option
      .setName("category")
      .setDescription("The category to add")
      .setRequired(true)
    )
  )
  .addSubcommand(command => command
    .setName("remove")
    .setDescription("Remove a category")
    .addStringOption(option => option
      .setName("category")
      .setDescription("The category to remove")
      .setRequired(true)
      .setAutocomplete(true)
    )
  );

export async function run(client: any, interaction: ChatInputCommandInteraction) {
  try {
    const category = interaction.options.getString("category", true);
    const doc = await guildModel.findOne({
      GuildId: interaction.guild!.id
    });
    if (!doc) return interaction.reply({
      content: ClientMessages.ERR_SERVER_NOT_FOUND_ADMIN,
      ephemeral: true,
    });
    const subcommand: string = interaction.options.getSubcommand();

    if (subcommand == "add") {
      if (category.length > 20) return interaction.reply({
        content: `Max character count for a category is 20 (got ${category.length})!`,
        ephemeral: true
      });
      doc.types.push(category);
      await doc.save();
      const embed = new EmbedBuilder()
        .setDescription(`✅ Added category \`${category}\``);
      interaction.reply({ embeds: [embed], ephemeral: true });
    } else if (subcommand == "remove") {
      if (!doc.types.includes(category)) return interaction.reply({
        content: `Invalid category \`${category}\``,
        ephemeral: true,
      });
      doc.types.splice(doc.types.indexOf(category), 1);
      await doc.save();
      const embed = new EmbedBuilder()
        .setDescription(`✅ Removed category \`${category}\``);
      interaction.reply({ embeds: [embed], ephemeral: true });
    }
  } catch (error) {
    console.error(error);
  }
}

export async function autocomplete(client: any, interaction: AutocompleteInteraction) {
  const doc = await guildModel.findOne({ GuildId: interaction.guild!.id });
  if (!doc) return interaction.respond([]);
  const input: string = interaction.options.getFocused();
  const data: string[] = doc.types.filter((type) => type.startsWith(input));
  interaction.respond(
    data.map(type => ({ name: type, value: type }))
  );
}