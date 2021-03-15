import mongoose from 'mongoose';

const ForumSchema = new mongoose.Schema({
    id: { 
        type: String,
        required: true,
        unique: true
    },
    users: [
        {id: String}
    ],
    name: String,
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
    ],
    maxUsers: Number,
    usersNumber: Number
});

export default mongoose.model('Forum', ForumSchema, 'forums');