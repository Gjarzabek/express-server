import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
    id: { 
        type: String,
        required: true,
        unique: true
    },
    users: [String],
    type: {
        type: Number,
        required: true,
    },
    messages: [
        {
            timestamp: Number,
            content: String,
            author: {
                id: String,
                required: true
            }
        }
    ]
});

export default mongoose.model('Chat', ChatSchema, 'chats');