import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui';

export const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Task Tracker Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user?.username}!</span>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      <main className="dashboard-main">
        <div className="dashboard-content">
          <h2>Your Tasks</h2>
          <p>Task functionality will be implemented in the next feature branch.</p>
          
          <div className="user-details">
            <h3>Account Information</h3>
            <p><strong>Username:</strong> {user?.username}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>
          </div>
        </div>
      </main>
    </div>
  );
};