import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { guildModel } from "../lib/schema.ts";
import { ClientMessages } from "../lib/messages.ts";

export const data = new SlashCommandBuilder()
  .setName("list")
  .setDescription("List links (up to 2048 characters)")
  .setDefaultMemberPermissions("8")
  .setDMPermission(false);

export async function run(client: any, interaction: CommandInteraction) {
  const doc = await guildModel.findOne({ GuildId: interaction.guild?.id });
  if (!doc) return interaction.reply({
    content: ClientMessages.ERR_SERVER_NOT_FOUND_ADMIN,
    ephemeral: true
  });
  
  const links = (doc?.links || []).map(link => `${link.domain} - ${link.type}`);

  const embed = new EmbedBuilder()
    .setTitle("Links")
    .setDescription(links.join("\n").slice(0, 2048));
  interaction.reply({ embeds: [embed], ephemeral: true });
}