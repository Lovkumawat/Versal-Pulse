import { createSlice } from '@reduxjs/toolkit';
import { addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, format, parseISO } from 'date-fns';

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    // Date range for analytics
    dateRange: {
      start: startOfMonth(new Date()).toISOString(),
      end: endOfMonth(new Date()).toISOString(),
      preset: 'thisMonth' // 'thisWeek', 'thisMonth', 'lastMonth', 'last3Months', 'custom'
    },
    
    // Analytics filters
    filters: {
      selectedMembers: [], // Empty means all members
      selectedCategories: [], // Empty means all categories
      selectedPriorities: [], // Empty means all priorities
      includeCompleted: true,
      includeInProgress: true,
      includeNotStarted: true
    },
    
    // View preferences
    viewSettings: {
      chartType: 'mixed', // 'bar', 'line', 'pie', 'mixed'
      showComparisons: true,
      showTrends: true,
      refreshInterval: 300000, // 5 minutes in milliseconds
      exportFormat: 'pdf' // 'pdf', 'csv', 'excel'
    },
    
    // Calendar settings
    calendar: {
      view: 'month', // 'week', 'month', 'year'
      selectedDate: new Date().toISOString(),
      showWeekends: true,
      showCompletedTasks: false,
      taskDisplayMode: 'dots' // 'dots', 'bars', 'list'
    },
    
    // Cached calculations (updated when data changes)
    cachedMetrics: {
      lastCalculated: null,
      teamOverview: {
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        overdueTasks: 0,
        totalTimeTracked: 0,
        averageCompletionTime: 0,
        productivityScore: 0
      },
      memberMetrics: {}, // Keyed by member ID
      categoryMetrics: {}, // Keyed by category
      priorityMetrics: {}, // Keyed by priority
      timeAnalytics: {
        dailyProductivity: [],
        weeklyTrends: [],
        monthlyComparison: []
      },
      deadlineAnalytics: {
        onTimeCompletion: 0,
        averageDelayDays: 0,
        upcomingDeadlines: []
      }
    },
    
    // Chart data
    chartData: {
      taskCompletionTrend: { labels: [], datasets: [] },
      memberProductivity: { labels: [], datasets: [] },
      categoryDistribution: { labels: [], datasets: [] },
      timeTrackingAnalysis: { labels: [], datasets: [] },
      deadlinePerformance: { labels: [], datasets: [] },
      workloadDistribution: { labels: [], datasets: [] }
    },
    
    // Export status
    exportStatus: {
      isExporting: false,
      lastExport: null,
      error: null
    },
    
    error: null,
    isLoading: false
  },
  
  reducers: {
    // Date range management
    setDateRange: (state, action) => {
      const { start, end, preset } = action.payload;
      state.dateRange = { start, end, preset };
      state.cachedMetrics.lastCalculated = null; // Invalidate cache
    },
    
    setDatePreset: (state, action) => {
      const preset = action.payload;
      const now = new Date();
      let start, end;
      
      switch (preset) {
        case 'thisWeek':
          start = startOfWeek(now);
          end = endOfWeek(now);
          break;
        case 'thisMonth':
          start = startOfMonth(now);
          end = endOfMonth(now);
          break;
        case 'lastMonth':
          const lastMonth = addDays(startOfMonth(now), -1);
          start = startOfMonth(lastMonth);
          end = endOfMonth(lastMonth);
          break;
        case 'last3Months':
          start = addDays(startOfMonth(now), -90);
          end = endOfMonth(now);
          break;
        default:
          return; // Don't change for custom
      }
      
      state.dateRange = {
        start: start.toISOString(),
        end: end.toISOString(),
        preset
      };
      state.cachedMetrics.lastCalculated = null;
    },
    
    // Filter management
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.cachedMetrics.lastCalculated = null;
    },
    
    // View settings
    updateViewSettings: (state, action) => {
      state.viewSettings = { ...state.viewSettings, ...action.payload };
    },
    
    // Calendar management
    updateCalendarSettings: (state, action) => {
      state.calendar = { ...state.calendar, ...action.payload };
    },
    
    setCalendarDate: (state, action) => {
      state.calendar.selectedDate = action.payload;
    },
    
    setCalendarView: (state, action) => {
      state.calendar.view = action.payload;
    },
    
    // Metrics calculation (this will be called by a thunk)
    setCalculatedMetrics: (state, action) => {
      state.cachedMetrics = {
        ...state.cachedMetrics,
        ...action.payload,
        lastCalculated: new Date().toISOString()
      };
      state.isLoading = false;
      state.error = null;
    },
    
    // Chart data updates
    updateChartData: (state, action) => {
      state.chartData = { ...state.chartData, ...action.payload };
    },
    
    // Export functionality
    startExport: (state, action) => {
      state.exportStatus.isExporting = true;
      state.exportStatus.error = null;
    },
    
    exportSuccess: (state, action) => {
      state.exportStatus.isExporting = false;
      state.exportStatus.lastExport = new Date().toISOString();
      state.exportStatus.error = null;
    },
    
    exportFailure: (state, action) => {
      state.exportStatus.isExporting = false;
      state.exportStatus.error = action.payload;
    },
    
    // General state management
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    clearError: (state) => {
      state.error = null;
      state.exportStatus.error = null;
    },
    
    // Invalidate cache (when underlying data changes)
    invalidateCache: (state) => {
      state.cachedMetrics.lastCalculated = null;
    }
  }
});

// Thunk for calculating comprehensive metrics
export const calculateAnalytics = () => (dispatch, getState) => {
  try {
    dispatch(setLoading(true));
    
    const state = getState();
    const { teamMembers } = state.members;
    const { dateRange, filters } = state.analytics;
    
    // Parse date range
    const startDate = parseISO(dateRange.start);
    const endDate = parseISO(dateRange.end);
    
    // Helper function to check if a task/date is in range
    const isInDateRange = (dateString) => {
      if (!dateString) return false;
      const date = parseISO(dateString);
      return isWithinInterval(date, { start: startDate, end: endDate });
    };
    
    // Filter tasks based on criteria
    const getFilteredTasks = (member) => {
      return member.tasks.filter(task => {
        // Date range filter
        const inDateRange = isInDateRange(task.createdAt) || 
                           isInDateRange(task.updatedAt) || 
                           isInDateRange(task.completedAt);
        
        if (!inDateRange) return false;
        
        // Category filter
        if (filters.selectedCategories.length > 0 && 
            !filters.selectedCategories.includes(task.category)) {
          return false;
        }
        
        // Priority filter
        if (filters.selectedPriorities.length > 0 && 
            !filters.selectedPriorities.includes(task.priority)) {
          return false;
        }
        
        // Status filter
        if (task.progress === 100 && !filters.includeCompleted) return false;
        if (task.progress > 0 && task.progress < 100 && !filters.includeInProgress) return false;
        if (task.progress === 0 && !filters.includeNotStarted) return false;
        
        return true;
      });
    };
    
    // Filter members
    const filteredMembers = teamMembers.filter(member => 
      filters.selectedMembers.length === 0 || 
      filters.selectedMembers.includes(member.id)
    );
    
    // Calculate team overview metrics
    let totalTasks = 0;
    let completedTasks = 0;
    let inProgressTasks = 0;
    let overdueTasks = 0;
    let totalTimeTracked = 0;
    let totalCompletionTime = 0;
    let completedWithTime = 0;
    
    const memberMetrics = {};
    const categoryMetrics = {};
    const priorityMetrics = {};
    
    filteredMembers.forEach(member => {
      const tasks = getFilteredTasks(member);
      const memberCompleted = tasks.filter(t => t.progress === 100);
      const memberInProgress = tasks.filter(t => t.progress > 0 && t.progress < 100);
      const memberOverdue = tasks.filter(t => {
        if (t.progress === 100) return false;
        const dueDate = parseISO(t.dueDate);
        return dueDate < new Date();
      });
      
      totalTasks += tasks.length;
      completedTasks += memberCompleted.length;
      inProgressTasks += memberInProgress.length;
      overdueTasks += memberOverdue.length;
      
      // Time tracking calculations
      const memberTimeTracked = tasks.reduce((sum, task) => {
        const timeMs = task.timeTracking?.totalTime || 0;
        return sum + timeMs;
      }, 0);
      
      totalTimeTracked += memberTimeTracked;
      
      // Completion time analysis
      memberCompleted.forEach(task => {
        if (task.createdAt && task.completedAt) {
          const created = parseISO(task.createdAt);
          const completed = parseISO(task.completedAt);
          const completionTime = completed - created;
          totalCompletionTime += completionTime;
          completedWithTime++;
        }
      });
      
      // Member-specific metrics
      memberMetrics[member.id] = {
        name: member.name,
        totalTasks: tasks.length,
        completedTasks: memberCompleted.length,
        inProgressTasks: memberInProgress.length,
        overdueTasks: memberOverdue.length,
        completionRate: tasks.length > 0 ? (memberCompleted.length / tasks.length) * 100 : 0,
        averageProgress: tasks.length > 0 ? tasks.reduce((sum, t) => sum + t.progress, 0) / tasks.length : 0,
        timeTracked: memberTimeTracked,
        hoursTracked: memberTimeTracked / (1000 * 60 * 60),
        productivityScore: calculateProductivityScore(tasks, memberTimeTracked),
        tasksThisWeek: tasks.filter(t => isInDateRange(t.updatedAt) && 
          isWithinInterval(parseISO(t.updatedAt), { 
            start: startOfWeek(new Date()), 
            end: endOfWeek(new Date()) 
          })).length
      };
      
      // Category metrics
      tasks.forEach(task => {
        if (!categoryMetrics[task.category]) {
          categoryMetrics[task.category] = {
            totalTasks: 0,
            completedTasks: 0,
            totalTime: 0,
            averageProgress: 0
          };
        }
        
        categoryMetrics[task.category].totalTasks++;
        if (task.progress === 100) categoryMetrics[task.category].completedTasks++;
        categoryMetrics[task.category].totalTime += task.timeTracking?.totalTime || 0;
      });
      
      // Priority metrics
      tasks.forEach(task => {
        if (!priorityMetrics[task.priority]) {
          priorityMetrics[task.priority] = {
            totalTasks: 0,
            completedTasks: 0,
            onTime: 0,
            overdue: 0
          };
        }
        
        priorityMetrics[task.priority].totalTasks++;
        if (task.progress === 100) {
          priorityMetrics[task.priority].completedTasks++;
          const dueDate = parseISO(task.dueDate);
          const completedDate = parseISO(task.completedAt);
          if (completedDate <= dueDate) {
            priorityMetrics[task.priority].onTime++;
          }
        } else if (parseISO(task.dueDate) < new Date()) {
          priorityMetrics[task.priority].overdue++;
        }
      });
    });
    
    // Calculate completion rates for categories
    Object.keys(categoryMetrics).forEach(category => {
      const cat = categoryMetrics[category];
      cat.completionRate = cat.totalTasks > 0 ? (cat.completedTasks / cat.totalTasks) * 100 : 0;
      cat.averageTime = cat.completedTasks > 0 ? cat.totalTime / cat.completedTasks : 0;
    });
    
    // Team productivity score
    const productivityScore = calculateTeamProductivityScore({
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
      overdueRate: totalTasks > 0 ? (overdueTasks / totalTasks) * 100 : 0,
      timeEfficiency: calculateTimeEfficiency(filteredMembers)
    });
    
    // Average completion time
    const averageCompletionTime = completedWithTime > 0 ? 
      totalCompletionTime / completedWithTime : 0;
    
    // Time analytics
    const timeAnalytics = calculateTimeAnalytics(filteredMembers, dateRange);
    
    // Deadline analytics
    const deadlineAnalytics = calculateDeadlineAnalytics(filteredMembers);
    
    // Dispatch the calculated metrics
    dispatch(setCalculatedMetrics({
      teamOverview: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        overdueTasks,
        totalTimeTracked: totalTimeTracked / (1000 * 60 * 60), // Convert to hours
        averageCompletionTime: averageCompletionTime / (1000 * 60 * 60 * 24), // Convert to days
        productivityScore
      },
      memberMetrics,
      categoryMetrics,
      priorityMetrics,
      timeAnalytics,
      deadlineAnalytics
    }));
    
    // Generate chart data
    dispatch(generateChartData());
    
  } catch (error) {
    dispatch(setError(error.message));
  }
};

// Helper function to calculate productivity score for a member
function calculateProductivityScore(tasks, timeTracked) {
  if (tasks.length === 0) return 0;
  
  const completionRate = (tasks.filter(t => t.progress === 100).length / tasks.length) * 100;
  const averageProgress = tasks.reduce((sum, t) => sum + t.progress, 0) / tasks.length;
  const onTimeRate = calculateOnTimeRate(tasks);
  const timeEfficiency = calculateTaskTimeEfficiency(tasks, timeTracked);
  
  // Weighted score: 40% completion rate, 30% progress, 20% on-time, 10% efficiency
  return Math.round(
    (completionRate * 0.4) + 
    (averageProgress * 0.3) + 
    (onTimeRate * 0.2) + 
    (timeEfficiency * 0.1)
  );
}

// Helper function to calculate team productivity score
function calculateTeamProductivityScore({ completionRate, overdueRate, timeEfficiency }) {
  const overdueImpact = Math.max(0, 100 - (overdueRate * 2)); // Overdue tasks hurt score
  return Math.round(
    (completionRate * 0.5) + 
    (overdueImpact * 0.3) + 
    (timeEfficiency * 0.2)
  );
}

// Helper function to calculate on-time completion rate
function calculateOnTimeRate(tasks) {
  const completedTasks = tasks.filter(t => t.progress === 100 && t.completedAt);
  if (completedTasks.length === 0) return 100;
  
  const onTimeTasks = completedTasks.filter(task => {
    const dueDate = parseISO(task.dueDate);
    const completedDate = parseISO(task.completedAt);
    return completedDate <= dueDate;
  });
  
  return (onTimeTasks.length / completedTasks.length) * 100;
}

// Helper function to calculate time efficiency
function calculateTimeEfficiency(members) {
  let totalEstimated = 0;
  let totalActual = 0;
  
  members.forEach(member => {
    member.tasks.forEach(task => {
      if (task.estimatedHours && task.actualHours) {
        totalEstimated += task.estimatedHours;
        totalActual += task.actualHours;
      }
    });
  });
  
  if (totalActual === 0) return 100;
  return Math.min(100, (totalEstimated / totalActual) * 100);
}

// Helper function to calculate task time efficiency
function calculateTaskTimeEfficiency(tasks, timeTracked) {
  const totalEstimated = tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
  const actualHours = timeTracked / (1000 * 60 * 60);
  
  if (actualHours === 0) return 100;
  return Math.min(100, (totalEstimated / actualHours) * 100);
}

// Helper function to calculate time analytics
function calculateTimeAnalytics(members, dateRange) {
  // This would calculate daily/weekly/monthly productivity trends
  // Implementation would involve grouping tasks by time periods
  return {
    dailyProductivity: [],
    weeklyTrends: [],
    monthlyComparison: []
  };
}

// Helper function to calculate deadline analytics
function calculateDeadlineAnalytics(members) {
  const allTasks = members.flatMap(m => m.tasks);
  const completedTasks = allTasks.filter(t => t.progress === 100 && t.completedAt);
  
  let onTimeCount = 0;
  let totalDelay = 0;
  
  completedTasks.forEach(task => {
    const dueDate = parseISO(task.dueDate);
    const completedDate = parseISO(task.completedAt);
    
    if (completedDate <= dueDate) {
      onTimeCount++;
    } else {
      const delay = (completedDate - dueDate) / (1000 * 60 * 60 * 24); // Days
      totalDelay += delay;
    }
  });
  
  const onTimeCompletion = completedTasks.length > 0 ? 
    (onTimeCount / completedTasks.length) * 100 : 100;
  
  const averageDelayDays = (completedTasks.length - onTimeCount) > 0 ? 
    totalDelay / (completedTasks.length - onTimeCount) : 0;
  
  // Upcoming deadlines (next 7 days)
  const nextWeek = addDays(new Date(), 7);
  const upcomingDeadlines = allTasks.filter(task => {
    if (task.progress === 100) return false;
    const dueDate = parseISO(task.dueDate);
    return dueDate >= new Date() && dueDate <= nextWeek;
  }).length;
  
  return {
    onTimeCompletion,
    averageDelayDays,
    upcomingDeadlines
  };
}

// Thunk for generating chart data
export const generateChartData = () => (dispatch, getState) => {
  const state = getState();
  const { cachedMetrics } = state.analytics;
  
  // Generate different chart data sets based on cached metrics
  const chartData = {
    taskCompletionTrend: generateCompletionTrendData(cachedMetrics),
    memberProductivity: generateMemberProductivityData(cachedMetrics.memberMetrics),
    categoryDistribution: generateCategoryDistributionData(cachedMetrics.categoryMetrics),
    timeTrackingAnalysis: generateTimeTrackingData(cachedMetrics.memberMetrics),
    deadlinePerformance: generateDeadlinePerformanceData(cachedMetrics.deadlineAnalytics),
    workloadDistribution: generateWorkloadDistributionData(cachedMetrics.memberMetrics)
  };
  
  dispatch(updateChartData(chartData));
};

// Chart data generators
function generateCompletionTrendData(metrics) {
  // This would generate time series data for task completion trends
  return {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Tasks Completed',
      data: [12, 19, 15, 25],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4
    }]
  };
}

function generateMemberProductivityData(memberMetrics) {
  const members = Object.values(memberMetrics);
  return {
    labels: members.map(m => m.name),
    datasets: [{
      label: 'Productivity Score',
      data: members.map(m => m.productivityScore),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(139, 92, 246, 0.8)'
      ]
    }]
  };
}

function generateCategoryDistributionData(categoryMetrics) {
  const categories = Object.keys(categoryMetrics);
  return {
    labels: categories.map(c => c.charAt(0).toUpperCase() + c.slice(1)),
    datasets: [{
      data: categories.map(c => categoryMetrics[c].totalTasks),
      backgroundColor: [
        '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16'
      ]
    }]
  };
}

function generateTimeTrackingData(memberMetrics) {
  const members = Object.values(memberMetrics);
  return {
    labels: members.map(m => m.name),
    datasets: [{
      label: 'Hours Tracked',
      data: members.map(m => m.hoursTracked),
      backgroundColor: 'rgba(16, 185, 129, 0.8)'
    }]
  };
}

function generateDeadlinePerformanceData(deadlineAnalytics) {
  return {
    labels: ['On Time', 'Delayed'],
    datasets: [{
      data: [
        deadlineAnalytics.onTimeCompletion || 0,
        100 - (deadlineAnalytics.onTimeCompletion || 0)
      ],
      backgroundColor: ['#10B981', '#EF4444']
    }]
  };
}

function generateWorkloadDistributionData(memberMetrics) {
  const members = Object.values(memberMetrics);
  return {
    labels: members.map(m => m.name),
    datasets: [
      {
        label: 'Completed Tasks',
        data: members.map(m => m.completedTasks),
        backgroundColor: 'rgba(16, 185, 129, 0.8)'
      },
      {
        label: 'In Progress Tasks',
        data: members.map(m => m.inProgressTasks),
        backgroundColor: 'rgba(245, 158, 11, 0.8)'
      }
    ]
  };
}

// Export functionality
export const exportAnalytics = (format = 'pdf') => async (dispatch, getState) => {
  try {
    dispatch(startExport());
    
    const state = getState();
    const { cachedMetrics, dateRange } = state.analytics;
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real implementation, this would generate and download the file
    console.log(`Exporting analytics in ${format} format...`);
    console.log('Analytics data:', cachedMetrics);
    
    dispatch(exportSuccess());
    
    // Show success notification
    const { addNotification, NOTIFICATION_TYPES } = await import('./notificationsSlice');
    dispatch(addNotification({
      type: NOTIFICATION_TYPES.SYSTEM_UPDATE,
      title: 'Analytics Export Complete',
      message: `Analytics report exported successfully in ${format.toUpperCase()} format`,
      priority: 'medium',
      showAsToast: true
    }));
    
  } catch (error) {
    dispatch(exportFailure(error.message));
  }
};

export const {
  setDateRange,
  setDatePreset,
  updateFilters,
  updateViewSettings,
  updateCalendarSettings,
  setCalendarDate,
  setCalendarView,
  setCalculatedMetrics,
  updateChartData,
  startExport,
  exportSuccess,
  exportFailure,
  setLoading,
  setError,
  clearError,
  invalidateCache
} = analyticsSlice.actions;

export default analyticsSlice.reducer; 