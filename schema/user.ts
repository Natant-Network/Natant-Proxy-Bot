import mongoose from 'mongoose';

export default mongoose.model('user', new mongoose.Schema({
    UserId: String,
    thisMonth: Number,
    links: Array,
    guilds: Object
}))