import { createSlice } from '@reduxjs/toolkit';

// Notification types
export const NOTIFICATION_TYPES = {
  TASK_ASSIGNED: 'task_assigned',
  TASK_COMPLETED: 'task_completed',
  TASK_PROGRESS: 'task_progress',
  STATUS_CHANGED: 'status_changed',
  DEADLINE_APPROACHING: 'deadline_approaching',
  COMMENT_ADDED: 'comment_added',
  TIME_TRACKING: 'time_tracking',
  MEMBER_ONLINE: 'member_online',
  MEMBER_OFFLINE: 'member_offline',
  PRIORITY_CHANGED: 'priority_changed',
  CATEGORY_CHANGED: 'category_changed',
  SYSTEM_UPDATE: 'system_update'
};

// Sample initial notifications for demo with Indian names
const initialNotifications = [
  {
    id: 1,
    type: NOTIFICATION_TYPES.TASK_ASSIGNED,
    title: 'New Task Assigned',
    message: 'Priya Sharma has been assigned "Complete dashboard design" by Team Lead',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    isRead: false,
    isToast: false,
    priority: 'high',
    actionUrl: '/tasks/1',
    relatedUser: 'Priya Sharma',
    relatedTask: 1,
    icon: '📋',
    color: 'blue'
  },
  {
    id: 2,
    type: NOTIFICATION_TYPES.COMMENT_ADDED,
    title: 'New Comment',
    message: 'Rohan Patel commented on "Client presentation prep"',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    isRead: false,
    isToast: false,
    priority: 'medium',
    actionUrl: '/tasks/3',
    relatedUser: 'Rohan Patel',
    relatedTask: 3,
    icon: '💬',
    color: 'green'
  },
  {
    id: 3,
    type: NOTIFICATION_TYPES.DEADLINE_APPROACHING,
    title: 'Deadline Reminder',
    message: 'Task "Client presentation prep" assigned to Rohan Patel is due tomorrow',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
    isRead: true,
    isToast: false,
    priority: 'urgent',
    actionUrl: '/tasks/3',
    relatedTask: 3,
    icon: '⏰',
    color: 'red'
  }
];

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: initialNotifications,
    toastNotifications: [],
    nextNotificationId: 4,
    unreadCount: 2,
    isNotificationCenterOpen: false,
    notificationSettings: {
      enableToasts: true,
      enableSounds: true,
      autoMarkRead: true,
      toastDuration: 5000, // 5 seconds
      maxToasts: 5,
      enableDeadlineReminders: true,
      enableTaskNotifications: true,
      enableStatusNotifications: true,
      enableCommentNotifications: true
    },
    error: null
  },
  reducers: {
    // Create a new notification
    addNotification: (state, action) => {
      const {
        type,
        title,
        message,
        priority = 'medium',
        relatedUser = null,
        relatedTask = null,
        actionUrl = null,
        showAsToast = true,
        autoRead = false
      } = action.payload;

      const notification = {
        id: state.nextNotificationId,
        type,
        title,
        message,
        timestamp: new Date().toISOString(),
        isRead: autoRead,
        isToast: showAsToast,
        priority,
        actionUrl,
        relatedUser,
        relatedTask,
        icon: getNotificationIcon(type),
        color: getNotificationColor(type, priority)
      };

      // Add to main notifications list
      state.notifications.unshift(notification);

      // Add to toast notifications if enabled
      if (showAsToast && state.notificationSettings.enableToasts) {
        state.toastNotifications.push({
          ...notification,
          id: `toast-${state.nextNotificationId}`,
          createdAt: Date.now()
        });

        // Limit number of toasts
        if (state.toastNotifications.length > state.notificationSettings.maxToasts) {
          state.toastNotifications = state.toastNotifications.slice(-state.notificationSettings.maxToasts);
        }
      }

      // Update unread count
      if (!autoRead) {
        state.unreadCount += 1;
      }

      state.nextNotificationId += 1;
      state.error = null;
    },

    // Mark notification as read
    markNotificationRead: (state, action) => {
      const { notificationId } = action.payload;
      const notification = state.notifications.find(n => n.id === notificationId);
      
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },

    // Mark all notifications as read
    markAllNotificationsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.isRead = true;
      });
      state.unreadCount = 0;
    },

    // Remove notification
    removeNotification: (state, action) => {
      const { notificationId } = action.payload;
      const notificationIndex = state.notifications.findIndex(n => n.id === notificationId);
      
      if (notificationIndex !== -1) {
        const notification = state.notifications[notificationIndex];
        if (!notification.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications.splice(notificationIndex, 1);
      }
    },

    // Remove toast notification
    removeToastNotification: (state, action) => {
      const { toastId } = action.payload;
      state.toastNotifications = state.toastNotifications.filter(t => t.id !== toastId);
    },

    // Clear all notifications
    clearAllNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },

    // Clear old notifications (older than 30 days)
    clearOldNotifications: (state) => {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const oldNotifications = state.notifications.filter(n => 
        new Date(n.timestamp) < thirtyDaysAgo && n.isRead
      );
      
      state.notifications = state.notifications.filter(n => 
        new Date(n.timestamp) >= thirtyDaysAgo || !n.isRead
      );
      
      // Don't decrease unread count for old read notifications
    },

    // Toggle notification center
    toggleNotificationCenter: (state) => {
      state.isNotificationCenterOpen = !state.isNotificationCenterOpen;
    },

    // Close notification center
    closeNotificationCenter: (state) => {
      state.isNotificationCenterOpen = false;
    },

    // Update notification settings
    updateNotificationSettings: (state, action) => {
      state.notificationSettings = {
        ...state.notificationSettings,
        ...action.payload
      };
    },

    // Bulk actions for efficiency
    bulkMarkRead: (state, action) => {
      const { notificationIds } = action.payload;
      let markedCount = 0;
      
      notificationIds.forEach(id => {
        const notification = state.notifications.find(n => n.id === id);
        if (notification && !notification.isRead) {
          notification.isRead = true;
          markedCount += 1;
        }
      });
      
      state.unreadCount = Math.max(0, state.unreadCount - markedCount);
    },

    bulkRemove: (state, action) => {
      const { notificationIds } = action.payload;
      let removedUnreadCount = 0;
      
      state.notifications = state.notifications.filter(notification => {
        if (notificationIds.includes(notification.id)) {
          if (!notification.isRead) {
            removedUnreadCount += 1;
          }
          return false;
        }
        return true;
      });
      
      state.unreadCount = Math.max(0, state.unreadCount - removedUnreadCount);
    },

    // Set error
    setNotificationError: (state, action) => {
      state.error = action.payload;
    },

    // Clear error
    clearNotificationError: (state) => {
      state.error = null;
    }
  }
});

// Helper functions for notification styling
function getNotificationIcon(type) {
  switch (type) {
    case NOTIFICATION_TYPES.TASK_ASSIGNED: return '📋';
    case NOTIFICATION_TYPES.TASK_COMPLETED: return '✅';
    case NOTIFICATION_TYPES.TASK_PROGRESS: return '📈';
    case NOTIFICATION_TYPES.STATUS_CHANGED: return '🔄';
    case NOTIFICATION_TYPES.DEADLINE_APPROACHING: return '⏰';
    case NOTIFICATION_TYPES.COMMENT_ADDED: return '💬';
    case NOTIFICATION_TYPES.TIME_TRACKING: return '⏱️';
    case NOTIFICATION_TYPES.MEMBER_ONLINE: return '🟢';
    case NOTIFICATION_TYPES.MEMBER_OFFLINE: return '🔴';
    case NOTIFICATION_TYPES.PRIORITY_CHANGED: return '🚨';
    case NOTIFICATION_TYPES.CATEGORY_CHANGED: return '🏷️';
    case NOTIFICATION_TYPES.SYSTEM_UPDATE: return '🔔';
    default: return '📢';
  }
}

function getNotificationColor(type, priority) {
  // Priority takes precedence
  if (priority === 'urgent') return 'red';
  if (priority === 'high') return 'orange';
  if (priority === 'low') return 'gray';
  
  // Type-based colors for medium priority
  switch (type) {
    case NOTIFICATION_TYPES.TASK_ASSIGNED: return 'blue';
    case NOTIFICATION_TYPES.TASK_COMPLETED: return 'green';
    case NOTIFICATION_TYPES.TASK_PROGRESS: return 'purple';
    case NOTIFICATION_TYPES.STATUS_CHANGED: return 'indigo';
    case NOTIFICATION_TYPES.DEADLINE_APPROACHING: return 'red';
    case NOTIFICATION_TYPES.COMMENT_ADDED: return 'green';
    case NOTIFICATION_TYPES.TIME_TRACKING: return 'yellow';
    case NOTIFICATION_TYPES.MEMBER_ONLINE: return 'green';
    case NOTIFICATION_TYPES.MEMBER_OFFLINE: return 'gray';
    case NOTIFICATION_TYPES.PRIORITY_CHANGED: return 'orange';
    case NOTIFICATION_TYPES.CATEGORY_CHANGED: return 'blue';
    case NOTIFICATION_TYPES.SYSTEM_UPDATE: return 'indigo';
    default: return 'blue';
  }
}

// Selectors
export const selectAllNotifications = (state) => state.notifications.notifications;
export const selectUnreadNotifications = (state) => 
  state.notifications.notifications.filter(n => !n.isRead);
export const selectUnreadCount = (state) => state.notifications.unreadCount;
export const selectToastNotifications = (state) => state.notifications.toastNotifications;
export const selectNotificationSettings = (state) => state.notifications.notificationSettings;
export const selectIsNotificationCenterOpen = (state) => state.notifications.isNotificationCenterOpen;

// Export actions
export const {
  addNotification,
  markNotificationRead,
  markAllNotificationsRead,
  removeNotification,
  removeToastNotification,
  clearAllNotifications,
  clearOldNotifications,
  toggleNotificationCenter,
  closeNotificationCenter,
  updateNotificationSettings,
  bulkMarkRead,
  bulkRemove,
  setNotificationError,
  clearNotificationError
} = notificationsSlice.actions;

export default notificationsSlice.reducer; 