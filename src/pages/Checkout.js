import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000/api';

function Checkout() {
  const { token } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [couponError, setCouponError] = useState('');
  const [ordered, setOrdered] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API}/cart`, { headers: { Authorization: `Bearer ${token}` } }).then(res => {
      if (res.data.items.length === 0) navigate('/cart');
      setCart(res.data);
    });
  }, [navigate, token]);

  const applyCoupon = async () => {
    setCouponError('');
    setCouponMsg('');
    setDiscount(0);
    if (!couponCode.trim()) return;
    try {
      const total = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
      const res = await axios.post(`${API}/coupons/validate`, { code: couponCode, cartTotal: total }, { headers: { Authorization: `Bearer ${token}` } });
      setDiscount(res.data.discount);
      setCouponMsg(`Coupon applied! You save Rs ${res.data.discount.toLocaleString()}`);
    } catch (err) {
      setCouponError(err.response?.data?.error || 'Invalid coupon');
    }
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/orders/checkout`, { address, phone, couponCode, discount }, { headers: { Authorization: `Bearer ${token}` } });
      setOrdered(true);
    } catch (err) {
      alert(err.response?.data?.error || 'Error placing order');
    }
    setLoading(false);
  };

  if (ordered) {
    return (
      <div className="container">
        <div className="empty-state order-success">
          <div className="success-icon">&#10004;</div>
          <h1>Order Placed Successfully!</h1>
          <p>Thank you for shopping with GPM Collection.</p>
          <div className="success-actions">
            <button className="btn-primary" onClick={() => navigate('/orders')}>View Orders</button>
            <button className="btn-outline" onClick={() => navigate('/')}>Continue Shopping</button>
          </div>
        </div>
      </div>
    );
  }

  const total = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const finalTotal = total - discount;

  return (
    <div className="container">
      <h1>Checkout</h1>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={placeOrder}>
          <div className="checkout-section">
            <h2>&#128205; Delivery Address</h2>
            <div className="form-group">
              <textarea value={address} onChange={e => setAddress(e.target.value)} required placeholder="Enter full delivery address (area, city, state, pincode)" />
            </div>
          </div>
          <div className="checkout-section">
            <h2>&#128222; Contact</h2>
            <div className="form-group">
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required placeholder="Enter phone number" />
            </div>
          </div>
          <div className="checkout-section">
            <h2>&#127991; Coupon</h2>
            <div className="coupon-input-row">
              <input type="text" placeholder="Enter coupon code" value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} />
              <button type="button" className="btn-apply" onClick={applyCoupon}>APPLY</button>
            </div>
            {couponMsg && <p className="coupon-success">{couponMsg}</p>}
            {couponError && <p className="coupon-error-text">{couponError}</p>}
            <div className="available-coupons">
              <p>Available coupons:</p>
              <button type="button" className="coupon-chip" onClick={() => { setCouponCode('WELCOME10'); }}>WELCOME10</button>
              <button type="button" className="coupon-chip" onClick={() => { setCouponCode('SAVE500'); }}>SAVE500</button>
              <button type="button" className="coupon-chip" onClick={() => { setCouponCode('MEGA20'); }}>MEGA20</button>
            </div>
          </div>
          <button type="submit" className="btn-primary btn-full btn-place-order" disabled={loading}>
            {loading ? 'Placing Order...' : `PAY Rs ${finalTotal.toLocaleString()}`}
          </button>
        </form>

        <div className="order-summary">
          <h2>Order Summary</h2>
          {cart.items.map(item => (
            <div key={item.productId} className="summary-item">
              <div className="summary-item-left">
                <img src={item.image} alt={item.name} />
                <div>
                  <p>{item.name}</p>
                  <span>Qty: {item.quantity}</span>
                </div>
              </div>
              <span>Rs {(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="summary-divider"></div>
          <div className="summary-row"><span>Subtotal</span><span>Rs {total.toLocaleString()}</span></div>
          {discount > 0 && <div className="summary-row discount"><span>Discount</span><span>- Rs {discount.toLocaleString()}</span></div>}
          <div className="summary-row"><span>Delivery</span><span className="free">FREE</span></div>
          <div className="summary-divider"></div>
          <div className="summary-row total"><span>Total</span><span>Rs {finalTotal.toLocaleString()}</span></div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
