import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name, phone, avatar });
      setMsg('Profile updated successfully!');
    } catch { setMsg('Failed to update'); }
    setSaving(false);
  };

  return (
    <div className="container">
      <div className="profile-page">
        <h1>My Profile</h1>
        <div className="profile-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar-large">
              {avatar ? <img src={avatar} alt="avatar" /> : name?.charAt(0)?.toUpperCase()}
            </div>
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
          </div>

          <form onSubmit={handleSave} className="profile-form">
            {msg && <div className={msg.includes('success') ? 'coupon-success' : 'auth-error'}>{msg}</div>}
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Email (cannot be changed)</label>
              <input type="email" value={user?.email || ''} disabled />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Avatar URL (optional)</label>
              <input type="url" value={avatar} onChange={e => setAvatar(e.target.value)} placeholder="https://..." />
            </div>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
          </form>

          <div className="profile-links">
            <button onClick={() => navigate('/orders')}>My Orders</button>
            <button onClick={() => navigate('/wishlist')}>My Wishlist</button>
            <button className="logout-btn" onClick={() => { logout(); navigate('/'); }}>Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
