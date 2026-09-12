// ======================================================
// CODEALPHA STORE - SCRIPT.JS
// ======================================================


// ===============================
// CART
// ===============================

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}


// ===============================
// PRODUCTS
// ===============================

let allProducts = [];

const commonProductImage =
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80";


// ===============================
// LOAD PRODUCTS
// ===============================

async function loadProducts() {

    try {

        const response = await fetch("/api/products");

        if (!response.ok) {
            throw new Error("Failed to load products");
        }

        allProducts = await response.json();

        renderProducts(allProducts);

    } catch (error) {

        console.error("Product loading error:", error);

        const container =
            document.getElementById("products-container");

        if (container) {
            container.innerHTML = `
                <p>
                    Unable to load products.
                    Please refresh the page.
                </p>
            `;
        }

    }

}


// ===============================
// RENDER PRODUCTS
// ===============================

function renderProducts(products) {

    const container =
        document.getElementById("products-container");

    if (!container) {
        return;
    }

    container.innerHTML = "";


    if (!products || products.length === 0) {

        container.innerHTML = `
            <p class="no-products">
                No products found 😕
            </p>
        `;

        return;
    }


    products.forEach(function (product) {

        const card =
            document.createElement("div");

        card.className = "product-card";


        card.innerHTML = `

            <img
                src="${product.image || commonProductImage}"
                alt="${product.name}"
                class="product-image"
            >

            <div class="product-info">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3>
                    ${product.name}
                </h3>

                <p>
                    ${product.description || ""}
                </p>

                <h3 class="product-price">
                    ₹${product.price}
                </h3>

                <div class="product-actions">

                    <button
                        class="view-btn"
                        data-id="${product.id}"
                    >
                        View Details
                    </button>

                    <button
                        class="add-btn"
                        data-id="${product.id}"
                    >
                        Add to Cart 🛒
                    </button>

                </div>

            </div>

        `;


        container.appendChild(card);

    });

}


// ===============================
// ADD TO CART
// ===============================

function addToCart(product) {

    const existing =
        cart.find(function (item) {
            return item.id === product.id;
        });


    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            price: product.price,

            image:
                product.image ||
                commonProductImage,

            quantity: 1

        });

    }


    saveCart();


    showNotification(
        product.name + " added to cart"
    );

}


// ===============================
// BUTTON CLICKS
// ===============================

document.addEventListener("click", function (event) {


    // VIEW DETAILS

    if (
        event.target.classList.contains("view-btn")
    ) {

        const id =
            event.target.dataset.id;

        window.location.href =
            "product.html?id=" + id;

        return;
    }


    // ADD TO CART

    if (
        event.target.classList.contains("add-btn")
    ) {

        const id =
            Number(event.target.dataset.id);


        const product =
            allProducts.find(function (item) {
                return item.id === id;
            });


        if (product) {
            addToCart(product);
        }

        return;
    }


    // INCREASE QUANTITY

    if (
        event.target.classList.contains(
            "increase-btn"
        )
    ) {

        const id =
            Number(event.target.dataset.id);


        const item =
            cart.find(function (product) {
                return product.id === id;
            });


        if (item) {

            item.quantity += 1;

            saveCart();

            renderCart();

        }

        return;
    }


    // DECREASE QUANTITY

    if (
        event.target.classList.contains(
            "decrease-btn"
        )
    ) {

        const id =
            Number(event.target.dataset.id);


        const item =
            cart.find(function (product) {
                return product.id === id;
            });


        if (item) {

            item.quantity -= 1;


            if (item.quantity <= 0) {

                cart =
                    cart.filter(function (product) {
                        return product.id !== id;
                    });

            }


            saveCart();

            renderCart();

        }

        return;
    }


    // REMOVE

    if (
        event.target.classList.contains(
            "remove-btn"
        )
    ) {

        const id =
            Number(event.target.dataset.id);


        cart =
            cart.filter(function (product) {
                return product.id !== id;
            });


        saveCart();

        renderCart();


        showNotification(
            "Product removed from cart"
        );

    }

});


// ===============================
// SEARCH
// ===============================

const searchInput =
    document.getElementById("product-search");


if (searchInput) {

    searchInput.addEventListener(
        "input",
        applyFilters
    );

}


// ===============================
// CATEGORY
// ===============================

const categoryFilter =
    document.getElementById("category-filter");


if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        applyFilters
    );

}


// ===============================
// SORT
// ===============================

const sortProducts =
    document.getElementById("sort-products");


if (sortProducts) {

    sortProducts.addEventListener(
        "change",
        applyFilters
    );

}


// ===============================
// FILTER PRODUCTS
// ===============================

function applyFilters() {

    let products =
        [...allProducts];


    // SEARCH

    const search =
        searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";


    if (search) {

        products =
            products.filter(function (product) {

                return (

                    product.name
                        .toLowerCase()
                        .includes(search)

                    ||

                    (
                        product.description || ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    product.category
                        .toLowerCase()
                        .includes(search)

                );

            });

    }


    // CATEGORY

    const category =
        categoryFilter
            ? categoryFilter.value
            : "all";


    if (category !== "all") {

        products =
            products.filter(function (product) {

                return product.category === category;

            });

    }


    // SORT

    const sort =
        sortProducts
            ? sortProducts.value
            : "default";


    if (sort === "low-high") {

        products.sort(function (a, b) {
            return a.price - b.price;
        });

    }


    if (sort === "high-low") {

        products.sort(function (a, b) {
            return b.price - a.price;
        });

    }


    if (sort === "name") {

        products.sort(function (a, b) {

            return a.name.localeCompare(b.name);

        });

    }


    renderProducts(products);

}


// ===============================
// CART DISPLAY
// ===============================

function renderCart() {

    const container =
        document.getElementById("cart-container");


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (cart.length === 0) {

        container.innerHTML = `

            <div class="empty-cart">

                <h3>
                    Your cart is empty 🛒
                </h3>

                <p>
                    Add some products to continue shopping.
                </p>

                <a href="index.html">
                    Continue Shopping →
                </a>

            </div>

        `;


        updateCartTotals();

        return;
    }


    cart.forEach(function (item) {

        const cartItem =
            document.createElement("div");


        cartItem.className = "cart-item";


        cartItem.innerHTML = `

            <img
                src="${item.image || commonProductImage}"
                alt="${item.name}"
            >

            <div class="cart-item-info">

                <h3>
                    ${item.name}
                </h3>

                <p>
                    ₹${item.price}
                </p>

            </div>


            <div class="quantity-controls">

                <button
                    class="decrease-btn"
                    data-id="${item.id}"
                >
                    −
                </button>

                <span>
                    ${item.quantity}
                </span>

                <button
                    class="increase-btn"
                    data-id="${item.id}"
                >
                    +
                </button>

            </div>


            <strong>
                ₹${item.price * item.quantity}
            </strong>


            <button
                class="remove-btn"
                data-id="${item.id}"
            >
                Remove
            </button>

        `;


        container.appendChild(cartItem);

    });


    updateCartTotals();

}


// ===============================
// CART TOTALS
// ===============================

function updateCartTotals() {

    const subtotal =
        cart.reduce(
            function (total, item) {

                return total +
                    (
                        item.price *
                        item.quantity
                    );

            },
            0
        );


    const subtotalElement =
        document.getElementById("subtotal");


    const totalElement =
        document.getElementById("total");


    if (subtotalElement) {

        subtotalElement.textContent =
            "₹" + subtotal;

    }


    if (totalElement) {

        totalElement.textContent =
            "₹" + subtotal;

    }

}


// ===============================
// CHECKOUT
// ===============================

function checkout() {

    if (cart.length === 0) {

        showNotification(
            "Your cart is empty 🛒"
        );

        return;
    }


    const user =
        JSON.parse(
            localStorage.getItem("user")
        );


    // LOGIN REQUIRED

    if (!user) {

        localStorage.setItem(
            "checkoutPending",
            "true"
        );


        showNotification(
            "Please login to continue 🔐"
        );


        setTimeout(function () {

            window.location.href =
                "auth.html?redirect=checkout";

        }, 800);


        return;
    }


    // USER LOGGED IN

    window.location.href =
        "checkout.html";

}


// ===============================
// ANIMATED NOTIFICATION
// ===============================

function showNotification(message) {

    const old =
        document.querySelector(
            ".notification"
        );


    if (old) {
        old.remove();
    }


    const notification =
        document.createElement("div");


    notification.className =
        "notification";


    notification.textContent =
        "🛒 " + message;


    document.body.appendChild(
        notification
    );


    setTimeout(function () {

        notification.classList.add(
            "hide"
        );


        setTimeout(function () {

            notification.remove();

        }, 400);

    }, 2500);

}


// ===============================
// PAGE START
// ===============================

function initializePage() {

    // HOME PAGE

    if (
        document.getElementById(
            "products-container"
        )
    ) {

        loadProducts();

    }


    // CART PAGE

    if (
        document.getElementById(
            "cart-container"
        )
    ) {

        renderCart();

    }

}


// Run after page loads

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializePage
    );

} else {

    initializePage();

}