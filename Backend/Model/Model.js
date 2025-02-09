import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    age: {
        type: Number,
        required: truxe
    },
    createdAt: {
        type: String,
        default: () => new Date().toLocaleString()
    },
    editedAt: {
        type: String
    }
})

export default mongoose.model("users", userSchema);
