"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const twilio_1 = __importDefault(require("twilio"));
const config_1 = __importDefault(require("../config/config"));
class NotificationService {
    constructor() {
        this.emailTransporter = null;
        this.twilioClient = null;
        // Initialize email transporter if credentials are available
        if (config_1.default.emailConfig.host && config_1.default.emailConfig.user && config_1.default.emailConfig.pass) {
            this.emailTransporter = nodemailer_1.default.createTransport({
                host: config_1.default.emailConfig.host,
                port: config_1.default.emailConfig.port,
                secure: false,
                auth: {
                    user: config_1.default.emailConfig.user,
                    pass: config_1.default.emailConfig.pass
                }
            });
        }
        // Initialize Twilio client if credentials are available
        if (config_1.default.whatsappConfig.accountSid && config_1.default.whatsappConfig.authToken) {
            this.twilioClient = (0, twilio_1.default)(config_1.default.whatsappConfig.accountSid, config_1.default.whatsappConfig.authToken);
        }
    }
    async initialize() {
        // Test email connection
        if (this.emailTransporter) {
            try {
                await this.emailTransporter.verify();
                console.log('Email service verified successfully');
            }
            catch (error) {
                console.error('Email service verification failed:', error);
            }
        }
        else {
            console.error('Email service is not initialized');
        }
        // Test WhatsApp connection if configured
        if (this.twilioClient && process.env.TWILIO_WHATSAPP_NUMBER) {
            try {
                const message = await this.twilioClient.messages.create({
                    from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
                    to: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
                    body: 'WhatsApp service test message'
                });
                console.log('WhatsApp service verified successfully');
            }
            catch (error) {
                console.error('WhatsApp service verification failed:', error);
            }
        }
    }
    async sendEmail({ to, subject, text, html }) {
        if (!this.emailTransporter) {
            console.warn('Email service not configured');
            return;
        }
        try {
            const info = await this.emailTransporter.sendMail({
                from: config_1.default.emailConfig.from,
                to,
                subject,
                text,
                html
            });
            console.log('Email sent:', info.response);
            return info;
        }
        catch (error) {
            console.error('Failed to send email:', error);
            throw error;
        }
    }
    async sendWhatsApp({ to, message }) {
        if (!this.twilioClient) {
            console.warn('WhatsApp service not configured');
            return;
        }
        try {
            const twilioMessage = await this.twilioClient.messages.create({
                from: `whatsapp:${config_1.default.whatsappConfig.whatsappFrom}`,
                to: `whatsapp:${to}`,
                body: message
            });
            console.log('WhatsApp message sent:', twilioMessage.sid);
            return twilioMessage;
        }
        catch (error) {
            console.error('Failed to send WhatsApp message:', error);
            throw error;
        }
    }
}
exports.NotificationService = NotificationService;
