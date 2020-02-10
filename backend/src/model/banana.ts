import * as mongoose from "mongoose";
import {Schema} from "mongoose";

// Create schema for banana collection
const BananaSchema: Schema = new Schema({
    name: {
        type: String,
        required: 'enter the name of the banana'
    },
    color: {
        type: String,
        required: 'enter the color of the banana'
    },
    size: {
        type: Number,
        required: 'enter the size of the banana'
    },
    pick_date: {
        type: Date,
        default: Date.now
    },
    comment: String
});

// Export schema for banana collection
export const Banana = mongoose.model('bananas', BananaSchema);