import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  addNotification, 
  NOTIFICATION_TYPES 
} from '../redux/slices/notificationsSlice';
import { checkDeadlineReminders } from '../redux/slices/membersSlice';

const NotificationDemo = () => {
  const dispatch = useDispatch();
  const { teamMembers } = useSelector(state => state.members);
  const [isOpen, setIsOpen] = useState(false);

  const createTestNotification = (type, priority = 'medium') => {
    const notifications = {
      [NOTIFICATION_TYPES.TASK_ASSIGNED]: {
        title: 'New Task Assigned',
        message: 'Priya Sharma has been assigned "Build notification system" by Team Lead',
        relatedUser: 'Priya Sharma',
        relatedTask: 1
      },
      [NOTIFICATION_TYPES.TASK_COMPLETED]: {
        title: 'Task Completed! 🎉',
        message: '"Notification system development" has been completed by Rohan Patel',
        relatedUser: 'Rohan Patel',
        relatedTask: 2
      },
      [NOTIFICATION_TYPES.TASK_PROGRESS]: {
        title: 'Great Progress!',
        message: '"Dashboard redesign" is now 75% complete by Anjali Desai',
        relatedUser: 'Anjali Desai',
        relatedTask: 3
      },
      [NOTIFICATION_TYPES.STATUS_CHANGED]: {
        title: 'Status Updated',
        message: 'Arjun Singh changed status from Break to Working',
        relatedUser: 'Arjun Singh'
      },
      [NOTIFICATION_TYPES.DEADLINE_APPROACHING]: {
        title: 'Deadline Tomorrow',
        message: '"Client presentation prep" assigned to Rohan Patel is due tomorrow',
        relatedUser: 'Rohan Patel',
        relatedTask: 4
      },
      [NOTIFICATION_TYPES.COMMENT_ADDED]: {
        title: 'New Comment',
        message: 'Team Lead commented: "Great work on the UI improvements!"',
        relatedUser: 'Team Lead',
        relatedTask: 5
      },
      [NOTIFICATION_TYPES.TIME_TRACKING]: {
        title: 'Time Tracking Started',
        message: 'Priya Sharma started tracking time for "Dashboard design"',
        relatedUser: 'Priya Sharma',
        relatedTask: 1
      },
      [NOTIFICATION_TYPES.MEMBER_ONLINE]: {
        title: 'Member Online',
        message: 'Rohan Patel is now online',
        relatedUser: 'Rohan Patel'
      },
      [NOTIFICATION_TYPES.MEMBER_OFFLINE]: {
        title: 'Member Offline',
        message: 'Anjali Desai is now offline',
        relatedUser: 'Anjali Desai'
      },
      [NOTIFICATION_TYPES.PRIORITY_CHANGED]: {
        title: 'Priority Updated',
        message: '"API documentation" priority changed to High by Arjun Singh',
        relatedUser: 'Arjun Singh',
        relatedTask: 5
      },
      [NOTIFICATION_TYPES.CATEGORY_CHANGED]: {
        title: 'Category Updated',
        message: '"Database optimization" category changed to Development by Anjali Desai',
        relatedUser: 'Anjali Desai',
        relatedTask: 4
      },
      [NOTIFICATION_TYPES.SYSTEM_UPDATE]: {
        title: 'System Update',
        message: 'New features have been deployed to production',
        relatedUser: 'System'
      }
    };

    const notification = notifications[type];
    if (notification) {
      dispatch(addNotification({
        type,
        title: notification.title,
        message: notification.message,
        priority,
        relatedUser: notification.relatedUser,
        relatedTask: notification.relatedTask,
        actionUrl: notification.relatedTask ? `/tasks/${notification.relatedTask}` : null,
        showAsToast: true
      }));
    }
  };

  const createBulkNotifications = () => {
    const bulkNotifications = [
      {
        type: NOTIFICATION_TYPES.TASK_ASSIGNED,
        title: 'Bulk Task Assignment',
        message: 'Priya Sharma assigned 3 new tasks to team members',
        priority: 'medium',
        relatedUser: 'Priya Sharma'
      },
      {
        type: NOTIFICATION_TYPES.STATUS_CHANGED,
        title: 'Team Status Update',
        message: 'Rohan Patel and Anjali Desai updated their status',
        priority: 'low',
        relatedUser: 'Team'
      },
      {
        type: NOTIFICATION_TYPES.TASK_PROGRESS,
        title: 'Progress Update',
        message: 'Arjun Singh completed 2 tasks ahead of schedule',
        priority: 'medium',
        relatedUser: 'Arjun Singh'
      },
      {
        type: NOTIFICATION_TYPES.COMMENT_ADDED,
        title: 'Team Discussion',
        message: 'Multiple comments added to project discussion',
        priority: 'low',
        relatedUser: 'Team'
      },
      {
        type: NOTIFICATION_TYPES.DEADLINE_APPROACHING,
        title: 'Weekly Deadlines',
        message: '5 tasks are due this week across the team',
        priority: 'high',
        relatedUser: 'System'
      }
    ];

    bulkNotifications.forEach((notification, index) => {
      setTimeout(() => {
        dispatch(addNotification({
          ...notification,
          showAsToast: true,
          autoRead: false
        }));
      }, index * 500); // Stagger notifications by 500ms
    });
  };

  const createUrgentNotification = () => {
    dispatch(addNotification({
      type: NOTIFICATION_TYPES.DEADLINE_APPROACHING,
      title: 'URGENT: Task Overdue! 🚨',
      message: 'Critical bug fix task is now 2 days overdue and blocking production deployment',
      priority: 'urgent',
      relatedUser: 'System',
      relatedTask: 999,
      actionUrl: '/tasks/999',
      showAsToast: true
    }));
  };

  const testDeadlineReminders = () => {
    dispatch(checkDeadlineReminders());
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-purple-700 transition-colors z-40"
        title="Open Notification Demo Panel"
      >
        🧪 Test Notifications
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-40 w-80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">🧪 Notification Demo</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Individual Notifications</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => createTestNotification(NOTIFICATION_TYPES.TASK_ASSIGNED, 'high')}
              className="px-3 py-2 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200 transition-colors"
            >
              📋 Task Assigned
            </button>
            <button
              onClick={() => createTestNotification(NOTIFICATION_TYPES.TASK_COMPLETED, 'medium')}
              className="px-3 py-2 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200 transition-colors"
            >
              ✅ Task Complete
            </button>
            <button
              onClick={() => createTestNotification(NOTIFICATION_TYPES.COMMENT_ADDED, 'medium')}
              className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded text-sm hover:bg-yellow-200 transition-colors"
            >
              💬 New Comment
            </button>
            <button
              onClick={() => createTestNotification(NOTIFICATION_TYPES.STATUS_CHANGED, 'low')}
              className="px-3 py-2 bg-indigo-100 text-indigo-800 rounded text-sm hover:bg-indigo-200 transition-colors"
            >
              🔄 Status Change
            </button>
            <button
              onClick={() => createTestNotification(NOTIFICATION_TYPES.TIME_TRACKING, 'low')}
              className="px-3 py-2 bg-purple-100 text-purple-800 rounded text-sm hover:bg-purple-200 transition-colors"
            >
              ⏱️ Time Tracking
            </button>
            <button
              onClick={() => createTestNotification(NOTIFICATION_TYPES.PRIORITY_CHANGED, 'high')}
              className="px-3 py-2 bg-orange-100 text-orange-800 rounded text-sm hover:bg-orange-200 transition-colors"
            >
              🚨 Priority Change
            </button>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Special Tests</h4>
          <div className="space-y-2">
            <button
              onClick={createUrgentNotification}
              className="w-full px-3 py-2 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200 transition-colors font-medium"
            >
              🚨 URGENT Notification
            </button>
            <button
              onClick={createBulkNotifications}
              className="w-full px-3 py-2 bg-gray-100 text-gray-800 rounded text-sm hover:bg-gray-200 transition-colors"
            >
              📦 Bulk Test (5 notifications)
            </button>
            <button
              onClick={testDeadlineReminders}
              className="w-full px-3 py-2 bg-orange-100 text-orange-800 rounded text-sm hover:bg-orange-200 transition-colors"
            >
              ⏰ Test Deadline Reminders
            </button>
          </div>
        </div>

        <div className="text-xs text-gray-500 pt-2 border-t">
          <p>💡 Tips:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Check notification center (🔔) in header</li>
            <li>Watch for toast notifications (top-right)</li>
            <li>Toggle sound settings in notification center</li>
            <li>Test bulk actions (select multiple notifications)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotificationDemo; 