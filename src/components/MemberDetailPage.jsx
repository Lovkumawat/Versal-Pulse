import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  updateMemberStatusWithNotification, 
  updateTaskProgressWithNotification, 
  assignTask,
  startTimeTrackingWithNotification,
  stopTimeTrackingWithNotification,
  addTaskCommentWithNotification,
  updateTaskPriorityWithNotification,
  updateTaskCategory,
  clearError
} from '../redux/slices/membersSlice';

const MemberDetailPage = ({ memberId, onBack }) => {
  const { teamMembers, taskCategories, taskPriorities, error } = useSelector(state => state.members);
  const { currentRole, currentUser } = useSelector(state => state.role);
  const dispatch = useDispatch();

  const [commentTexts, setCommentTexts] = useState({});
  const [expandedTasks, setExpandedTasks] = useState({});

  const member = teamMembers.find(m => m.id === parseInt(memberId));

  if (!member) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">❓</div>
        <h2 className="text-xl font-semibold text-gray-900">Member not found</h2>
        <button 
          onClick={onBack}
          className="mt-4 btn btn-primary"
        >
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  const handleStatusChange = (newStatus) => {
    dispatch(updateMemberStatusWithNotification({ memberId: member.id, status: newStatus }));
  };

  const handleProgressChange = (taskId, change) => {
    const task = member.tasks.find(t => t.id === taskId);
    if (task) {
      const newProgress = Math.max(0, Math.min(100, task.progress + change));
      dispatch(updateTaskProgressWithNotification({
        memberId: member.id,
        taskId,
        progress: newProgress
      }));
    }
  };

  const handleTimeTrackingToggle = (taskId) => {
    const task = member.tasks.find(t => t.id === taskId);
    if (task) {
      if (task.timeTracking.isActive) {
        dispatch(stopTimeTrackingWithNotification({
          memberId: member.id,
          taskId
        }));
      } else {
        dispatch(startTimeTrackingWithNotification({
          memberId: member.id,
          taskId
        }));
      }
    }
  };

  const handleAddComment = (taskId) => {
    const commentText = commentTexts[taskId];
    if (commentText && commentText.trim()) {
      dispatch(addTaskCommentWithNotification({
        memberId: member.id,
        taskId,
        text: commentText.trim(),
        user: currentUser
      }));
      setCommentTexts(prev => ({ ...prev, [taskId]: '' }));
    }
  };

  const handlePriorityChange = (taskId, priority) => {
    dispatch(updateTaskPriorityWithNotification({
      memberId: member.id,
      taskId,
      priority
    }));
  };

  const handleCategoryChange = (taskId, category) => {
    dispatch(updateTaskCategory({
      memberId: member.id,
      taskId,
      category
    }));
  };

  const toggleTaskExpansion = (taskId) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const getActiveTasks = () => member.tasks.filter(task => task.progress < 100);
  const getCompletedTasks = () => member.tasks.filter(task => task.progress === 100);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Working': return 'bg-green-100 text-green-800 border-green-200';
      case 'Break': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Meeting': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Offline': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Working': return '💻';
      case 'Break': return '☕';
      case 'Meeting': return '🎯';
      case 'Offline': return '😴';
      default: return '❓';
    }
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

  return (
    <div className="space-y-8 member-detail-container">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <button 
          onClick={onBack}
          className="hover:text-blue-600 transition-colors"
        >
          Dashboard
        </button>
        <span>→</span>
        <span className="text-gray-900 font-medium">Team Members</span>
        <span>→</span>
        <span className="text-gray-900 font-medium">{member.name}</span>
      </div>

      {/* Member Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative flex-shrink-0 w-8 h-8">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-8 h-8 rounded-full object-cover ring-4 ring-gray-100 max-w-full max-h-full"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-sm">{getStatusIcon(member.status)}</span>
              </div>
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{member.name}</h1>
              <div className="flex items-center space-x-4 mt-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(member.status)}`}
                >
                  <span className="mr-2">{getStatusIcon(member.status)}</span>
                  {member.status}
                </span>
                {member.email && (
                  <span className="text-gray-600">{member.email}</span>
                )}
              </div>
              {member.location && (
                <div className="text-gray-500 text-sm mt-1">📍 {member.location}</div>
              )}
            </div>
          </div>

          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-3xl font-bold text-gray-900">{member.tasks.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Tasks</p>
              <p className="text-3xl font-bold text-orange-600">{getActiveTasks().length}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <span className="text-2xl">⏳</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-green-600">{getCompletedTasks().length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-3xl font-bold text-purple-600">
                {member.tasks.length > 0 ? Math.round((getCompletedTasks().length / member.tasks.length) * 100) : 0}%
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-2xl">📈</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Status Management */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Management</h3>
            
            {currentRole === 'lead' ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Update {member.name}'s status:</p>
                {['Working', 'Break', 'Meeting', 'Offline'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`w-full flex items-center p-3 rounded-lg border-2 transition-all ${
                      member.status === status 
                        ? getStatusColor(status)
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xl mr-3">{getStatusIcon(status)}</span>
                    <span className="font-medium">{status}</span>
                    {member.status === status && (
                      <div className="ml-auto w-3 h-3 bg-blue-500 rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="text-4xl mb-2">{getStatusIcon(member.status)}</div>
                <p className="font-medium text-gray-900">{member.status}</p>
                <p className="text-sm text-gray-500">Current Status</p>
              </div>
            )}
          </div>
        </div>

        {/* Task Management */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Task Management</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {getActiveTasks().length} active, {getCompletedTasks().length} completed
                </span>
              </div>
            </div>

            {member.tasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <p className="text-gray-500 text-lg">No tasks assigned yet</p>
                <p className="text-gray-400 text-sm mt-2">Tasks will appear here when assigned</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Active Tasks */}
                {getActiveTasks().length > 0 && (
                  <div>
                    <h4 className="text-md font-medium text-gray-700 mb-3 flex items-center">
                      <span className="text-orange-500 mr-2">⏳</span>
                      Active Tasks ({getActiveTasks().length})
                    </h4>
                    <div className="space-y-4">
                      {getActiveTasks().map((task) => (
                        <div key={task.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h5 className="font-medium text-gray-900">{task.title}</h5>
                              <p className="text-sm text-gray-600 mt-1">
                                Due: {formatDate(task.dueDate)}
                                {getDaysUntilDue(task.dueDate) < 0 && (
                                  <span className="ml-2 text-red-600 font-medium">(Overdue)</span>
                                )}
                                {getDaysUntilDue(task.dueDate) === 0 && (
                                  <span className="ml-2 text-orange-600 font-medium">(Due Today)</span>
                                )}
                                {getDaysUntilDue(task.dueDate) === 1 && (
                                  <span className="ml-2 text-yellow-600 font-medium">(Due Tomorrow)</span>
                                )}
                              </p>
                            </div>
                            <span className="text-sm font-medium text-blue-600">{task.progress}%</span>
                          </div>
                          
                          <div className="mb-3">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${task.progress}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleProgressChange(task.id, -10)}
                                disabled={task.progress <= 0}
                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                              >
                                -10%
                              </button>
                              <button
                                onClick={() => handleProgressChange(task.id, 10)}
                                disabled={task.progress >= 100}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                              >
                                +10%
                              </button>
                            </div>
                            
                            {task.progress >= 90 && task.progress < 100 && (
                              <button
                                onClick={() => handleProgressChange(task.id, 100 - task.progress)}
                                className="px-4 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm"
                              >
                                ✅ Complete
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Completed Tasks */}
                {getCompletedTasks().length > 0 && (
                  <div>
                    <h4 className="text-md font-medium text-gray-700 mb-3 flex items-center">
                      <span className="text-green-500 mr-2">✅</span>
                      Completed Tasks ({getCompletedTasks().length})
                    </h4>
                    <div className="space-y-2">
                      {getCompletedTasks().map((task) => (
                        <div key={task.id} className="border border-green-200 bg-green-50 rounded-lg p-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <span className="text-green-600 mr-3 text-lg">✅</span>
                              <div>
                                <span className="text-gray-900 font-medium">{task.title}</span>
                                <div className="text-sm text-green-700">
                                  Completed • Due: {formatDate(task.dueDate)}
                                </div>
                              </div>
                            </div>
                            <span className="text-sm font-medium text-green-600">100%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetailPage; 