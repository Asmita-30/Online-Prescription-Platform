const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const Prescription = require("../models/Prescription");

const generatePrescriptionPdf = async (prescriptionId) => {
    const prescription = await Prescription.findById(prescriptionId)
        .populate("doctor", "name specialty")
        .populate("patient", "name age email phone")
        .populate("consultation");

    if (!prescription) {
        throw new Error("Prescription not found.");
    }

    const pdfDirectory = path.join(__dirname, "../../generated-pdfs");
    if (!fs.existsSync(pdfDirectory)) {
        fs.mkdirSync(pdfDirectory, { recursive: true });
    }

    const filePath = path.join(pdfDirectory, `prescription-${prescription._id}.pdf`);
    const document = new PDFDocument({ size: "A4", margin: 50 });
    const stream = fs.createWriteStream(filePath);
    document.pipe(stream);

    // Header
    document.fontSize(22).font("Helvetica-Bold").text("ONLINE PRESCRIPTION", { align: "center" });
    document.moveDown();

    document.fontSize(11).font("Helvetica").text(`Prescription ID: ${prescription._id}`);
    document.text(`Date: ${new Date(prescription.createdAt).toLocaleDateString()}`);
    document.moveDown();

    // Doctor
    document.fontSize(15).font("Helvetica-Bold").text("Doctor Information");
    document.moveDown(0.5);
    document.fontSize(11).font("Helvetica").text(`Dr. ${prescription.doctor.name}`);
    document.text(`Specialty: ${prescription.doctor.specialty}`);
    document.moveDown();

    // Patient
    document.fontSize(15).font("Helvetica-Bold").text("Patient Information");
    document.moveDown(0.5);
    document.fontSize(11).font("Helvetica").text(`Name: ${prescription.patient.name}`);
    document.text(`Age: ${prescription.patient.age}`);
    document.text(`Email: ${prescription.patient.email}`);
    document.text(`Phone: ${prescription.patient.phone}`);
    document.moveDown();

    // Illness
    document.fontSize(15).font("Helvetica-Bold").text("Current Illness");
    document.moveDown(0.5);
    document.fontSize(11).font("Helvetica").text(prescription.consultation?.currentIllness || "Not provided");
    document.moveDown();

    // Medicines
    document.fontSize(15).font("Helvetica-Bold").text("Medicines");
    document.moveDown(0.5);
    document.fontSize(11).font("Helvetica").text(prescription.medicines || "No medicines specified.");
    document.moveDown();

    // Care
    document.fontSize(15).font("Helvetica-Bold").text("Care to be Taken");
    document.moveDown(0.5);
    document.fontSize(11).font("Helvetica").text(prescription.careToBeTaken);
    document.moveDown(2);

    document.fontSize(10).fillColor("#666666").text(
        "This prescription was generated through the Online Prescription Platform.",
        { align: "center" }
    );

    document.end();

    await new Promise((resolve, reject) => {
        stream.on("finish", resolve);
        stream.on("error", reject);
    });

    prescription.pdfUrl = filePath;
    await prescription.save();

    return filePath;
};

module.exports = { generatePrescriptionPdf };