import { Request, Response } from 'express';
import { BookingService } from '../services/bookingService';
import { NotificationService } from '../services/notificationService';
import User from '../models/User'; // Assuming User model exists and can be used to fetch email
// Booking model is not directly used here for details, booking object has them.
import Turf from '../models/Turf'; // To get turf name
import {
  generateBookingConfirmationEmailHTML,
  generateBookingConfirmationEmailText,
  BookingDetailsForEmail // Import the interface
} from '../utils/emailTemplates';

export class BookingController {
  private bookingService: BookingService;

  constructor() {
    this.bookingService = new BookingService();
  }

  async createBooking(req: Request, res: Response) {
    try {
      const bookingData = req.body;
      const booking = await this.bookingService.createBooking(bookingData);

      // Send booking confirmation email
      try {
        const notificationService = new NotificationService();
        const user = await User.findById(booking.userId);
        const turf = await Turf.findById(booking.turfId);

        if (user && user.email) {
          const bookingDetailsForEmail: BookingDetailsForEmail = {
            userName: user.name,
            turfName: turf?.name,
            bookingDate: new Date(booking.startTime).toLocaleDateString(),
            bookingTime: new Date(booking.startTime).toLocaleTimeString(),
            bookingId: booking._id.toString(),
            totalPrice: booking.totalPrice,
          };

          const subject = 'Your Turf Booking Confirmation';
          const textBody = generateBookingConfirmationEmailText(bookingDetailsForEmail);
          const htmlBody = generateBookingConfirmationEmailHTML(bookingDetailsForEmail);

          const emailOptions = {
            to: user.email,
            subject: subject,
            text: textBody,
            html: htmlBody,
          };

          await notificationService.sendEmail(emailOptions);
          console.log(`Booking confirmation email sent to ${user.email}`);
        } else {
          console.warn(`User email not found for userId: ${booking.userId}. Skipping confirmation email.`);
        }
      } catch (emailError) {
        console.error(`Failed to send booking confirmation email:`, emailError);
        // Do not let email failure block the booking response
      }

      res.status(201).json({ message: 'Booking created successfully', booking });
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({ error: 'Failed to create booking' });
    }
  }
}
