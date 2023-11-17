import { UserContextMenuCommandInteraction, ContextMenuCommandBuilder, ApplicationCommandType } from "discord.js";
import viewUser from "../lib/viewUser.js";

export const data = new ContextMenuCommandBuilder()
  .setName("View Usage")
  .setType(ApplicationCommandType.User)
  .setDefaultMemberPermissions(8)
  .setDMPermission(false);

export async function run(client: any, interaction: UserContextMenuCommandInteraction) {
  const data = await viewUser(interaction.targetUser, interaction.guild!.id);
  interaction.reply(data);
}