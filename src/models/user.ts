import mongoose from "mongoose";

const user = new mongoose.Schema({
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        required: false
    },
    otpExpires: {
        type: Date,
        required: false
    }
});

export default mongoose.model('User', user);