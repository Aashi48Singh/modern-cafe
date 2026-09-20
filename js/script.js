
// Wait until the complete HTML document is loaded
document.addEventListener("DOMContentLoaded", function () {

    /// Get the current year from the user's system
    const currentYear = new Date().getFullYear();

    // Find the element with id="currentYear"
    const yearElement = document.getElementById("currentYear");

    // If the element exists, update its text
    if (yearElement) {
        yearElement.textContent = currentYear;
    }

// 2. CONTACT FORM
   
    // Get the contact form
    const contactForm = document.getElementById("contactForm");

    // Get the success message element
    const formMessage = document.getElementById("formMessage");

    // Check whether the form exists
    if (contactForm) {

        // Listen for form submission
        contactForm.addEventListener("submit", function (event) {

            // Stop the browser from actually submitting the form
            event.preventDefault();

            // Get form input values
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const message = document.getElementById("message").value.trim();

            // ==================================================
            // FORM VALIDATION
            // ==================================================

            // Check if required fields are empty
            if (name === "" || email === "" || message === "") {

                formMessage.textContent =
                    "Please fill in all required fields.";

                formMessage.className = "alert alert-danger mt-3";

                return;
            }

            // ==================================================
            // SIMPLE EMAIL VALIDATION
            // ==================================================

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {

                formMessage.textContent =
                    "Please enter a valid email address.";

                formMessage.className = "alert alert-danger mt-3";

                return;
            }

            // ==================================================
            // SUCCESS MESSAGE
            // ==================================================

            formMessage.textContent =
                `Thank you, ${name}! Your message has been received.`;

            formMessage.className = "alert alert-success mt-3";

            // Clear the form after successful submission
            contactForm.reset();

        });
    }

 // Select all navbar links
    const navLinks = document.querySelectorAll(
        ".navbar-nav .nav-link"
    );

    // Select Bootstrap's mobile navbar
    const navbarCollapse =
        document.getElementById("navbarNav");

    // Check if navbar exists
    if (navbarCollapse) {

        // Add click event to every navigation link
        navLinks.forEach(function (link) {

            link.addEventListener("click", function () {

                // Check whether the mobile menu is currently open
                if (navbarCollapse.classList.contains("show")) {

                    // Find Bootstrap's collapse instance
                    const bsCollapse =
                        bootstrap.Collapse.getInstance(navbarCollapse);

                    // Close the mobile menu
                    if (bsCollapse) {
                        bsCollapse.hide();
                    }
                }

            });

        });
    }


    
    // Select all buttons/links that point to the contact section
    const bookingLinks =
        document.querySelectorAll('a[href="#contact"]');

    bookingLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            // Prevent default jump
            event.preventDefault();

            // Find contact section
            const contactSection =
                document.getElementById("contact");

            // Smoothly scroll to contact section
            if (contactSection) {
                contactSection.scrollIntoView({
                    behavior: "smooth"
                });
            }

        });

    });

});