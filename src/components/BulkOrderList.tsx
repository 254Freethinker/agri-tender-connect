import React, { useEffect, useState } from 'react';
import { getBulkOrders } from '../services/BulkOrderService';
import { notify } from '../services/notificationService';

export default function BulkOrderList({ onSelect }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prevOrders, setPrevOrders] = useState([]);

  useEffect(() => {
    let intervalId;
    const fetchOrders = async () => {
      setLoading(true);
      const { data } = await getBulkOrders();
      setOrders(data || []);
      setLoading(false);
      // Notify on new orders or status changes
      if (prevOrders.length > 0 && data) {
        data.forEach(order => {
          const prev = prevOrders.find(o => o.id === order.id);
          if (!prev) {
            notify({ type: 'bulk_order_new', title: 'New Bulk Order', description: `${order.product_type} (${order.quantity} ${order.unit})` });
          } else if (prev.status !== order.status) {
            notify({ type: 'bulk_order_status', title: 'Order Status Updated', description: `${order.product_type}: ${order.status}` });
          }
        });
      }
      setPrevOrders(data || []);
    };
    fetchOrders();
    intervalId = setInterval(fetchOrders, 5000); // Poll every 5 seconds
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-white rounded shadow p-4 max-w-2xl mx-auto mt-4">
      <h2 className="text-lg font-bold mb-2">Open Bulk Orders</h2>
      {loading ? (
        <div>Loading...</div>
      ) : orders.length === 0 ? (
        <div className="text-gray-500">No bulk orders found.</div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {orders.map(order => (
            <li key={order.id} className="py-2 flex justify-between items-center">
              <div>
                <span className="font-semibold">{order.product_type}</span> - {order.quantity} {order.unit}
                <span className="ml-2 text-xs text-gray-500">Status: {order.status}</span>
              </div>
              {onSelect && (
                <button className="btn btn-sm btn-outline" onClick={() => onSelect(order)}>
                  View
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
