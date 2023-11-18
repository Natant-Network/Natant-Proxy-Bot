import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} from "discord.js";
import { guildModel } from "../lib/schema.js";
import { ClientMessages } from "../lib/messages.js";

export const data = new SlashCommandBuilder()
  .setName("limit")
  .setDescription("View or edit the proxy limit")
  .setDefaultMemberPermissions("8")
  .setDMPermission(false)
  .addSubcommand(command => command
    .setName("view")
    .setDescription("View the current proxy limit")
  )
  .addSubcommand(command => command
    .setName("edit")
    .setDescription("Edit the proxy limit")
    .addIntegerOption(option => option
      .setName("limit")
      .setDescription("The new proxy limit")
      .setRequired(true)
    )
  );

export async function run(client: any, interaction: ChatInputCommandInteraction) {
  const subcommand: string = interaction.options.getSubcommand();
  const doc = await guildModel.findOne({ GuildId: interaction.guild!.id });
  if (!doc) return interaction.reply({
    content: ClientMessages.ERR_SERVER_NOT_FOUND_ADMIN,
    ephemeral: true
  });
  if (subcommand == "view") {
    const embed = new EmbedBuilder()
      .setDescription(`The proxy limit is currently set to \`${doc.limit || 3}\``);
    interaction.reply({ embeds: [embed], ephemeral: true });
  } else if (subcommand == "edit") {
    try {
      const limit = interaction.options.getInteger("limit");
      // @ts-ignore
      doc.limit = limit;
      await doc.save();
      const embed = new EmbedBuilder()
        .setDescription(`✅ The proxy limit has been set to \`${limit}\``);
      interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.log(error);
    }
  }
}
