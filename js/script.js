/* 
   MODERN CAFÉ - MAIN JAVASCRIPT
   
    */

document.addEventListener("DOMContentLoaded", function () {

    console.log("Modern Café JavaScript loaded successfully.");


    /* =====================================================
       2. GLOBAL VARIABLES
       ===================================================== */

    // Shopping cart data.
    // We will store cart items inside this array.
    let cart = JSON.parse(localStorage.getItem("modernCafeCart")) || [];


    // Customer reviews saved by the user.
    let reviews =
        JSON.parse(localStorage.getItem("modernCafeReviews")) || [];


    /* =====================================================
       3. DYNAMIC COPYRIGHT YEAR
       ===================================================== */

    const currentYear =
        document.getElementById("currentYear");

    if (currentYear) {

        currentYear.textContent =
            new Date().getFullYear();
    }


    /* =====================================================
       4. SMOOTH SCROLLING
       ===================================================== */

    /*
       Select all links that start with "#".

       Example:
       href="#home"
       href="#about"
       href="#menu"
       href="#contact"
    */

    const internalLinks =
        document.querySelectorAll('a[href^="#"]');


    internalLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId =
                link.getAttribute("href");


            // Ignore an empty "#"
            if (!targetId || targetId === "#") {
                return;
            }


            const targetSection =
                document.querySelector(targetId);


            if (targetSection) {

                event.preventDefault();


                targetSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

        });

    });


    /* =====================================================
       5. MOBILE NAVBAR
       ===================================================== */

    const navbarCollapse =
        document.getElementById("navbarNav");


    const navLinks =
        document.querySelectorAll(".navbar-nav .nav-link");


    if (navbarCollapse) {

        navLinks.forEach(function (link) {

            link.addEventListener("click", function () {

                /*
                   When the mobile menu is open,
                   close it after clicking a navigation link.
                */

                if (
                    navbarCollapse.classList.contains("show")
                ) {

                    const collapse =
                        bootstrap.Collapse.getInstance(
                            navbarCollapse
                        );


                    if (collapse) {
                        collapse.hide();
                    }

                }

            });

        });

    }

    

    /* =====================================================
       6. MENU SEARCH
       ===================================================== */

    const menuSearch =
        document.getElementById("menuSearch");


    if (menuSearch) {

        menuSearch.addEventListener("input", function () {

            /*
               Get what the user typed.

               toLowerCase() makes the search
               case-insensitive.
            */

            const searchText =
                menuSearch.value
                    .trim()
                    .toLowerCase();


            filterMenuItems(
                searchText,
                getActiveCategory()
            );

        });

    }


    /* =====================================================
       7. MENU CATEGORY FILTER
       ===================================================== */

    const menuFilters =
        document.querySelectorAll(".menu-filter");


    menuFilters.forEach(function (button) {

        button.addEventListener("click", function () {

            /*
               Get category from data-category.

               Example:
               data-category="coffee"
            */

            const selectedCategory =
                button.dataset.category;


            // Remove active class from all buttons
            menuFilters.forEach(function (filterButton) {

                filterButton.classList.remove("active");

                filterButton.classList.remove("btn-primary");

                filterButton.classList.add(
                    "btn-outline-primary"
                );

            });


            // Make clicked button active
            button.classList.add("active");

            button.classList.remove(
                "btn-outline-primary"
            );

            button.classList.add("btn-primary");


            /*
               Get current search text.
            */

            const searchText =
                menuSearch
                    ? menuSearch.value.trim().toLowerCase()
                    : "";


            // Filter menu
            filterMenuItems(
                searchText,
                selectedCategory
            );

        });

    });


    /* =====================================================
       8. GET ACTIVE MENU CATEGORY
       ===================================================== */

    function getActiveCategory() {

        const activeButton =
            document.querySelector(
                ".menu-filter.active"
            );


        if (activeButton) {

            return activeButton.dataset.category;

        }


        return "all";
    }


    /* =====================================================
       9. FILTER MENU ITEMS
       ===================================================== */

    function filterMenuItems(searchText, category) {

        const menuItems =
            document.querySelectorAll(".menu-item");


        const noMenuResults =
            document.getElementById("noMenuResults");


        let visibleItems = 0;


        menuItems.forEach(function (item) {

            /*
               Read information from the HTML.

               Example:
               data-category="coffee"
               data-name="cappuccino"
            */

            const itemCategory =
                item.dataset.category.toLowerCase();


            const itemName =
                item.dataset.name.toLowerCase();


            /*
               Check category.
            */

            const categoryMatches =
                category === "all" ||
                itemCategory === category;


            /*
               Check search text.
            */

            const searchMatches =
                searchText === "" ||
                itemName.includes(searchText);


            /*
               Show item only when BOTH conditions
               are true.
            */

            if (categoryMatches && searchMatches) {

                item.classList.remove("menu-hidden");

                visibleItems++;

            } else {

                item.classList.add("menu-hidden");

            }

        });


        /*
           If no items match the search/filter,
           show the "No menu items found" message.
        */

        if (noMenuResults) {

            if (visibleItems === 0) {

                noMenuResults.classList.remove("d-none");

            } else {

                noMenuResults.classList.add("d-none");

            }

        }

    }


    /* =====================================================
       10. ADD TO CART
       ===================================================== */

    const addToCartButtons =
        document.querySelectorAll(".add-to-cart");


    addToCartButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            /*
               Read product information from
               data attributes.

               Example:
               data-id="1"
               data-name="Cappuccino"
               data-price="180"
            */

            const productId =
                button.dataset.id;


            const productName =
                button.dataset.name;


            const productPrice =
                Number(button.dataset.price);


            /*
               Check whether this product
               already exists in the cart.
            */

            const existingItem =
                cart.find(function (item) {

                    return item.id === productId;

                });


            if (existingItem) {

                // Increase quantity
                existingItem.quantity++;

            } else {

                // Add new item
                cart.push({

                    id: productId,

                    name: productName,

                    price: productPrice,

                    quantity: 1

                });

            }


            // Save cart
            saveCart();


            // Update cart UI
            renderCart();


            // Show notification
            showToast(
                `${productName} added to cart.`
            );

        });

    });


    /* =====================================================
       11. SAVE CART TO LOCAL STORAGE
       ===================================================== */

    function saveCart() {

        localStorage.setItem(
            "modernCafeCart",
            JSON.stringify(cart)
        );

    }


    /* =====================================================
       12. DISPLAY CART
       ===================================================== */

    function renderCart() {

        const cartItems =
            document.getElementById("cartItems");


        const emptyCartMessage =
            document.getElementById(
                "emptyCartMessage"
            );


        const cartSummary =
            document.getElementById("cartSummary");


        const cartTotal =
            document.getElementById("cartTotal");


        if (!cartItems) {
            return;
        }


        /*
           If cart is empty
        */

        if (cart.length === 0) {

            cartItems.innerHTML = "";

            cartItems.appendChild(
                emptyCartMessage
            );


            if (emptyCartMessage) {

                emptyCartMessage.classList.remove(
                    "d-none"
                );

            }


            if (cartSummary) {

                cartSummary.classList.add(
                    "d-none"
                );

            }


            return;
        }


        /*
           Hide empty cart message.
        */

        if (emptyCartMessage) {

            emptyCartMessage.classList.add(
                "d-none"
            );

        }


        /*
           Create cart HTML.
        */

        cartItems.innerHTML = "";


        cart.forEach(function (item) {

            const itemTotal =
                item.price * item.quantity;


            const cartItem =
                document.createElement("div");


            cartItem.className =
                "cart-item";


            cartItem.innerHTML = `

                <div class="row align-items-center g-3">

                    <div class="col-12 col-md-4">

                        <div class="cart-item-title">
                            ${item.name}
                        </div>

                        <div class="cart-item-price">
                            ₹${item.price}
                        </div>

                    </div>


                    <div class="col-7 col-md-4">

                        <div class="quantity-controls">

                            <button
                                type="button"
                                class="quantity-btn decrease-quantity"
                                data-id="${item.id}"
                                aria-label="Decrease quantity"
                            >
                                -
                            </button>

                            <span class="quantity-value">
                                ${item.quantity}
                            </span>

                            <button
                                type="button"
                                class="quantity-btn increase-quantity"
                                data-id="${item.id}"
                                aria-label="Increase quantity"
                            >
                                +
                            </button>

                        </div>

                    </div>


                    <div class="col-4 col-md-3 text-end">

                        <strong>
                            ₹${itemTotal}
                        </strong>

                    </div>


                    <div class="col-1 text-end">

                        <button
                            type="button"
                            class="remove-cart-item"
                            data-id="${item.id}"
                            aria-label="Remove ${item.name}"
                        >
                            <i class="bi bi-trash"></i>
                        </button>

                    </div>

                </div>
            `;


            cartItems.appendChild(cartItem);

        });


        /*
           Calculate total.
        */

        const total =
            calculateCartTotal();


        if (cartTotal) {

            cartTotal.textContent =
                `₹${total}`;

        }


        if (cartSummary) {

            cartSummary.classList.remove(
                "d-none"
            );

        }


        /*
           Add events to quantity buttons.
        */

        attachCartEvents();

    }


    /* =====================================================
       13. CALCULATE CART TOTAL
       ===================================================== */

    function calculateCartTotal() {

        return cart.reduce(
            function (total, item) {

                return total +
                    (item.price * item.quantity);

            },
            0
        );

    }


    /* =====================================================
       14. CART QUANTITY / REMOVE EVENTS
       ===================================================== */

    function attachCartEvents() {

        /*
           Increase quantity
        */

        const increaseButtons =
            document.querySelectorAll(
                ".increase-quantity"
            );


        increaseButtons.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const productId =
                        button.dataset.id;


                    const item =
                        cart.find(function (cartItem) {

                            return cartItem.id === productId;

                        });


                    if (item) {

                        item.quantity++;

                        saveCart();

                        renderCart();

                    }

                }
            );

        });


        /*
           Decrease quantity
        */

        const decreaseButtons =
            document.querySelectorAll(
                ".decrease-quantity"
            );


        decreaseButtons.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const productId =
                        button.dataset.id;


                    const item =
                        cart.find(function (cartItem) {

                            return cartItem.id === productId;

                        });


                    if (item) {

                        item.quantity--;


                        /*
                           If quantity becomes zero,
                           remove the item.
                        */

                        if (item.quantity <= 0) {

                            cart =
                                cart.filter(
                                    function (cartItem) {

                                        return cartItem.id !==
                                            productId;

                                    }
                                );

                        }


                        saveCart();

                        renderCart();

                    }

                }
            );

        });


        /*
           Remove item completely
        */

        const removeButtons =
            document.querySelectorAll(
                ".remove-cart-item"
            );


        removeButtons.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const productId =
                        button.dataset.id;


                    cart =
                        cart.filter(
                            function (item) {

                                return item.id !==
                                    productId;

                            }
                        );


                    saveCart();

                    renderCart();


                    showToast(
                        "Item removed from cart."
                    );

                }
            );

        });

    }


    /* =====================================================
       15. CLEAR CART
       ===================================================== */

    const clearCartButton =
        document.getElementById("clearCartBtn");


    if (clearCartButton) {

        clearCartButton.addEventListener(
            "click",
            function () {

                if (cart.length === 0) {
                    return;
                }


                cart = [];


                saveCart();

                renderCart();


                showToast(
                    "Your cart has been cleared."
                );

            }
        );

    }


    /* =====================================================
       16. BOOKING FORM
       ===================================================== */

    const bookingForm =
        document.getElementById("bookingForm");


    if (bookingForm) {

        bookingForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const name =
                    document.getElementById(
                        "bookingName"
                    ).value.trim();


                const phone =
                    document.getElementById(
                        "bookingPhone"
                    ).value.trim();


                const date =
                    document.getElementById(
                        "bookingDate"
                    ).value;


                const time =
                    document.getElementById(
                        "bookingTime"
                    ).value;


                const guests =
                    document.getElementById(
                        "guestCount"
                    ).value;


                const request =
                    document.getElementById(
                        "bookingRequest"
                    ).value.trim();


                const bookingMessage =
                    document.getElementById(
                        "bookingMessage"
                    );


                /*
                   Basic validation
                */

                if (
                    name === "" ||
                    phone === "" ||
                    date === "" ||
                    time === "" ||
                    guests === ""
                ) {

                    showFormMessage(
                        bookingMessage,
                        "Please fill in all required booking fields.",
                        "error"
                    );

                    return;
                }


                /*
                   Validate phone number.
                */

                const phonePattern =
                    /^[0-9]{10}$/;


                if (!phonePattern.test(phone)) {

                    showFormMessage(
                        bookingMessage,
                        "Please enter a valid 10-digit phone number.",
                        "error"
                    );

                    return;
                }


                /*
                   Check that selected date is not
                   in the past.
                */

                const selectedDate =
                    new Date(date + "T00:00:00");


                const today =
                    new Date();


                today.setHours(
                    0,
                    0,
                    0,
                    0
                );


                if (selectedDate < today) {

                    showFormMessage(
                        bookingMessage,
                        "Please select today or a future date.",
                        "error"
                    );

                    return;
                }


                /*
                   Booking successful.

                   This is currently a FRONTEND demo.
                   No real booking is sent to a server yet.
                */

                let successMessage =
                    `Thank you, ${name}! Your table request for ${guests} guest(s) on ${date} at ${time} has been received.`;


                if (request !== "") {

                    successMessage +=
                        " Your special request was also noted.";

                }


                showFormMessage(
                    bookingMessage,
                    successMessage,
                    "success"
                );


                bookingForm.reset();


                showToast(
                    "Booking request submitted."
                );

            }
        );

    }


    /* =====================================================
       17. CONTACT FORM
       ===================================================== */

    const contactForm =
        document.getElementById("contactForm");


    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const name =
                    document.getElementById(
                        "contactName"
                    ).value.trim();


                const email =
                    document.getElementById(
                        "contactEmail"
                    ).value.trim();


                const phone =
                    document.getElementById(
                        "contactPhone"
                    ).value.trim();


                const message =
                    document.getElementById(
                        "contactMessage"
                    ).value.trim();


                const contactMessageBox =
                    document.getElementById(
                        "contactMessageBox"
                    );


                /*
                   Required field validation.
                */

                if (
                    name === "" ||
                    email === "" ||
                    message === ""
                ) {

                    showFormMessage(
                        contactMessageBox,
                        "Please fill in all required fields.",
                        "error"
                    );

                    return;
                }


                /*
                   Email validation.
                */

                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                if (!emailPattern.test(email)) {

                    showFormMessage(
                        contactMessageBox,
                        "Please enter a valid email address.",
                        "error"
                    );

                    return;
                }


                /*
                   Phone is optional.

                   But if user enters a phone number,
                   it must contain 10 digits.
                */

                if (phone !== "") {

                    const phonePattern =
                        /^[0-9]{10}$/;


                    if (!phonePattern.test(phone)) {

                        showFormMessage(
                            contactMessageBox,
                            "Please enter a valid 10-digit phone number.",
                            "error"
                        );

                        return;
                    }

                }


                /*
                   Contact form successful.

                   Currently this is a frontend simulation.
                   Later we can connect it to a backend/API.
                */

                showFormMessage(
                    contactMessageBox,
                    `Thank you, ${name}! Your message has been received.`,
                    "success"
                );


                contactForm.reset();


                showToast(
                    "Message sent successfully."
                );

            }
        );

    }


    /* =====================================================
       18. FORM MESSAGE FUNCTION
       ===================================================== */

    function showFormMessage(
        element,
        message,
        type
    ) {

        if (!element) {
            return;
        }


        element.textContent = message;


        element.classList.remove(
            "d-none",
            "form-success",
            "form-error"
        );


        if (type === "success") {

            element.classList.add(
                "form-success"
            );

        } else {

            element.classList.add(
                "form-error"
            );

        }

    }


    /* =====================================================
       19. REVIEW FORM
       ===================================================== */

    const reviewForm =
        document.getElementById("reviewForm");


    if (reviewForm) {

        reviewForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const name =
                    document.getElementById(
                        "reviewName"
                    ).value.trim();


                const rating =
                    Number(
                        document.getElementById(
                            "reviewRating"
                        ).value
                    );


                const reviewText =
                    document.getElementById(
                        "reviewText"
                    ).value.trim();


                const reviewMessage =
                    document.getElementById(
                        "reviewMessage"
                    );


                /*
                   Validate review.
                */

                if (
                    name === "" ||
                    rating === 0 ||
                    reviewText === ""
                ) {

                    showFormMessage(
                        reviewMessage,
                        "Please complete all review fields.",
                        "error"
                    );

                    return;
                }


                /*
                   Create review object.
                */

                const newReview = {

                    id: Date.now(),

                    name: name,

                    rating: rating,

                    text: reviewText

                };


                /*
                   Add review to array.
                */

                reviews.push(newReview);


                /*
                   Save reviews in localStorage.
                */

                localStorage.setItem(
                    "modernCafeReviews",
                    JSON.stringify(reviews)
                );


                /*
                   Display the new review.
                */

                renderReviews();


                /*
                   Clear form.
                */

                reviewForm.reset();


                /*
                   Close modal.
                */

                const reviewModal =
                    document.getElementById(
                        "reviewModal"
                    );


                const modalInstance =
                    bootstrap.Modal.getInstance(
                        reviewModal
                    );


                if (modalInstance) {
                    modalInstance.hide();
                }


                /*
                   Notification.
                */

                showToast(
                    "Thank you for your review!"
                );

            }
        );

    }


    /* =====================================================
       20. DISPLAY REVIEWS
       ===================================================== */

    function renderReviews() {

        const reviewsContainer =
            document.getElementById(
                "reviewsContainer"
            );


        if (!reviewsContainer) {
            return;
        }


        /*
           Keep the three original sample reviews.

           User-created reviews are added after them.
        */

        reviews.forEach(function (review) {

            const reviewColumn =
                document.createElement("div");


            reviewColumn.className =
                "col-md-4";


            /*
               Create star icons based on rating.
            */

            let stars = "";


            for (let i = 1; i <= 5; i++) {

                if (i <= review.rating) {

                    stars +=
                        '<i class="bi bi-star-fill text-warning"></i>';

                } else {

                    stars +=
                        '<i class="bi bi-star text-warning"></i>';

                }

            }


            reviewColumn.innerHTML = `

                <div class="card h-100 p-4 review-card">

                    <div class="mb-3">
                        ${stars}
                    </div>

                    <p>
                        "${escapeHTML(review.text)}"
                    </p>

                    <h6 class="mb-0">
                        ${escapeHTML(review.name)}
                    </h6>

                    <small class="text-muted">
                        Customer Review
                    </small>

                </div>

            `;


            reviewsContainer.appendChild(
                reviewColumn
            );

        });

    }


    /* =====================================================
       21. ESCAPE HTML
       ===================================================== */

    /*
       This function protects the page from inserting
       HTML entered by users into their reviews.

       Example:
       A user typing HTML/JavaScript into a review
       will be displayed as text instead of being executed.
    */

    function escapeHTML(value) {

        const div =
            document.createElement("div");


        div.textContent = value;


        return div.innerHTML;

    }


    /* =====================================================
       22. GALLERY LIGHTBOX
       ===================================================== */

    const galleryItems =
        document.querySelectorAll(".gallery-item");


    galleryItems.forEach(function (item) {

        item.addEventListener(
            "click",
            function () {

                const image =
                    item.dataset.image;


                const title =
                    item.dataset.title;


                const modalImage =
                    document.getElementById(
                        "galleryModalImage"
                    );


                const modalTitle =
                    document.getElementById(
                        "galleryModalTitle"
                    );


                if (modalImage) {

                    modalImage.src = image;

                    modalImage.alt = title;

                }


                if (modalTitle) {

                    modalTitle.textContent =
                        title;

                }
 /* =========================================================
   DYNAMIC GALLERY - ADD PHOTO
   ========================================================= */


/*
   Get the file input.
*/
const galleryPhotoInput =
    document.getElementById("galleryPhotoInput");


/*
   Get Add Photo button.
*/
const addGalleryPhotoBtn =
    document.getElementById("addGalleryPhotoBtn");


/*
   Container where new photos will appear.
*/
const dynamicGallery =
    document.getElementById("dynamicGallery");


/*
   Message area.
*/
const galleryPhotoMessage =
    document.getElementById("galleryPhotoMessage");


/*
   Get previously saved gallery photos.

   localStorage stores the images as data URLs,
   so they can appear again after refreshing.
*/
let galleryPhotos =
    JSON.parse(
        localStorage.getItem("modernCafeGallery")
    ) || [];


/*
   Display all saved photos when the page loads.
*/
renderGalleryPhotos();


/*
   Add photo button.
*/
if (addGalleryPhotoBtn) {

    addGalleryPhotoBtn.addEventListener(
        "click",
        function () {

            /*
               Check whether the user selected a file.
            */
            if (
                !galleryPhotoInput ||
                galleryPhotoInput.files.length === 0
            ) {

                galleryPhotoMessage.textContent =
                    "Please select an image first.";

                galleryPhotoMessage.className =
                    "form-error mt-3";

                return;
            }


            /*
               Get selected file.
            */
            const file =
                galleryPhotoInput.files[0];


            /*
               Make sure it is an image.
            */
            if (!file.type.startsWith("image/")) {

                galleryPhotoMessage.textContent =
                    "Please select a valid image file.";

                galleryPhotoMessage.className =
                    "form-error mt-3";

                return;
            }


            /*
               FileReader converts the selected image
               into a data URL that JavaScript can use.
            */
            const reader =
                new FileReader();


            reader.onload = function (event) {

                /*
                   Create a gallery photo object.
                */
                const newPhoto = {

                    id: Date.now(),

                    name: file.name,

                    image: event.target.result

                };


                /*
                   Add photo to array.
                */
                galleryPhotos.push(newPhoto);


                /*
                   Save photos in localStorage.
                */
                localStorage.setItem(
                    "modernCafeGallery",
                    JSON.stringify(galleryPhotos)
                );


                /*
                   Display updated gallery.
                */
                renderGalleryPhotos();


                /*
                   Clear file input.
                */
                galleryPhotoInput.value = "";


                /*
                   Show success message.
                */
                galleryPhotoMessage.textContent =
                    "Photo added successfully!";

                galleryPhotoMessage.className =
                    "form-success mt-3";

            };


            /*
               Start reading the image.
            */
            reader.readAsDataURL(file);

        }
    );

}


/*
   ========================================================
   DISPLAY SAVED GALLERY PHOTOS
   ========================================================
*/

function renderGalleryPhotos() {

    if (!dynamicGallery) {
        return;
    }


    dynamicGallery.innerHTML = "";


    galleryPhotos.forEach(function (photo) {

        const column =
            document.createElement("div");


        column.className =
            "col-12 col-sm-6 col-lg-4";


        column.innerHTML = `

            <div class="dynamic-gallery-item">

                <img
                    src="${photo.image}"
                    alt="${escapeHTML(photo.name)}"
                    class="dynamic-gallery-image"
                >

                <button
                    type="button"
                    class="delete-gallery-photo"
                    data-id="${photo.id}"
                    aria-label="Delete photo"
                >
                    <i class="bi bi-trash"></i>
                </button>

            </div>

        `;


        dynamicGallery.appendChild(column);

    });


    /*
       Add delete functionality.
    */
    const deleteButtons =
        document.querySelectorAll(
            ".delete-gallery-photo"
        );


    deleteButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const photoId =
                    Number(button.dataset.id);


                /*
                   Remove selected photo.
                */
                galleryPhotos =
                    galleryPhotos.filter(
                        function (photo) {

                            return photo.id !== photoId;

                        }
                    );


                /*
                   Update localStorage.
                */
                localStorage.setItem(
                    "modernCafeGallery",
                    JSON.stringify(galleryPhotos)
                );


                /*
                   Refresh gallery.
                */
                renderGalleryPhotos();

            }
        );

    });

}

                /*
                   Open Bootstrap modal.
                */

                const galleryModal =
                    document.getElementById(
                        "galleryModal"
                    );


                if (galleryModal) {

                    const modal =
                        new bootstrap.Modal(
                            galleryModal
                        );


                    modal.show();

                }

            }
        );

    });


    /* =====================================================
       23. TOAST NOTIFICATION
       ===================================================== */

    function showToast(message) {

        const toastElement =
            document.getElementById(
                "siteToast"
            );


        const toastMessage =
            document.getElementById(
                "toastMessage"
            );


        if (!toastElement || !toastMessage) {
            return;
        }


        /*
           Put message inside toast.
        */

        toastMessage.textContent =
            message;


        /*
           Create Bootstrap Toast.
        */

        const toast =
            bootstrap.Toast.getOrCreateInstance(
                toastElement,
                {
                    delay: 2500
                }
            );


        toast.show();

    }


    /* =====================================================
       24. LOAD EXISTING CART
       ===================================================== */

    /*
       If the user previously added products,
       localStorage allows us to restore them
       after refreshing the page.
    */

    renderCart();


    /* =====================================================
       25. LOAD EXISTING REVIEWS
       ===================================================== */

    renderReviews();


    /* =====================================================
       26. SET MINIMUM BOOKING DATE
       ===================================================== */

    const bookingDate =
        document.getElementById(
            "bookingDate"
        );


    if (bookingDate) {

        /*
           Convert today's date into YYYY-MM-DD.
        */

        const today =
            new Date();


        const year =
            today.getFullYear();


        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");


        const day =
            String(
                today.getDate()
            ).padStart(2, "0");


        const formattedDate =
            `${year}-${month}-${day}`;


        /*
           Prevent selecting dates in the past.
        */

        bookingDate.min =
            formattedDate;

    }


});