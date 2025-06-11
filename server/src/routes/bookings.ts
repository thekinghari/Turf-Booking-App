import express from 'express';
import { BookingController } from '../controllers/bookingController';

const router = express.Router();
const bookingController = new BookingController();

// Create a new booking
router.post('/', async (req: express.Request, res: express.Response) => {
  await bookingController.createBooking(req, res);
});

export default router;
