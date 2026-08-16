import { useEffect, useState } from "react";
import axios from "axios";
import { getAllProducts, addToCart } from "../services/api"; // ✅ API import

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [cartId, setCartId] = useState(null);
  const [adding, setAdding] = useState({});

  useEffect(() => {
    // ✅ Get cartId from localStorage
    const userId = localStorage.getItem('userId');
    if (userId) {
      setCartId(userId);
    }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts(); // ✅ Using service
      setProducts(data);
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ Add to Cart function
  const handleAddToCart = async (productId) => {
    if (!cartId) {
      alert('Please login first');
      return;
    }

    setAdding(prev => ({ ...prev, [productId]: true }));
    try {
      await addToCart(cartId, productId, 1);
      alert('🛒 Added to cart!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add to cart');
    } finally {
      setAdding(prev => ({ ...prev, [productId]: false }));
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-6">
      
      <h1 className="text-3xl font-bold text-center mb-8">
        Featured Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">

        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
          >

            <img
              src={product.imageUrl || 'https://via.placeholder.com/300x200'}
              alt={product.name}
              className="w-full h-48 object-cover"
            />

            <div className="p-5">

              <p className="text-sm text-gray-500">
                {product.category || 'Uncategorized'}
              </p>

              <h2 className="text-xl font-semibold mt-1">
                {product.name}
              </h2>

              <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                {product.description || 'No description available'}
              </p>

              <div className="flex justify-between items-center mt-4">

                <span className="text-xl font-bold">
                  ₹{product.price}
                </span>

                <span className={`text-sm ${product.quantity > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {product.quantity > 0 ? `Stock: ${product.quantity}` : 'Out of Stock'}
                </span>

              </div>

              <button
                onClick={() => handleAddToCart(product.id)}
                disabled={product.quantity <= 0 || adding[product.id]}
                className="w-full mt-4 bg-black text-white py-2.5 rounded-xl hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {adding[product.id] ? 'Adding...' : 'Add to Cart'}
              </button>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default FeaturedProducts;