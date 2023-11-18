import mongoose from "mongoose";

const linksSchema = new mongoose.Schema({
  _id: { type: mongoose.Types.ObjectId, required: true, default: () => new mongoose.Types.ObjectId() },
  type: { type: String, required: true },
  domain: { type: String, required: true }
});

const userGuildSchema = new mongoose.Schema({
  uses: { type: Number, required: true, default: 0 },
  links: { type: [String], required: true, default: 0 }
});

const guildSchema = new mongoose.Schema({
  GuildId: { type: String, required: true },
  isPremium: Boolean,
  dmMode: Boolean,
  limit: { type: Number, required: true },
  types: { type: [String], required: true, default: [] },
  links: { type: [linksSchema], required: true, default: [] }
});

export const guildModel = mongoose.model("guild", guildSchema)

export const userModel = mongoose.model("user", new mongoose.Schema({
  UserId: { type: String, required: true },
  guilds: {
    type: Map,
    of: userGuildSchema,
    required: true,
    default: {}
  }
}));