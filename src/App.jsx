import React from 'react';
import Dashboard from './pages/Dashboard';
import ToastNotifications from './components/ToastNotifications';
import NotificationDemo from './components/NotificationDemo';

function App() {
  return (
    <div className="App">
      <Dashboard />
      <ToastNotifications />
      <NotificationDemo />
    </div>
  );
}

export default App; 