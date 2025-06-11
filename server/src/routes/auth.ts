import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import auth from '../middleware/auth';
import { NotificationService } from '../services/notificationService';
import config from '../config/config';

const router = express.Router();
const notificationService = new NotificationService();

// Register
router.post('/register', async (req: Request, res: Response) => {
  console.log('Register route hit!', req.body);
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use.' });
    }
    const user = new User({ name, email, password, phone });
    await user.save();

    // Send welcome email only if email configuration is available
    if (config.emailConfig.host && config.emailConfig.user && config.emailConfig.pass) {
      try {
        await notificationService.sendEmail({
          to: email,
          subject: 'Welcome to TurfBook!',
          text: `Welcome to TurfBook!\n\nThank you for registering.\n\nYour account has been created successfully.\n\nName: ${name}\nEmail: ${email}\n\nBest regards,\nTurfBook Team`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #2563eb;">Welcome to TurfBook!</h2>
              <p>Thank you for registering.</p>
              <p>Your account has been created successfully.</p>
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
              </div>
              <p>Best regards,</p>
              <p>TurfBook Team</p>
            </div>
          `
        });
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Continue with registration even if email fails
      }
    }

    // Generate token for immediate login
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
    res.status(201).json({ 
      message: 'User registered successfully.',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    if (err.name === 'ValidationError') {
      const errors = Object.keys(err.errors).map(key => err.errors[key].message);
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Password reset request
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Generate reset token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1h' });
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour from now
    await user.save();

    // Send password reset email
    await notificationService.sendEmail({
      to: email,
      subject: 'Password Reset Request - TurfBook',
      text: `You have requested to reset your password.\n\nReset link: ${process.env.FRONTEND_URL}/reset-password/${resetToken}\n\nThis link will expire in 1 hour.\n\nIf you did not request this, please ignore this email.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Password Reset Request</h2>
          <p>You have requested to reset your password.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><a href="${process.env.FRONTEND_URL}/reset-password/${resetToken}" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 4px;">Reset Password</a></p>
            <p>This link will expire in 1 hour.</p>
          </div>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `
    });

    res.status(200).json({ message: 'Password reset email sent successfully.' });
  } catch (err: any) {
    console.error('Password reset error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Reset password
router.post('/reset-password/:token', async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    if (!password || !token) {
      return res.status(400).json({ message: 'Password and token are required.' });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(404).json({ message: 'Invalid or expired token.' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Send password reset confirmation email
    await notificationService.sendEmail({
      to: user.email,
      subject: 'Password Reset Confirmation - TurfBook',
      text: `Your password has been successfully reset.\n\nYou can now login with your new password.\n\nBest regards,\nTurfBook Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Password Reset Confirmation</h2>
          <p>Your password has been successfully reset.</p>
          <p>You can now login with your new password.</p>
          <p>Best regards,</p>
          <p>TurfBook Team</p>
        </div>
      `
    });

    res.status(200).json({ message: 'Password reset successfully.' });
  } catch (err: any) {
    console.error('Password reset error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await user.incrementLoginAttempts();
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    await user.resetLoginAttempts();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Get current user
router.get('/me', auth, async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

export default router; 