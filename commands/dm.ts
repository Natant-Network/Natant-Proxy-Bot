import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { guildModel } from "../lib/schema.ts";
import { ClientMessages } from "../lib/messages.ts";

export const data = new SlashCommandBuilder()
  .setName("dm")
  .setDescription("Enable or Disable DM mode")
  .setDefaultMemberPermissions("8")
  .setDMPermission(false)
  .addBooleanOption(option => option
    .setName("enabled")
    .setDescription("enabled/disabled")
    .setRequired(true)
  );

export async function run(client: any, interaction: ChatInputCommandInteraction) {
  // @ts-ignore you know what by now
  const GuildId: string = interaction.guild.id;
  const doc = await guildModel.findOne({ GuildId });
  if (!doc) return interaction.reply({ content: ClientMessages.ERR_SERVER_NOT_FOUND_ADMIN, ephemeral: true });
  const enable = interaction.options.getBoolean("enabled", true);
  const members: any = interaction.guild?.members.cache;

  if (members.size < 100 && !doc.isPremium) return interaction.reply({ content: `DM mode is a premium feature for servers with more then 100 members. ${ClientMessages.ERR_NEED_PREMIUM}`, ephemeral: true });
  doc.dmMode = enable;
  doc.save();
  interaction.reply({ content: `DM mode has been ${enable ? "enabled" : "disabled"}`, ephemeral: true });
}