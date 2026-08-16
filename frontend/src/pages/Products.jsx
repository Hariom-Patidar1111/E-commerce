import React from 'react';
import ProductList from '../components/product/ProductList';

const Products = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="container mx-auto px-4 py-8">
                <ProductList />
            </div>
        </div>
    );
};

export default Products;