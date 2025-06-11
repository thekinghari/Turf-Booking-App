"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Turf = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const turfSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true }
    },
    contactNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    pricePerHour: {
        type: Number,
        required: true
    },
    amenities: [{
            type: String
        }],
    images: [{
            type: String
        }],
    openHours: {
        from: { type: String, required: true },
        to: { type: String, required: true }
    },
    rating: {
        type: Number,
        default: 0
    },
    reviews: [{
            userId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'User'
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }]
}, {
    timestamps: true
});
exports.Turf = mongoose_1.default.model('Turf', turfSchema);
