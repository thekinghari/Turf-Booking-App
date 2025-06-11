"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
const bookingService_1 = require("../services/bookingService");
class BookingController {
    constructor() {
        this.bookingService = new bookingService_1.BookingService();
    }
    async createBooking(req, res) {
        try {
            const bookingData = req.body;
            const booking = await this.bookingService.createBooking(bookingData);
            res.status(201).json({ message: 'Booking created successfully', booking });
        }
        catch (error) {
            console.error('Error creating booking:', error);
            res.status(500).json({ error: 'Failed to create booking' });
        }
    }
}
exports.BookingController = BookingController;
