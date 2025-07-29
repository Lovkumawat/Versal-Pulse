import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  markNotificationRead,
  markAllNotificationsRead,
  removeNotification,
  clearAllNotifications,
  clearOldNotifications,
  closeNotificationCenter,
  bulkMarkRead,
  bulkRemove,
  updateNotificationSettings
} from '../redux/slices/notificationsSlice';

const NotificationCenter = () => {
  // Use direct state access instead of selectors to avoid initialization issues
  const allNotifications = useSelector(state => state.notifications.notifications);
  const unreadNotifications = useSelector(state => 
    state.notifications.notifications.filter(n => !n.isRead)
  );
  const unreadCount = useSelector(state => state.notifications.unreadCount);
  const isOpen = useSelector(state => state.notifications.isNotificationCenterOpen);
  const settings = useSelector(state => state.notifications.notificationSettings);
  const dispatch = useDispatch();

  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        dispatch(closeNotificationCenter());
        setShowSettings(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, dispatch]);

  // Filter and search notifications
  const filteredNotifications = allNotifications.filter(notification => {
    // Filter by read status
    if (filter === 'unread' && notification.isRead) return false;
    if (filter === 'read' && !notification.isRead) return false;

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        notification.title.toLowerCase().includes(searchLower) ||
        notification.message.toLowerCase().includes(searchLower) ||
        (notification.relatedUser && notification.relatedUser.toLowerCase().includes(searchLower))
      );
    }

    return true;
  });

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      dispatch(markNotificationRead({ notificationId: notification.id }));
    }

    // Handle navigation if actionUrl exists
    if (notification.actionUrl) {
      console.log('Navigate to:', notification.actionUrl);
      // In a real app, this would handle routing
    }
  };

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsRead());
    setSelectedNotifications([]);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      dispatch(clearAllNotifications());
      setSelectedNotifications([]);
    }
  };

  const handleClearOld = () => {
    dispatch(clearOldNotifications());
  };

  const handleBulkMarkRead = () => {
    if (selectedNotifications.length > 0) {
      dispatch(bulkMarkRead({ notificationIds: selectedNotifications }));
      setSelectedNotifications([]);
    }
  };

  const handleBulkRemove = () => {
    if (selectedNotifications.length > 0) {
      if (window.confirm(`Remove ${selectedNotifications.length} selected notifications?`)) {
        dispatch(bulkRemove({ notificationIds: selectedNotifications }));
        setSelectedNotifications([]);
      }
    }
  };

  const toggleNotificationSelection = (notificationId) => {
    setSelectedNotifications(prev =>
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const selectAllNotifications = () => {
    setSelectedNotifications(filteredNotifications.map(n => n.id));
  };

  const deselectAllNotifications = () => {
    setSelectedNotifications([]);
  };

  const formatTimeAgo = (timestamp) => {
    const now = Date.now();
    const diff = now - new Date(timestamp).getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const getNotificationColorClasses = (color, isRead) => {
    const opacity = isRead ? 'opacity-70' : '';
    
    switch (color) {
      case 'red':
        return `border-l-red-400 bg-red-50 text-red-800 ${opacity}`;
      case 'orange':
        return `border-l-orange-400 bg-orange-50 text-orange-800 ${opacity}`;
      case 'yellow':
        return `border-l-yellow-400 bg-yellow-50 text-yellow-800 ${opacity}`;
      case 'green':
        return `border-l-green-400 bg-green-50 text-green-800 ${opacity}`;
      case 'blue':
        return `border-l-blue-400 bg-blue-50 text-blue-800 ${opacity}`;
      case 'indigo':
        return `border-l-indigo-400 bg-indigo-50 text-indigo-800 ${opacity}`;
      case 'purple':
        return `border-l-purple-400 bg-purple-50 text-purple-800 ${opacity}`;
      case 'gray':
        return `border-l-gray-400 bg-gray-50 text-gray-800 ${opacity}`;
      default:
        return `border-l-blue-400 bg-blue-50 text-blue-800 ${opacity}`;
    }
  };

  if (!isOpen) return null;

  return (
    <div ref={dropdownRef} className="absolute top-full right-0 mt-2 w-96 max-w-sm bg-white rounded-lg shadow-xl border border-gray-200 z-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="mr-2">🔔</span>
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </h3>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            title="Settings"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex space-x-2">
            {['all', 'unread', 'read'].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                  filter === filterOption
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                {filterOption === 'unread' && unreadCount > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedNotifications.length > 0 && (
          <div className="mt-3 p-2 bg-gray-50 rounded-md">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {selectedNotifications.length} selected
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={handleBulkMarkRead}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Mark Read
                </button>
                <button
                  onClick={handleBulkRemove}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Remove
                </button>
                <button
                  onClick={deselectAllNotifications}
                  className="text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-3 flex justify-between text-xs">
          <div className="flex space-x-2">
            <button
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
              className="text-blue-600 hover:text-blue-800 disabled:text-gray-400 font-medium"
            >
              Mark All Read
            </button>
            <button
              onClick={() => selectedNotifications.length === filteredNotifications.length ? deselectAllNotifications() : selectAllNotifications()}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              {selectedNotifications.length === filteredNotifications.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleClearOld}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              Clear Old
            </button>
            <button
              onClick={handleClearAll}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Notification Settings</h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.enableToasts}
                onChange={(e) => dispatch(updateNotificationSettings({ enableToasts: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Enable toast notifications</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.enableSounds}
                onChange={(e) => dispatch(updateNotificationSettings({ enableSounds: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Enable notification sounds</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.enableDeadlineReminders}
                onChange={(e) => dispatch(updateNotificationSettings({ enableDeadlineReminders: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Deadline reminders</span>
            </label>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-2">🔕</div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">
              {searchTerm ? 'No matching notifications' : 'No notifications'}
            </h4>
            <p className="text-xs text-gray-500">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'You\'re all caught up! New notifications will appear here.'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`
                  p-4 border-l-4 cursor-pointer transition-all hover:bg-gray-50
                  ${getNotificationColorClasses(notification.color, notification.isRead)}
                  ${selectedNotifications.includes(notification.id) ? 'ring-2 ring-blue-500 ring-inset' : ''}
                `}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start space-x-3">
                  {/* Selection Checkbox */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleNotificationSelection(notification.id);
                    }}
                    className="mt-1 p-1 hover:bg-white hover:bg-opacity-50 rounded transition-colors"
                  >
                    <div className={`w-4 h-4 border-2 rounded ${
                      selectedNotifications.includes(notification.id)
                        ? 'bg-blue-500 border-blue-500'
                        : 'border-gray-300'
                    } flex items-center justify-center`}>
                      {selectedNotifications.includes(notification.id) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>

                  {/* Icon */}
                  <div className="text-xl flex-shrink-0">
                    {notification.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-medium truncate ${notification.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                        {notification.title}
                      </h4>
                      <div className="flex items-center space-x-2 ml-2">
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                        {notification.priority === 'urgent' && (
                          <span className="bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded-full font-medium">
                            URGENT
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(removeNotification({ notificationId: notification.id }));
                          }}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          title="Remove notification"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <p className={`text-sm mt-1 ${notification.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                      {notification.message}
                    </p>

                    <div className="flex items-center justify-between mt-2 text-xs">
                      <span className="text-gray-500">
                        {formatTimeAgo(notification.timestamp)}
                      </span>
                      {notification.relatedUser && (
                        <span className="text-gray-500">
                          by {notification.relatedUser}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {filteredNotifications.length} of {allNotifications.length} notifications
          </span>
          <button
            onClick={() => dispatch(closeNotificationCenter())}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter; 