require("dotenv").config();

const express = require("express");
const cors = require("cors");
const emailService = require("./emailService");
const sendBookingEmail = emailService;
const sendCorporateEnquiryEmail = emailService.sendCorporateEnquiryEmail;
const mongoose = require("mongoose");
const Booking = require("./Booking");
const Counter = require("./Counter");
const CorporateEnquiry = require("./CorporateEnquiry");

const app = express();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully.");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("ROAVIEW Backend is running.");
});

app.post("/api/booking", async (req, res) => {

    console.log("New booking received:");
    console.log(req.body);

    try {

        const bookingCounterId = Counter.getCurrentYearCounterId("booking");

        // Generate unique ROAVIEW booking ID for the current year
        const counter = await Counter.findByIdAndUpdate(
        bookingCounterId,
        { $inc: { sequence: 1 } },
        { new: true, upsert: true }
        );

        const bookingId = `RV-${String(counter.sequence).padStart(6, "0")}`;

        // Add booking ID to booking data
        const bookingData = {
            ...req.body,
            bookingId: bookingId
        };

        // Save booking to MongoDB
        const newBooking = new Booking(bookingData);

        await newBooking.save();

        console.log("Booking saved to MongoDB successfully.");
        console.log("Booking ID:", bookingId);

        // Send booking emails
        await sendBookingEmail(bookingData);

        console.log("Booking emails sent successfully.");

        res.json({
            success: true,
            message: "Booking request received successfully.",
            bookingId: bookingId
        });

    } catch (error) {

        console.error("Booking error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to process booking. Please try again."
        });

    }
});

// =========================================================
// CORPORATE ENQUIRY
// =========================================================

app.post("/api/corporate-enquiry", async (req, res) => {

    console.log("New corporate enquiry received:");
    console.log(req.body);

    try {

        const corporateCounterId = Counter.getCurrentYearCounterId("corporate");

        // Generate sequential corporate enquiry ID for the current year
        const counter = await Counter.findByIdAndUpdate(
            corporateCounterId,
            { $inc: { sequence: 1 } },
            { new: true, upsert: true }
        );

        const enquiryId =
            `RV-C${String(counter.sequence).padStart(6, "0")}`;

        // Prepare corporate enquiry data
        const enquiryData = {
            companyName: req.body.companyName,
            contactPerson: req.body.contactPerson,
            email: req.body.corporateEmail,
            phone: req.body.corporatePhone,
            passengers: req.body.passengers,
            vehicle: req.body.corporateVehicle,
            date: req.body.corporateDate,
            travelType: req.body.travelType,
            message: req.body.corporateMessage || "",
            enquiryId: enquiryId,
            bookingType: "Corporate"
        };

        // Save corporate enquiry to MongoDB
        const newEnquiry =
            new CorporateEnquiry(enquiryData);

        await newEnquiry.save();

        console.log(
            "Corporate enquiry saved successfully."
        );

        await sendCorporateEnquiryEmail(enquiryData);

        console.log(
            "Corporate enquiry emails sent successfully."
        );

        console.log(
            "Corporate Enquiry ID:",
            enquiryId
        );

        res.json({
            success: true,
            message:
                "Corporate enquiry received successfully.",
            enquiryId: enquiryId
        });

    } catch (error) {

        console.error(
            "Corporate enquiry error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to process corporate enquiry. Please try again."
        });

    }

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`ROAVIEW Backend running on port ${PORT}`);
});
