"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const notificationService_1 = require("./notificationService");
const Booking_1 = require("../models/Booking");
const User_1 = require("../models/User");
const Turf_1 = require("../models/Turf");
class BookingService {
    constructor() {
        this.notificationService = new notificationService_1.NotificationService();
    }
    async createBooking(bookingData) {
        try {
            // Get turf details
            const turf = await Turf_1.Turf.findById(bookingData.turfId);
            if (!turf) {
                throw new Error('Turf not found');
            }
            // Validate time format
            if (!bookingData.startTime || !bookingData.endTime) {
                throw new Error('Start time and end time are required');
            }
            // Parse times
            const startTime = new Date(`2023-01-01T${bookingData.startTime}`);
            const endTime = new Date(`2023-01-01T${bookingData.endTime}`);
            // Validate times are valid
            if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
                throw new Error('Invalid time format. Please use HH:mm format');
            }
            // Calculate duration in hours
            const durationInHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
            // Validate duration
            if (durationInHours <= 0) {
                throw new Error('End time must be after start time');
            }
            // Create booking with turf details
            const booking = new Booking_1.Booking({
                ...bookingData,
                turfName: turf.name,
                totalPrice: bookingData.totalPrice ||
                    (Number(turf.pricePerHour) * Number(durationInHours))
            });
            await booking.save();
            console.log('Booking created successfully:', {
                bookingId: booking._id,
                turfName: booking.turfName,
                date: booking.date,
                userId: booking.userId
            });
            // Get user details
            const user = await User_1.User.findById(booking.userId);
            if (!user) {
                throw new Error('User not found');
            }
            // Get email from request or user profile
            const userEmail = bookingData.email || user.email;
            if (!userEmail) {
                throw new Error('Email is required for booking confirmation');
            }
            // Send email notification with detailed turf info
            console.log('Attempting to send booking confirmation email to:', userEmail);
            await this.sendBookingConfirmationEmail(userEmail, booking, turf);
            console.log('Booking confirmation email sent successfully');
            // Send WhatsApp notification if phone is provided
            if (user.phone) {
                console.log('Attempting to send WhatsApp notification to:', user.phone);
                await this.sendBookingConfirmationWhatsApp(user.phone, booking);
                console.log('WhatsApp notification sent successfully');
            }
            return booking;
        }
        catch (error) {
            console.error('Error creating booking:', {
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
                bookingData: bookingData
            });
            throw error;
        }
    }
    async sendBookingConfirmationEmail(to, booking, turf) {
        const subject = 'Booking Confirmation - TurfBook';
        // Format time duration
        const duration = Math.floor((new Date(`2023-01-01T${booking.endTime}`).getTime() -
            new Date(`2023-01-01T${booking.startTime}`).getTime()) /
            (1000 * 60));
        const text = `Your booking has been confirmed!\n\n` +
            `Booking ID: BK${booking._id}\n` +
            `Turf: ${booking.turfName}\n` +
            `Location: ${turf.location}\n` +
            `Date: ${booking.date}\n` +
            `Time: ${booking.startTime} - ${booking.endTime} (${duration} minutes)\n` +
            `Amount: ₹${booking.totalPrice}\n` +
            `Facilities: ${turf.facilities.join(', ')}\n\n` +
            `Thank you for choosing TurfBook!`;
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb; margin-bottom: 20px;">Booking Confirmation</h2>
        <p style="margin-bottom: 15px;">Dear Customer,</p>
        <p style="margin-bottom: 25px;">Your booking has been confirmed successfully!</p>

        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">Booking Details</h3>
          <p><strong>Booking ID:</strong> BK${booking._id}</p>
          <p><strong>Turf Name:</strong> ${booking.turfName}</p>
          <p><strong>Location:</strong> ${turf.location}</p>
          <p><strong>Date:</strong> ${booking.date}</p>
          <p><strong>Time Slot:</strong> ${booking.startTime} - ${booking.endTime} (${duration} minutes)</p>
          <p><strong>Amount:</strong> ₹${booking.totalPrice}</p>
          <h4 style="color: #3b82f6; margin: 20px 0;">Facilities Included:</h4>
          <ul style="list-style-type: disc; margin-left: 20px;">
            ${turf.facilities.map((facility) => `<li>${facility}</li>`).join('')}
          </ul>
        </div>

        <p style="margin-top: 20px;">Thank you for choosing TurfBook!</p>
        <p style="margin-top: 10px; color: #64748b;">For any queries, please contact our support team.</p>
      </div>
    `;
        await this.notificationService.sendEmail({
            to,
            subject,
            text,
            html
        });
    }
    async sendBookingConfirmationWhatsApp(to, booking) {
        const message = `Your booking has been confirmed!\n\n` +
            `Booking ID: BK${booking._id}\n` +
            `Turf: ${booking.turfName}\n` +
            `Date: ${booking.date}\n` +
            `Time: ${booking.startTime} - ${booking.endTime}\n` +
            `Amount: ₹${booking.totalPrice}\n\n` +
            `Thank you for choosing TurfBook!`;
        await this.notificationService.sendWhatsApp({
            to,
            message
        });
    }
}
exports.BookingService = BookingService;
