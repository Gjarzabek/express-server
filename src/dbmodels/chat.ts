import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
    id: { 
        type: String,
        required: true,
        unique: true
    },
    users: [
        {id: String}
    ],
    name: String,
    type: {
        type: Number,
        required: true,
    },
    messages: [
        {
            timestamp: Number,
            content: String,
            author: {
                name: String,
                id: String,
                icon: Number,
                required: true
            }
        }
    ]
});

export default mongoose.model('Chat', ChatSchema, 'chats');