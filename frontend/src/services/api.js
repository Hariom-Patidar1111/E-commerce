import axios from 'axios';

// 👇 APNI BACKEND URL YAHAN DAALO
const API_URL = 'http://172.22.239.81:8081';

// Axios Instance Create
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// ===== Request Interceptor =====
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ===== Response Interceptor =====
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error('API Error:', error.response.status, error.response.data);
            if (error.response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                localStorage.removeItem('username');
                window.location.href = '/login';
            }
        } else if (error.request) {
            console.error('Network Error:', error.request);
        } else {
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

// ==================== PRODUCT APIs ====================

// 1. Get All Products
export const getAllProducts = async () => {
    try {
        const response = await api.get('/product/get');
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

// 2. Get Product by ID
export const getProductById = async (id) => {
    try {
        const response = await api.get(`/product/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
};

// 3. Get Products by Category
export const getProductsByCategory = async (category) => {
    try {
        const response = await api.get(`/product/category/${category}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching products by category:', error);
        throw error;
    }
};

// 4. Search Products
export const searchProducts = async (name) => {
    try {
        if (!name || name.trim() === '') {
            return getAllProducts();
        }
        const response = await api.get(`/product/search?name=${encodeURIComponent(name.trim())}`);
        return response.data;
    } catch (error) {
        console.error('Error searching products:', error);
        throw error;
    }
};

// 5. Add Multiple Products (Admin)
export const addMultipleProducts = async (products) => {
    try {
        const response = await api.post('/product/add', products);
        return response.data;
    } catch (error) {
        console.error('Error adding products:', error);
        throw error;
    }
};

// ==================== AUTH APIs ====================

// 6. Login
export const login = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', response.data.name);
            localStorage.setItem('email', response.data.email);
            localStorage.setItem('role', response.data.role);
            localStorage.setItem('userId', response.data.id);
        }
        
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

// 7. Register
export const register = async (userData) => {
    try {
        const response = await api.post('/auth/sign', userData);
        return response.data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

// 8. Logout
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    window.location.href = '/';
};

// 9. Get User Profile
export const getUserProfile = async (id) => {
    try {
        const response = await api.get(`/user/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};

// ==================== CART APIs ====================

// ==================== CART APIs ====================

// 1. Add to Cart - ✅ Sahi
export const addToCart = async (cartId, productId, quantity = 1) => {
    try {
        const response = await api.post(`/product/add/${cartId}/${productId}/${quantity}`);
        return response.data;
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
    }
};

// 2. Get Cart Items - ✅ Sahi
export const getCartItems = async () => {
    try {
        const response = await api.get('/product/cartItem');
        return response.data;
    } catch (error) {
        console.error('Error fetching cart items:', error);
        throw error;
    }
};

// 3. Get Cart Count - ✅ Fixed
export const getCartCount = async (cartId) => {
    try {
        const response = await api.post(`/product/count/${cartId}`);  // ✅ "count"
        return response.data;
    } catch (error) {
        console.error('Error fetching cart count:', error);
        throw error;
    }
};

// 4. Get Cart ID - Agar chahiye toh
export const getCartId = async (userId) => {
    try {
        const response = await api.post(`/product/cartId/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching cart ID:', error);
        throw error;
    }
};

// ==================== ORDER APIs ====================

// 5. Create Order from Cart
export const createOrderFromCart = async (cartId) => {
    try {
        const response = await api.post(`/order/create-from-cart/${cartId}`);
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

// 6. Create Direct Order
export const createDirectOrder = async (productId, quantity) => {
    try {
        const response = await api.post(`/order/create/${productId}/${quantity}`);
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};