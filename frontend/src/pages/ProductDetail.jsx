import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById, addToCart, getCartCount } from '../services/api'; // ✅ getCartCount add karo

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const [cartId, setCartId] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            setCartId(userId);
        }
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const data = await getProductById(id);
            setProduct(data);
            setLoading(false);
        } catch (err) {
            setError('Product not found');
            setLoading(false);
        }
    };

    // ✅ Ek hi handleAddToCart function rakho
    const handleAddToCart = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert('Please login first');
            navigate('/login');
            return;
        }

        setAdding(true);
        try {
            const result = await addToCart(userId, product.id, quantity);
            alert(result || `🛒 Added ${quantity} x ${product?.name} to cart!`);
            
            // ✅ Count refresh - Navbar count update ke liye
            if (window.refreshCartCount) {
                await window.refreshCartCount();
            }
            
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to add to cart');
        } finally {
            setAdding(false);
        }
    };

    const handleBuyNow = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert('Please login first');
            navigate('/login');
            return;
        }

        try {
            await addToCart(userId, product.id, quantity);
            navigate('/cart');
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to add to cart');
        }
    };

    // Rest of the code...
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <p className="text-red-500 text-lg">{error || 'Product not found'}</p>
                <Link to="/" className="mt-4 text-blue-600 hover:underline">
                    ← Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link 
                    to="/products" 
                    className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
                >
                    ← Back to Products
                </Link>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
                        {/* Image */}
                        <div className="bg-gray-100 rounded-xl overflow-hidden">
                            <img 
                                src={product.imageUrl || 'https://via.placeholder.com/400x400'} 
                                alt={product.name}
                                className="w-full h-96 object-cover"
                            />
                        </div>

                        {/* Info */}
                        <div className="flex flex-col">
                            <div className="flex items-start justify-between">
                                <h1 className="text-3xl font-bold text-gray-800">
                                    {product.name}
                                </h1>
                                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                    {product.brand || 'General'}
                                </span>
                            </div>

                            <div className="mt-2 flex items-center gap-3">
                                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                                    {product.category || 'Uncategorized'}
                                </span>
                                <span className={`text-sm font-medium ${product.quantity <= 0 ? 'text-red-500' : 'text-green-500'}`}>
                                    {product.quantity > 0 ? `🟢 ${product.quantity} in stock` : '🔴 Out of Stock'}
                                </span>
                            </div>

                            <div className="mt-4">
                                <span className="text-4xl font-bold text-blue-600">
                                    ₹{product.price?.toLocaleString()}
                                </span>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-sm font-semibold text-gray-700">Description</h3>
                                <p className="mt-2 text-gray-600 leading-relaxed">
                                    {product.description || 'No description available'}
                                </p>
                            </div>

                            {/* Quantity Selector */}
                            <div className="mt-6 flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-8 h-8 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all"
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center font-semibold">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.quantity || 10, quantity + 1))}
                                        className="w-8 h-8 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.quantity <= 0 || adding}
                                    className="flex-1 py-3 px-6 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {adding ? 'Adding...' : '🛒 Add to Cart'}
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    disabled={product.quantity <= 0}
                                    className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:scale-105 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;