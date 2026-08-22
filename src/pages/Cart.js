import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000/api';

function Cart() {
  const { token } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const navigate = useNavigate();

  const fetchCart = () => {
    axios.get(`${API}/cart`, { headers: { Authorization: `Bearer ${token}` } }).then(res => setCart(res.data)).catch(() => {});
  };

  useEffect(() => { fetchCart(); }, []);

  const updateQty = async (productId, quantity) => {
    await axios.post(`${API}/cart/update`, { productId, quantity }, { headers: { Authorization: `Bearer ${token}` } });
    fetchCart();
  };

  const removeItem = async (productId) => {
    await axios.post(`${API}/cart/update`, { productId, quantity: 0 }, { headers: { Authorization: `Bearer ${token}` } });
    fetchCart();
  };

  const total = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const savings = cart.items.reduce((s, i) => s + Math.round(i.price * 0.1) * i.quantity, 0);

  if (cart.items.length === 0) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="empty-icon">&#128722;</div>
          <h1>Your Cart is Empty!</h1>
          <p>Add items to it now.</p>
          <Link to="/" className="btn-primary">Shop Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>My Cart ({cart.items.length} items)</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {cart.items.map(item => (
            <div key={item.productId} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="cart-item-info">
                <Link to={`/product/${item.productId}`}><h3>{item.name}</h3></Link>
                <p className="cart-item-price">Rs {item.price.toLocaleString()}</p>
                <p className="cart-item-seller">Seller: GPM Collection</p>
                <div className="cart-item-controls">
                  <button onClick={() => updateQty(item.productId, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQty(item.productId, item.quantity + 1)}>+</button>
                  <button className="remove-btn" onClick={() => removeItem(item.productId)}>REMOVE</button>
                </div>
              </div>
              <div className="cart-item-total">Rs {(item.price * item.quantity).toLocaleString()}</div>
            </div>
          ))}
        </div>

        <div className="cart-sidebar">
          <div className="cart-summary-card">
            <h3>PRICE DETAILS</h3>
            <div className="summary-row"><span>Price ({cart.items.length} items)</span><span>Rs {total.toLocaleString()}</span></div>
            <div className="summary-row"><span>Delivery Charges</span><span className="free">FREE</span></div>
            <div className="summary-row discount"><span>Discount</span><span>- Rs {savings.toLocaleString()}</span></div>
            <div className="summary-row total"><span>Total Amount</span><span>Rs {(total - savings).toLocaleString()}</span></div>
            <p className="savings-text">You will save Rs {savings.toLocaleString()} on this order</p>
            <button className="btn-primary btn-full" onClick={() => navigate('/checkout')}>PLACE ORDER</button>
          </div>
          <div className="coupons-strip">
            <span>&#127991; Apply Coupon</span>
            <span className="coupon-hint">Use WELCOME10 for 10% off</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
