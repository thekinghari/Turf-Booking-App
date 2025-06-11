export interface BookingDetailsForEmail {
  userName?: string;
  turfName?: string;
  bookingDate: string;
  bookingTime: string;
  bookingId: string;
  totalPrice: number | string;
}

export function generateBookingConfirmationEmailHTML(details: BookingDetailsForEmail): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
    .container { background-color: #f9f9f9; padding: 20px; border-radius: 5px; }
    .header { color: #2c3e50; font-size: 24px; margin-bottom: 20px; }
    .details p { margin: 5px 0; line-height: 1.6; }
    .footer { margin-top: 20px; font-size: 12px; color: #777; }
  </style>
</head>
<body>
  <div class="container">
    <h1 class="header">Booking Confirmation</h1>
    <div class="details">
      <p>Dear ${details.userName || 'Valued Customer'},</p>
      <p>Your booking for <strong>${details.turfName || 'the selected turf'}</strong> is confirmed!</p>
      <p><strong>Details:</strong></p>
      <p>Booking ID: ${details.bookingId}</p>
      <p>Date: ${details.bookingDate}</p>
      <p>Time: ${details.bookingTime}</p>
      <p>Total Price: ${details.totalPrice}</p>
    </div>
    <div class="footer">
      <p>Thank you for booking with us!</p>
      <p>If you have any questions, please contact our support.</p>
    </div>
  </div>
</body>
</html>
  `;
}

export function generateBookingConfirmationEmailText(details: BookingDetailsForEmail): string {
  return `
Dear ${details.userName || 'Valued Customer'},

Your booking for ${details.turfName || 'the selected turf'} is confirmed!

Details:
Booking ID: ${details.bookingId}
Date: ${details.bookingDate}
Time: ${details.bookingTime}
Total Price: ${details.totalPrice}

Thank you for booking with us!
If you have any questions, please contact our support.
  `;
}
