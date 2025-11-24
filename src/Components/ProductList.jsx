import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/productsSlice';

export default function ProductList(){
  const dispatch = useDispatch();
  const products = useSelector(s => s.products.items);

  useEffect(()=>{ dispatch(fetchProducts()); }, [dispatch]);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="font-semibold mb-2">Products</h2>
      <table className="w-full text-sm">
        <thead>
          <tr><th className="text-left">Name</th><th>Price</th><th>Stock</th></tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id} className="border-t">
              <td>{p.name}</td>
              <td>{p.price.toFixed(2)}</td>
              <td>
                <span className={p.stock <= 5 ? 'text-red-600 font-bold' : ''}>
                  {p.stock}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
