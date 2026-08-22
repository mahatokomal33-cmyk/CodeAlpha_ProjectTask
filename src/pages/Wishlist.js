import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000/api';

function Wishlist() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);

  const fetchWishlist = () => {
    axios.get(`${API}/wishlist`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setItems(res.data.items || [])).catch(() => {});
  };

  useEffect(() => { fetchWishlist(); }, []);

  const removeWishlist = async (productId) => {
    await axios.post(`${API}/wishlist/toggle`, { productId }, { headers: { Authorization: `Bearer ${token}` } });
    setItems(prev => prev.filter(p => p._id !== productId));
  };

  const moveToCart = async (productId) => {
    await axios.post(`${API}/cart/add`, { productId, quantity: 1 }, { headers: { Authorization: `Bearer ${token}` } });
    removeWishlist(productId);
  };

  if (items.length === 0) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="empty-icon">&#9825;</div>
          <h2>Your Wishlist is Empty</h2>
          <p>Save items that you like in your wishlist.</p>
          <Link to="/" className="btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>My Wishlist ({items.length})</h1>
      <div className="wishlist-grid">
        {items.map(product => (
          <div key={product._id} className="wishlist-card">
            <button className="wishlist-remove" onClick={() => removeWishlist(product._id)}>&times;</button>
            <Link to={`/product/${product._id}`}>
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <span className="product-price">Rs {product.price.toLocaleString()}</span>
            </Link>
            <button className="btn-primary btn-sm" onClick={() => moveToCart(product._id)}>Move to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wishlist;
