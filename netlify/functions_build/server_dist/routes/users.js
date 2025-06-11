"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = require("../models/User");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
// Get user by ID
router.get('/:id', auth_1.default, async (req, res) => {
    try {
        const user = await User_1.User.findById(req.params.id).select('-password');
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.default = router;
