import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    phoneNo: {type: String, required: true},
    password: {
        type: String,
        minlength: 6,
        required: true,
        select: false
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    title: {type:String},
    age: {
        type: Number,
        required: true
    },
    createdAt: {
        type: String,
        default: () => new Date().toLocaleString()
    },
    updatedAt: {
        type: String
    }
});

userSchema.pre('save', function (next) {
    if (this.gender === 'male') {
        this.title = 'Mr. ';
    } else if (this.gender === 'female') {
        this.title = 'Ms. ';
    }
    next();
});

export default mongoose.model("users", userSchema);
