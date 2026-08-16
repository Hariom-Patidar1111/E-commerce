import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
//import { searchProducts, getCartCount, getCartItems } from '../services/api';
import { searchProducts, getCartCount, getCartItems } from "../../services/api";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [cartItems, setCartItems] = useState([]); // ✅ Cart items state
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const searchRef = useRef(null);

    

    // ===== Check login and fetch data =====
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
        if (token) {
            fetchCartCount();
            fetchCartItems(); // ✅ Cart items bhi fetch karo
        }
    }, []);

    // ===== Click outside handler =====
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // ===== Fetch Cart Count =====
    const fetchCartCount = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (userId) {
                const count = await getCartCount(userId);
                setCartCount(count || 0);
            }
        } catch (error) {
            console.error('Error fetching cart count:', error);
        }
    };

    // Navbar.jsx - useEffect ke andar yeh add karo
useEffect(() => {
    window.refreshCartCount = fetchCartCount;
}, []);

    // ===== Fetch Cart Items =====
    const fetchCartItems = async () => {
        try {
            const items = await getCartItems();
            setCartItems(items || []);
            console.log('Cart items loaded:', items.length); // ✅ Debug
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };

    // ===== Live search suggestions =====
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.trim().length < 1) {
                setSuggestions([]);
                setShowSuggestions(false);
                return;
            }

            setLoading(true);
            try {
                const products = await searchProducts(searchQuery.trim());
                setSuggestions(products.slice(0, 5));
                setShowSuggestions(true);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    // ===== Search handler =====
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setShowSuggestions(false);
            setIsMenuOpen(false);
        }
    };

    // ===== Suggestion click =====
    const handleSuggestionClick = (productName) => {
        navigate(`/products?search=${encodeURIComponent(productName)}`);
        setSearchQuery('');
        setShowSuggestions(false);
        setIsMenuOpen(false);
    };

    // ===== Logout =====
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        setIsLoggedIn(false);
        setCartCount(0);
        setCartItems([]);
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
                        <span className="text-2xl">🏠</span>
                        <span className="text-xl font-bold text-gray-800">BuyNest</span>
                    </Link>

                    {/* Search Bar with Suggestions */}
                    <div className="hidden md:flex flex-1 max-w-xl mx-4 relative" ref={searchRef}>
                        <form onSubmit={handleSearch} className="w-full">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                                    className="w-full px-4 py-2 pl-10 pr-20 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                                />
                                <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <button type="submit" className="absolute right-1 top-1 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700">
                                    {loading ? '...' : 'Search'}
                                </button>
                            </div>
                        </form>

                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                                {suggestions.map((product) => (
                                    <div
                                        key={product.id}
                                        onClick={() => handleSuggestionClick(product.name)}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-3"
                                    >
                                        {product.imageUrl && (
                                            <img src={product.imageUrl} alt={product.name} className="w-8 h-8 object-cover rounded" />
                                        )}
                                        <div>
                                            <div className="text-sm font-medium">{product.name}</div>
                                            <div className="text-xs text-gray-500">₹{product.price}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1 flex-shrink-0">
                        <Link to="/" className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg text-sm font-medium">Home</Link>
                        <Link to="/products" className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg text-sm font-medium">Products</Link>
                        <Link to="/cart" className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg text-sm font-medium relative">
                            🛒 Cart
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        {isLoggedIn ? (
                            <button onClick={handleLogout} className="ml-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg text-sm font-medium">
                                Logout
                            </button>
                        ) : (
                            <Link to="/login" className="ml-2 px-4 py-2 bg-gray-800 text-white hover:bg-gray-700 rounded-lg text-sm font-medium">
                                Sign In
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Search Bar */}
                <div className="md:hidden pb-3">
                    <form onSubmit={handleSearch} className="w-full">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 pl-10 pr-20 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                            />
                            <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <button type="submit" className="absolute right-1 top-1 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700">
                                Search
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} bg-white border-t border-gray-200`}>
                <div className="px-4 py-3 space-y-2">
                    <Link to="/" className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg" onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link to="/products" className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg" onClick={() => setIsMenuOpen(false)}>Products</Link>
                    <Link to="/cart" className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg flex justify-between items-center" onClick={() => setIsMenuOpen(false)}>
                        <span>Cart</span>
                        {cartCount > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{cartCount}</span>
                        )}
                    </Link>
                    {isLoggedIn ? (
                        <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg">
                            Logout
                        </button>
                    ) : (
                        <Link to="/login" className="block px-4 py-2 bg-gray-800 text-white rounded-lg text-center font-medium" onClick={() => setIsMenuOpen(false)}>
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;