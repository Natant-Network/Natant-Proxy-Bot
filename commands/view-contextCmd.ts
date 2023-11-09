import { UserContextMenuCommandInteraction, ContextMenuCommandBuilder, ApplicationCommandType } from "discord.js";
import viewUser from "../lib/viewUser.js";

export const data = new ContextMenuCommandBuilder()
  .setName("View Usage")
  .setType(ApplicationCommandType.User)
  .setDefaultMemberPermissions(8)
  .setDMPermission(false);

export async function run(client: any, interaction: UserContextMenuCommandInteraction) {
  // @ts-ignore
  const gid: string = interaction.guild.id;
  const data = await viewUser(interaction.targetUser, gid);
  interaction.reply(data);
}