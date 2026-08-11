const nodemailer = require("nodemailer");

let transporter = null;
let testAccount = null;

const createTransporter = async () => {
    try {
        testAccount = await nodemailer.createTestAccount();

        console.log("========================================");
        console.log("📧 ETHEREAL EMAIL TEST ACCOUNT CREATED");
        console.log("========================================");
        console.log(`📧 Email: ${testAccount.user}`);
        console.log(`🔑 Password: ${testAccount.pass}`);
        console.log(`🔗 Preview URL: https://ethereal.email/messages`);
        console.log("========================================");

        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });

        await transporter.verify();
        console.log("✅ Email service connected successfully (Ethereal)");
        return transporter;
    } catch (err) {
        console.error("❌ Email service connection failed:", err.message);
        
        transporter = {
            sendMail: async (mailOptions) => {
                console.log("========================================");
                console.log("📧 EMAIL (DUMMY MODE - No actual email sent)");
                console.log("========================================");
                console.log(`To: ${mailOptions.to}`);
                console.log(`Subject: ${mailOptions.subject}`);
                const patientName = mailOptions.html?.match(/Dear <strong>(.*?)<\/strong>/)?.[1] || "Unknown";
                console.log(`Patient: ${patientName}`);
                console.log("========================================");
                return { messageId: "dummy-" + Date.now() };
            },
            verify: async () => true,
        };
        return transporter;
    }
};

const getTransporter = async () => {
    if (!transporter) {
        await createTransporter();
    }
    return transporter;
};

const getTestAccount = () => testAccount;

module.exports = {
    getTransporter,
    createTransporter,
    getTestAccount,
};