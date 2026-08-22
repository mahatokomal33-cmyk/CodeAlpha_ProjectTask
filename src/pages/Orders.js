import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000/api';

function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get(`${API}/orders`, { headers: { Authorization: `Bearer ${token}` } }).then(res => setOrders(res.data)).catch(() => {});
  }, [token]);

  return (
    <div className="container">
      <h1>My Orders</h1>
      {orders.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">&#128230;</div>
          <h2>No Orders Yet</h2>
          <p>Looks like you haven't placed any orders.</p>
          <Link to="/" className="btn-primary">Start Shopping</Link>
        </div>
      )}
      <div className="orders-list">
        {orders.map(order => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div className="order-id">Order #{order._id.slice(-8).toUpperCase()}</div>
              <span className={`order-status ${order.status}`}>{order.status}</span>
            </div>
            <div className="order-date">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
            <div className="order-items">
              {order.items.map((item, i) => (
                <Link key={i} to={`/product/${item.productId}`} className="order-item-row">
                  <img src={item.image} alt={item.name} className="order-item-img" />
                  <div>
                    <p>{item.name}</p>
                    <span>Qty: {item.quantity} x Rs {item.price.toLocaleString()}</span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="order-footer">
              <span>Delivered to: {order.address}</span>
              <span className="order-total">Total: Rs {(order.finalAmount || order.totalAmount).toLocaleString()}</span>
            </div>
            {order.discount > 0 && <div className="order-discount-tag">Saved Rs {order.discount.toLocaleString()}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
