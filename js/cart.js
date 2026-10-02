// js/cart.js
// Shopping Cart State Management for NolMart Scents

import { CONFIG } from './config.js';

/**
 * Retrieves the current cart from Local Storage.
 * @returns {Array<Object>}
 */
export function getCart() {
    try {
        const cartJson = localStorage.getItem(CONFIG.STORAGE_KEY);
        return cartJson ? JSON.parse(cartJson) : [];
    } catch (error) {
        console.error("Error reading cart from Local Storage:", error);
        return [];
    }
}

/**
 * Saves cart array to Local Storage and fires event.
 * @param {Array<Object>} cart
 */
export function saveCart(cart) {
    try {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(cart));
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart } }));
    } catch (error) {
        console.error("Error saving cart:", error);
    }
}

/**
 * Adds or increments an item in the cart.
 * An item is uniquely identified by productId + size (e.g. crown-noir_30ml).
 */
export function addItemToCart(product, size = "30ml", quantity = 1) {
    if (!product || !product.id) {
        console.error("Invalid product:", product);
        return getCart();
    }

    const cart = getCart();
    const itemKey = `${product.id}_${size}`;
    const price = product.prices[size] || Object.values(product.prices)[0] || 0;

    const existingIndex = cart.findIndex(item => item.itemKey === itemKey);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({
            itemKey: itemKey,
            id: product.id,
            name: product.name,
            tagline: product.tagline || "",
            size: size,
            price: price,
            category: product.category,
            imageUrl: product.imageUrl || "img/logo-icon.png",
            quantity: quantity
        });
    }

    saveCart(cart);
    return cart;
}

/**
 * Removes an item from the cart.
 */
export function removeItemFromCart(itemKey) {
    let cart = getCart();
    cart = cart.filter(item => item.itemKey !== itemKey);
    saveCart(cart);
    return cart;
}

/**
 * Updates quantity of an item. Removes if <= 0.
 */
export function updateItemQuantity(itemKey, quantity) {
    let cart = getCart();
    const index = cart.findIndex(item => item.itemKey === itemKey);

    if (index > -1) {
        if (quantity <= 0) {
            cart.splice(index, 1);
        } else {
            cart[index].quantity = quantity;
        }
        saveCart(cart);
    }
    return cart;
}

/**
 * Clears entire cart.
 */
export function clearCart() {
    saveCart([]);
}

/**
 * Returns total item count in cart.
 */
export function getCartTotalCount() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Returns grand total price in TZS.
 */
export function getCartTotalPrice() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}
