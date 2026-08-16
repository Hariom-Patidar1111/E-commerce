import React, { useState } from 'react';

const Card = ({ product, onAddToCart, onBuyNow }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const handleAddToCart = () => {
        if (product.quantity === 0) {
            showToastMessage('❌ Out of Stock!');
            return;
        }
        if (onAddToCart) onAddToCart(product);
        showToastMessage(`✅ ${product.name} added to cart!`);
    };

    const handleBuyNow = () => {
        if (product.quantity === 0) {
            showToastMessage('❌ Out of Stock!');
            return;
        }
        if (onBuyNow) onBuyNow(product);
        showToastMessage(`🛒 Proceeding to buy ${product.name}...`);
    };

    const showToastMessage = (message) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2500);
    };

    return (
        <>
            <div 
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* ===== Image ===== */}
                <div className="relative overflow-hidden bg-slate-100 pt-[75%]">
                    <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        loading="lazy"
                    />
                    
                    {/* Badges */}
                    {product.quantity === 0 && (
                        <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white bg-red-500 uppercase tracking-wide z-10">
                            Out of Stock
                        </span>
                    )}
                    {product.quantity > 0 && product.quantity <= 5 && (
                        <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white bg-amber-500 animate-pulse z-10">
                            Only {product.quantity} left!
                        </span>
                    )}
                    {product.price > 50000 && (
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r from-purple-500 to-purple-700 z-10">
                            ⭐ Premium
                        </span>
                    )}
                </div>

                {/* ===== Content ===== */}
                <div className="p-4 flex flex-col flex-1">
                    {/* Header */}
                    <div className="flex justify-between items-start gap-2 mb-2">
                        <h3 className="text-base font-semibold text-slate-800 leading-tight flex-1 line-clamp-2">
                            {product.name}
                        </h3>
                        <span className="text-sm font-medium text-slate-500 whitespace-nowrap">
                            {product.brand}
                        </span>
                    </div>

                    {/* Meta */}
                    <div className="flex justify-between items-center mb-2.5 text-sm">
                        <span className="bg-slate-100 px-3 py-0.5 rounded-full text-slate-600 text-xs font-medium">
                            {product.category}
                        </span>
                        <span className={`text-sm font-medium ${product.quantity === 0 ? 'text-red-500' : 'text-green-500'}`}>
                            {product.quantity > 0 ? `🟢 ${product.quantity} in stock` : '🔴 Out of Stock'}
                        </span>
                    </div>

                    {/* Description */}
                    <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-2">
                        {product.description?.substring(0, 80)}...
                    </p>

                    {/* Footer */}
                    <div className="flex flex-col gap-3 pt-3 border-t border-slate-100">
                        {/* Price */}
                        <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-blue-600">
                                ₹{product.price.toLocaleString()}
                            </span>
                            {product.price > 50000 && (
                                <span className="text-sm text-slate-400 line-through">
                                    ₹{(product.price * 1.2).toLocaleString()}
                                </span>
                            )}
                        </div>
                        
                        {/* Buttons */}
                        <div className="flex gap-2.5">
                            <button 
                                className="flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 bg-slate-200 text-slate-800 hover:bg-slate-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleAddToCart}
                                disabled={product.quantity === 0}
                            >
                                🛒 Add to Cart
                            </button>
                            <button 
                                className="flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-700 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleBuyNow}
                                disabled={product.quantity === 0}
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* ===== Hover Overlay ===== */}
                {isHovered && (
                    <div className="absolute inset-0 bg-black/40 flex justify-center items-center gap-3 animate-in fade-in duration-300 z-10">
                        <button 
                            className="px-5 py-2.5 rounded-lg font-semibold bg-white text-slate-800 hover:bg-slate-100 transition-all hover:scale-105"
                            onClick={() => window.location.href = `/product/${product.id}`}
                        >
                            👁️ Quick View
                        </button>
                        <button className="px-5 py-2.5 rounded-lg font-semibold bg-red-500 text-white hover:bg-red-600 transition-all hover:scale-105">
                            ❤️ Wishlist
                        </button>
                    </div>
                )}
            </div>

            {/* ===== Toast ===== */}
            {showToast && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-xl font-medium text-sm z-50 shadow-xl max-w-[90%] animate-in slide-in-from-bottom-5 duration-400">
                    {toastMessage}
                </div>
            )}
        </>
    );
};

export default Card;