import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  calculateAnalytics,
  setDatePreset,
  updateFilters,
  updateViewSettings,
  exportAnalytics,
  clearError
} from '../redux/slices/analyticsSlice';
import { addNotification, NOTIFICATION_TYPES } from '../redux/slices/notificationsSlice';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsDashboard = ({ onBack }) => {
  const dispatch = useDispatch();
  const {
    cachedMetrics,
    chartData,
    dateRange,
    filters,
    viewSettings,
    exportStatus,
    isLoading,
    error
  } = useSelector(state => state.analytics);
  
  const { teamMembers } = useSelector(state => state.members);
  const { currentRole } = useSelector(state => state.role);
  
  const [selectedView, setSelectedView] = useState('overview'); // 'overview', 'members', 'tasks', 'time'
  const [showFilters, setShowFilters] = useState(false);

  // Calculate analytics on component mount and when dependencies change
  useEffect(() => {
    dispatch(calculateAnalytics());
  }, [dispatch, dateRange, filters]);

  // Auto-refresh analytics based on refresh interval
  useEffect(() => {
    if (viewSettings.refreshInterval > 0) {
      const interval = setInterval(() => {
        dispatch(calculateAnalytics());
      }, viewSettings.refreshInterval);
      
      return () => clearInterval(interval);
    }
  }, [dispatch, viewSettings.refreshInterval]);

  const handleDatePresetChange = (preset) => {
    dispatch(setDatePreset(preset));
  };

  const handleFilterChange = (filterType, value) => {
    dispatch(updateFilters({ [filterType]: value }));
  };

  const handleExport = (format) => {
    dispatch(exportAnalytics(format));
  };

  const handleViewChange = (view) => {
    setSelectedView(view);
    
    // Analytics tracking
    dispatch(addNotification({
      type: NOTIFICATION_TYPES.SYSTEM_UPDATE,
      title: 'Analytics View Changed',
      message: `Switched to ${view} analytics view`,
      priority: 'low',
      showAsToast: false,
      autoRead: true
    }));
  };

  // Chart options
  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 11
          }
        }
      }
    }
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        cornerRadius: 8
      }
    }
  };

  if (isLoading && !cachedMetrics.lastCalculated) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Calculating analytics...</p>
        </div>
      </div>
    );
  }

  const { teamOverview, memberMetrics, categoryMetrics, deadlineAnalytics } = cachedMetrics;

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <button
            onClick={onBack}
            className="hover:text-blue-600 transition-colors"
          >
            Dashboard
          </button>
          <span>→</span>
          <span className="text-gray-900 font-medium">Analytics & Reports</span>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Export Button */}
          <div className="relative">
            <button
              onClick={() => handleExport('pdf')}
              disabled={exportStatus.isExporting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {exportStatus.isExporting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <span>📊</span>
                  <span>Export Report</span>
                </>
              )}
            </button>
          </div>
          
          {/* Back Button */}
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
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

      {/* Controls Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Date Range Presets */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Time Period:</span>
            {['thisWeek', 'thisMonth', 'lastMonth', 'last3Months'].map((preset) => (
              <button
                key={preset}
                onClick={() => handleDatePresetChange(preset)}
                className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                  dateRange.preset === preset
                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {preset === 'thisWeek' && 'This Week'}
                {preset === 'thisMonth' && 'This Month'}
                {preset === 'lastMonth' && 'Last Month'}
                {preset === 'last3Months' && 'Last 3 Months'}
              </button>
            ))}
          </div>

          {/* View Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">View:</span>
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'members', label: 'Team', icon: '👥' },
              { id: 'tasks', label: 'Tasks', icon: '📋' },
              { id: 'time', label: 'Time', icon: '⏱️' }
            ].map((view) => (
              <button
                key={view.id}
                onClick={() => handleViewChange(view.id)}
                className={`px-3 py-1 text-sm rounded-lg border transition-colors flex items-center space-x-1 ${
                  selectedView === view.id
                    ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <span>{view.icon}</span>
                <span>{view.label}</span>
              </button>
            ))}
          </div>

          {/* Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-1"
          >
            <span>🎛️</span>
            <span>Filters</span>
            <span className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Member Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Team Members</label>
                <select
                  multiple
                  value={filters.selectedMembers}
                  onChange={(e) => handleFilterChange('selectedMembers', 
                    Array.from(e.target.selectedOptions, option => parseInt(option.value))
                  )}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {teamMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                <select
                  multiple
                  value={filters.selectedCategories}
                  onChange={(e) => handleFilterChange('selectedCategories', 
                    Array.from(e.target.selectedOptions, option => option.value)
                  )}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.keys(categoryMetrics).map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priorities</label>
                <select
                  multiple
                  value={filters.selectedPriorities}
                  onChange={(e) => handleFilterChange('selectedPriorities', 
                    Array.from(e.target.selectedOptions, option => option.value)
                  )}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {['low', 'medium', 'high', 'urgent'].map((priority) => (
                    <option key={priority} value={priority}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overview View */}
      {selectedView === 'overview' && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                  <p className="text-3xl font-bold text-gray-900">{teamOverview.totalTasks}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {teamOverview.completedTasks} completed
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <span className="text-2xl">📋</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                  <p className="text-3xl font-bold text-green-600">
                    {teamOverview.totalTasks > 0 
                      ? Math.round((teamOverview.completedTasks / teamOverview.totalTasks) * 100)
                      : 0}%
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {teamOverview.inProgressTasks} in progress
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <span className="text-2xl">✅</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Time Tracked</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {Math.round(teamOverview.totalTimeTracked)}h
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    This {dateRange.preset.replace('this', '').replace('last', 'last ')}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <span className="text-2xl">⏱️</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Productivity Score</p>
                  <p className="text-3xl font-bold text-indigo-600">
                    {teamOverview.productivityScore}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {teamOverview.overdueTasks} overdue tasks
                  </p>
                </div>
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <span className="text-2xl">📈</span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Task Completion Trend */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📈</span>
                Task Completion Trend
              </h3>
              <div className="h-64">
                <Line data={chartData.taskCompletionTrend} options={commonChartOptions} />
              </div>
            </div>

            {/* Category Distribution */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">🥧</span>
                Task Distribution by Category
              </h3>
              <div className="h-64">
                <Pie data={chartData.categoryDistribution} options={pieChartOptions} />
              </div>
            </div>

            {/* Member Productivity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">👥</span>
                Team Productivity Scores
              </h3>
              <div className="h-64">
                <Bar data={chartData.memberProductivity} options={commonChartOptions} />
              </div>
            </div>

            {/* Deadline Performance */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">⏰</span>
                Deadline Performance
              </h3>
              <div className="h-64">
                <Doughnut data={chartData.deadlinePerformance} options={pieChartOptions} />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Team Members View */}
      {selectedView === 'members' && (
        <div className="space-y-6">
          {/* Team Performance Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">👥</span>
              Team Performance Overview
            </h3>
            <div className="h-80">
              <Bar data={chartData.workloadDistribution} options={commonChartOptions} />
            </div>
          </div>

          {/* Individual Member Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {Object.values(memberMetrics).map((member) => (
              <div key={member.name} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">{member.name}</h4>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    member.productivityScore >= 80 ? 'bg-green-100 text-green-800' :
                    member.productivityScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {member.productivityScore}% Score
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tasks Completed</span>
                    <span className="text-sm font-medium">{member.completedTasks}/{member.totalTasks}</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${member.completionRate}%` }}
                    ></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">
                        {Math.round(member.hoursTracked)}h
                      </div>
                      <div className="text-xs text-gray-500">Time Tracked</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600">
                        {member.overdueTasks}
                      </div>
                      <div className="text-xs text-gray-500">Overdue</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tasks View */}
      {selectedView === 'tasks' && (
        <div className="space-y-6">
          {/* Category Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Category Performance</h3>
              <div className="space-y-4">
                {Object.entries(categoryMetrics).map(([category, metrics]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {category}
                      </span>
                      <span className="text-sm text-gray-600">
                        {metrics.completedTasks}/{metrics.totalTasks} ({Math.round(metrics.completionRate)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${metrics.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Priority Breakdown</h3>
              <div className="space-y-4">
                {['urgent', 'high', 'medium', 'low'].map((priority) => {
                  const metrics = cachedMetrics.priorityMetrics[priority];
                  if (!metrics) return null;
                  
                  return (
                    <div key={priority} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          priority === 'urgent' ? 'bg-red-500' :
                          priority === 'high' ? 'bg-orange-500' :
                          priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></div>
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {priority}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {metrics.totalTasks} tasks ({metrics.completedTasks} done)
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Deadline Analytics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">⏰</span>
              Deadline Performance Analytics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {Math.round(deadlineAnalytics.onTimeCompletion || 0)}%
                </div>
                <div className="text-sm text-gray-600">On-Time Completion</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {Math.round(deadlineAnalytics.averageDelayDays || 0)}
                </div>
                <div className="text-sm text-gray-600">Avg Delay (Days)</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {deadlineAnalytics.upcomingDeadlines || 0}
                </div>
                <div className="text-sm text-gray-600">Upcoming (7 days)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Time Tracking View */}
      {selectedView === 'time' && (
        <div className="space-y-6">
          {/* Time Tracking Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">⏱️</span>
              Time Tracking Analysis
            </h3>
            <div className="h-80">
              <Bar data={chartData.timeTrackingAnalysis} options={commonChartOptions} />
            </div>
          </div>

          {/* Time Efficiency Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(teamOverview.totalTimeTracked)}h
              </div>
              <div className="text-sm text-gray-600">Total Tracked</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
              <div className="text-2xl font-bold text-green-600">
                {Object.values(memberMetrics).length > 0 
                  ? Math.round(teamOverview.totalTimeTracked / Object.values(memberMetrics).length)
                  : 0}h
              </div>
              <div className="text-sm text-gray-600">Avg per Member</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {teamOverview.completedTasks > 0 
                  ? Math.round(teamOverview.totalTimeTracked / teamOverview.completedTasks * 10) / 10
                  : 0}h
              </div>
              <div className="text-sm text-gray-600">Avg per Task</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
              <div className="text-2xl font-bold text-orange-600">85%</div>
              <div className="text-sm text-gray-600">Time Efficiency</div>
            </div>
          </div>
        </div>
      )}

      {/* Export Status */}
      {exportStatus.lastExport && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-green-600 mr-2">✅</span>
            <span className="text-green-800">
              Analytics report exported successfully on {new Date(exportStatus.lastExport).toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard; 