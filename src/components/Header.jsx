import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  toggleNotificationCenter
} from '../redux/slices/notificationsSlice';
import NotificationCenter from './NotificationCenter';

const Header = ({ currentView, selectedMemberId }) => {
  const { currentRole, currentUser } = useSelector(state => state.role);
  const { teamMembers } = useSelector(state => state.members);
  const unreadCount = useSelector(state => state.notifications.unreadCount);
  const dispatch = useDispatch();

  // Get current user's avatar
  const currentMember = teamMembers.find(member => member.name === currentUser);
  
  // Get selected member for detail view
  const selectedMember = selectedMemberId 
    ? teamMembers.find(member => member.id === parseInt(selectedMemberId))
    : null;

  const handleNotificationToggle = () => {
    dispatch(toggleNotificationCenter());
  };

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
                              className="w-3 h-5 rounded-full object-cover max-w-full max-h-full"
                            />
                            <span className="text-indigo-900 font-semibold">{selectedMember.name}</span>
                          </div>
                        ) : currentView === 'team-members' ? (
                          <div className="flex items-center space-x-2 bg-orange-50 px-3 py-1 rounded-lg">
                            <span className="text-orange-600">👥</span>
                            <span className="text-orange-700 font-medium">Team Members</span>
                          </div>
                        ) : currentView === 'analytics' ? (
                          <div className="flex items-center space-x-2 bg-purple-50 px-3 py-1 rounded-lg">
                            <span className="text-purple-600">📈</span>
                            <span className="text-purple-700 font-medium">Analytics Dashboard</span>
                          </div>
                        ) : currentView === 'calendar' ? (
                          <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-lg">
                            <span className="text-green-600">📅</span>
                            <span className="text-green-700 font-medium">Calendar & Scheduling</span>
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
            <div className="relative">
              <button 
                onClick={handleNotificationToggle}
                className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                title={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
              >
                <span className="text-xl">🔔</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center animate-pulse">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
              
              {/* Notification Center Dropdown */}
              <NotificationCenter />
            </div>

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
                  src={currentMember?.avatar || '/Images/PriyaSharm.jpeg'}
                  alt={currentUser}
                  className="w-5 h-3 rounded-full object-cover ring-2 ring-indigo-100 max-w-full max-h-full"
                />
                <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-400 ring-2 ring-white"></span>
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