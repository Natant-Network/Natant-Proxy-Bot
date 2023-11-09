import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { guildModel, userModel } from "../lib/schema.ts";
import { ClientMessages } from "../lib/messages.ts";

export const data = new SlashCommandBuilder()
  .setName("usage")
  .setDescription("View the last couple links you have received, along with your usage")
  .setDMPermission(false);
  
export async function run(client: any, interaction: ChatInputCommandInteraction) {
  // @ts-ignore
  const gid: string = interaction.guild.id;
  const doc = await guildModel.findOne({ GuildId: gid });
  if(!doc) return interaction.reply({
    content: ClientMessages.ERR_SERVER_NOT_FOUND,
    ephemeral: true
  });
  const user = await userModel.findOne({ UserId: interaction.user.id });
  if(!user) return interaction.reply({
      content: ClientMessages.ERR_YOU_HAVE_NOT_USED_BOT,
      ephemeral: true
  });
  if(!user.guilds[gid]) return interaction.reply({
    content: ClientMessages.ERR_YOU_HAVE_NOT_USED_BOT,
    ephemeral: true
  });

  const links: string = user.guilds[gid].links.slice(0, doc.limit).join("\n");
  const embed = new EmbedBuilder()
    .addFields([
      { name: "Curent Usage", value: `${user.guilds[gid].uses} (out of ${doc.limit})` },
      { name: `Last ${doc.limit} links`, value: links }
    ]);
  interaction.reply({ embeds: [embed], ephemeral: true });
}