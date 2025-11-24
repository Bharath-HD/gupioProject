import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/productsSlice';
import { createOrder, fetchOrders } from '../store/ordersSlice';

export default function PlaceOrder(){
  const dispatch = useDispatch();
  const products = useSelector(s => s.products.items);
  const [items, setItems] = useState([{ productId: '', qty: 1 }]);
  const [message, setMessage] = useState('');

  useEffect(()=>{ dispatch(fetchProducts()); }, [dispatch]);

  const handleItemChange = (idx, field, val) => {
    const copy = [...items];
    copy[idx][field] = field === 'qty' ? Number(val) : val;
    setItems(copy);
  };
  const addRow = () => setItems(prev => [...prev, {productId:'', qty:1}]);
  const removeRow = idx => setItems(prev => prev.filter((_,i)=>i!==idx));

  const submit = async () => {
    try{
      setMessage('');
      const cleaned = items.filter(i=>i.productId && i.qty>0);
      if(!cleaned.length) return setMessage('Add at least one product');
      const res = await dispatch(createOrder({ items: cleaned })).unwrap();
      setMessage('Order placed!');
      dispatch(fetchOrders());
      setItems([{ productId:'', qty:1 }]);
    }catch(err){
      setMessage('Error: ' + err);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="font-semibold mb-2">Place Order</h2>
      {items.map((it, idx) => (
        <div key={idx} className="flex gap-2 mb-2">
          <select className="flex-1 border px-2" value={it.productId}
            onChange={e=>handleItemChange(idx,'productId', e.target.value)}>
            <option value="">-- select product --</option>
            {products.map(p => <option value={p._id} key={p._id}>{p.name} (stock: {p.stock})</option>)}
          </select>
          <input type="number" className="w-20 border px-2" min="1" value={it.qty}
            onChange={e=>handleItemChange(idx,'qty', e.target.value)} />
          <button className="px-2" onClick={()=>removeRow(idx)}>Remove</button>
        </div>
      ))}
      <div className="flex gap-2">
        <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={addRow}>Add product</button>
        <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={submit}>Place Order</button>
      </div>
      {message && <div className="mt-2 text-sm">{message}</div>}
    </div>
  );
}
