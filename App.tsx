
import React, { useState } from 'react';
import { User } from './types';
import Login from './components/Login';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const renderContent = () => {
    if (!currentUser) {
      return <Login onLoginSuccess={handleLoginSuccess} />;
    }
    if (currentUser.role === 'admin') {
      return <AdminDashboard onLogout={handleLogout} />;
    }
    return <UserDashboard user={currentUser} onLogout={handleLogout} />;
  };

  return (
    <div className="w-full">
      {renderContent()}
    </div>
  );
}

export default App;
