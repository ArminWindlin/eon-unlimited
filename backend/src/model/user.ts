import * as mongoose from "mongoose";
import {Schema} from "mongoose";

// Create schema for user collection
const UserSchema: Schema = new Schema({
    name: {
        type: String,
        index: true,
        unique: true,
        required: 'enter the name of the user',
    },
    email: {
        type: String,
        default: '',
    },
    password: {
        type: String,
        default: '',
    },
    token: {
        type: String,
        index: true,
        unique: true,
        required: 'enter the token of the user',
    },
    registerAt: {
        type: Date,
        default: Date.now,
    }
});

// Export schema for user collection
export const User =  mongoose.model('users', UserSchema);