import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    id: { 
        type: String,
        required: true,
        unique: true
    },
    name: String,
    password: String,
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
});

export default mongoose.model('User', UserSchema, 'users');