import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function ChatWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { from: 'support', text: 'Hi! Welcome to GPM Collection. How can I help you today?', time: new Date() }
  ]);
  const messagesEnd = useRef();

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickReplies = [
    'Where is my order?',
    'Return policy?',
    'Payment methods?',
    'Track my order'
  ];

  const getBotReply = (msg) => {
    const lower = msg.toLowerCase();
    if (lower.includes('order') && lower.includes('where')) return 'You can track your order from the "My Orders" page. All orders with tracking info will show real-time status.';
    if (lower.includes('return')) return 'We offer 7-day easy return policy. Go to My Orders, select the order and click "Return Item".';
    if (lower.includes('payment')) return 'We accept UPI, Credit/Debit Cards, Net Banking, Wallets (Paytm, PhonePe) and Cash on Delivery.';
    if (lower.includes('track')) return 'Go to My Orders page and click on any order to see its delivery tracking status.';
    if (lower.includes('cancel')) return 'You can cancel an order within 1 hour of placing it from the My Orders page.';
    if (lower.includes('coupon') || lower.includes('discount')) return 'Use code WELCOME10 for 10% off (max Rs 2000). Also try SAVE500, MEGA20, FLAT1000.';
    if (lower.includes('hello') || lower.includes('hi')) return 'Hello! Welcome to GPM Collection. How can I assist you?';
    return 'Thank you for reaching out! Our team will get back to you shortly. Meanwhile, you can check FAQs or browse our help center.';
  };

  const send = (text) => {
    const msg = text || message;
    if (!msg.trim()) return;
    setMessages(prev => [...prev, { from: 'user', text: msg, time: new Date() }]);
    setMessage('');
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'support', text: getBotReply(msg), time: new Date() }]);
    }, 800);
  };

  if (!open) {
    return (
      <button className="chat-fab" onClick={() => setOpen(true)}>
        <span className="chat-fab-icon">&#128172;</span>
        <span className="chat-fab-badge">1</span>
      </button>
    );
  }

  return (
    <div className="chat-widget">
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-avatar">E</div>
          <div>
            <h4>GPM Collection Support</h4>
            <span className="chat-status">Online</span>
          </div>
        </div>
        <button className="chat-close" onClick={() => setOpen(false)}>&times;</button>
      </div>
      <div className="chat-body">
        {messages.map((m, i) => (
          <div key={i} className={`chat-msg ${m.from === 'user' ? 'user' : 'support'}`}>
            <div className="chat-bubble">{m.text}</div>
            <span className="chat-time">{new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        ))}
        <div ref={messagesEnd} />
      </div>
      <div className="chat-quick-replies">
        {quickReplies.map((qr, i) => (
          <button key={i} className="quick-reply-btn" onClick={() => send(qr)}>{qr}</button>
        ))}
      </div>
      <div className="chat-footer">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
        />
        <button className="chat-send" onClick={() => send()}>&#10148;</button>
      </div>
    </div>
  );
}

export default ChatWidget;
