import mongoose from 'mongoose';

export default mongoose.model('guild', new mongoose.Schema({
  GuildId: String,
  isPremium: Boolean,
  dmMode: Boolean,
  limit: Number,
  types: Array,
  links: Array
}))