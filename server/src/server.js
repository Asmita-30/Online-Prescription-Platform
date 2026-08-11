require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const { createTransporter, getTestAccount } = require("./config/mail");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        console.log("✅ MongoDB connected");

        await createTransporter();
        const testAccount = getTestAccount();
        
        if (testAccount) {
            console.log("========================================");
            console.log("📧 TEST EMAIL ACCOUNT");
            console.log("========================================");
            console.log(`📧 Email: ${testAccount.user}`);
            console.log(`🔑 Password: ${testAccount.pass}`);
            console.log(`🔗 Preview: https://ethereal.email/messages`);
            console.log("========================================");
            console.log("⚠️  Use these credentials to view emails");
            console.log("========================================");
        }

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("❌ Server startup failed:", err.message);
        process.exit(1);
    }
};

startServer();