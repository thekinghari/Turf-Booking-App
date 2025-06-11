"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookingController_1 = require("../controllers/bookingController");
const router = express_1.default.Router();
const bookingController = new bookingController_1.BookingController();
// Create a new booking
router.post('/', async (req, res) => {
    await bookingController.createBooking(req, res);
});
exports.default = router;
