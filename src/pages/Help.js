import React, { useState } from 'react';

const videos = [
  {
    id: 1,
    title: 'Getting Started - Full Website Tour',
    desc: 'See how the GPM Collection store works from browsing to checkout.',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  {
    id: 2,
    title: 'Create Account & Login',
    desc: 'Sign up, log in and manage your profile easily.',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
  },
  {
    id: 3,
    title: 'Browse Products & Search',
    desc: 'Find products with filters, categories and search.',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  },
  {
    id: 4,
    title: 'Add to Cart & Checkout',
    desc: 'Place your order with delivery address and payment.',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
  },
  {
    id: 5,
    title: 'Apply Coupon Codes',
    desc: 'Save money with discount coupons at checkout.',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
  },
  {
    id: 6,
    title: 'Track Orders & Sales Dashboard',
    desc: 'Check order history and view the sales dashboard.',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
  }
];

function getEmbedSrc(url) {
  if (url.includes('youtube.com/embed')) return url;
  if (url.includes('youtube.com/watch')) {
    const v = new URL(url).searchParams.get('v');
    if (v) return `https://www.youtube.com/embed/${v}?autoplay=1&rel=0`;
  }
  if (url.includes('youtu.be')) {
    const v = url.split('/').pop()?.split('?')[0];
    if (v) return `https://www.youtube.com/embed/${v}?autoplay=1&rel=0`;
  }
  return null;
}

function Help() {
  const [current, setCurrent] = useState(videos[0]);
  const embedSrc = getEmbedSrc(current.url);

  const selectVideo = (v) => setCurrent(v);

  return (
    <div className="container">
      <div className="help-header">
        <h1>Help Videos</h1>
        <p>Learn how to use GPM Collection with these step-by-step video guides.</p>
      </div>

      <div className="help-layout">
        <div className="help-player">
          {embedSrc ? (
            <iframe
              className="help-frame"
              src={embedSrc}
              title={current.title}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              key={current.id}
              className="help-frame"
              src={current.url}
              controls
              autoPlay
              muted
              playsInline
            />
          )}
          <div className="help-now">
            <span className="help-now-badge">NOW PLAYING</span>
            <h2>{current.title}</h2>
            <p>{current.desc}</p>
          </div>
        </div>

        <div className="help-list">
          {videos.map(v => (
            <button
              key={v.id}
              className={`help-item ${current.id === v.id ? 'active' : ''}`}
              onClick={() => selectVideo(v)}
            >
              <div className="help-item-icon">&#9654;</div>
              <div className="help-item-text">
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Help;
