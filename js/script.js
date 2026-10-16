
document.addEventListener("DOMContentLoaded", function () {

    // =========================================================
    // NORMAL BOOKING
    // =========================================================

    const bookingForm = document.getElementById("bookingForm");
    const bookingMessage = document.getElementById("bookingMessage");
    const bookingModal = document.getElementById("bookingModal");
    const closeBookingModal = document.getElementById("closeBookingModal");
    const modalBookingMessage = document.getElementById("modalBookingMessage");
    const travelDate = document.getElementById("date");

    // Prevent past travel dates
    if (travelDate) {
        const today = new Date().toISOString().split("T")[0];
        travelDate.setAttribute("min", today);
    }

    // Normal booking form
    if (bookingForm) {
        bookingForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const submitButton = document.getElementById("bookingSubmitButton");

            submitButton.disabled = true;
            submitButton.textContent = "Submitting...";

            const bookingData = {
                name: document.getElementById("name").value,
                phone: document.getElementById("phone").value,
                email: document.getElementById("email").value,
                pickup: document.getElementById("pickup").value,
                dropoff: document.getElementById("dropoff").value,
                date: document.getElementById("date").value,
                time: document.getElementById("time").value,
                vehicle: document.getElementById("vehicle").value,
                message: document.getElementById("message").value
            };

            try {
                const response = await fetch(
                    "https://roaview-api-lg.devloom.xyz/api/booking",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(bookingData)
                    }
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message || "Booking failed."
                    );
                }

                bookingMessage.textContent = result.message;

                modalBookingMessage.textContent =
                    `${result.message} Your Booking ID is ${result.bookingId}.`;

                bookingForm.reset();

                submitButton.disabled = false;
                submitButton.textContent = "Request Booking →";

                if (bookingModal) {
                    bookingModal.classList.add("active");
                }

            } catch (error) {
                console.error("Booking error:", error);

                submitButton.disabled = false;
                submitButton.textContent = "Request Booking →";

                alert("Unable to submit booking. Please try again.");
            }
        });
    }

    // Close normal booking modal
    if (closeBookingModal && bookingModal) {
        closeBookingModal.addEventListener("click", function () {
            bookingModal.classList.remove("active");
        });

        bookingModal.addEventListener("click", function (event) {
            if (event.target === bookingModal) {
                bookingModal.classList.remove("active");
            }
        });
    }


    // =========================================================
    // CORPORATE ENQUIRY
    // =========================================================

    const corporateForm =
        document.getElementById("corporateEnquiryForm");

    const corporateSubmitButton =
        document.getElementById("corporateSubmitButton");

    const corporateEnquiryMessage =
        document.getElementById("corporateEnquiryMessage");

    const corporateDate =
        document.getElementById("corporateDate");

    const corporateModal =
        document.getElementById("corporateModal");

    const modalCorporateMessage =
        document.getElementById("modalCorporateMessage");

    const closeCorporateModal =
        document.getElementById("closeCorporateModal");

    // Prevent past corporate travel dates
    if (corporateDate) {
        const today = new Date().toISOString().split("T")[0];
        corporateDate.setAttribute("min", today);
    }

    // Corporate enquiry form
    if (corporateForm) {
        corporateForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            corporateSubmitButton.disabled = true;
            corporateSubmitButton.textContent = "Submitting...";

            const corporateData = {
                companyName: document.getElementById("companyName").value,
                contactPerson: document.getElementById("contactPerson").value,
                corporateEmail: document.getElementById("corporateEmail").value,
                corporatePhone: document.getElementById("corporatePhone").value,
                passengers: document.getElementById("passengers").value,
                corporateVehicle: document.getElementById("corporateVehicle").value,
                corporateDate: document.getElementById("corporateDate").value,
                travelType: document.getElementById("travelType").value,
                corporateMessage: document.getElementById("corporateMessage").value
            };

            try {
                const response = await fetch(
                    "https://roaview-api-lg.devloom.xyz/api/corporate-enquiry",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(corporateData)
                    }
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message || "Corporate enquiry failed."
                    );
                }

                // Show corporate success popup
                if (corporateModal && modalCorporateMessage) {
                    modalCorporateMessage.textContent =
                        `${result.message} Your Enquiry ID is ${result.enquiryId}.`;

                    corporateModal.classList.add("active");
                } else {
                    // Fallback if popup HTML is missing
                    corporateEnquiryMessage.textContent =
                        `${result.message} Your Enquiry ID is ${result.enquiryId}.`;
                }

                corporateForm.reset();

                corporateSubmitButton.disabled = false;
                corporateSubmitButton.textContent =
                    "Submit Corporate Enquiry →";

            } catch (error) {
                console.error("Corporate enquiry error:", error);

                corporateEnquiryMessage.textContent =
                    "Unable to submit enquiry. Please try again.";

                corporateSubmitButton.disabled = false;
                corporateSubmitButton.textContent =
                    "Submit Corporate Enquiry →";
            }
        });
    }

    // Close corporate popup with Continue
    if (closeCorporateModal && corporateModal) {
        closeCorporateModal.addEventListener("click", function () {
            corporateModal.classList.remove("active");
        });

        // Close corporate popup by clicking the backdrop
        corporateModal.addEventListener("click", function (event) {
            if (event.target === corporateModal) {
                corporateModal.classList.remove("active");
            }
        });
    }

});


/* Homepage header: transparent at top, dark when scrolling */
document.addEventListener("DOMContentLoaded", function () {
    const header = document.querySelector("header.transparent-header");

    if (!header) return;

    function updateHeader() {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();
});
