const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true
        },
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true
        },
        currentIllness: {
            type: String,
            required: true,
            trim: true
        },
        recentSurgery: {
            type: String,
            default: "",
            trim: true
        },
        surgeryTimeSpan: {
            type: String,
            default: "",
            trim: true
        },
        isDiabetic: {
            type: Boolean,
            default: false
        },
        allergies: {
            type: String,
            default: "",
            trim: true
        },
        others: {
            type: String,
            default: "",
            trim: true
        },
        transactionId: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            enum: ["pending", "prescribed"],
            default: "pending"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Consultation", consultationSchema);