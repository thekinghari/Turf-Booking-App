import express, { Request, Response } from 'express';
import { User } from '../models/User';
import auth from '../middleware/auth';

const router = express.Router();

// Get user by ID
router.get('/:id', auth, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

export default router; 