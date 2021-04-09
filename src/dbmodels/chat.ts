import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
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