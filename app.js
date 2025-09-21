// script.js
// Food Pre-Order System - JavaScript Implementation

// ==============================
// DATA STRUCTURES AND INITIALIZATION
// ==============================

// Sample food items data
// To add/edit food items, modify this array with your menu items
const foodItems = [
    {
        id: 1,
        name: "Margherita Pizza",
        description: "Classic pizza with tomato sauce, mozzarella, and basil",
        price: 12.99,
        category: "main",
        image: "https://placeholder-image-service.onrender.com/image/400x300?prompt=Delicious Margherita pizza with fresh basil and melted cheese&id=food-1"
    },
    {
        id: 2,
        name: "Garlic Bread",
        description: "Freshly baked bread with garlic butter and herbs",
        price: 5.99,
        category: "appetizer",
        image: "https://placeholder-image-service.onrender.com/image/400x300?prompt=Golden brown garlic bread with parsley garnish&id=food-2"
    },
    {
        id: 3,
        name: "Caesar Salad",
        description: "Crisp romaine lettuce with Caesar dressing, croutons, and parmesan",
        price: 8.99,
        category: "appetizer",
        image: "https://placeholder-image-service.onrender.com/image/400x300?prompt=Fresh Caesar salad with croutons and parmesan cheese&id=food-3"
    },
    {
        id: 4,
        name: "Spaghetti Carbonara",
        description: "Classic Italian pasta with eggs, cheese, pancetta, and black pepper",
        price: 14.99,
        category: "main",
        image: "https://placeholder-image-service.onrender.com/image/400x300?prompt=Creamy spaghetti carbonara with pancetta and black pepper&id=food-4"
    },
    {
        id: 5,
        name: "Chocolate Brownie",
        description: "Rich chocolate brownie with walnuts, served with ice cream",
        price: 6.99,
        category: "dessert",
        image: "https://placeholder-image-service.onrender.com/image/400x300?prompt=Decadent chocolate brownie with walnuts and vanilla ice cream&id=food-5"
    },
    {
        id: 6,
        name: "Iced Coffee",
        description: "Chilled coffee with cream and optional flavored syrup",
        price: 4.99,
        category: "beverage",
        image: "https://placeholder-image-service.onrender.com/image/400x300?prompt=Refreshing iced coffee with cream and ice cubes&id=food-6"
    },
    {
        id: 7,
        name: "BBQ Chicken Wings",
        description: "Crispy chicken wings glazed in tangy BBQ sauce",
        price: 10.99,
        category: "appetizer",
        image: "https://placeholder-image-service.onrender.com/image/400x300?prompt=Sticky BBQ chicken wings with celery sticks&id=food-7"
    },
    {
        id: 8,
        name: "Cheeseburger",
        description: "Juicy beef patty with cheese, lettuce, tomato, and special sauce",
        price: 11.99,
        category: "main",
        image: "https://placeholder-image-service.onrender.com/image/400x300?prompt=Classic cheeseburger with all the fixings&id=food-8"
    }
];

// Shopping cart
let cart = [];

// Current order (for checkout process)
let currentOrder = null;

// Admin credentials (for demo purposes)
// To change admin credentials, update these values
const adminCredentials = {
    username: "admin",
    password: "password123"
};

// ==============================
// DOM ELEMENT REFERENCES
// ==============================
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');
const foodGrid = document.getElementById('food-grid');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const checkoutForm = document.getElementById('checkout-form');
const orderDetails = document.getElementById('order-details');
const adminLoginForm = document.getElementById('admin-login-form');
const ordersBody = document.getElementById('orders-body');
const adminSearch = document.getElementById('admin-search');
const statusFilter = document.getElementById('status-filter');
const dateFilter = document.getElementById('date-filter');
const exportOrdersBtn = document.getElementById('export-orders');
const addOrderBtn = document.getElementById('add-order-btn');
const addOrderModal = document.getElementById('add-order-modal');
const addOrderForm = document.getElementById('add-order-form');
const adminItemsSelection = document.getElementById('admin-items-selection');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const priceFilter = document.getElementById('price-filter');
const printFrame = document.getElementById('print-frame');

// ==============================
// INITIALIZATION
// ==============================
document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    // Load any saved cart from localStorage
    loadCart();
    
    // Render the food menu
    renderFoodItems();
    
    // Render the cart
    renderCart();
    
    // Set up event listeners
    setupEventListeners();
    
    // Check if we're coming back from a successful order
    checkOrderSuccess();
}

function setupEventListeners() {
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            showSection(sectionId);
        });
    });
    
    // Cart and checkout
    document.getElementById('checkout-btn').addEventListener('click', () => showSection('checkout'));
    document.getElementById('back-to-cart').addEventListener('click', () => showSection('cart'));
    checkoutForm.addEventListener('submit', handleCheckout);
    
    // Order confirmation
    document.getElementById('print-receipt').addEventListener('click', printReceipt);
    document.getElementById('new-order').addEventListener('click', startNewOrder);
    
    // Admin
    adminLoginForm.addEventListener('submit', adminLogin);
    document.getElementById('admin-logout').addEventListener('click', adminLogout);
    adminSearch.addEventListener('input', filterAdminOrders);
    statusFilter.addEventListener('change', filterAdminOrders);
    dateFilter.addEventListener('change', filterAdminOrders);
    exportOrdersBtn.addEventListener('click', exportOrdersToCSV);
    addOrderBtn.addEventListener('click', () => showModal(addOrderModal));
    
    // Modal
    document.querySelector('.close').addEventListener('click', () => hideModal(addOrderModal));
    document.querySelector('.cancel-btn').addEventListener('click', () => hideModal(addOrderModal));
    addOrderForm.addEventListener('submit', handleAddOrder);
    
    // Search and filters
    searchInput.addEventListener('input', filterFoodItems);
    categoryFilter.addEventListener('change', filterFoodItems);
    priceFilter.addEventListener('change', filterFoodItems);
}

// ==============================
// SECTION MANAGEMENT
// ==============================
function showSection(sectionId) {
    // Hide all sections
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the requested section
    document.getElementById(sectionId).classList.add('active');
    
    // Special handling for certain sections
    if (sectionId === 'admin-dashboard') {
        renderAdminOrders();
    }
}

// ==============================
// FOOD MENU MANAGEMENT
// ==============================
function renderFoodItems(items = foodItems) {
    foodGrid.innerHTML = '';
    
    items.forEach(item => {
        const foodItemElement = document.createElement('div');
        foodItemElement.className = 'food-item';
        foodItemElement.innerHTML = `
            <div class="food-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="food-info">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <span class="food-price">₱${item.price.toFixed(2)}</span>
                <button class="add-to-cart" data-id="${item.id}">Add to Cart</button>
            </div>
        `;
        
        foodGrid.appendChild(foodItemElement);
    });
    
    // Add event listeners to Add to Cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemId = parseInt(e.target.getAttribute('data-id'));
            addToCart(itemId);
        });
    });
}

function filterFoodItems() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    const priceRange = priceFilter.value;
    
    const filteredItems = foodItems.filter(item => {
        // Search term filter
        const matchesSearch = item.name.toLowerCase().includes(searchTerm) || 
                             item.description.toLowerCase().includes(searchTerm);
        
        // Category filter
        const matchesCategory = category === 'all' || item.category === category;
        
        // Price filter
        let matchesPrice = true;
        if (priceRange === 'low') {
            matchesPrice = item.price < 10;
        } else if (priceRange === 'medium') {
            matchesPrice = item.price >= 10 && item.price <= 20;
        } else if (priceRange === 'high') {
            matchesPrice = item.price > 20;
        }
        
        return matchesSearch && matchesCategory && matchesPrice;
    });
    
    renderFoodItems(filteredItems);
}

// ==============================
// CART MANAGEMENT
// ==============================
function addToCart(itemId) {
    const item = foodItems.find(i => i.id === itemId);
    if (!item) return;
    
    // Check if item is already in cart
    const existingItem = cart.find(i => i.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }
    
    // Save cart to localStorage
    saveCart();
    
    // Update cart display
    renderCart();
    
    // Show success message
    alert(`${item.name} added to cart!`);
}

function updateCartItem(itemId, change) {
    const item = cart.find(i => i.id === itemId);
    if (!item) return;
    
    item.quantity += change;
    
    // Remove item if quantity is 0 or less
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== itemId);
    }
    
    // Save cart to localStorage
    saveCart();
    
    // Update cart display
    renderCart();
}

function removeFromCart(itemId) {
    cart = cart.filter(i => i.id !== itemId);
    
    // Save cart to localStorage
    saveCart();
    
    // Update cart display
    renderCart();
}

function renderCart() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        cartCount.textContent = '0';
        return;
    }
    
    let total = 0;
    let totalItems = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        totalItems += item.quantity;
        
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>₱${item.price.toFixed(2)} each</p>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" data-id="${item.id}" data-change="-1">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" data-id="${item.id}" data-change="1">+</button>
                <button class="remove-btn" data-id="${item.id}">Remove</button>
            </div>
            <div class="cart-item-total">
                ₱${itemTotal.toFixed(2)}
            </div>
        `;
        
        cartItems.appendChild(cartItemElement);
    });
    
    // Update totals
    cartTotal.textContent = total.toFixed(2);
    cartCount.textContent = totalItems;
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemId = parseInt(e.target.getAttribute('data-id'));
            const change = parseInt(e.target.getAttribute('data-change'));
            updateCartItem(itemId, change);
        });
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemId = parseInt(e.target.getAttribute('data-id'));
            removeFromCart(itemId);
        });
    });
}

function saveCart() {
    localStorage.setItem('foodCart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('foodCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

function clearCart() {
    cart = [];
    saveCart();
    renderCart();
}

// ==============================
// CHECKOUT AND ORDER PROCESSING
// ==============================
function handleCheckout(e) {
    e.preventDefault();
    
    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const deliveryOption = document.getElementById('delivery-option').value;
    
    // Calculate total with delivery fee if applicable
    let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (deliveryOption === 'delivery') {
        total += 5;
    }
    
    // Generate unique order ID (timestamp + random number)
    const orderId = Date.now() + Math.floor(Math.random() * 1000);
    
    // Create order object
    const order = {
        id: orderId,
        customer: {
            name,
            email,
            phone,
            address
        },
        items: [...cart],
        deliveryOption,
        total: parseFloat(total.toFixed(2)),
        status: 'pending',
        timestamp: new Date().toISOString()
    };
    
    // Save order
    saveOrder(order);
    
    // Set as current order for confirmation display
    currentOrder = order;
    
    // Clear the cart
    clearCart();
    
    // Show confirmation
    showOrderConfirmation(order);
    showSection('confirmation');
}

function showOrderConfirmation(order) {
    const deliveryFee = order.deliveryOption === 'delivery' ? 5 : 0;
    
    orderDetails.innerHTML = `
        <div class="order-detail">
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Customer:</strong> ${order.customer.name}</p>
            <p><strong>Email:</strong> ${order.customer.email}</p>
            <p><strong>Phone:</strong> ${order.customer.phone}</p>
            <p><strong>Delivery:</strong> ${order.deliveryOption} ${deliveryFee > 0 ? '(₱5 fee)' : ''}</p>
            <p><strong>Order Date:</strong> ${new Date(order.timestamp).toLocaleString()}</p>
        </div>
        <div class="order-detail">
            <h3>Order Items</h3>
            ${order.items.map(item => `
                <p>${item.quantity} x ${item.name} - ₱${(item.price * item.quantity).toFixed(2)}</p>
            `).join('')}
            ${deliveryFee > 0 ? `<p>Delivery Fee - ₱${deliveryFee.toFixed(2)}</p>` : ''}
            <p><strong>Total: ₱${order.total.toFixed(2)}</strong></p>
        </div>
    `;
}

function printReceipt() {
    if (!currentOrder) return;
    
    const deliveryFee = currentOrder.deliveryOption === 'delivery' ? 5 : 0;
    
    const receiptHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Order Receipt - #${currentOrder.id}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .receipt { max-width: 400px; margin: 0 auto; }
                .header { text-align: center; margin-bottom: 20px; }
                .info { margin-bottom: 15px; }
                .items { margin-bottom: 15px; }
                .total { font-weight: bold; font-size: 1.2em; border-top: 1px solid #000; padding-top: 10px; }
                .thank-you { text-align: center; margin-top: 20px; font-style: italic; }
            </style>
        </head>
        <body>
            <div class="receipt">
                <div class="header">
                    <h1>FoodPreOrder</h1>
                    <h2>Order Receipt</h2>
                    <p>Order #${currentOrder.id}</p>
                    <p>${new Date(currentOrder.timestamp).toLocaleString()}</p>
                </div>
                
                <div class="info">
                    <p><strong>Customer:</strong> ${currentOrder.customer.name}</p>
                    <p><strong>Email:</strong> ${currentOrder.customer.email}</p>
                    <p><strong>Phone:</strong> ${currentOrder.customer.phone}</p>
                    <p><strong>Delivery:</strong> ${currentOrder.deliveryOption}</p>
                </div>
                
                <div class="items">
                    <h3>Items:</h3>
                    ${currentOrder.items.map(item => `
                        <p>${item.quantity} x ${item.name} - ₱${(item.price * item.quantity).toFixed(2)}</p>
                    `).join('')}
                    ${deliveryFee > 0 ? `<p>Delivery Fee - ₱${deliveryFee.toFixed(2)}</p>` : ''}
                </div>
                
                <div class="total">
                    <p>Total: ₱${currentOrder.total.toFixed(2)}</p>
                </div>
                
                <div class="thank-you">
                    <p>Thank you for your order!</p>
                </div>
            </div>
        </body>
        </html>
    `;
    
    // Print the receipt
    const printWindow = window.open('', '_blank');
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
}

function startNewOrder() {
    currentOrder = null;
    showSection('menu');
}

function checkOrderSuccess() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('orderSuccess') === 'true') {
        // This would typically be used after a redirect from a payment processor
        // For now, we'll just show a message if needed
    }
}

// ==============================
// ORDER STORAGE (LocalStorage Simulation)
// ==============================

// Save order to localStorage
// In a real application, this would be an API call to your backend
function saveOrder(order) {
    const orders = getOrders();
    orders.push(order);
    localStorage.setItem('foodOrders', JSON.stringify(orders));
    
    /* 
    EXAMPLE OF HOW TO CONVERT TO A REAL BACKEND:
    
    // Using fetch API to send order to backend
    fetch('/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(order)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Order saved:', data);
    })
    .catch(error => {
        console.error('Error saving order:', error);
    });
    */
}

// Get all orders from localStorage
// In a real application, this would be an API call to your backend
function getOrders() {
    const ordersJSON = localStorage.getItem('foodOrders');
    return ordersJSON ? JSON.parse(ordersJSON) : [];
    
    /* 
    EXAMPLE OF HOW TO CONVERT TO A REAL BACKEND:
    
    // Using fetch API to get orders from backend
    return fetch('/api/orders')
        .then(response => response.json())
        .then(orders => {
            return orders;
        })
        .catch(error => {
            console.error('Error fetching orders:', error);
            return [];
        });
    */
}

// Update order status
// In a real application, this would be an API call to your backend
function updateOrderStatus(orderId, status) {
    const orders = getOrders();
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = status;
        localStorage.setItem('foodOrders', JSON.stringify(orders));
        return true;
    }
    
    return false;
    
    /* 
    EXAMPLE OF HOW TO CONVERT TO A REAL BACKEND:
    
    // Using fetch API to update order status
    return fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
    })
    .then(response => response.json())
    .then(updatedOrder => {
        return true;
    })
    .catch(error => {
        console.error('Error updating order:', error);
        return false;
    });
    */
}

// Delete order
// In a real application, this would be an API call to your backend
function deleteOrder(orderId) {
    let orders = getOrders();
    orders = orders.filter(order => order.id !== orderId);
    localStorage.setItem('foodOrders', JSON.stringify(orders));
    
    /* 
    EXAMPLE OF HOW TO CONVERT TO A REAL BACKEND:
    
    // Using fetch API to delete order
    return fetch(`/api/orders/${orderId}`, {
        method: 'DELETE'
    })
    .then(response => {
        return response.ok;
    })
    .catch(error => {
        console.error('Error deleting order:', error);
        return false;
    });
    */
}

// ==============================
// ADMIN FUNCTIONALITY
// ==============================
function adminLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    
    if (username === adminCredentials.username && password === adminCredentials.password) {
        showSection('admin-dashboard');
        renderAdminOrders();
    } else {
        alert('Invalid admin credentials');
    }
}

function adminLogout() {
    showSection('menu');
}

function renderAdminOrders(orders = getOrders()) {
    ordersBody.innerHTML = '';
    
    if (orders.length === 0) {
        ordersBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No orders found</td></tr>';
        return;
    }
    
    orders.forEach(order => {
        const orderDate = new Date(order.timestamp);
        const itemsSummary = order.items.map(item => `${item.quantity}x ${item.name}`).join(', ');
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${order.id}</td>
            <td>${order.customer.name}<br>${order.customer.email}</td>
            <td>${itemsSummary}</td>
            <td>₱${order.total.toFixed(2)}</td>
            <td><span class="status-badge status-${order.status}">${order.status}</span></td>
            <td>${orderDate.toLocaleDateString()}<br>${orderDate.toLocaleTimeString()}</td>
            <td>
                <select class="status-select" data-order-id="${order.id}">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                    <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
                <button class="action-btn delete-btn" data-order-id="${order.id}">Delete</button>
            </td>
        `;
        
        ordersBody.appendChild(row);
    });
    
    // Add event listeners to status selects
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', (e) => {
            const orderId = parseInt(e.target.getAttribute('data-order-id'));
            const newStatus = e.target.value;
            
            if (updateOrderStatus(orderId, newStatus)) {
                alert(`Order status updated to ${newStatus}`);
                renderAdminOrders();
            } else {
                alert('Error updating order status');
            }
        });
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const orderId = parseInt(e.target.getAttribute('data-order-id'));
            
            if (confirm('Are you sure you want to delete this order?')) {
                if (deleteOrder(orderId)) {
                    alert('Order deleted');
                    renderAdminOrders();
                } else {
                    alert('Error deleting order');
                }
            }
        });
    });
}

function filterAdminOrders() {
    const searchTerm = adminSearch.value.toLowerCase();
    const status = statusFilter.value;
    const date = dateFilter.value;
    
    let orders = getOrders();
    
    // Apply filters
    if (searchTerm) {
        orders = orders.filter(order => 
            order.customer.name.toLowerCase().includes(searchTerm) ||
            order.customer.email.toLowerCase().includes(searchTerm) ||
            order.id.toString().includes(searchTerm)
        );
    }
    
    if (status !== 'all') {
        orders = orders.filter(order => order.status === status);
    }
    
    if (date) {
        orders = orders.filter(order => {
            const orderDate = new Date(order.timestamp).toISOString().split('T')[0];
            return orderDate === date;
        });
    }
    
    renderAdminOrders(orders);
}

function exportOrdersToCSV() {
    const orders = getOrders();
    
    if (orders.length === 0) {
        alert('No orders to export');
        return;
    }
    
    // Create CSV content
    let csvContent = 'Order ID,Customer Name,Email,Phone,Address,Items,Total,Status,Timestamp\n';
    
    orders.forEach(order => {
        const itemsString = order.items.map(item => 
            `${item.quantity}x ${item.name} (₱${item.price})`
        ).join('; ');
        
        const row = [
            order.id,
            `"${order.customer.name}"`,
            `"${order.customer.email}"`,
            `"${order.customer.phone}"`,
            `"${order.customer.address}"`,
            `"${itemsString}"`,
            order.total,
            order.status,
            new Date(order.timestamp).toLocaleString()
        ];
        
        csvContent += row.join(',') + '\n';
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function showModal(modal) {
    modal.style.display = 'block';
    
    // If it's the add order modal, populate the items selection
    if (modal.id === 'add-order-modal') {
        populateAdminItemsSelection();
    }
}

function hideModal(modal) {
    modal.style.display = 'none';
}

function populateAdminItemsSelection() {
    adminItemsSelection.innerHTML = '';
    
    foodItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'admin-item-select';
        itemElement.innerHTML = `
            <input type="checkbox" id="admin-item-${item.id}" value="${item.id}">
            <label for="admin-item-${item.id}">${item.name} (₱${item.price.toFixed(2)})</label>
            <input type="number" min="1" value="1" class="item-quantity" data-item-id="${item.id}" style="display: none;">
        `;
        
        adminItemsSelection.appendChild(itemElement);
    });
    
    // Show quantity input when item is selected
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const itemId = e.target.value;
            const quantityInput = document.querySelector(`.item-quantity[data-item-id="${itemId}"]`);
            quantityInput.style.display = e.target.checked ? 'inline-block' : 'none';
        });
    });
}

function handleAddOrder(e) {
    e.preventDefault();
    
    const name = document.getElementById('customer-name').value;
    const email = document.getElementById('customer-email').value;
    const phone = document.getElementById('customer-phone').value;
    const address = document.getElementById('customer-address').value;
    const status = document.getElementById('admin-order-status').value;
    
    // Get selected items
    const selectedItems = [];
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
        const itemId = parseInt(checkbox.value);
        const quantity = parseInt(document.querySelector(`.item-quantity[data-item-id="${itemId}"]`).value);
        const item = foodItems.find(i => i.id === itemId);
        
        if (item) {
            selectedItems.push({
                ...item,
                quantity
            });
        }
    });
    
    if (selectedItems.length === 0) {
        alert('Please select at least one item');
        return;
    }
    
    // Calculate total
    const total = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Generate order ID
    const orderId = Date.now() + Math.floor(Math.random() * 1000);
    
    // Create order object
    const order = {
        id: orderId,
        customer: {
            name,
            email,
            phone,
            address
        },
        items: selectedItems,
        deliveryOption: 'pickup', // Default for admin orders
        total: parseFloat(total.toFixed(2)),
        status,
        timestamp: new Date().toISOString()
    };
    
    // Save order
    saveOrder(order);
    
    // Show success message
    alert(`Order #${orderId} created successfully`);
    
    // Reset form and close modal
    addOrderForm.reset();
    hideModal(addOrderModal);
    
    // Refresh orders list
    renderAdminOrders();
}

// Close modal when clicking outside of it
window.addEventListener('click', (e) => {
    if (e.target === addOrderModal) {
        hideModal(addOrderModal);
    }
});