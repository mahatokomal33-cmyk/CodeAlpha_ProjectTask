import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API = 'http://localhost:5000/api';

function Dashboard() {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [summary, setSummary] = useState({});

  useEffect(() => {
    axios.get(`${API}/report`).then(res => {
      const data = res.data;
      setChartData({
        labels: data.map(d => d._id),
        datasets: [{
          label: 'Revenue (Rs)',
          data: data.map(d => d.totalEarning),
          backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'],
          borderRadius: 8,
        }]
      });
    }).catch(() => {});
    axios.get(`${API}/report/summary`).then(res => setSummary(res.data)).catch(() => {});
  }, []);

  return (
    <div className="container">
      <h1>Sales Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">&#8377;</div>
          <h3>Rs {(summary.totalRevenue || 0).toLocaleString()}</h3>
          <p>Total Revenue</p>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">&#128230;</div>
          <h3>{summary.totalOrders || 0}</h3>
          <p>Total Orders</p>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon">&#128241;</div>
          <h3>{summary.totalProducts || 0}</h3>
          <p>Products</p>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon">&#128100;</div>
          <h3>{summary.totalUsers || 0}</h3>
          <p>Customers</p>
        </div>
      </div>
      <div className="chart-container">
        <h2>Product-wise Revenue</h2>
        <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
      </div>
    </div>
  );
}

export default Dashboard;
