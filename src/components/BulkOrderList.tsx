import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { notify } from '../services/notificationService';

interface BulkOrder {
  id: string;
  produce_type: string;
  quantity: number;
  status: string;
  unit: string;
}

interface BulkOrderListProps {
  onSelect?: (order: BulkOrder) => void;
}

export default function BulkOrderList({ onSelect }: BulkOrderListProps) {
  const [orders, setOrders] = useState<BulkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [prevOrders, setPrevOrders] = useState<BulkOrder[]>([]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    const fetchOrders = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('bulk_orders').select('*');
      
      if (error) {
        console.error('Error fetching bulk orders:', error);
        setLoading(false);
        return;
      }

      const typedOrders = data as BulkOrder[];
      setOrders(typedOrders || []);
      setLoading(false);
      
      // Notify on new orders or status changes
      if (prevOrders.length > 0 && typedOrders) {
        typedOrders.forEach(order => {
          const prev = prevOrders.find(o => o.id === order.id);
          if (!prev) {
            notify({ type: 'bulk_order_new', title: 'New Bulk Order', description: `${order.produce_type} (${order.quantity} units)` });
          } else if (prev.status !== order.status) {
            notify({ type: 'bulk_order_status', title: 'Order Status Updated', description: `${order.produce_type}: ${order.status}` });
          }
        });
      }
      setPrevOrders(typedOrders || []);
    };
    
    fetchOrders();
    intervalId = setInterval(fetchOrders, 5000); // Poll every 5 seconds
    return () => clearInterval(intervalId);
  }, [prevOrders]);

  return (
    <div className="bg-card rounded shadow p-4 max-w-2xl mx-auto mt-4">
      <h2 className="text-lg font-bold mb-2">Open Bulk Orders</h2>
      {loading ? (
        <div>Loading...</div>
      ) : orders.length === 0 ? (
        <div className="text-muted-foreground">No bulk orders found.</div>
      ) : (
        <ul className="divide-y divide-border">
          {orders.map(order => (
            <li key={order.id} className="py-2 flex justify-between items-center">
              <div>
                <span className="font-semibold">{order.produce_type}</span> - {order.quantity} {order.unit}
                <span className="ml-2 text-xs text-muted-foreground">Status: {order.status}</span>
              </div>
              {onSelect && (
                <button 
                  className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90" 
                  onClick={() => onSelect(order)}
                >
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