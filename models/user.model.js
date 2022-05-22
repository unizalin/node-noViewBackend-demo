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
        photo: String,
    },
    {
        versionKey: false,
    }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
