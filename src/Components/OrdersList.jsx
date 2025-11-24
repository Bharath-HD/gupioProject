import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../store/ordersSlice';

export default function OrdersList(){
  const dispatch = useDispatch();
  const orders = useSelector(s => s.orders.items);

  useEffect(()=>{ dispatch(fetchOrders()); }, [dispatch]);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="font-semibold mb-2">Orders</h2>
      {orders.length===0 ? <div>No orders yet</div> :
      orders.map(o => (
        <div key={o._id} className="border p-2 mb-2 rounded">
          <div className="flex justify-between">
            <div>Order #{o._id.substring(0,6)}</div>
            <div>{new Date(o.createdAt).toLocaleString()}</div>
          </div>
          <div className="text-sm">
            {o.items.map(it => (
              <div key={it._id || it.productId}>
                {it.productId?.name || it.productId} x {it.qty}
              </div>
            ))}
          </div>
          <div className="mt-1 font-semibold">Total: {o.totalAmount.toFixed(2)}</div>
        </div>
      ))}
    </div>
  );
}
