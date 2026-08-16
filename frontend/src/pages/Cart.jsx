import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCartItems, addToCart, createOrderFromCart, getCartCount } from '../services/api';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cartId, setCartId] = useState(null);
    const [total, setTotal] = useState(0);
    const [ordering, setOrdering] = useState(false); // ✅ Already hai

    // ✅ Ye sab add karo (fetchCartItems, calculateTotal, handleUpdateQuantity, handlePlaceOrder)
    const fetchCartItems = async () => {
        try {
            setLoading(true);
            const items = await getCartItems();
            console.log('Cart items:', items);
            setCartItems(items || []);
            calculateTotal(items || []);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = (items) => {
        let sum = 0;
        items.forEach(item => {
            sum += (item.product?.price || 0) * (item.quantity || 0);
        });
        setTotal(sum);
    };

    const handleUpdateQuantity = async (productId, change) => {
        try {
            await addToCart(cartId, productId, change);
            await fetchCartItems();
            
            // ✅ Count refresh
            if (window.refreshCartCount) {
                await window.refreshCartCount();
            }
            
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handlePlaceOrder = async () => {
        if (!cartId) {
            alert('Please login first');
            return;
        }
        if (cartItems.length === 0) {
            alert('Your cart is empty');
            return;
        }
        
        setOrdering(true);
        try {
            const result = await createOrderFromCart(cartId);
            alert(result);
            setCartItems([]);
            setTotal(0);
            
            // ✅ Count refresh after order
            if (window.refreshCartCount) {
                await window.refreshCartCount();
            }
            
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to place order');
        } finally {
            setOrdering(false);
        }
    };

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            setCartId(userId);
            fetchCartItems();
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return <div className="text-center py-8">Loading cart...</div>;
    }

    if (cartItems.length === 0) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-600">🛒 Your Cart is Empty</h2>
                <Link to="/products" className="text-blue-600 hover:underline mt-4 inline-block">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    {cartItems.map((item) => (
                        <div key={item.id} className="border rounded-lg p-4 mb-4 flex items-center">
                            <img 
                                src={item.product?.imageUrl || 'https://via.placeholder.com/80'} 
                                alt={item.product?.name}
                                className="w-20 h-20 object-cover rounded"
                            />
                            <div className="flex-1 ml-4">
                                <h3 className="font-semibold">{item.product?.name}</h3>
                                <p className="text-gray-600">₹{item.product?.price}</p>
                                <p className="text-sm text-gray-500">Total: ₹{(item.product?.price || 0) * (item.quantity || 0)}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button 
                                    onClick={() => handleUpdateQuantity(item.product?.id, -1)}
                                    className="px-2 py-1 border rounded hover:bg-gray-100"
                                >
                                    -
                                </button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <button 
                                    onClick={() => handleUpdateQuantity(item.product?.id, 1)}
                                    className="px-2 py-1 border rounded hover:bg-gray-100"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-1">
                    <div className="border rounded-lg p-4 sticky top-20">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                        <div className="flex justify-between mb-2">
                            <span>Items ({cartItems.length})</span>
                            <span>₹{total}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span>Shipping</span>
                            <span className="text-green-600">Free</span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                            <div className="flex justify-between font-bold">
                                <span>Total</span>
                                <span>₹{total}</span>
                            </div>
                        </div>
                        <button 
                            onClick={handlePlaceOrder}
                            disabled={ordering}
                            className="w-full bg-gray-800 text-white py-3 rounded-lg mt-4 hover:bg-gray-700 transition-colors disabled:opacity-50"
                        >
                            {ordering ? 'Placing Order...' : 'Place Order 📦'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;