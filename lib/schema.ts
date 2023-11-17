import mongoose from "mongoose";

export const guildModel = mongoose.model("guild", new mongoose.Schema({
  GuildId: String,
  isPremium: Boolean,
  dmMode: Boolean,
  limit: Number,
  types: Array,
  links: Array
}))

export const userModel = mongoose.model("user", new mongoose.Schema({
    UserId: String,
    links: Array,
    guilds: Object
}));