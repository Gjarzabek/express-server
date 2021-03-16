import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    _id: String, 
    name: String,
    password: String,
    email: {
        type: String,
        unique: true
    },
    friends: [
        {id: String}
    ],
    chats: [
        {id: String}
    ],
    notifications: [],
    desc: String,
    icon: {
        type: Number,
        default: 0
    }
}, { _id: false });

export default mongoose.model('User', UserSchema, 'users');