const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "姓名必填"]
        },
        content: {
            type: String,
            required: [true, 'Content 未填寫']
        },
        image: {
            type: String,
            default: ""
        },
        tags: {
            type: Number,
            default: 0
        },
        likes: {
            type: Number,
            default: 0
        },
        createdAt: {
            type: Date,
            default: Date.now,
            select: false
        }
    },
    {
        versionKey: false,
        timestamps: true
    });


const Post = mongoose.model('Post', postSchema);



module.exports = Post;