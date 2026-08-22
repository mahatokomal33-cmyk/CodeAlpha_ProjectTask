import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000/api';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    axios.get(`${API}/products/${id}`, { headers }).then(res => setProduct(res.data)).catch(() => navigate('/'));
    axios.get(`${API}/products/${id}/related`).then(res => setRelated(res.data)).catch(() => {});
  }, [id, navigate, token]);

  const addToCart = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      await axios.post(`${API}/cart/add`, { productId: id, quantity }, { headers: { Authorization: `Bearer ${token}` } });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleWishlist = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      await axios.post(`${API}/wishlist/toggle`, { productId: id }, { headers: { Authorization: `Bearer ${token}` } });
      setProduct(prev => ({ ...prev, isWishlisted: !prev.isWishlisted }));
    } catch {}
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewError('');
    if (!user) { navigate('/login'); return; }
    try {
      const res = await axios.post(`${API}/reviews`, { productId: id, ...reviewForm }, { headers: { Authorization: `Bearer ${token}` } });
      setProduct(prev => ({
        ...prev,
        reviews: [res.data, ...prev.reviews],
        avgRating: prev.reviews.length > 0 ? (prev.reviews.reduce((s, r) => s + r.rating, 0) + reviewForm.rating) / (prev.reviews.length + 1) : reviewForm.rating,
        reviewCount: prev.reviewCount + 1
      }));
      setReviewForm({ rating: 5, title: '', comment: '' });
    } catch (err) {
      setReviewError(err.response?.data?.error || 'Failed to submit review');
    }
  };

  const shareProduct = (platform) => {
    const url = window.location.href;
    const text = `Check out ${product.name} at Rs ${product.price.toLocaleString()} on GPM Collection!`;
    if (platform === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
    else if (platform === 'facebook') window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
    else if (platform === 'twitter') window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
    else if (platform === 'copy') { navigator.clipboard.writeText(url); alert('Link copied!'); }
  };

  if (!product) return <div className="loading-screen"><div className="spinner"></div></div>;

  return (
    <div className="container">
      <button className="back-btn" onClick={() => navigate(-1)}>&larr; Back</button>

      <div className="product-detail">
        <div className="detail-left">
          <div className="detail-image">
            <img src={product.image} alt={product.name} />
          </div>
          <div className="detail-actions-row">
            <button className={`btn-action ${product.isWishlisted ? 'wishlisted' : ''}`} onClick={toggleWishlist}>
              {product.isWishlisted ? '\u2764 Saved' : '\u2661 Save'}
            </button>
            <button className="btn-action" onClick={addToCart}>
              {added ? 'Added!' : '\u{1F6D2} Add to Cart'}
            </button>
          </div>
        </div>

        <div className="detail-right">
          <span className="product-category">{product.category}</span>
          <h1>{product.name}</h1>

          <div className="rating-row">
            <span className="rating-badge big">{product.avgRating > 0 ? product.avgRating.toFixed(1) : 'NEW'}</span>
            {product.reviewCount > 0 && <span className="review-count">{product.reviewCount} ratings</span>}
          </div>

          <div className="detail-price-section">
            <span className="detail-price">Rs {product.price.toLocaleString()}</span>
            {product.price > 999 && <span className="free-delivery-tag">Free Delivery</span>}
          </div>

          <p className="detail-desc">{product.description}</p>

          <div className="share-section">
            <span>Share:</span>
            <button className="share-btn whatsapp" onClick={() => shareProduct('whatsapp')}>WhatsApp</button>
            <button className="share-btn facebook" onClick={() => shareProduct('facebook')}>Facebook</button>
            <button className="share-btn twitter" onClick={() => shareProduct('twitter')}>Twitter</button>
            <button className="share-btn copy" onClick={() => shareProduct('copy')}>Copy Link</button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="related-section">
          <div className="related-header">
            <h2>More From This Collection</h2>
            <p>You may also like these picks</p>
          </div>
          <div className="products-grid">
            {related.map(p => (
              <div key={p._id} className="product-card">
                <Link to={`/product/${p._id}`}>
                  <div className="product-image">
                    <img src={p.image} alt={p.name} loading="lazy" />
                    <span className="product-category-badge">{p.category}</span>
                  </div>
                  <div className="product-info">
                    <h3>{p.name}</h3>
                    <p className="product-desc">{p.description}</p>
                    <div className="product-rating">
                      <span className="rating-badge">{p.avgRating > 0 ? p.avgRating.toFixed(1) : 'NEW'}</span>
                      {p.reviewCount > 0 && <span className="review-count">({p.reviewCount})</span>}
                    </div>
                    <div className="product-price-row">
                      <span className="product-price">Rs {p.price.toLocaleString()}</span>
                      {p.price > 999 && <span className="product-shipping">Free Delivery</span>}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="reviews-section">
        <h2>Customer Reviews</h2>

        {user && (
          <form className="review-form" onSubmit={submitReview}>
            <h3>Write a Review</h3>
            {reviewError && <div className="auth-error">{reviewError}</div>}
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} type="button" className={`star ${reviewForm.rating >= star ? 'active' : ''}`}
                  onClick={() => setReviewForm({ ...reviewForm, rating: star })}>&#9733;</button>
              ))}
            </div>
            <input type="text" placeholder="Review title (optional)" value={reviewForm.title} onChange={e => setReviewForm({ ...reviewForm, title: e.target.value })} />
            <textarea placeholder="Write your review..." value={reviewForm.comment} onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })} />
            <button type="submit" className="btn-primary">Submit Review</button>
          </form>
        )}

        {product.reviews?.length === 0 && <p className="no-results">No reviews yet. Be the first to review!</p>}

        {product.reviews?.map(review => (
          <div key={review._id} className="review-card">
            <div className="review-header">
              <span className="reviewer-name">{review.userName}</span>
              <span className="rating-badge">{review.rating} &#9733;</span>
            </div>
            {review.title && <h4>{review.title}</h4>}
            <p>{review.comment}</p>
            <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductDetail;
