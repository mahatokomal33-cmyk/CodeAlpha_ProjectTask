import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import BannerSlider from '../components/BannerSlider';

const API = 'http://localhost:5000/api';

function ProductList() {
  const { user, token } = useAuth();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';

  useEffect(() => {
    setCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    let url = `${API}/products`;
    const params = [];
    if (category) params.push(`category=${category}`);
    if (searchQuery) params.push(`search=${searchQuery}`);
    if (sort) params.push(`sort=${sort}`);
    if (params.length) url += '?' + params.join('&');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    axios.get(url, { headers }).then(res => setProducts(res.data)).catch(() => {});
  }, [category, searchQuery, sort, token]);

  const toggleWishlist = async (productId) => {
    if (!user) return;
    try {
      await axios.post(`${API}/wishlist/toggle`, { productId }, { headers: { Authorization: `Bearer ${token}` } });
      setProducts(prev => prev.map(p => p._id === productId ? { ...p, isWishlisted: !p.isWishlisted } : p));
    } catch {}
  };

  const categories = ['', 'Electronics', 'Fashion', 'Home'];
  const sorts = [
    { value: '', label: 'Relevance' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' }
  ];

  return (
    <div className="container homepage">
      {!searchQuery && !categoryParam && <BannerSlider />}
      <div className="page-header">
        <h1>{searchQuery ? `Results for "${searchQuery}"` : category || 'All Products'}</h1>
        <div className="filters-row">
          <div className="filters">
            {categories.map(cat => (
              <button key={cat} className={`filter-btn ${(cat === '' && !category) || cat === category ? 'active' : ''}`}
                onClick={() => setCategory(cat)}>
                {cat || 'All'}
              </button>
            ))}
          </div>
          <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
            {sorts.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      <div className="products-grid">
        {products.map(product => (
          <div key={product._id} className="product-card">
            <Link to={`/product/${product._id}`}>
              <div className="product-image">
                <img src={product.image} alt={product.name} loading="lazy" />
                <span className="product-category-badge">{product.category}</span>
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-desc">{product.description}</p>
                <div className="product-rating">
                  <span className="rating-badge">{product.avgRating > 0 ? product.avgRating.toFixed(1) : 'NEW'}</span>
                  {product.reviewCount > 0 && <span className="review-count">({product.reviewCount})</span>}
                </div>
                <div className="product-price-row">
                  <span className="product-price">Rs {product.price.toLocaleString()}</span>
                  {product.price > 999 && <span className="product-shipping">Free Delivery</span>}
                </div>
              </div>
            </Link>
            <button className={`wishlist-btn ${product.isWishlisted ? 'active' : ''}`} onClick={() => toggleWishlist(product._id)}>
              {product.isWishlisted ? '\u2764' : '\u2661'}
            </button>
          </div>
        ))}
      </div>
      {products.length === 0 && <div className="empty-state"><p>No products found.</p></div>}
    </div>
  );
}

export default ProductList;
