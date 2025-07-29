import React from 'react';
import { useSelector } from 'react-redux';

const Header = ({ currentView, selectedMemberId }) => {
  const { currentRole, currentUser } = useSelector(state => state.role);
  const { teamMembers } = useSelector(state => state.members);

  // Get current user's avatar
  const currentMember = teamMembers.find(member => member.name === currentUser);
  
  // Get selected member for detail view
  const selectedMember = selectedMemberId 
    ? teamMembers.find(member => member.id === parseInt(selectedMemberId))
    : null;

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Context Indicator & Search Bar */}
          <div className="flex items-center flex-1 max-w-2xl space-x-4">
            {/* Current View Context */}
            <div className="flex items-center space-x-2 text-sm">
              {currentView === 'member-detail' && selectedMember ? (
                <div className="flex items-center space-x-2 bg-indigo-50 px-3 py-1 rounded-lg">
                  <span className="text-indigo-600">👁️</span>
                  <span className="text-indigo-700 font-medium">Viewing:</span>
                  <img
                    src={selectedMember.avatar}
                    alt={selectedMember.name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="text-indigo-900 font-semibold">{selectedMember.name}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-lg">
                  <span className="text-blue-600">📊</span>
                  <span className="text-blue-700 font-medium">
                    {currentRole === 'lead' ? 'Team Dashboard' : 'My Dashboard'}
                  </span>
                </div>
              )}
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search team members, tasks..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <span className="text-gray-400">🔍</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <span className="text-xl">🔔</span>
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{currentUser}</p>
                <p className="text-xs text-gray-500">
                  {currentRole === 'lead' ? 'Team Lead' : 'Team Member'}
                </p>
              </div>
              <div className="relative">
                <img
                  src={currentMember?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                  alt={currentUser}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-100"
                />
                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></span>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <span>⚙️</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 