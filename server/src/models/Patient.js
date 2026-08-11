const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        age: {
            type: Number,
            required: true
        },
        historyOfSurgery: {
            type: String,
            default: ""
        },
        historyOfIllness: {
            type: [String],
            default: []
        },
        profilePicUrl: {
            type: String,
            default: ""
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);