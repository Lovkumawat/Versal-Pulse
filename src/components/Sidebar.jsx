import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { switchRole } from '../redux/slices/roleSlice';

const Sidebar = () => {
  const { currentRole } = useSelector(state => state.role);
  const dispatch = useDispatch();

  const handleRoleSwitch = () => {
    const newRole = currentRole === 'lead' ? 'member' : 'lead';
    dispatch(switchRole(newRole));
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      active: true
    },
    {
      id: 'team',
      label: 'Team',
      icon: '👥',
      active: false
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: '📋',
      active: false
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: '📈',
      active: false
    }
  ];

  return (
    <div className="bg-indigo-900 text-white w-64 min-h-screen flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-indigo-800">
        <div className="flex items-center">
          <div className="bg-indigo-600 p-2 rounded-lg mr-3">
            <span className="text-xl">⚡</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">Team Pulse</h1>
            <p className="text-indigo-300 text-sm">Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                item.active
                  ? 'bg-indigo-700 text-white'
                  : 'text-indigo-300 hover:bg-indigo-800 hover:text-white'
              }`}
            >
              <span className="text-lg mr-3">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
              {item.active && (
                <div className="ml-auto w-2 h-2 bg-indigo-400 rounded-full"></div>
              )}
            </button>
          ))}
        </div>

        {/* Role Switch Section */}
        <div className="mt-8 p-4 bg-indigo-800 rounded-lg">
          <h3 className="text-sm font-medium text-indigo-300 mb-3">Current Role</h3>
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">
              {currentRole === 'lead' ? '👨‍💼 Team Lead' : '👤 Team Member'}
            </span>
          </div>
          <button
            onClick={handleRoleSwitch}
            className="w-full mt-3 bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-md transition-colors text-sm font-medium"
          >
            Switch to {currentRole === 'lead' ? 'Member' : 'Lead'}
          </button>
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-indigo-800">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center mr-3">
            <span className="text-sm">👤</span>
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium">Settings</p>
            <p className="text-indigo-300 text-xs">Preferences</p>
          </div>
          <button className="text-indigo-300 hover:text-white">
            <span>⚙️</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 