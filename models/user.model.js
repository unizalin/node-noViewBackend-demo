const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [ true, '請輸入您的名字' ]
        },
        email: {
            type: String,
            required: [ true, '請輸入您的 Email' ],
            unique: true,
            lowercase: true,
            select: false
        },
        gender:{
            type: Number,
            default:2
        },
        createAt: {
            type: Date,
            default: Date.now,
        },
        photo: {
            type: String,
            default: 'https://cdn.pixabay.com/photo/2021/01/04/10/41/icon-5887126_960_720.png'
        }
    },
    {
        versionKey: false,
    }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
