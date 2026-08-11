const { getTransporter } = require("../config/mail");
const nodemailer = require("nodemailer");

const sendPrescriptionEmail = async ({
    to,
    patientName,
    doctorName,
    pdfPath,
    careToBeTaken,
    medicines
}) => {
    try {
        console.log("========================================");
        console.log("📧 SENDING PRESCRIPTION EMAIL");
        console.log("========================================");
        console.log(`📧 To: ${to}`);
        console.log(`👤 Patient: ${patientName}`);
        console.log(`👨‍⚕️ Doctor: Dr. ${doctorName}`);
        console.log(`📎 PDF: ${pdfPath}`);
        console.log("========================================");

        const transporter = await getTransporter();
        if (!transporter) {
            throw new Error("Email transporter is not available");
        }

        const mailOptions = {
            from: `"Dr. ${doctorName}" <noreply@prescription-platform.com>`,
            to: to,
            subject: `📋 Prescription from Dr. ${doctorName}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <div style="text-align: center; border-bottom: 2px solid #3498db; padding-bottom: 15px; margin-bottom: 20px;">
                        <h1 style="color: #2c3e50; margin: 0;">🏥 Prescription</h1>
                        <p style="color: #7f8c8d; margin: 5px 0;">Online Prescription Platform</p>
                    </div>
                    
                    <p style="font-size: 16px;">Dear <strong style="color: #2c3e50;">${patientName}</strong>,</p>
                    
                    <p style="font-size: 16px;">Please find your prescription from <strong style="color: #3498db;">Dr. ${doctorName}</strong> attached to this email.</p>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3498db;">
                        <h3 style="color: #2c3e50; margin-top: 0;">📝 Prescription Details</h3>
                        <p style="margin: 10px 0;"><strong>🩺 Care to be taken:</strong><br>${careToBeTaken}</p>
                        <p style="margin: 10px 0;"><strong>💊 Medicines:</strong><br>${medicines || "None prescribed"}</p>
                    </div>
                    
                    <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                        <p style="margin: 0; color: #856404;">
                            <strong>⚠️ Important:</strong> This is a computer-generated prescription. 
                            Please verify all details with your doctor.
                        </p>
                    </div>
                    
                    <hr style="border: 1px solid #e0e0e0; margin: 20px 0;">
                    
                    <p style="color: #7f8c8d; font-size: 14px; text-align: center;">
                        This is an automated email. Please do not reply to this email.<br>
                        For any queries, please contact your doctor directly.
                    </p>
                    
                    <p style="color: #95a5a6; font-size: 12px; text-align: center; margin-top: 20px;">
                        © ${new Date().getFullYear()} Online Prescription Platform
                    </p>
                </div>
            `,
            attachments: [{
                filename: `prescription-${Date.now()}.pdf`,
                path: pdfPath,
                contentType: "application/pdf"
            }]
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent!");

        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
            console.log("========================================");
            console.log("📩 EMAIL PREVIEW URL:");
            console.log(`🔗 ${previewUrl}`);
            console.log("========================================");
        }

        return true;
    } catch (err) {
        console.error("❌ Email error:", err);
        throw new Error(`Failed to send email: ${err.message}`);
    }
};

module.exports = { sendPrescriptionEmail };