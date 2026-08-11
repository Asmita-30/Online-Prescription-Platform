const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema(
    {
        consultation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Consultation",
            required: true,
            unique: true
        },
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true
        },
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true
        },
        careToBeTaken: {
            type: String,
            required: true,
            trim: true
        },
        medicines: {
            type: String,
            default: "",
            trim: true
        },
        pdfUrl: {
            type: String,
            default: ""
        },
        sentToPatient: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);