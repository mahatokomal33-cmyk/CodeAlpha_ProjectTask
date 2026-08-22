import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/?search=${search}`);
  };

  const categories = [
    'Electronics', 'Women Fashion', 'Men Fashion', 'Footwear',
    'Beauty', 'Home', 'Sports', 'Kids', 'Accessories', 'Books', 'Grocery'
  ];

  return (
    <>
      <div className="top-strip">
        <div className="container top-strip-inner">
          <span>&#128666; FREE DELIVERY on orders above &#8377;499 &nbsp;|&nbsp; Use code <b>WELCOME10</b> for 10% OFF &nbsp;|&nbsp; &#9733; New Arrivals Daily!</span>
        </div>
      </div>

      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="logo">
            <span className="logo-icon">G</span>
            <span className="logo-text">GPM <span className="logo-accent">Collection</span></span>
          </Link>

          <form className="search-bar" onSubmit={handleSearch}>
            <div className="search-cat-select">
              <select defaultValue="" onChange={e => { if (e.target.value) navigate(`/?category=${e.target.value}`); }}>
                <option value="">All</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <input type="text" placeholder="Search for dresses, electronics, brands..." value={search} onChange={e => setSearch(e.target.value)} />
            <button type="submit">&#128269;</button>
          </form>

          <div className="nav-links">
            {user ? (
              <>
                <div className="nav-user" onClick={() => setMenuOpen(!menuOpen)}>
                  <div className="user-avatar">{user.name?.charAt(0)?.toUpperCase()}</div>
                  <span className="nav-user-name">{user.name?.split(' ')[0]}</span>
                  {menuOpen && (
                    <div className="user-dropdown">
                      <div className="dropdown-header">
                        <div className="dropdown-avatar">{user.name?.charAt(0)?.toUpperCase()}</div>
                        <div>
                          <p className="dropdown-name">{user.name}</p>
                          <p className="dropdown-email">{user.email}</p>
                        </div>
                      </div>
                      <div className="dropdown-divider"></div>
                      <Link to="/profile" onClick={() => setMenuOpen(false)}>&#128100; My Profile</Link>
                      <Link to="/orders" onClick={() => setMenuOpen(false)}>&#128230; My Orders</Link>
                      <Link to="/wishlist" onClick={() => setMenuOpen(false)}>&#9825; My Wishlist</Link>
                      <Link to="/dashboard" onClick={() => setMenuOpen(false)}>&#128202; Dashboard</Link>
                      <Link to="/help" onClick={() => setMenuOpen(false)}>&#127909; Help Videos</Link>
                      <div className="dropdown-divider"></div>
                      <button onClick={() => { logout(); setMenuOpen(false); navigate('/'); }}>&#10140; Logout</button>
                    </div>
                  )}
                </div>
                <Link to="/wishlist" className="nav-icon-link" title="Wishlist">
                  <span className="nav-icon">&#9825;</span>
                  <span className="nav-label">Wishlist</span>
                </Link>
                <Link to="/cart" className="nav-icon-link" title="Cart">
                  <span className="nav-icon">&#128722;</span>
                  <span className="nav-label">Cart</span>
                </Link>
                <Link to="/help" className="nav-icon-link" title="Help">
                  <span className="nav-icon">&#127909;</span>
                  <span className="nav-label">Help</span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/help" className="btn-help">&#127909; Help</Link>
                <Link to="/login" className="btn-login">Login</Link>
                <Link to="/register" className="btn-register">New User? Sign Up</Link>
              </>
            )}
          </div>

          <button className="mobile-menu-btn" onClick={() => setMobileMenu(!mobileMenu)}>&#9776;</button>
        </div>

        <div className="category-bar">
          <div className="container category-bar-inner">
            {categories.map(cat => (
              <Link key={cat} to={`/?category=${cat}`} className="cat-link">{cat}</Link>
            ))}
            <Link to="/?sort=price_low" className="cat-deal">&#128293; Top Deals</Link>
            <Link to="/?sort=newest" className="cat-deal">&#9733; New Arrivals</Link>
          </div>
        </div>

        {mobileMenu && (
          <div className="mobile-menu">
            {categories.map(cat => (
              <Link key={cat} to={`/?category=${cat}`} onClick={() => setMobileMenu(false)}>{cat}</Link>
            ))}
            <Link to="/?sort=price_low" onClick={() => setMobileMenu(false)}>&#128293; Top Deals</Link>
            <Link to="/?sort=newest" onClick={() => setMobileMenu(false)}>&#9733; New Arrivals</Link>
            <Link to="/help" onClick={() => setMobileMenu(false)}>&#127909; Help Videos</Link>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;
