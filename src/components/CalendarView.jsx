import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
  isWithinInterval
} from 'date-fns';
import {
  setCalendarDate,
  setCalendarView,
  updateCalendarSettings
} from '../redux/slices/analyticsSlice';
import { addNotification, NOTIFICATION_TYPES } from '../redux/slices/notificationsSlice';

const CalendarView = ({ onBack }) => {
  const dispatch = useDispatch();
  const { teamMembers } = useSelector(state => state.members);
  const { calendar } = useSelector(state => state.analytics);
  const { currentRole } = useSelector(state => state.role);

  const [selectedDate, setSelectedDate] = useState(new Date(calendar.selectedDate));
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    members: [],
    priorities: [],
    categories: [],
    statusFilter: 'all' // 'all', 'active', 'completed', 'overdue'
  });

  // Calendar navigation
  const navigateMonth = (direction) => {
    const newDate = direction === 'next' 
      ? addMonths(selectedDate, 1)
      : subMonths(selectedDate, 1);
    setSelectedDate(newDate);
    dispatch(setCalendarDate(newDate.toISOString()));
  };

  const navigateToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    dispatch(setCalendarDate(today.toISOString()));
  };

  // Get all tasks for calendar display
  const getAllTasks = () => {
    return teamMembers.flatMap(member => 
      member.tasks.map(task => ({
        ...task,
        memberName: member.name,
        memberId: member.id,
        memberAvatar: member.avatar
      }))
    );
  };

  // Filter tasks based on current filters
  const getFilteredTasks = () => {
    const allTasks = getAllTasks();
    
    return allTasks.filter(task => {
      // Member filter
      if (filters.members.length > 0 && !filters.members.includes(task.memberId)) {
        return false;
      }
      
      // Priority filter
      if (filters.priorities.length > 0 && !filters.priorities.includes(task.priority)) {
        return false;
      }
      
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(task.category)) {
        return false;
      }
      
      // Status filter
      switch (filters.statusFilter) {
        case 'active':
          return task.progress > 0 && task.progress < 100;
        case 'completed':
          return task.progress === 100;
        case 'overdue':
          const dueDate = parseISO(task.dueDate);
          return task.progress < 100 && dueDate < new Date();
        default:
          return true;
      }
    });
  };

  // Get tasks for a specific date
  const getTasksForDate = (date) => {
    const tasks = getFilteredTasks();
    return tasks.filter(task => {
      const dueDate = parseISO(task.dueDate);
      return isSameDay(dueDate, date);
    });
  };

  // Get task priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  // Get task status indicator
  const getStatusIndicator = (task) => {
    if (task.progress === 100) return '✅';
    if (task.progress > 0) return '🔄';
    const dueDate = parseISO(task.dueDate);
    if (dueDate < new Date()) return '⚠️';
    return '📋';
  };

  // Handle date click
  const handleDateClick = (date) => {
    const tasks = getTasksForDate(date);
    if (tasks.length > 0) {
      setSelectedTasks(tasks);
      setShowTaskModal(true);
    }
    
    dispatch(addNotification({
      type: NOTIFICATION_TYPES.SYSTEM_UPDATE,
      title: 'Calendar Date Selected',
      message: `Selected ${format(date, 'MMMM dd, yyyy')} - ${tasks.length} tasks found`,
      priority: 'low',
      showAsToast: false,
      autoRead: true
    }));
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
      days.push(new Date(currentDate));
      currentDate = addDays(currentDate, 1);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  // Get calendar statistics
  const getCalendarStats = () => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const tasks = getFilteredTasks();
    
    const monthTasks = tasks.filter(task => {
      const dueDate = parseISO(task.dueDate);
      return isWithinInterval(dueDate, { start: monthStart, end: monthEnd });
    });

    const completedTasks = monthTasks.filter(t => t.progress === 100);
    const overdueTasks = monthTasks.filter(t => {
      const dueDate = parseISO(t.dueDate);
      return t.progress < 100 && dueDate < new Date();
    });

    return {
      totalTasks: monthTasks.length,
      completedTasks: completedTasks.length,
      overdueTasks: overdueTasks.length,
      completionRate: monthTasks.length > 0 ? Math.round((completedTasks.length / monthTasks.length) * 100) : 0
    };
  };

  const stats = getCalendarStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <button
            onClick={onBack}
            className="hover:text-blue-600 transition-colors"
          >
            Dashboard
          </button>
          <span>→</span>
          <span className="text-gray-900 font-medium">Calendar & Scheduling</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
          >
            <span>🎛️</span>
            <span>Filters</span>
          </button>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Calendar Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tasks This Month</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalTasks}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-green-600">{stats.completedTasks}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-3xl font-bold text-red-600">{stats.overdueTasks}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-3xl font-bold text-purple-600">{stats.completionRate}%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-2xl">📈</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Calendar Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Member Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Team Members</label>
              <select
                multiple
                value={filters.members}
                onChange={(e) => setFilters({
                  ...filters,
                  members: Array.from(e.target.selectedOptions, option => parseInt(option.value))
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {teamMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                multiple
                value={filters.priorities}
                onChange={(e) => setFilters({
                  ...filters,
                  priorities: Array.from(e.target.selectedOptions, option => option.value)
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {['urgent', 'high', 'medium', 'low'].map((priority) => (
                  <option key={priority} value={priority}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                multiple
                value={filters.categories}
                onChange={(e) => setFilters({
                  ...filters,
                  categories: Array.from(e.target.selectedOptions, option => option.value)
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {['development', 'design', 'testing', 'presentation', 'research', 'documentation', 'meeting'].map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.statusFilter}
                onChange={(e) => setFilters({
                  ...filters,
                  statusFilter: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Tasks</option>
                <option value="active">Active Only</option>
                <option value="completed">Completed Only</option>
                <option value="overdue">Overdue Only</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Calendar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="text-lg">←</span>
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              {format(selectedDate, 'MMMM yyyy')}
            </h2>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="text-lg">→</span>
            </button>
          </div>
          <button
            onClick={navigateToToday}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Today
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {/* Day Headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}

          {/* Calendar Days */}
          {calendarDays.map((day, index) => {
            const dayTasks = getTasksForDate(day);
            const isCurrentMonth = isSameMonth(day, selectedDate);
            const isCurrentDay = isToday(day);
            const hasHover = hoveredDate && isSameDay(day, hoveredDate);

            return (
              <div
                key={index}
                onClick={() => handleDateClick(day)}
                onMouseEnter={() => setHoveredDate(day)}
                onMouseLeave={() => setHoveredDate(null)}
                className={`
                  min-h-[120px] p-2 border border-gray-100 cursor-pointer transition-all hover:bg-gray-50
                  ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'}
                  ${isCurrentDay ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
                  ${hasHover ? 'shadow-md' : ''}
                  ${dayTasks.length > 0 ? 'hover:shadow-lg' : ''}
                `}
              >
                {/* Date Number */}
                <div className={`text-sm font-medium mb-1 ${
                  isCurrentDay ? 'text-blue-600' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {format(day, 'd')}
                </div>

                {/* Task Indicators */}
                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map((task, taskIndex) => (
                    <div
                      key={taskIndex}
                      className={`
                        flex items-center space-x-1 p-1 rounded text-xs truncate
                        ${calendar.taskDisplayMode === 'dots' ? 'justify-center' : ''}
                        ${task.progress === 100 ? 'bg-green-100 text-green-800' :
                          parseISO(task.dueDate) < new Date() ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'}
                      `}
                      title={`${task.title} - ${task.memberName} (${task.priority})`}
                    >
                      {calendar.taskDisplayMode === 'dots' ? (
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                      ) : (
                        <>
                          <span>{getStatusIndicator(task)}</span>
                          <span className="truncate">{task.title.substring(0, 15)}</span>
                        </>
                      )}
                    </div>
                  ))}
                  
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{dayTasks.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Calendar Legend */}
        <div className="flex flex-wrap items-center justify-between pt-4 border-t border-gray-200 text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Urgent</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>High</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Medium</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Low</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span>📋 Not Started</span>
            <span>🔄 In Progress</span>
            <span>✅ Completed</span>
            <span>⚠️ Overdue</span>
          </div>
        </div>
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Tasks for {selectedTasks.length > 0 && format(parseISO(selectedTasks[0].dueDate), 'MMMM dd, yyyy')}
                </h3>
                <button
                  onClick={() => setShowTaskModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="text-gray-400">✕</span>
                </button>
              </div>

              <div className="space-y-4">
                {selectedTasks.map((task) => (
                  <div key={`${task.memberId}-${task.id}`} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <img
                          src={task.memberAvatar}
                          alt={task.memberName}
                          className="w-6 h-6 rounded-full object-cover max-w-full max-h-full"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">{task.title}</h4>
                          <p className="text-sm text-gray-600">{task.memberName}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                        <span className="text-lg">{getStatusIndicator(task)}</span>
                      </div>
                    </div>

                    {task.description && (
                      <p className="text-sm text-gray-700 mb-3">{task.description}</p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>📂 {task.category}</span>
                        <span>⏱️ {task.estimatedHours}h estimated</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{task.progress}%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              task.progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView; 