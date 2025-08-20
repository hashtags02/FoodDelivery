import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Dummy data for restaurants
  const [restaurants, setRestaurants] = useState([
    {
      id: 1,
      name: "Pizza Palace",
      location: "Downtown",
      totalOrders: 156,
      status: "pending",
      owner: "John Doe",
      phone: "+1-555-0123",
      cuisine: "Italian"
    },
    {
      id: 2,
      name: "Burger House",
      location: "Westside",
      totalOrders: 89,
      status: "approved",
      owner: "Jane Smith",
      phone: "+1-555-0124",
      cuisine: "American"
    },
    {
      id: 3,
      name: "Sushi Express",
      location: "Eastside",
      totalOrders: 234,
      status: "blocked",
      owner: "Mike Johnson",
      phone: "+1-555-0125",
      cuisine: "Japanese"
    },
    {
      id: 4,
      name: "Taco Corner",
      location: "Southside",
      totalOrders: 67,
      status: "pending",
      owner: "Sarah Wilson",
      phone: "+1-555-0126",
      cuisine: "Mexican"
    },
    {
      id: 5,
      name: "Curry House",
      location: "Northside",
      totalOrders: 189,
      status: "approved",
      owner: "Raj Patel",
      phone: "+1-555-0127",
      cuisine: "Indian"
    }
  ]);

  // Dummy data for orders
  const [orders, setOrders] = useState([
    {
      id: "ORD001",
      customerName: "Alice Brown",
      restaurant: "Pizza Palace",
      items: ["Margherita Pizza", "Garlic Bread"],
      total: 24.99,
      status: "delivered",
      orderDate: "2024-01-15"
    },
    {
      id: "ORD002",
      customerName: "Bob Davis",
      restaurant: "Burger House",
      items: ["Classic Burger", "French Fries"],
      total: 18.50,
      status: "in_progress",
      orderDate: "2024-01-15"
    },
    {
      id: "ORD003",
      customerName: "Carol White",
      restaurant: "Sushi Express",
      items: ["California Roll", "Miso Soup"],
      total: 32.75,
      status: "pending",
      orderDate: "2024-01-15"
    }
  ]);

  const [activeTab, setActiveTab] = useState('restaurants');
  const [showOrders, setShowOrders] = useState(false);

  // Handle restaurant approval
  const handleApproveRestaurant = (restaurantId) => {
    setRestaurants(prev => 
      prev.map(restaurant => 
        restaurant.id === restaurantId 
          ? { ...restaurant, status: 'approved' }
          : restaurant
      )
    );
  };

  // Handle restaurant block/unblock
  const handleToggleBlockRestaurant = (restaurantId) => {
    setRestaurants(prev => 
      prev.map(restaurant => 
        restaurant.id === restaurantId 
          ? { 
              ...restaurant, 
              status: restaurant.status === 'blocked' ? 'approved' : 'blocked' 
            }
          : restaurant
      )
    );
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'blocked':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'pending':
        return 'Pending';
      case 'blocked':
        return 'Blocked';
      default:
        return status;
    }
  };

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <h1>Access Denied</h1>
        <p>You don't have permission to access the admin dashboard.</p>
        <button 
          onClick={() => navigate('/')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#3B82F6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <Navbar />
      
      <div className="admin-container">
        <div className="admin-header">
          <div className="admin-title">
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {user.name || 'Admin'}!</p>
          </div>
          <div className="admin-actions">
            <button 
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="admin-stats">
          <div className="stat-card">
            <h3>Total Restaurants</h3>
            <p>{restaurants.length}</p>
          </div>
          <div className="stat-card">
            <h3>Pending Approvals</h3>
            <p>{restaurants.filter(r => r.status === 'pending').length}</p>
          </div>
          <div className="stat-card">
            <h3>Total Orders</h3>
            <p>{orders.length}</p>
          </div>
          <div className="stat-card">
            <h3>Active Users</h3>
            <p>1,234</p>
          </div>
        </div>

        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'restaurants' ? 'active' : ''}`}
            onClick={() => setActiveTab('restaurants')}
          >
            Restaurants
          </button>
          <button 
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
        </div>

        {activeTab === 'restaurants' && (
          <div className="restaurants-section">
            <h2>Restaurant Management</h2>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Owner</th>
                    <th>Cuisine</th>
                    <th>Total Orders</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {restaurants.map(restaurant => (
                    <tr key={restaurant.id}>
                      <td>{restaurant.id}</td>
                      <td>{restaurant.name}</td>
                      <td>{restaurant.location}</td>
                      <td>{restaurant.owner}</td>
                      <td>{restaurant.cuisine}</td>
                      <td>{restaurant.totalOrders}</td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(restaurant.status) }}
                        >
                          {getStatusText(restaurant.status)}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {restaurant.status === 'pending' && (
                            <button 
                              className="approve-btn"
                              onClick={() => handleApproveRestaurant(restaurant.id)}
                            >
                              Approve
                            </button>
                          )}
                          <button 
                            className={restaurant.status === 'blocked' ? 'unblock-btn' : 'block-btn'}
                            onClick={() => handleToggleBlockRestaurant(restaurant.id)}
                          >
                            {restaurant.status === 'blocked' ? 'Unblock' : 'Block'}
                          </button>
                          <button 
                            className="view-btn"
                            onClick={() => setShowOrders(true)}
                          >
                            View Orders
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-section">
            <h2>Order Management</h2>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Restaurant</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Order Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.customerName}</td>
                      <td>{order.restaurant}</td>
                      <td>{order.items.join(', ')}</td>
                      <td>${order.total}</td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ 
                            backgroundColor: 
                              order.status === 'delivered' ? '#10B981' :
                              order.status === 'in_progress' ? '#F59E0B' :
                              order.status === 'pending' ? '#6B7280' : '#6B7280'
                          }}
                        >
                          {order.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td>{order.orderDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Modal */}
        {showOrders && (
          <div className="modal-overlay" onClick={() => setShowOrders(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Restaurant Orders</h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowOrders(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 3).map(order => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.customerName}</td>
                        <td>{order.items.join(', ')}</td>
                        <td>${order.total}</td>
                        <td>
                          <span 
                            className="status-badge"
                            style={{ 
                              backgroundColor: 
                                order.status === 'delivered' ? '#10B981' :
                                order.status === 'in_progress' ? '#F59E0B' :
                                order.status === 'pending' ? '#6B7280' : '#6B7280'
                            }}
                          >
                            {order.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
