const mongoose = require("mongoose");

const corporateEnquirySchema = new mongoose.Schema(
    {
        enquiryId: {
            type: String,
            required: true,
            unique: true
        },

        bookingType: {
            type: String,
            default: "Corporate"
        },

        companyName: {
            type: String,
            required: true
        },

        contactPerson: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            required: true
        },

        passengers: {
            type: Number,
            required: true
        },

        vehicle: {
            type: String,
            required: true
        },

        date: {
            type: String,
            required: true
        },

        travelType: {
            type: String,
            required: true
        },

        message: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            default: "New"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "CorporateEnquiry",
    corporateEnquirySchema
);