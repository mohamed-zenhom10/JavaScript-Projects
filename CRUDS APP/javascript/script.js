/* ==============================================
   DOM ELEMENTS - Organized by functionality
   ============================================== */

// Header Elements
const notificationBell = document.querySelector(".notification-bell");
const notificationCount = document.querySelector(".notification-count");
const notificationPart = document.querySelector(".notification-part");

// Add Product Elements
const productName = document.getElementById("product-name");
const productPrice = document.getElementById("product-price");
const productTax = document.getElementById("product-tax");
const productDiscount = document.getElementById("product-discount");
const productCategory = document.getElementById("product-category");
const productQuantity = document.getElementById("product-quantity");
const totalValue = document.getElementById("total");
const addButton = document.getElementById("add-prodcut");

// Search Element
const searchInput = document.getElementById("search");

// Display Area Element
const displayArea = document.getElementById("display-area");

// Update Product Elements
const overlay = document.querySelector(".overlay");
const updateForm = document.querySelector(".update-form");
const updateName = document.getElementById("update-name");
const updatePrice = document.getElementById("update-price");
const updateTax = document.getElementById("update-tax");
const updateDiscount = document.getElementById("update-discount");
const updateCategory = document.getElementById("update-category");
const updateQuantity = document.getElementById("update-quantity");
const closeIcon = document.querySelector(".close-icon");
const applyUpdates = document.getElementById("update-product");

/* ==============================================
  APPLICATION STATE & DATA MANAGEMENT
============================================== */

class ProductManager {
    constructor() {
        this.products = JSON.parse(localStorage.getItem("products")) || [];
        this.notifications = JSON.parse(localStorage.getItem("notifications")) || [];
        this.notificationCounter = parseInt(localStorage.getItem("counter")) || 0;
        this.currentUpdateIndex = null;
        this.searchTerm = "";
    }

    // Save data to localStorage
    saveToStorage() {
        localStorage.setItem("products", JSON.stringify(this.products));
        localStorage.setItem("notifications", JSON.stringify(this.notifications));
        localStorage.setItem("counter", this.notificationCounter.toString());
    }

    // Generate unique ID for products
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

// Initialize Product Manager
const productManager = new ProductManager();

/* ==============================================
  UTILITY FUNCTIONS
  ============================================== */

// Format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
};

// Calculate total price
const calculateTotal = (price, tax, discount) => {
    return (parseFloat(price) || 0) + (parseFloat(tax) || 0) - (parseFloat(discount) || 0);
};

// Format time since notification
const timeSince = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'week', seconds: 604800 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 },
        { label: 'second', seconds: 1 }
    ];

    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) {
            return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
        }
    }
    
    return 'just now';
};

// Show toast notification
const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span>${message}</span>
        <button class="toast-close">&times;</button>
    `;
    
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#32CD32' : '#FF4500'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Add close functionality
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }
    }, 5000);
    
    // Add CSS animations if not already added
    if (!document.querySelector('#toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
};

// Validate product data
const validateProductData = (data) => {
    const errors = [];
    
    if (!data.name?.trim()) errors.push("Product name is required");
    if (!data.price || parseFloat(data.price) <= 0) errors.push("Valid price is required");
    if (!data.category?.trim()) errors.push("Category is required");
    if (data.quantity && parseInt(data.quantity) < 0) errors.push("Quantity cannot be negative");
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

/* ==============================================
   DOM UPDATE FUNCTIONS
   ============================================== */

// Update total value display
const updateTotalDisplay = () => {
    const total = calculateTotal(productPrice.value, productTax.value, productDiscount.value);
    totalValue.innerHTML = formatCurrency(total);
    totalValue.style.background = productPrice.value && productPrice.value > 0 
        ? "linear-gradient(135deg, #32CD32, #28a428)" 
        : "linear-gradient(135deg, #FF4500, #e63900)";
};

// Display products in table
const displayProducts = (products = productManager.products) => {
    if (products.length === 0) {
        displayArea.innerHTML = `
            <tr>
                <td colspan="10" class="empty-state">
                    <div style="text-align: center; padding: 40px;">
                        <div style="font-size: 3rem; margin-bottom: 20px;">📦</div>
                        <h3>No products found</h3>
                        <p>Add your first product to get started!</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    const tableRows = products.map((product, index) => `
        <tr data-id="${product.id || index}">
            <td>${index + 1}</td>
            <td><strong>${product.name}</strong></td>
            <td>${formatCurrency(product.price)}</td>
            <td>${formatCurrency(product.tax || 0)}</td>
            <td>${formatCurrency(product.discount || 0)}</td>
            <td><strong>${formatCurrency(product.total || calculateTotal(product.price, product.tax, product.discount))}</strong></td>
            <td><span class="category-badge">${product.category}</span></td>
            <td><span class="quantity-badge ${product.quantity <= 5 ? 'low-stock' : ''}">${product.quantity}</span></td>
            <td>
                <button onclick="updateProduct(${index})" class="update" title="Edit product">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                    </svg>
                    Edit
                </button>
            </td>
            <td>
                <button onclick="deleteProduct(${index})" class="delete" title="Delete product">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                    Delete
                </button>
            </td>
        </tr>
    `).join('');

    displayArea.innerHTML = tableRows;
};

// Display notifications
const displayNotifications = () => {
    if (productManager.notifications.length === 0) {
        notificationPart.innerHTML = `
            <div class="notify" style="text-align: center; color: #666; padding: 30px;">
                <div style="font-size: 2rem; margin-bottom: 10px;">🔔</div>
                <p>No notifications yet</p>
            </div>
        `;
        notificationCount.innerHTML = '0';
        return;
    }

    const notificationContent = productManager.notifications.slice(-10).reverse().map(notification => `
        <div class="notify" data-id="${notification.id}">
            <div class="notify-content">
                <span class="notify-text">${notification.content}</span>
                <small class="notify-time">${timeSince(notification.id)}</small>
            </div>
            <button class="notify-delete" onclick="deleteNotification('${notification.id}')" title="Clear notification">
                &times;
            </button>
        </div>
    `).join('');

    notificationPart.innerHTML = notificationContent;
    notificationCount.innerHTML = productManager.notificationCounter.toString();
    
    // Add animation to new notifications
    const latestNotification = notificationPart.querySelector('.notify:first-child');
    if (latestNotification) {
        latestNotification.style.animation = 'highlight 0.5s ease';
    }
};

/* ==============================================
   PRODUCT MANAGEMENT FUNCTIONS
   ============================================== */

// Add new product
const addProduct = () => {
    const productData = {
        id: productManager.generateId(),
        name: productName.value.trim(),
        price: parseFloat(productPrice.value) || 0,
        tax: parseFloat(productTax.value) || 0,
        discount: parseFloat(productDiscount.value) || 0,
        category: productCategory.value.trim(),
        quantity: parseInt(productQuantity.value) || 1,
        dateAdded: new Date().toISOString()
    };

    // Calculate total
    productData.total = calculateTotal(productData.price, productData.tax, productData.discount);

    // Validate product data
    const validation = validateProductData(productData);
    if (!validation.isValid) {
        showToast(validation.errors[0], 'error');
        addNotification(false);
        return;
    }

    // Add product(s) based on quantity
    const quantityToAdd = Math.max(1, productData.quantity);
    for (let i = 0; i < quantityToAdd; i++) {
        const singleProduct = { ...productData, id: productManager.generateId() };
        productManager.products.push(singleProduct);
    }

    // Add notification and save
    addNotification(true);
    productManager.saveToStorage();

    // Update UI
    displayProducts();
    displayNotifications();
    showToast(`Added ${quantityToAdd} product(s) successfully!`, 'success');

    // Reset form
    resetAddForm();
};

// Update existing product
const updateProduct = (productIndex) => {
    if (productIndex < 0 || productIndex >= productManager.products.length) return;

    const product = productManager.products[productIndex];
    productManager.currentUpdateIndex = productIndex;

    // Populate update form
    updateName.value = product.name;
    updatePrice.value = product.price;
    updateTax.value = product.tax || 0;
    updateDiscount.value = product.discount || 0;
    updateCategory.value = product.category;
    updateQuantity.value = product.quantity;

    // Show modal
    updateForm.classList.add("display-update-form");
    overlay.classList.add("display-overlay");

    // Disable scroll on body
    document.body.style.overflow = 'hidden';
};

// Apply updates to product
const applyProductUpdate = () => {
    if (productManager.currentUpdateIndex === null) return;

    const updatedProduct = {
        ...productManager.products[productManager.currentUpdateIndex],
        name: updateName.value.trim(),
        price: parseFloat(updatePrice.value) || 0,
        tax: parseFloat(updateTax.value) || 0,
        discount: parseFloat(updateDiscount.value) || 0,
        category: updateCategory.value.trim(),
        quantity: parseInt(updateQuantity.value) || 1
    };

    // Validate updated product
    const validation = validateProductData(updatedProduct);
    if (!validation.isValid) {
        showToast(validation.errors[0], 'error');
        return;
    }

    // Recalculate total
    updatedProduct.total = calculateTotal(updatedProduct.price, updatedProduct.tax, updatedProduct.discount);

    // Update product in array
    productManager.products[productManager.currentUpdateIndex] = updatedProduct;
    productManager.saveToStorage();

    // Update UI
    displayProducts();
    closeUpdateForm();
    showToast('Product updated successfully!', 'success');
};

// Delete product
const deleteProduct = (productIndex) => {
    if (productIndex < 0 || productIndex >= productManager.products.length) return;

    // Create custom confirmation modal
    const confirmModal = document.createElement('div');
    confirmModal.className = 'custom-confirm-modal';
    confirmModal.innerHTML = `
        <div class="confirm-content">
            <h3>Delete Product</h3>
            <p>Are you sure you want to delete "${productManager.products[productIndex].name}"?</p>
            <p class="warning-text">This action cannot be undone.</p>
            <div class="confirm-buttons">
                <button class="cancel-btn">Cancel</button>
                <button class="delete-btn">Delete</button>
            </div>
        </div>
    `;

    // Add styles
    confirmModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;

    const confirmContent = confirmModal.querySelector('.confirm-content');
    confirmContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 12px;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        animation: scaleIn 0.3s ease;
    `;

    // Add animation styles if not present
    if (!document.querySelector('#confirm-modal-styles')) {
        const style = document.createElement('style');
        style.id = 'confirm-modal-styles';
        style.textContent = `
            @keyframes scaleIn {
                from { transform: scale(0.8); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            .warning-text { color: #FF4500; font-weight: bold; margin: 10px 0; }
            .confirm-buttons { display: flex; gap: 10px; margin-top: 20px; }
            .confirm-buttons button {
                flex: 1;
                padding: 12px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s ease;
            }
            .cancel-btn { background: #E0E0E0; }
            .cancel-btn:hover { background: #D0D0D0; }
            .delete-btn { background: #FF4500; color: white; }
            .delete-btn:hover { background: #e63900; }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(confirmModal);

    // Handle button clicks
    confirmModal.querySelector('.cancel-btn').addEventListener('click', () => {
        confirmModal.remove();
    });

    confirmModal.querySelector('.delete-btn').addEventListener('click', () => {
        // Remove product
        productManager.products.splice(productIndex, 1);
        productManager.saveToStorage();
        
        // Update UI
        displayProducts();
        showToast('Product deleted successfully!', 'success');
        
        // Close modal
        confirmModal.remove();
    });

    // Close on overlay click
    confirmModal.addEventListener('click', (e) => {
        if (e.target === confirmModal) {
            confirmModal.remove();
        }
    });
};

// Search products
const searchProducts = (searchTerm) => {
    productManager.searchTerm = searchTerm.toLowerCase().trim();
    
    if (!productManager.searchTerm) {
        displayProducts();
        return;
    }

    const filteredProducts = productManager.products.filter(product => 
        product.name.toLowerCase().includes(productManager.searchTerm) ||
        product.category.toLowerCase().includes(productManager.searchTerm) ||
        product.price.toString().includes(productManager.searchTerm)
    );

    displayProducts(filteredProducts);
};

/* ==============================================
   NOTIFICATION MANAGEMENT
   ============================================== */

// Add notification
const addNotification = (isSuccess) => {
    const notification = {
        id: Date.now(),
        content: isSuccess ? 
            "✅ Product added successfully!" : 
            "❌ Failed to add product. Please check your input.",
        type: isSuccess ? 'success' : 'error',
        timestamp: Date.now()
    };

    productManager.notifications.push(notification);
    productManager.notificationCounter++;
    
    // Keep only last 100 notifications
    if (productManager.notifications.length > 100) {
        productManager.notifications.shift();
    }

    productManager.saveToStorage();
    displayNotifications();
};

// Delete single notification
const deleteNotification = (notificationId) => {
    productManager.notifications = productManager.notifications.filter(
        n => n.id.toString() !== notificationId
    );
    productManager.notificationCounter = Math.max(0, productManager.notificationCounter - 1);
    productManager.saveToStorage();
    displayNotifications();
};

// Clear all notifications
const clearAllNotifications = () => {
    productManager.notifications = [];
    productManager.notificationCounter = 0;
    productManager.saveToStorage();
    displayNotifications();
    showToast('All notifications cleared', 'info');
};

/* ==============================================
   FORM MANAGEMENT
   ============================================== */

// Reset add product form
const resetAddForm = () => {
    productName.value = '';
    productPrice.value = '';
    productTax.value = '';
    productDiscount.value = '';
    productCategory.value = '';
    productQuantity.value = '1';
    totalValue.innerHTML = '';
    totalValue.style.background = 'linear-gradient(135deg, #FF4500, #e63900)';
};

// Close update form
const closeUpdateForm = () => {
    updateForm.classList.remove("display-update-form");
    overlay.classList.remove("display-overlay");
    document.body.style.overflow = 'auto';
    productManager.currentUpdateIndex = null;
};

/* ==============================================
   EVENT LISTENERS
   ============================================== */

// Initialize application
const initApp = () => {
    // Display initial data
    displayProducts();
    displayNotifications();
    updateTotalDisplay();

    // Add product button
    addButton.addEventListener("click", (e) => {
        e.preventDefault();
        addProduct();
    });

    // Update product button
    applyUpdates.addEventListener("click", (e) => {
        e.preventDefault();
        applyProductUpdate();
    });

    // Real-time total calculation
    [productPrice, productTax, productDiscount].forEach(input => {
        input.addEventListener("input", updateTotalDisplay);
    });

    // Search functionality
    searchInput.addEventListener("input", (e) => {
        searchProducts(e.target.value);
    });

    // Notification bell toggle
    notificationBell.addEventListener("click", () => {
        notificationPart.classList.toggle("display");
        if (notificationPart.classList.contains("display")) {
            notificationBell.style.transform = 'scale(1.1) rotate(15deg)';
        } else {
            notificationBell.style.transform = 'scale(1) rotate(0)';
        }
    });

    // Close update form
    closeIcon.addEventListener("click", closeUpdateForm);
    overlay.addEventListener("click", closeUpdateForm);

    // Close modal on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === 'Escape' && updateForm.classList.contains("display-update-form")) {
            closeUpdateForm();
        }
    });

    // Auto-focus on product name input
    productName.focus();

    // Add clear all notifications button
    const clearNotificationsBtn = document.createElement('button');
    clearNotificationsBtn.className = 'clear-notifications';
    clearNotificationsBtn.innerHTML = 'Clear All';
    clearNotificationsBtn.style.cssText = `
        background: var(--red);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        margin-top: 10px;
        display: block;
        margin-left: auto;
        margin-right: auto;
    `;
    clearNotificationsBtn.addEventListener('click', clearAllNotifications);
    notificationPart.appendChild(clearNotificationsBtn);
};

/* ==============================================
  INITIALIZE APPLICATION
   ============================================== */

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// Make functions globally available for onclick handlers
window.updateProduct = updateProduct;
window.deleteProduct = deleteProduct;
window.deleteNotification = deleteNotification;

// Add extra CSS for enhanced UI
const extraStyles = document.createElement('style');
extraStyles.textContent = `
    .category-badge {
        background: #E0E0E0;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;
    }
    
    .quantity-badge {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 4px;
        background: #32CD32;
        color: white;
        font-weight: bold;
        min-width: 40px;
        text-align: center;
    }
    
    .quantity-badge.low-stock {
        background: #FF4500;
        animation: pulse 2s infinite;
    }
    
    .notify {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
    }
    
    .notify-content {
        flex: 1;
    }
    
    .notify-text {
        display: block;
        margin-bottom: 4px;
    }
    
    .notify-time {
        color: #666;
        font-size: 12px;
    }
    
    .notify-delete {
        background: none;
        border: none;
        color: #999;
        cursor: pointer;
        font-size: 18px;
        padding: 0 4px;
        transition: color 0.2s;
    }
    
    .notify-delete:hover {
        color: #FF4500;
    }
    
    @keyframes highlight {
        0% { background: rgba(30, 144, 255, 0.2); }
        100% { background: transparent; }
    }
    
    .toast-close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }
`;
document.head.appendChild(extraStyles);
