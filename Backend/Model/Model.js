import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {type: String, required: true},
    password: {
        type: String,
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
    },
    otp: {
        type: String
    }, 
    otpExpiresAt: {
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
