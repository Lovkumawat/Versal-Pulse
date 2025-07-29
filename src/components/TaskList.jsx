import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  updateTaskProgressWithNotification, 
  completeTask, 
  startTimeTrackingWithNotification, 
  stopTimeTrackingWithNotification,
  addTaskCommentWithNotification,
  updateTaskPriorityWithNotification,
  updateTaskCategory,
  clearError
} from '../redux/slices/membersSlice';

const TaskList = () => {
  const { currentUser } = useSelector(state => state.role);
  const { teamMembers, taskCategories, taskPriorities, error } = useSelector(state => state.members);
  const dispatch = useDispatch();

  const [commentTexts, setCommentTexts] = useState({});
  const [expandedTasks, setExpandedTasks] = useState({});
  const [selectedTab, setSelectedTab] = useState('active'); // 'active', 'completed', 'all'

  const currentMember = teamMembers.find(member => member.name === currentUser);

  useEffect(() => {
    // Auto-update time tracking display every minute
    const interval = setInterval(() => {
      // This will trigger re-render to update active time tracking displays
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleProgressChange = (taskId, change) => {
    if (currentMember) {
      const task = currentMember.tasks.find(t => t.id === taskId);
      if (task) {
        const newProgress = Math.max(0, Math.min(100, task.progress + change));
        dispatch(updateTaskProgressWithNotification({
          memberId: currentMember.id,
          taskId,
          progress: newProgress
        }));
      }
    }
  };

  const handleTimeTrackingToggle = (taskId) => {
    if (currentMember) {
      const task = currentMember.tasks.find(t => t.id === taskId);
      if (task) {
        if (task.timeTracking.isActive) {
          dispatch(stopTimeTrackingWithNotification({
            memberId: currentMember.id,
            taskId
          }));
        } else {
          dispatch(startTimeTrackingWithNotification({
            memberId: currentMember.id,
            taskId
          }));
        }
      }
    }
  };

  const handleAddComment = (taskId) => {
    const commentText = commentTexts[taskId];
    if (commentText && commentText.trim() && currentMember) {
      dispatch(addTaskCommentWithNotification({
        memberId: currentMember.id,
        taskId,
        text: commentText.trim(),
        user: currentUser
      }));
      setCommentTexts(prev => ({ ...prev, [taskId]: '' }));
    }
  };

  const handlePriorityChange = (taskId, priority) => {
    if (currentMember) {
      dispatch(updateTaskPriorityWithNotification({
        memberId: currentMember.id,
        taskId,
        priority
      }));
    }
  };

  const handleCategoryChange = (taskId, category) => {
    if (currentMember) {
      dispatch(updateTaskCategory({
        memberId: currentMember.id,
        taskId,
        category
      }));
    }
  };

  const toggleTaskExpansion = (taskId) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDuration = (milliseconds) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getActiveTrackingTime = (task) => {
    if (!task.timeTracking.isActive || !task.timeTracking.currentSessionStart) {
      return 0;
    }
    const start = new Date(task.timeTracking.currentSessionStart);
    const now = new Date();
    return now - start;
  };

  const getTotalTime = (task) => {
    let total = task.timeTracking.totalTime || 0;
    if (task.timeTracking.isActive) {
      total += getActiveTrackingTime(task);
    }
    return total;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'low': return '🟢';
      case 'medium': return '🟡';
      case 'high': return '🟠';
      case 'urgent': return '🔴';
      default: return '⚪';
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      development: '💻',
      design: '🎨',
      testing: '🧪',
      presentation: '📊',
      research: '🔍',
      documentation: '📚',
      meeting: '👥'
    };
    return icons[category] || '📋';
  };

  const getDueDateColor = (dueDate) => {
    const daysUntil = getDaysUntilDue(dueDate);
    if (daysUntil < 0) return 'text-red-600 font-semibold';
    if (daysUntil === 0) return 'text-orange-600 font-semibold';
    if (daysUntil === 1) return 'text-yellow-600 font-medium';
    return 'text-gray-600';
  };

  if (!currentMember) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">❓</div>
          <h3 className="text-lg font-semibold text-gray-900">Member not found</h3>
          <p className="text-gray-500 mt-2">Unable to load your task list</p>
        </div>
      </div>
    );
  }

  const activeTasks = currentMember.tasks.filter(task => task.progress < 100);
  const completedTasks = currentMember.tasks.filter(task => task.progress === 100);
  const allTasks = currentMember.tasks;

  const getFilteredTasks = () => {
    switch (selectedTab) {
      case 'active': return activeTasks;
      case 'completed': return completedTasks;
      case 'all': return allTasks;
      default: return activeTasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">My Tasks</h3>
          <p className="text-sm text-gray-500 mt-1">Manage your assigned tasks and track progress</p>
        </div>
        <div className="p-2 bg-blue-100 rounded-lg">
          <span className="text-lg">📋</span>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <span className="text-red-600 mr-2">❌</span>
            <span className="text-red-800 font-medium">{error}</span>
            <button 
              onClick={() => dispatch(clearError())}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Task Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'active', label: 'Active', count: activeTasks.length, icon: '⏳' },
            { id: 'completed', label: 'Completed', count: completedTasks.length, icon: '✅' },
            { id: 'all', label: 'All', count: allTasks.length, icon: '📋' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedTab === tab.id
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              <span>{tab.label}</span>
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                selectedTab === tab.id ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-200 text-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Task Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{allTasks.length}</div>
          <div className="text-xs text-gray-600">Total Tasks</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{activeTasks.length}</div>
          <div className="text-xs text-gray-600">In Progress</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {allTasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0).toFixed(1)}h
          </div>
          <div className="text-xs text-gray-600">Estimated</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {Math.round((completedTasks.length / Math.max(allTasks.length, 1)) * 100)}%
          </div>
          <div className="text-xs text-gray-600">Completed</div>
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">
            {selectedTab === 'active' && '⏳'}
            {selectedTab === 'completed' && '✅'}
            {selectedTab === 'all' && '📋'}
          </div>
          <h4 className="text-lg font-semibold text-gray-600 mb-2">
            No {selectedTab} tasks
          </h4>
          <p className="text-gray-500">
            {selectedTab === 'active' && 'All your tasks are completed! Great job! 🎉'}
            {selectedTab === 'completed' && 'Complete some tasks to see them here.'}
            {selectedTab === 'all' && 'No tasks have been assigned to you yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div key={task.id} className="border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
              {/* Task Header */}
              <div className="p-4 bg-white border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{task.title}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                        <span className="mr-1">{getPriorityIcon(task.priority)}</span>
                        {task.priority}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <span className="mr-1">{getCategoryIcon(task.category)}</span>
                        {task.category}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className={getDueDateColor(task.dueDate)}>
                        📅 Due: {formatDate(task.dueDate)}
                        {getDaysUntilDue(task.dueDate) < 0 && ' (Overdue)'}
                        {getDaysUntilDue(task.dueDate) === 0 && ' (Today)'}
                        {getDaysUntilDue(task.dueDate) === 1 && ' (Tomorrow)'}
                      </span>
                      <span>⏱️ {task.estimatedHours || 0}h estimated</span>
                      <span>⏰ {formatDuration(getTotalTime(task))} tracked</span>
                    </div>

                    {task.description && (
                      <p className="mt-2 text-sm text-gray-700 line-clamp-2">{task.description}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <span className="text-lg font-semibold text-blue-600">{task.progress}%</span>
                    <button
                      onClick={() => toggleTaskExpansion(task.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <span className={`transform transition-transform ${expandedTasks[task.id] ? 'rotate-180' : ''}`}>
                        ▼
                      </span>
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <div className="flex items-center space-x-2">
                      {task.progress < 100 && (
                        <>
                          <button
                            onClick={() => handleProgressChange(task.id, -10)}
                            disabled={task.progress <= 0}
                            className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            -10%
                          </button>
                          <button
                            onClick={() => handleProgressChange(task.id, 10)}
                            disabled={task.progress >= 100}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            +10%
                          </button>
                        </>
                      )}
                      {task.progress >= 90 && task.progress < 100 && (
                        <button
                          onClick={() => handleProgressChange(task.id, 100 - task.progress)}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors"
                        >
                          ✅ Complete
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        task.progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Expanded Task Details */}
              {expandedTasks[task.id] && (
                <div className="p-4 space-y-4">
                  {/* Time Tracking */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-gray-900 flex items-center">
                        ⏰ Time Tracking
                        {task.timeTracking.isActive && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 animate-pulse">
                            Active
                          </span>
                        )}
                      </h5>
                      <button
                        onClick={() => handleTimeTrackingToggle(task.id)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          task.timeTracking.isActive
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {task.timeTracking.isActive ? '⏹️ Stop' : '▶️ Start'}
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-semibold text-gray-900">
                          {formatDuration(getTotalTime(task))}
                        </div>
                        <div className="text-gray-600">Total Time</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-semibold text-gray-900">
                          {task.timeTracking.sessions.length}
                        </div>
                        <div className="text-gray-600">Sessions</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-semibold text-gray-900">
                          {task.actualHours ? task.actualHours.toFixed(1) : '0'}h
                        </div>
                        <div className="text-gray-600">Logged</div>
                      </div>
                    </div>

                    {task.timeTracking.isActive && (
                      <div className="mt-3 p-2 bg-green-50 rounded-lg">
                        <div className="text-sm text-green-800">
                          ⏱️ Current session: {formatDuration(getActiveTrackingTime(task))}
                          <span className="ml-2 text-green-600">
                            (Started {formatDateTime(task.timeTracking.currentSessionStart)})
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Task Properties */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h5 className="font-medium text-gray-900 mb-3">📝 Task Properties</h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select
                          value={task.priority}
                          onChange={(e) => handlePriorityChange(task.id, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {taskPriorities.map((priority) => (
                            <option key={priority} value={priority}>
                              {getPriorityIcon(priority)} {priority.charAt(0).toUpperCase() + priority.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                          value={task.category}
                          onChange={(e) => handleCategoryChange(task.id, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {taskCategories.map((category) => (
                            <option key={category} value={category}>
                              {getCategoryIcon(category)} {category.charAt(0).toUpperCase() + category.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>📅 Created: {formatDateTime(task.createdAt)}</div>
                      <div>🔄 Updated: {formatDateTime(task.updatedAt)}</div>
                      <div>👤 Assigned by: {task.assignedBy}</div>
                      <div>📊 Status: {task.status.replace('_', ' ')}</div>
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                      💬 Comments ({task.comments.length})
                    </h5>
                    
                    {/* Existing Comments */}
                    <div className="space-y-3 mb-4">
                      {task.comments.map((comment) => (
                        <div key={comment.id} className="flex space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                {comment.user.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-gray-900 text-sm">{comment.user}</span>
                              <span className="text-xs text-gray-500">{formatDateTime(comment.timestamp)}</span>
                            </div>
                            <p className="text-sm text-gray-700">{comment.text}</p>
                          </div>
                        </div>
                      ))}
                      
                      {task.comments.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4">No comments yet. Add the first one!</p>
                      )}
                    </div>

                    {/* Add Comment */}
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={commentTexts[task.id] || ''}
                        onChange={(e) => setCommentTexts(prev => ({ ...prev, [task.id]: e.target.value }))}
                        placeholder="Add a comment..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment(task.id)}
                      />
                      <button
                        onClick={() => handleAddComment(task.id)}
                        disabled={!commentTexts[task.id]?.trim()}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                      >
                        💬 Add
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList; 