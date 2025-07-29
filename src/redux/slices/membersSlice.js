import { createSlice } from '@reduxjs/toolkit';
import { addNotification, NOTIFICATION_TYPES } from './notificationsSlice';

// Sample team members data with Indian names and local images
const initialMembers = [
  {
    id: 1,
    name: 'Priya Sharma',
    status: 'Working',
    avatar: '/Images/PriyaSharm.jpeg',
    tasks: [
      { 
        id: 1, 
        title: 'Complete dashboard design', 
        description: 'Design and implement the main dashboard UI with responsive layout',
        dueDate: '2024-02-15', 
        progress: 60,
        priority: 'high',
        category: 'design',
        status: 'in_progress',
        estimatedHours: 8,
        actualHours: 4.5,
        assignedBy: 'Team Lead',
        assignedTo: 'Priya Sharma',
        createdAt: '2024-02-01T09:00:00Z',
        updatedAt: '2024-02-05T14:30:00Z',
        timeTracking: {
          isActive: false,
          currentSessionStart: null,
          totalTime: 4.5 * 60 * 60 * 1000, // 4.5 hours in milliseconds
          sessions: [
            { start: '2024-02-01T09:00:00Z', end: '2024-02-01T12:00:00Z', duration: 3 * 60 * 60 * 1000 },
            { start: '2024-02-05T13:00:00Z', end: '2024-02-05T14:30:00Z', duration: 1.5 * 60 * 60 * 1000 }
          ]
        },
        comments: [
          {
            id: 1,
            user: 'Team Lead',
            text: 'Please focus on mobile responsiveness',
            timestamp: '2024-02-02T10:00:00Z'
          }
        ],
        tags: ['ui', 'responsive', 'priority']
      },
      { 
        id: 2, 
        title: 'Review code changes', 
        description: 'Review and approve pending pull requests',
        dueDate: '2024-02-10', 
        progress: 100,
        priority: 'medium',
        category: 'development',
        status: 'completed',
        estimatedHours: 2,
        actualHours: 1.8,
        assignedBy: 'Team Lead',
        assignedTo: 'Priya Sharma',
        createdAt: '2024-02-08T10:00:00Z',
        updatedAt: '2024-02-09T16:00:00Z',
        completedAt: '2024-02-09T16:00:00Z',
        timeTracking: {
          isActive: false,
          currentSessionStart: null,
          totalTime: 1.8 * 60 * 60 * 1000,
          sessions: [
            { start: '2024-02-09T14:00:00Z', end: '2024-02-09T16:00:00Z', duration: 1.8 * 60 * 60 * 1000 }
          ]
        },
        comments: [],
        tags: ['review', 'code']
      }
    ]
  },
  {
    id: 2,
    name: 'Rohan Patel',
    status: 'Meeting',
    avatar: '/Images/Rohit_Patel.pn.jpeg',
    tasks: [
      { 
        id: 3, 
        title: 'Client presentation prep', 
        description: 'Prepare slides and demo for client quarterly review',
        dueDate: '2024-02-12', 
        progress: 30,
        priority: 'high',
        category: 'presentation',
        status: 'in_progress',
        estimatedHours: 6,
        actualHours: 1.5,
        assignedBy: 'Team Lead',
        assignedTo: 'Rohan Patel',
        createdAt: '2024-02-05T08:00:00Z',
        updatedAt: '2024-02-06T11:00:00Z',
        timeTracking: {
          isActive: false,
          currentSessionStart: null,
          totalTime: 1.5 * 60 * 60 * 1000,
          sessions: [
            { start: '2024-02-06T09:00:00Z', end: '2024-02-06T10:30:00Z', duration: 1.5 * 60 * 60 * 1000 }
          ]
        },
        comments: [
          {
            id: 2,
            user: 'Team Lead',
            text: 'Great progress on the slides!',
            timestamp: '2024-02-06T12:00:00Z'
          }
        ],
        tags: ['presentation', 'client', 'demo']
      }
    ]
  },
  {
    id: 3,
    name: 'Anjali Desai',
    status: 'Break',
    avatar: '/Images/AnjaliDesa.jpeg',
    tasks: [
      { 
        id: 4, 
        title: 'Database optimization', 
        description: 'Optimize database queries and improve performance',
        dueDate: '2024-02-20', 
        progress: 45,
        priority: 'medium',
        category: 'development',
        status: 'in_progress',
        estimatedHours: 10,
        actualHours: 4.2,
        assignedBy: 'Team Lead',
        assignedTo: 'Anjali Desai',
        createdAt: '2024-02-03T14:00:00Z',
        updatedAt: '2024-02-07T16:00:00Z',
        timeTracking: {
          isActive: false,
          currentSessionStart: null,
          totalTime: 4.2 * 60 * 60 * 1000,
          sessions: [
            { start: '2024-02-05T10:00:00Z', end: '2024-02-05T12:00:00Z', duration: 2 * 60 * 60 * 1000 },
            { start: '2024-02-07T14:00:00Z', end: '2024-02-07T16:00:00Z', duration: 2.2 * 60 * 60 * 1000 }
          ]
        },
        comments: [
          {
            id: 3,
            user: 'Anjali Desai',
            text: 'Query optimization completed for user table',
            timestamp: '2024-02-07T16:30:00Z'
          }
        ],
        tags: ['database', 'optimization', 'performance']
      }
    ]
  },
  {
    id: 4,
    name: 'Arjun Singh',
    status: 'Offline',
    avatar: '/Images/ArjunSing.jpeg',
    tasks: [
      { 
        id: 5, 
        title: 'API documentation', 
        description: 'Create comprehensive API documentation for new endpoints',
        dueDate: '2024-02-18', 
        progress: 80,
        priority: 'low',
        category: 'documentation',
        status: 'in_progress',
        estimatedHours: 4,
        actualHours: 3.1,
        assignedBy: 'Team Lead',
        assignedTo: 'Arjun Singh',
        createdAt: '2024-02-04T11:00:00Z',
        updatedAt: '2024-02-08T15:00:00Z',
        timeTracking: {
          isActive: false,
          currentSessionStart: null,
          totalTime: 3.1 * 60 * 60 * 1000,
          sessions: [
            { start: '2024-02-06T13:00:00Z', end: '2024-02-06T15:00:00Z', duration: 2 * 60 * 60 * 1000 },
            { start: '2024-02-08T14:00:00Z', end: '2024-02-08T15:00:00Z', duration: 1.1 * 60 * 60 * 1000 }
          ]
        },
        comments: [
          {
            id: 4,
            user: 'Arjun Singh',
            text: 'Authentication endpoints documented',
            timestamp: '2024-02-08T15:30:00Z'
          }
        ],
        tags: ['api', 'documentation', 'endpoints']
      }
    ]
  }
];

const membersSlice = createSlice({
  name: 'members',
  initialState: {
    teamMembers: initialMembers,
    statusFilter: 'All',
    sortBy: 'name', // 'name' or 'activeTasks'
    nextTaskId: 6,
    nextCommentId: 10,
    taskCategories: ['development', 'design', 'testing', 'presentation', 'research', 'documentation', 'meeting'],
    taskPriorities: ['low', 'medium', 'high', 'urgent'],
    error: null
  },
  reducers: {
    updateMemberStatus: (state, action) => {
      const { memberId, status } = action.payload;
      const member = state.teamMembers.find(m => m.id === memberId);
      if (member) {
        member.status = status;
      }
    },
    
    assignTask: (state, action) => {
      const { 
        memberId, 
        title, 
        description = '', 
        dueDate, 
        priority = 'medium', 
        category = 'development',
        estimatedHours = 1,
        assignedBy = 'Team Lead'
      } = action.payload;
      
      const member = state.teamMembers.find(m => m.id === memberId);
      if (member) {
        const now = new Date().toISOString();
        const newTask = {
          id: state.nextTaskId,
          title,
          description,
          dueDate,
          progress: 0,
          priority,
          category,
          status: 'not_started',
          estimatedHours,
          actualHours: 0,
          assignedBy,
          assignedTo: member.name,
          createdAt: now,
          updatedAt: now,
          timeTracking: {
            isActive: false,
            currentSessionStart: null,
            totalTime: 0,
            sessions: []
          },
          comments: [],
          tags: []
        };
        
        member.tasks.push(newTask);
        state.nextTaskId += 1;
        state.error = null;
      } else {
        state.error = 'Member not found';
      }
    },
    
    updateTaskProgress: (state, action) => {
      const { memberId, taskId, progress } = action.payload;
      const member = state.teamMembers.find(m => m.id === memberId);
      if (member) {
        const task = member.tasks.find(t => t.id === taskId);
        if (task) {
          const newProgress = Math.max(0, Math.min(100, progress));
          task.progress = newProgress;
          task.updatedAt = new Date().toISOString();
          
          // Update task status based on progress
          if (newProgress === 0) {
            task.status = 'not_started';
          } else if (newProgress === 100) {
            task.status = 'completed';
            task.completedAt = new Date().toISOString();
            // Stop time tracking if active
            if (task.timeTracking.isActive) {
              const sessionStart = new Date(task.timeTracking.currentSessionStart);
              const sessionEnd = new Date();
              const sessionDuration = sessionEnd - sessionStart;
              
              task.timeTracking.sessions.push({
                start: task.timeTracking.currentSessionStart,
                end: sessionEnd.toISOString(),
                duration: sessionDuration
              });
              
              task.timeTracking.totalTime += sessionDuration;
              task.actualHours = task.timeTracking.totalTime / (1000 * 60 * 60);
              task.timeTracking.isActive = false;
              task.timeTracking.currentSessionStart = null;
            }
          } else {
            task.status = 'in_progress';
          }
          
          state.error = null;
        } else {
          state.error = 'Task not found';
        }
      } else {
        state.error = 'Member not found';
      }
    },
    
    completeTask: (state, action) => {
      const { memberId, taskId } = action.payload;
      const member = state.teamMembers.find(m => m.id === memberId);
      if (member) {
        const task = member.tasks.find(t => t.id === taskId);
        if (task) {
          task.progress = 100;
        }
      }
    },
    
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
    
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    
    // Auto-reset status after inactivity (bonus feature)
    autoResetStatus: (state, action) => {
      const { memberId } = action.payload;
      const member = state.teamMembers.find(m => m.id === memberId);
      if (member && member.status !== 'Offline') {
        member.status = 'Offline';
      }
    },

    // Advanced Task Management Reducers

    // Start time tracking for a task
    startTimeTracking: (state, action) => {
      const { memberId, taskId } = action.payload;
      const member = state.teamMembers.find(m => m.id === memberId);
      if (member) {
        const task = member.tasks.find(t => t.id === taskId);
        if (task && !task.timeTracking.isActive) {
          // Stop any other active tracking for this member
          member.tasks.forEach(t => {
            if (t.timeTracking.isActive && t.id !== taskId) {
              const sessionStart = new Date(t.timeTracking.currentSessionStart);
              const sessionEnd = new Date();
              const sessionDuration = sessionEnd - sessionStart;
              
              t.timeTracking.sessions.push({
                start: t.timeTracking.currentSessionStart,
                end: sessionEnd.toISOString(),
                duration: sessionDuration
              });
              
              t.timeTracking.totalTime += sessionDuration;
              t.actualHours = t.timeTracking.totalTime / (1000 * 60 * 60);
              t.timeTracking.isActive = false;
              t.timeTracking.currentSessionStart = null;
              t.updatedAt = new Date().toISOString();
            }
          });

          // Start tracking on selected task
          task.timeTracking.isActive = true;
          task.timeTracking.currentSessionStart = new Date().toISOString();
          task.updatedAt = new Date().toISOString();
          
          // Auto-update status to in_progress if not started
          if (task.status === 'not_started') {
            task.status = 'in_progress';
          }
          
          state.error = null;
        } else if (!task) {
          state.error = 'Task not found';
        } else {
          state.error = 'Time tracking already active for this task';
        }
      } else {
        state.error = 'Member not found';
      }
    },

    // Stop time tracking for a task
    stopTimeTracking: (state, action) => {
      const { memberId, taskId } = action.payload;
      const member = state.teamMembers.find(m => m.id === memberId);
      if (member) {
        const task = member.tasks.find(t => t.id === taskId);
        if (task && task.timeTracking.isActive) {
          const sessionStart = new Date(task.timeTracking.currentSessionStart);
          const sessionEnd = new Date();
          const sessionDuration = sessionEnd - sessionStart;
          
          task.timeTracking.sessions.push({
            start: task.timeTracking.currentSessionStart,
            end: sessionEnd.toISOString(),
            duration: sessionDuration
          });
          
          task.timeTracking.totalTime += sessionDuration;
          task.actualHours = task.timeTracking.totalTime / (1000 * 60 * 60);
          task.timeTracking.isActive = false;
          task.timeTracking.currentSessionStart = null;
          task.updatedAt = new Date().toISOString();
          
          state.error = null;
        } else if (!task) {
          state.error = 'Task not found';
        } else {
          state.error = 'Time tracking not active for this task';
        }
      } else {
        state.error = 'Member not found';
      }
    },

    // Add comment to a task
    addTaskComment: (state, action) => {
      const { memberId, taskId, text, user } = action.payload;
      const member = state.teamMembers.find(m => m.id === memberId);
      if (member) {
        const task = member.tasks.find(t => t.id === taskId);
        if (task) {
          const newComment = {
            id: state.nextCommentId,
            user: user || 'Anonymous',
            text: text.trim(),
            timestamp: new Date().toISOString()
          };
          
          task.comments.push(newComment);
          task.updatedAt = new Date().toISOString();
          state.nextCommentId += 1;
          state.error = null;
        } else {
          state.error = 'Task not found';
        }
      } else {
        state.error = 'Member not found';
      }
    },

    // Update task priority
    updateTaskPriority: (state, action) => {
      const { memberId, taskId, priority } = action.payload;
      const member = state.teamMembers.find(m => m.id === memberId);
      if (member) {
        const task = member.tasks.find(t => t.id === taskId);
        if (task && state.taskPriorities.includes(priority)) {
          task.priority = priority;
          task.updatedAt = new Date().toISOString();
          state.error = null;
        } else if (!task) {
          state.error = 'Task not found';
        } else {
          state.error = 'Invalid priority level';
        }
      } else {
        state.error = 'Member not found';
      }
    },

    // Update task category
    updateTaskCategory: (state, action) => {
      const { memberId, taskId, category } = action.payload;
      const member = state.teamMembers.find(m => m.id === memberId);
      if (member) {
        const task = member.tasks.find(t => t.id === taskId);
        if (task && state.taskCategories.includes(category)) {
          task.category = category;
          task.updatedAt = new Date().toISOString();
          state.error = null;
        } else if (!task) {
          state.error = 'Task not found';
        } else {
          state.error = 'Invalid category';
        }
      } else {
        state.error = 'Member not found';
      }
    },

    // Update task estimated hours
    updateTaskEstimation: (state, action) => {
      const { memberId, taskId, estimatedHours } = action.payload;
      const member = state.teamMembers.find(m => m.id === memberId);
      if (member) {
        const task = member.tasks.find(t => t.id === taskId);
        if (task && estimatedHours > 0) {
          task.estimatedHours = estimatedHours;
          task.updatedAt = new Date().toISOString();
          state.error = null;
        } else if (!task) {
          state.error = 'Task not found';
        } else {
          state.error = 'Invalid estimation (must be > 0)';
        }
      } else {
        state.error = 'Member not found';
      }
    },

    // Add tag to task
    addTaskTag: (state, action) => {
      const { memberId, taskId, tag } = action.payload;
      const member = state.teamMembers.find(m => m.id === memberId);
      if (member) {
        const task = member.tasks.find(t => t.id === taskId);
        if (task) {
          const trimmedTag = tag.trim().toLowerCase();
          if (trimmedTag && !task.tags.includes(trimmedTag)) {
            task.tags.push(trimmedTag);
            task.updatedAt = new Date().toISOString();
          }
          state.error = null;
        } else {
          state.error = 'Task not found';
        }
      } else {
        state.error = 'Member not found';
      }
    },

    // Remove tag from task
    removeTaskTag: (state, action) => {
      const { memberId, taskId, tag } = action.payload;
      const member = state.teamMembers.find(m => m.id === memberId);
      if (member) {
        const task = member.tasks.find(t => t.id === taskId);
        if (task) {
          task.tags = task.tags.filter(t => t !== tag);
          task.updatedAt = new Date().toISOString();
          state.error = null;
        } else {
          state.error = 'Task not found';
        }
      } else {
        state.error = 'Member not found';
      }
    },

    // Clear errors
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  updateMemberStatus,
  assignTask,
  updateTaskProgress,
  completeTask,
  setStatusFilter,
  setSortBy,
  autoResetStatus,
  startTimeTracking,
  stopTimeTracking,
  addTaskComment,
  updateTaskPriority,
  updateTaskCategory,
  updateTaskEstimation,
  addTaskTag,
  removeTaskTag,
  clearError
} = membersSlice.actions;

export default membersSlice.reducer;

// Enhanced Action Creators with Notifications
// These are thunk actions that dispatch both member actions and notifications

export const assignTaskWithNotification = (taskData) => (dispatch, getState) => {
  const { memberId, title, assignedBy } = taskData;
  const { teamMembers } = getState().members;
  const member = teamMembers.find(m => m.id === memberId);
  
  if (member) {
    // Dispatch the task assignment
    dispatch(assignTask(taskData));
    
    // Create notification for the assigned member
    dispatch(addNotification({
      type: NOTIFICATION_TYPES.TASK_ASSIGNED,
      title: 'New Task Assigned',
      message: `You have been assigned "${title}" by ${assignedBy}`,
      priority: taskData.priority === 'urgent' ? 'urgent' : taskData.priority === 'high' ? 'high' : 'medium',
      relatedUser: assignedBy,
      relatedTask: getState().members.nextTaskId - 1, // Task was just created
      actionUrl: `/tasks/${getState().members.nextTaskId - 1}`,
      showAsToast: true
    }));

    // Create notification for team lead about successful assignment
    if (assignedBy !== member.name) {
      dispatch(addNotification({
        type: NOTIFICATION_TYPES.TASK_ASSIGNED,
        title: 'Task Assigned Successfully',
        message: `Task "${title}" has been assigned to ${member.name}`,
        priority: 'low',
        relatedUser: member.name,
        relatedTask: getState().members.nextTaskId - 1,
        showAsToast: true,
        autoRead: false
      }));
    }
  }
};

export const updateTaskProgressWithNotification = (progressData) => (dispatch, getState) => {
  const { memberId, taskId, progress } = progressData;
  const { teamMembers } = getState().members;
  const member = teamMembers.find(m => m.id === memberId);
  const task = member?.tasks.find(t => t.id === taskId);
  
  if (member && task) {
    const oldProgress = task.progress;
    
    // Dispatch the progress update
    dispatch(updateTaskProgress(progressData));
    
    // Create notifications for significant progress milestones
    if (progress === 100 && oldProgress < 100) {
      // Task completed
      dispatch(addNotification({
        type: NOTIFICATION_TYPES.TASK_COMPLETED,
        title: 'Task Completed! 🎉',
        message: `"${task.title}" has been completed successfully`,
        priority: 'medium',
        relatedUser: member.name,
        relatedTask: taskId,
        showAsToast: true
      }));
    } else if (progress >= 50 && oldProgress < 50) {
      // 50% milestone
      dispatch(addNotification({
        type: NOTIFICATION_TYPES.TASK_PROGRESS,
        title: 'Great Progress!',
        message: `"${task.title}" is now 50% complete`,
        priority: 'low',
        relatedUser: member.name,
        relatedTask: taskId,
        showAsToast: true
      }));
    }
  }
};

export const updateMemberStatusWithNotification = (statusData) => (dispatch, getState) => {
  const { memberId, status } = statusData;
  const { teamMembers } = getState().members;
  const member = teamMembers.find(m => m.id === memberId);
  
  if (member && member.status !== status) {
    const oldStatus = member.status;
    
    // Dispatch the status update
    dispatch(updateMemberStatus(statusData));
    
    // Create notification for status change
    dispatch(addNotification({
      type: NOTIFICATION_TYPES.STATUS_CHANGED,
      title: 'Status Updated',
      message: `${member.name} changed status from ${oldStatus} to ${status}`,
      priority: status === 'Offline' ? 'low' : 'medium',
      relatedUser: member.name,
      showAsToast: status === 'Working' || status === 'Offline',
      autoRead: status === 'Working' // Auto-read "working" status changes
    }));
  }
};

export const startTimeTrackingWithNotification = (trackingData) => (dispatch, getState) => {
  const { memberId, taskId } = trackingData;
  const { teamMembers } = getState().members;
  const member = teamMembers.find(m => m.id === memberId);
  const task = member?.tasks.find(t => t.id === taskId);
  
  if (member && task) {
    // Dispatch the time tracking start
    dispatch(startTimeTracking(trackingData));
    
    // Create notification
    dispatch(addNotification({
      type: NOTIFICATION_TYPES.TIME_TRACKING,
      title: 'Time Tracking Started',
      message: `Started tracking time for "${task.title}"`,
      priority: 'low',
      relatedUser: member.name,
      relatedTask: taskId,
      showAsToast: true,
      autoRead: true
    }));
  }
};

export const stopTimeTrackingWithNotification = (trackingData) => (dispatch, getState) => {
  const { memberId, taskId } = trackingData;
  const { teamMembers } = getState().members;
  const member = teamMembers.find(m => m.id === memberId);
  const task = member?.tasks.find(t => t.id === taskId);
  
  if (member && task) {
    // Dispatch the time tracking stop
    dispatch(stopTimeTracking(trackingData));
    
    // Calculate session time for notification
    const sessionStart = new Date(task.timeTracking.currentSessionStart);
    const sessionEnd = new Date();
    const sessionDuration = sessionEnd - sessionStart;
    const sessionHours = (sessionDuration / (1000 * 60 * 60)).toFixed(1);
    
    // Create notification
    dispatch(addNotification({
      type: NOTIFICATION_TYPES.TIME_TRACKING,
      title: 'Time Tracking Stopped',
      message: `Logged ${sessionHours}h for "${task.title}"`,
      priority: 'low',
      relatedUser: member.name,
      relatedTask: taskId,
      showAsToast: true,
      autoRead: true
    }));
  }
};

export const addTaskCommentWithNotification = (commentData) => (dispatch, getState) => {
  const { memberId, taskId, text, user } = commentData;
  const { teamMembers } = getState().members;
  const member = teamMembers.find(m => m.id === memberId);
  const task = member?.tasks.find(t => t.id === taskId);
  
  if (member && task) {
    // Dispatch the comment addition
    dispatch(addTaskComment(commentData));
    
    // Create notification for task owner (if comment is not from them)
    if (user !== member.name) {
      dispatch(addNotification({
        type: NOTIFICATION_TYPES.COMMENT_ADDED,
        title: 'New Comment',
        message: `${user} commented on "${task.title}": "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`,
        priority: 'medium',
        relatedUser: user,
        relatedTask: taskId,
        actionUrl: `/tasks/${taskId}`,
        showAsToast: true
      }));
    }
  }
};

export const updateTaskPriorityWithNotification = (priorityData) => (dispatch, getState) => {
  const { memberId, taskId, priority } = priorityData;
  const { teamMembers } = getState().members;
  const member = teamMembers.find(m => m.id === memberId);
  const task = member?.tasks.find(t => t.id === taskId);
  
  if (member && task && task.priority !== priority) {
    const oldPriority = task.priority;
    
    // Dispatch the priority update
    dispatch(updateTaskPriority(priorityData));
    
    // Create notification for priority changes to urgent or high
    if (priority === 'urgent' || priority === 'high') {
      dispatch(addNotification({
        type: NOTIFICATION_TYPES.PRIORITY_CHANGED,
        title: 'Task Priority Updated',
        message: `"${task.title}" priority changed from ${oldPriority} to ${priority}`,
        priority: priority === 'urgent' ? 'urgent' : 'high',
        relatedUser: member.name,
        relatedTask: taskId,
        showAsToast: priority === 'urgent',
        autoRead: priority === 'low'
      }));
    }
  }
};

// Deadline reminder notifications (would typically be called by a background service)
export const checkDeadlineReminders = () => (dispatch, getState) => {
  const { teamMembers } = getState().members;
  const { notificationSettings } = getState().notifications;
  
  if (!notificationSettings.enableDeadlineReminders) return;
  
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  
  teamMembers.forEach(member => {
    member.tasks.forEach(task => {
      if (task.progress < 100) {
        const dueDate = new Date(task.dueDate);
        const timeDiff = dueDate - now;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        
        // Notify for tasks due tomorrow
        if (daysDiff === 1) {
          dispatch(addNotification({
            type: NOTIFICATION_TYPES.DEADLINE_APPROACHING,
            title: 'Deadline Tomorrow',
            message: `"${task.title}" is due tomorrow`,
            priority: 'high',
            relatedUser: member.name,
            relatedTask: task.id,
            actionUrl: `/tasks/${task.id}`,
            showAsToast: true
          }));
        }
        // Notify for overdue tasks
        else if (daysDiff < 0) {
          dispatch(addNotification({
            type: NOTIFICATION_TYPES.DEADLINE_APPROACHING,
            title: 'Task Overdue',
            message: `"${task.title}" is ${Math.abs(daysDiff)} day(s) overdue`,
            priority: 'urgent',
            relatedUser: member.name,
            relatedTask: task.id,
            actionUrl: `/tasks/${task.id}`,
            showAsToast: true
          }));
        }
      }
    });
  });
}; 