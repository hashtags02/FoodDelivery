import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const TestAdminAccess = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const makeAdmin = () => {
    if (user) {
      const adminUser = { ...user, role: 'admin' };
      localStorage.setItem('user', JSON.stringify(adminUser));
      // Force a page reload to update the context
      window.location.reload();
    }
  };

  const makeUser = () => {
    if (user) {
      const regularUser = { ...user, role: 'user' };
      localStorage.setItem('user', JSON.stringify(regularUser));
      // Force a page reload to update the context
      window.location.reload();
    }
  };

  if (!user) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Please login first to test admin access</p>
        <button onClick={() => navigate('/login')}>Go to Login</button>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '600px', 
      margin: '0 auto',
      backgroundColor: '#f8fafc',
      borderRadius: '10px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h2>Test Admin Access</h2>
      <div style={{ marginBottom: '20px' }}>
        <p><strong>Current User:</strong> {user.name || user.phone}</p>
        <p><strong>Current Role:</strong> <span style={{ 
          color: user.role === 'admin' ? '#10b981' : '#6b7280',
          fontWeight: 'bold'
        }}>{user.role}</span></p>
      </div>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          onClick={makeAdmin}
          style={{
            padding: '10px 20px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Make Admin
        </button>
        <button 
          onClick={makeUser}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Make User
        </button>
      </div>
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => navigate('/dashboard')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Go to Dashboard
        </button>
        <button 
          onClick={() => navigate('/admin')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Go to Admin Dashboard
        </button>
      </div>
      
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#fef3c7', 
        borderRadius: '5px',
        border: '1px solid #f59e0b'
      }}>
        <p style={{ margin: 0, fontSize: '0.875rem' }}>
          <strong>Note:</strong> This is for testing purposes only. In a real application, 
          user roles should be managed through the backend with proper authentication.
        </p>
      </div>
    </div>
  );
};

export default TestAdminAccess;
