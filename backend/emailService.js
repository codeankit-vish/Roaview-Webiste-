const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.zoho.in",
    port: 465,
    secure: true,
    auth: {
        user: process.env.ZOHO_EMAIL,
        pass: process.env.ZOHO_PASSWORD
    }
});

function formatDate(date) {
    if (!date) return "Not specified";

    const d = new Date(date);

    if (isNaN(d.getTime())) {
        return date;
    }

    return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function detailRow(icon, label, value) {
    return `
        <tr>
            <td style="
                padding:16px 18px;
                border-bottom:1px solid #e8e8e8;
                width:42%;
            ">
                <span style="font-size:18px;">${icon}</span>

                <span style="
                    font-size:14px;
                    color:#666666;
                    font-weight:600;
                    margin-left:8px;
                ">
                    ${label}
                </span>
            </td>

            <td style="
                padding:16px 18px;
                border-bottom:1px solid #e8e8e8;
                text-align:right;
            ">
                <span style="
                    font-size:14px;
                    color:#111827;
                    font-weight:700;
                ">
                    ${value || "Not specified"}
                </span>
            </td>
        </tr>
    `;
}

async function sendBookingEmail(booking) {

    const bookingDate = formatDate(booking.date);
    const bookingId = booking.bookingId || "ROAVIEW";

    // =========================================================
    // 1. INTERNAL ROAVIEW BOOKING EMAIL
    // =========================================================

    const internalEmail = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New ROAVIEW Booking</title>
</head>

<body style="
    margin:0;
    padding:0;
    background:#f3f4f6;
    font-family:Arial,Helvetica,sans-serif;
    color:#111827;
">

<table width="100%" cellpadding="0" cellspacing="0"
    style="background:#f3f4f6;padding:30px 10px;">

    <tr>
        <td align="center">

            <table width="600" cellpadding="0" cellspacing="0"
                style="
                    max-width:600px;
                    width:100%;
                    background:#ffffff;
                    border-radius:18px;
                    overflow:hidden;
                    box-shadow:0 5px 25px rgba(0,0,0,0.08);
                ">

                <!-- HEADER -->

                <tr>
                    <td style="
                        background:#0b132b;
                        padding:38px 25px 34px;
                        text-align:center;
                    ">

                        <div style="
                            font-size:42px;
                            line-height:1;
                            font-weight:800;
                            letter-spacing:5px;
                            color:#d4a72c;
                        ">
                            ROAVIEW
                        </div>

                        <div style="
                            margin-top:14px;
                            color:#ffffff;
                            font-size:12px;
                            letter-spacing:7px;
                        ">
                            BEYOND EVERY JOURNEY
                        </div>

                    </td>
                </tr>

                <!-- TITLE -->

                <tr>
                    <td style="
                        background:#d4a72c;
                        padding:24px 20px;
                        text-align:center;
                    ">

                        <div style="
                            font-size:25px;
                            font-weight:800;
                            color:#0b132b;
                        ">
                            🚘 New Booking Received
                        </div>

                    </td>
                </tr>

                <!-- INTRO -->

                <tr>
                    <td style="
                        padding:34px 35px 18px;
                        text-align:center;
                    ">

                        <p style="
                            margin:0;
                            font-size:17px;
                            line-height:1.6;
                            color:#555555;
                        ">
                            A new booking request has been submitted
                            through the ROAVIEW website.
                        </p>

                    </td>
                </tr>

                <!-- BOOKING ID -->

                <tr>
                    <td style="padding:15px 35px 25px;">

                        <table width="100%" cellpadding="0" cellspacing="0">

                            <tr>
                                <td style="
                                    background:#fff8df;
                                    border-left:5px solid #d4a72c;
                                    border-radius:12px;
                                    padding:22px;
                                    text-align:center;
                                ">

                                    <div style="
                                        color:#777777;
                                        font-size:13px;
                                        font-weight:700;
                                        letter-spacing:2px;
                                    ">
                                        BOOKING ID
                                    </div>

                                    <div style="
                                        margin-top:8px;
                                        color:#111111;
                                        font-size:28px;
                                        font-weight:800;
                                        letter-spacing:2px;
                                    ">
                                        ${bookingId}
                                    </div>

                                </td>
                            </tr>

                        </table>

                    </td>
                </tr>

                <!-- BOOKING DETAILS -->

                <tr>
                    <td style="padding:0 35px 25px;">

                        <table width="100%" cellpadding="0" cellspacing="0"
                            style="
                                border:1px solid #e5e7eb;
                                border-radius:14px;
                                overflow:hidden;
                            ">

                            ${detailRow("👤", "Customer", booking.name)}
                            ${detailRow("📞", "Phone", booking.phone)}
                            ${detailRow("✉️", "Email", booking.email)}
                            ${detailRow("📍", "Pickup", booking.pickup)}
                            ${detailRow("🏁", "Destination", booking.dropoff)}
                            ${detailRow("📅", "Journey Date", bookingDate)}
                            ${detailRow("🕐", "Pickup Time", booking.time)}
                            ${detailRow("🚗", "Vehicle", booking.vehicle)}
                            ${detailRow("📝", "Requirements", booking.message || "None")}

                        </table>

                    </td>
                </tr>

                <!-- STATUS -->

                <tr>
                    <td style="
                        padding:0 35px 30px;
                        text-align:center;
                    ">

                        <span style="
                            display:inline-block;
                            background:#fff4cc;
                            color:#8a6810;
                            border:1px solid #e5c95d;
                            border-radius:30px;
                            padding:10px 22px;
                            font-size:13px;
                            font-weight:800;
                            letter-spacing:1px;
                        ">
                            NEW BOOKING
                        </span>

                    </td>
                </tr>

                <!-- FOOTER -->

                <tr>
                    <td style="
                        background:#0b132b;
                        padding:28px 25px;
                        text-align:center;
                    ">

                        <div style="
                            color:#d4a72c;
                            font-size:18px;
                            font-weight:800;
                            letter-spacing:2px;
                        ">
                            ROAVIEW
                        </div>

                        <div style="
                            margin-top:10px;
                            color:#ffffff;
                            font-size:13px;
                        ">
                            Premium Mobility • Beyond Every Journey
                        </div>

                        <div style="
                            margin-top:12px;
                            color:#cbd5e1;
                            font-size:12px;
                        ">
                            booking@roaview.com
                            &nbsp; | &nbsp;
                            +91 82994 81808
                        </div>

                    </td>
                </tr>

            </table>

        </td>
    </tr>

</table>

</body>
</html>
`;


    // =========================================================
    // 2. CUSTOMER CONFIRMATION EMAIL
    // =========================================================

    const customerEmail = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ROAVIEW Booking Confirmation</title>
</head>

<body style="
    margin:0;
    padding:0;
    background:#f3f4f6;
    font-family:Arial,Helvetica,sans-serif;
    color:#111827;
">

<table width="100%" cellpadding="0" cellspacing="0"
    style="background:#f3f4f6;padding:30px 10px;">

    <tr>
        <td align="center">

            <table width="600" cellpadding="0" cellspacing="0"
                style="
                    max-width:600px;
                    width:100%;
                    background:#ffffff;
                    border-radius:18px;
                    overflow:hidden;
                    box-shadow:0 5px 25px rgba(0,0,0,0.08);
                ">

                <!-- HEADER -->

                <tr>
                    <td style="
                        background:#0b132b;
                        padding:38px 25px 34px;
                        text-align:center;
                    ">

                        <div style="
                            font-size:42px;
                            line-height:1;
                            font-weight:800;
                            letter-spacing:5px;
                            color:#d4a72c;
                        ">
                            ROAVIEW
                        </div>

                        <div style="
                            margin-top:14px;
                            color:#ffffff;
                            font-size:12px;
                            letter-spacing:7px;
                        ">
                            BEYOND EVERY JOURNEY
                        </div>

                    </td>
                </tr>

                <!-- TITLE -->

                <tr>
                    <td style="
                        background:#d4a72c;
                        padding:24px 20px;
                        text-align:center;
                    ">

                        <div style="
                            font-size:25px;
                            font-weight:800;
                            color:#0b132b;
                        ">
                            ✓ Booking Request Received
                        </div>

                    </td>
                </tr>

                <!-- GREETING -->

                <tr>
                    <td style="padding:35px 35px 15px;">

                        <p style="
                            margin:0 0 15px;
                            font-size:20px;
                            color:#111827;
                        ">
                            Hello <strong>${booking.name}</strong>,
                        </p>

                        <p style="
                            margin:0;
                            font-size:15px;
                            line-height:1.8;
                            color:#555555;
                        ">
                            Thank you for choosing <strong>ROAVIEW</strong>.
                            Your booking request has been successfully received.
                            Our team will review your request and contact you shortly
                            to confirm your journey.
                        </p>

                    </td>
                </tr>

                <!-- BOOKING ID -->

                <tr>
                    <td style="padding:20px 35px 25px;">

                        <table width="100%" cellpadding="0" cellspacing="0">

                            <tr>
                                <td style="
                                    background:#fff8df;
                                    border-left:5px solid #d4a72c;
                                    border-radius:12px;
                                    padding:22px;
                                    text-align:center;
                                ">

                                    <div style="
                                        color:#777777;
                                        font-size:13px;
                                        font-weight:700;
                                        letter-spacing:2px;
                                    ">
                                        BOOKING ID
                                    </div>

                                    <div style="
                                        margin-top:8px;
                                        color:#111111;
                                        font-size:28px;
                                        font-weight:800;
                                        letter-spacing:2px;
                                    ">
                                        ${bookingId}
                                    </div>

                                </td>
                            </tr>

                        </table>

                    </td>
                </tr>

                <!-- JOURNEY DETAILS -->

                <tr>
                    <td style="padding:0 35px 30px;">

                        <table width="100%" cellpadding="0" cellspacing="0"
                            style="
                                border:1px solid #e5e7eb;
                                border-radius:14px;
                                overflow:hidden;
                            ">

                            ${detailRow("📍", "Pickup", booking.pickup)}
                            ${detailRow("🏁", "Destination", booking.dropoff)}
                            ${detailRow("📅", "Journey Date", bookingDate)}
                            ${detailRow("🕐", "Pickup Time", booking.time)}
                            ${detailRow("🚗", "Vehicle", booking.vehicle)}

                        </table>

                    </td>
                </tr>

                <!-- ADDITIONAL REQUIREMENTS -->

                <tr>
                    <td style="padding:0 35px 30px;">

                        <div style="
                            background:#f8fafc;
                            border-radius:12px;
                            padding:20px;
                        ">

                            <div style="
                                color:#777777;
                                font-size:12px;
                                font-weight:700;
                                letter-spacing:1px;
                                text-transform:uppercase;
                            ">
                                Additional Requirements
                            </div>

                            <div style="
                                margin-top:8px;
                                color:#333333;
                                font-size:14px;
                                line-height:1.6;
                            ">
                                ${booking.message || "None"}
                            </div>

                        </div>

                    </td>
                </tr>

                <!-- STATUS -->

                <tr>
                    <td style="
                        padding:0 35px 10px;
                        text-align:center;
                    ">

                        <span style="
                            display:inline-block;
                            background:#fff4cc;
                            color:#8a6810;
                            border:1px solid #e5c95d;
                            border-radius:30px;
                            padding:10px 24px;
                            font-size:13px;
                            font-weight:800;
                            letter-spacing:1px;
                        ">
                            REQUEST RECEIVED
                        </span>

                    </td>
                </tr>

                <!-- WHAT HAPPENS NEXT -->

                <tr>
                    <td style="padding:25px 35px 30px;">

                        <table width="100%" cellpadding="0" cellspacing="0"
                            style="
                                background:#f8fafc;
                                border-radius:14px;
                            ">

                            <tr>
                                <td style="padding:20px;">

                                    <div style="
                                        color:#0b132b;
                                        font-size:17px;
                                        font-weight:800;
                                        margin-bottom:15px;
                                    ">
                                        What happens next?
                                    </div>

                                    <div style="
                                        color:#555555;
                                        font-size:14px;
                                        line-height:1.8;
                                    ">
                                        <strong>1.</strong>
                                        Our team will review your booking request.
                                        <br>

                                        <strong>2.</strong>
                                        We will contact you to confirm availability
                                        and details.
                                        <br>

                                        <strong>3.</strong>
                                        Once confirmed, your journey will be scheduled
                                        with ROAVIEW.
                                    </div>

                                </td>
                            </tr>

                        </table>

                    </td>
                </tr>

                <!-- CONTACT -->

                <tr>
                    <td style="
                        padding:0 35px 35px;
                        text-align:center;
                    ">

                        <p style="
                            margin:0 0 20px;
                            color:#555555;
                            font-size:14px;
                            line-height:1.7;
                        ">
                            Need to make a change or have a question?
                            <br>
                            Our team is happy to help.
                        </p>

                        <a href="tel:+918299481808"
                            style="
                                display:inline-block;
                                background:#d4a72c;
                                color:#0b132b;
                                text-decoration:none;
                                font-size:14px;
                                font-weight:800;
                                padding:14px 28px;
                                border-radius:8px;
                            ">
                            CALL ROAVIEW
                        </a>

                    </td>
                </tr>

                <!-- FOOTER -->

                <tr>
                    <td style="
                        background:#0b132b;
                        padding:28px 25px;
                        text-align:center;
                    ">

                        <div style="
                            color:#d4a72c;
                            font-size:18px;
                            font-weight:800;
                            letter-spacing:2px;
                        ">
                            ROAVIEW
                        </div>

                        <div style="
                            margin-top:10px;
                            color:#ffffff;
                            font-size:13px;
                        ">
                            Premium Mobility • Beyond Every Journey
                        </div>

                        <div style="
                            margin-top:12px;
                            color:#cbd5e1;
                            font-size:12px;
                        ">
                            booking@roaview.com
                        </div>

                    </td>
                </tr>

            </table>

        </td>
    </tr>

</table>

</body>
</html>
`;


    // =========================================================
    // SEND INTERNAL ROAVIEW EMAIL
    // =========================================================

    await transporter.sendMail({
        from: `"ROAVIEW" <${process.env.ZOHO_EMAIL}>`,
        to: "booking@roaview.com",
        replyTo: booking.email,
        subject: `New ROAVIEW Booking - ${bookingId}`,
        html: internalEmail
    });


    // =========================================================
    // SEND CUSTOMER CONFIRMATION EMAIL
    // =========================================================

    await transporter.sendMail({
        from: `"ROAVIEW" <${process.env.ZOHO_EMAIL}>`,
        to: booking.email,
        replyTo: "booking@roaview.com",
        subject: `ROAVIEW Booking Request Received - ${bookingId}`,
        html: customerEmail
    });
}

async function sendCorporateEnquiryEmail(enquiry) {

    const enquiryId = enquiry.enquiryId || "ROAVIEW";
    const enquiryDate = formatDate(enquiry.date);

    // INTERNAL CORPORATE EMAIL
    const internalEmail = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ROAVIEW Corporate Enquiry</title>
</head>

<body style="
    margin:0;
    padding:0;
    background:#f3f4f6;
    font-family:Arial,Helvetica,sans-serif;
    color:#111827;
">

<table width="100%" cellpadding="0" cellspacing="0"
    style="background:#f3f4f6;padding:30px 10px;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0"
    style="
        max-width:600px;
        width:100%;
        background:#ffffff;
        border-radius:18px;
        overflow:hidden;
        box-shadow:0 5px 25px rgba(0,0,0,0.08);
    ">

<!-- HEADER -->
<tr>
<td style="
    background:#0b132b;
    padding:38px 25px 34px;
    text-align:center;
">
    <div style="
        font-size:42px;
        line-height:1;
        font-weight:800;
        letter-spacing:5px;
        color:#d4a72c;
    ">
        ROAVIEW
    </div>

    <div style="
        margin-top:14px;
        color:#ffffff;
        font-size:12px;
        letter-spacing:7px;
    ">
        BEYOND EVERY JOURNEY
    </div>
</td>
</tr>

<!-- CORPORATE LABEL -->
<tr>
<td style="
    background:#d4a72c;
    padding:24px 20px;
    text-align:center;
">
    <div style="
        font-size:25px;
        font-weight:800;
        color:#0b132b;
    ">
        🏢 CORPORATE ENQUIRY
    </div>
</td>
</tr>

<!-- ENQUIRY ID -->
<tr>
<td style="padding:30px 35px 20px;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td style="
    background:#fff8df;
    border-left:5px solid #d4a72c;
    border-radius:12px;
    padding:22px;
    text-align:center;
">

<div style="
    color:#777777;
    font-size:13px;
    font-weight:700;
    letter-spacing:2px;
">
    ENQUIRY ID
</div>

<div style="
    margin-top:8px;
    color:#111111;
    font-size:28px;
    font-weight:800;
    letter-spacing:2px;
">
    ${enquiryId}
</div>

</td>
</tr>
</table>

</td>
</tr>

<!-- DETAILS -->
<tr>
<td style="padding:0 35px 30px;">

<table width="100%" cellpadding="0" cellspacing="0"
    style="
        border:1px solid #e5e7eb;
        border-radius:14px;
        overflow:hidden;
    ">

${detailRow("🏢", "Company", enquiry.companyName)}
${detailRow("👤", "Contact Person", enquiry.contactPerson)}
${detailRow("✉️", "Business Email", enquiry.email)}
${detailRow("📞", "Phone", enquiry.phone)}
${detailRow("👥", "Passengers", enquiry.passengers)}
${detailRow("🚗", "Vehicle", enquiry.vehicle)}
${detailRow("📅", "Travel Date", enquiryDate)}
${detailRow("💼", "Travel Requirement", enquiry.travelType)}
${detailRow("📝", "Additional Requirements", enquiry.message || "None")}

</table>

</td>
</tr>

<!-- STATUS -->
<tr>
<td style="
    padding:0 35px 30px;
    text-align:center;
">

<span style="
    display:inline-block;
    background:#fff4cc;
    color:#8a6810;
    border:1px solid #e5c95d;
    border-radius:30px;
    padding:10px 22px;
    font-size:13px;
    font-weight:800;
    letter-spacing:1px;
">
    NEW CORPORATE ENQUIRY
</span>

</td>
</tr>

<!-- FOOTER -->
<tr>
<td style="
    background:#0b132b;
    padding:28px 25px;
    text-align:center;
">

<div style="
    color:#d4a72c;
    font-size:18px;
    font-weight:800;
    letter-spacing:2px;
">
    ROAVIEW
</div>

<div style="
    margin-top:10px;
    color:#ffffff;
    font-size:13px;
">
    Premium Mobility • Beyond Every Journey
</div>

<div style="
    margin-top:12px;
    color:#cbd5e1;
    font-size:12px;
">
    booking@roaview.com
    &nbsp; | &nbsp;
    +91 82994 81808
</div>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;

    // CUSTOMER CORPORATE CONFIRMATION EMAIL
    const customerEmail = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ROAVIEW Corporate Enquiry Received</title>
</head>

<body style="
    margin:0;
    padding:0;
    background:#f3f4f6;
    font-family:Arial,Helvetica,sans-serif;
">

<table width="100%" cellpadding="0" cellspacing="0"
    style="background:#f3f4f6;padding:30px 10px;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0"
    style="
        max-width:600px;
        width:100%;
        background:#ffffff;
        border-radius:18px;
        overflow:hidden;
    ">

<tr>
<td style="
    background:#0b132b;
    padding:38px 25px 34px;
    text-align:center;
">

<div style="
    font-size:42px;
    font-weight:800;
    letter-spacing:5px;
    color:#d4a72c;
">
    ROAVIEW
</div>

<div style="
    margin-top:14px;
    color:#ffffff;
    font-size:12px;
    letter-spacing:7px;
">
    BEYOND EVERY JOURNEY
</div>

</td>
</tr>

<tr>
<td style="
    background:#d4a72c;
    padding:24px 20px;
    text-align:center;
">

<div style="
    font-size:24px;
    font-weight:800;
    color:#0b132b;
">
    ✓ Corporate Enquiry Received
</div>

</td>
</tr>

<tr>
<td style="padding:35px;">

<p style="
    margin:0 0 15px;
    font-size:20px;
    color:#111827;
">
    Hello <strong>${enquiry.contactPerson}</strong>,
</p>

<p style="
    margin:0;
    font-size:15px;
    line-height:1.8;
    color:#555555;
">
    Thank you for contacting <strong>ROAVIEW</strong>.
    Your corporate travel enquiry has been successfully received.
    Our team will review your requirements and contact you shortly.
</p>

<div style="
    margin-top:25px;
    background:#fff8df;
    border-left:5px solid #d4a72c;
    border-radius:12px;
    padding:22px;
    text-align:center;
">

<div style="
    color:#777777;
    font-size:13px;
    font-weight:700;
    letter-spacing:2px;
">
    ENQUIRY ID
</div>

<div style="
    margin-top:8px;
    color:#111111;
    font-size:28px;
    font-weight:800;
">
    ${enquiryId}
</div>

</div>

<p style="
    margin-top:25px;
    font-size:14px;
    line-height:1.7;
    color:#555555;
">
    We will get in touch with you to discuss availability,
    pricing and the right mobility solution for your business.
</p>

</td>
</tr>

<tr>
<td style="
    background:#0b132b;
    padding:28px 25px;
    text-align:center;
">

<div style="
    color:#d4a72c;
    font-size:18px;
    font-weight:800;
">
    ROAVIEW
</div>

<div style="
    margin-top:10px;
    color:#ffffff;
    font-size:13px;
">
    Premium Mobility • Beyond Every Journey
</div>

<div style="
    margin-top:12px;
    color:#cbd5e1;
    font-size:12px;
">
    booking@roaview.com
    &nbsp; | &nbsp;
    +91 82994 81808
</div>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;

    // SEND INTERNAL CORPORATE EMAIL
    await transporter.sendMail({
        from: `"ROAVIEW" <${process.env.ZOHO_EMAIL}>`,
        to: "booking@roaview.com",
        replyTo: enquiry.email,
        subject: `ROAVIEW Corporate Enquiry - ${enquiryId}`,
        html: internalEmail
    });

    // SEND CUSTOMER CORPORATE CONFIRMATION
    await transporter.sendMail({
        from: `"ROAVIEW" <${process.env.ZOHO_EMAIL}>`,
        to: enquiry.email,
        replyTo: "booking@roaview.com",
        subject: `ROAVIEW Corporate Enquiry Received - ${enquiryId}`,
        html: customerEmail
    });
}

module.exports = sendBookingEmail;
module.exports.sendCorporateEnquiryEmail = sendCorporateEnquiryEmail;