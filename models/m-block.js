const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blockSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: false
    },
    userImage: {
        type: String,
        required: false
    },
    blockedBy: {
        users: [{
            id: {
                type: String,
                required: false
            },
            name: {
                type: String,
                required: false
            },
            image: {
                type: String,
                required: false
            }
        }]
    },
    totalBlock: {
        type: Number,
        required: false
    },
    harassment: {
        type: Number,
        required: false
    },
    nudity: {
        type: Number,
        required: false
    },
    falseGender: {
        type: Number,
        required: false
    },
    date: {
        type: Date,
        default: Date.now()
    }
}, { timestamps: true });

module.exports = mongoose.model('tblblock', blockSchema);