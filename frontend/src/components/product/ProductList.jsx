import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import { getAllProducts } from '../../services/api';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cart, setCart] = useState([]);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
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

    const handleAddToCart = (product) => {
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            setCart(cart.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
        setCartCount(cartCount + 1);
    };

    const handleBuyNow = (product) => {
        alert(`🛒 Proceeding to checkout for ${product.name}`);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-slate-600">Loading products...</p>
            </div>
        );
    }

    if (error) {
        return <div className="text-center py-10 text-red-500 text-lg">{error}</div>;
    }

    return (
        <div>
            {/* Cart Summary */}
            <div className="flex justify-between items-center bg-white p-3 px-5 rounded-xl mb-5 shadow-sm">
                <span className="font-semibold text-slate-800">🛒 Cart: {cartCount} items</span>
                <button 
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all hover:scale-105"
                    onClick={() => console.log('Cart:', cart)}
                >
                    View Cart
                </button>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-slate-800">🛍️ All Products</h2>
                <span className="text-sm text-slate-600 bg-slate-100 px-4 py-1.5 rounded-full">
                    {products.length} products
                </span>
            </div>

            {/* Grid */}
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
    );
};

export default ProductList;