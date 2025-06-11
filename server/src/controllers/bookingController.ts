import { Request, Response } from 'express';
import { BookingService } from '../services/bookingService';

export class BookingController {
  private bookingService: BookingService;

  constructor() {
    this.bookingService = new BookingService();
  }

  async createBooking(req: Request, res: Response) {
    try {
      const bookingData = req.body;
      const booking = await this.bookingService.createBooking(bookingData);
      res.status(201).json({ message: 'Booking created successfully', booking });
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({ error: 'Failed to create booking' });
    }
  }
}
