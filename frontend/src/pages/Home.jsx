import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts, addToCart, getCartCount } from '../services/api';
import Card from '../components/common/Card';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cartCount, setCartCount] = useState(0);
    const [cartId, setCartId] = useState(null);

    // ===== Check login and fetch =====
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            setCartId(userId);
            fetchCartCount(userId);
        }
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await getAllProducts();
            setProducts(data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load products');
            setLoading(false);
        }
    };

    const fetchCartCount = async (userId) => {
        try {
            const count = await getCartCount(userId);
            setCartCount(count || 0);
        } catch (error) {
            console.error('Error fetching cart count:', error);
        }
    };

    // ===== Add to Cart - Real API =====
    const handleAddToCart = async (product) => {
        if (!cartId) {
            alert('Please login first');
            return;
        }

        try {
            await addToCart(cartId, product.id, 1);
            setCartCount(prev => prev + 1);
            alert(`🛒 ${product.name} added to cart!`);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to add to cart');
        }
    };

    // ===== Buy Now =====
    const handleBuyNow = (product) => {
        if (!cartId) {
            alert('Please login first');
            return;
        }
        // Add to cart then redirect
        handleAddToCart(product);
        // Redirect after add
        setTimeout(() => window.location.href = '/cart', 500);
    };

    // ===== Loading State =====
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
        );
    }

    // ===== Error State =====
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center py-10">
                    <p className="text-red-500 text-lg">{error}</p>
                    <button 
                        onClick={fetchProducts}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // ===== Render =====
    return (
        <div className="min-h-screen bg-gray-50">
            
            {/* ===== Hero Section ===== */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        🏠 Welcome to BuyNest
                    </h1>
                    <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                        Discover amazing products at unbeatable prices. 
                        {products.length} products available!
                    </p>
                    <Link 
                        to="/products" 
                        className="inline-block px-8 py-3 bg-white text-gray-800 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200"
                    >
                        Shop Now
                    </Link>
                </div>
            </div>

            {/* ===== Cart Summary ===== */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                <div className="flex justify-between items-center bg-white p-3 px-5 rounded-xl shadow-sm">
                    <span className="font-semibold text-gray-800">🛒 Cart: {cartCount} items</span>
                    <Link 
                        to="/cart"
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all hover:scale-105"
                    >
                        View Cart
                    </Link>
                </div>
            </div>

            {/* ===== Categories Section ===== */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                    Shop by Category
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Electronics', 'Fashion', 'Home & Living', 'Books'].map((category) => (
                        <Link 
                            key={category}
                            to="/products"
                            className="bg-white p-6 rounded-lg text-center border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-200"
                        >
                            <div className="text-4xl mb-2">
                                {category === 'Electronics' && '💻'}
                                {category === 'Fashion' && '👕'}
                                {category === 'Home & Living' && '🏠'}
                                {category === 'Books' && '📚'}
                            </div>
                            <h3 className="font-semibold text-gray-800">{category}</h3>
                        </Link>
                    ))}
                </div>
            </div>

            {/* ===== All Products Section ===== */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">
                        🛍️ All Products
                    </h2>
                    <span className="text-sm text-gray-600 bg-white px-4 py-1.5 rounded-full shadow-sm">
                        {products.length} products
                    </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {products.map((product) => (
                        <Card 
                            key={product.id} 
                            product={product}
                            onAddToCart={handleAddToCart}
                            onBuyNow={handleBuyNow}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;