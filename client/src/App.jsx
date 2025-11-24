import React from 'react';
import ProductList from './components/ProductList';
import PlaceOrder from './components/PlaceOrder';
import OrdersList from './components/OrdersList';

export default function App(){
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Inventory & Order Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <PlaceOrder />
        </div>
        <div className="md:col-span-2 space-y-6">
          <ProductList />
          <OrdersList />
        </div>
      </div>
    </div>
  );
}
