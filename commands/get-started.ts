import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { guildModel } from "../lib/schema.js";

export const data = new SlashCommandBuilder()
  .setName("get-started")
  .setDescription("Get Started with Link Master!")
  .setDefaultMemberPermissions("8")
  .setDMPermission(false);

export async function run(client: any, interaction: ChatInputCommandInteraction) {
    const model = await guildModel.findOne({ GuildId: interaction.guild!.id });
    if(model) return interaction.reply({ content: "You have already set up Link Master!", ephemeral: true });
    await interaction.deferReply();

    const newData = new guildModel({
        GuildId: interaction.guild!.id,
        isPremium: false,
        dmMode: false,
        limit: 3
    });
    await newData.save();
    interaction.editReply("Set up! Thank you for using Link Master");
}