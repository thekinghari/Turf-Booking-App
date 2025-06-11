"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const notifications_1 = __importDefault(require("./routes/notifications"));
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const bookings_1 = __importDefault(require("./routes/bookings"));
const config_1 = __importDefault(require("./config/config"));
const app = (0, express_1.default)();
exports.app = app;
// Middleware
app.use((0, cors_1.default)({
    origin: config_1.default.corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json());
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/users', users_1.default);
app.use('/api/notifications', notifications_1.default);
app.use('/api/bookings', bookings_1.default); // Assuming this was missing and intended
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});
// MongoDB Connection and Server Listening (for traditional server start)
// This part will be executed if this file is run directly (e.g. `node dist/index.js`)
// but not when imported by serverless a handler that just needs the `app`.
let MONGODB_URI = config_1.default.mongoUri;
if (!MONGODB_URI) {
    console.error('MongoDB URI is not defined. Please set MONGODB_URI environment variable.');
    // process.exit(1); // Don't exit if imported, allow serverless to handle
}
// Function to connect to MongoDB
const connectDB = async () => {
    if (mongoose_1.default.connection.readyState >= 1) {
        // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
        console.log('MongoDB already connected.');
        return;
    }
    try {
        if (!MONGODB_URI)
            throw new Error("MONGODB_URI not set, cannot connect.");
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('MongoDB connected successfully (from connectDB).');
    }
    catch (error) {
        console.error('MongoDB connection error (from connectDB):', error);
        // In a serverless context, throwing here might fail the function invocation.
        // Depending on strategy, you might want to handle this differently or let it fail.
        throw error;
    }
};
// Test configuration status (can be called by the serverless handler if needed)
const testConfig = async () => {
    // ... (keep existing testConfig function, ensure it doesn't try to send mail unless truly configured)
    // For brevity, assuming testConfig is defined as before.
    // Ensure it's callable and doesn't rely on app.listen()
    try {
        // Test email configuration
        if (config_1.default.emailConfig.host && config_1.default.emailConfig.user && config_1.default.emailConfig.pass) {
            console.log('Email service is configured');
            // Add more detailed checks if necessary
        }
        else {
            console.warn('Email service is not configured');
        }
        // Test WhatsApp configuration
        if (config_1.default.whatsappConfig.accountSid && config_1.default.whatsappConfig.authToken) {
            console.log('WhatsApp service is configured');
            // Add more detailed checks if necessary
        }
        else {
            console.warn('WhatsApp service is not configured');
        }
    }
    catch (error) {
        console.error('Configuration test failed:', error);
    }
};
// This block will run if the script is executed directly
if (require.main === module) {
    console.log('Running in standalone mode (not serverless import).');
    (async () => {
        try {
            await connectDB();
            await testConfig(); // Test config when running standalone
            app.listen(config_1.default.port, () => {
                console.log(`Server running on port ${config_1.default.port}`);
                // ... other console logs from original file
            });
        }
        catch (error) {
            console.error('Failed to start standalone server:', error);
            process.exit(1);
        }
    })();
}
else {
    console.log('Running in import mode (likely serverless). MongoDB connection will be managed by handler or on first request.');
    // Optionally, connect to DB here if you want it to connect as soon as the function is loaded.
    // However, it's often better to connect lazily on the first request in the handler.
}
