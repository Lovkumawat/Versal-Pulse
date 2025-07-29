"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { format, startOfMonth, endOfMonth, isSameDay, parseISO, isWithinInterval } from "date-fns"
import { setCalendarDate } from "../redux/slices/analyticsSlice"
import { addNotification, NOTIFICATION_TYPES } from "../redux/slices/notificationsSlice"

const CalendarView = ({ onBack }) => {
  const dispatch = useDispatch()
  const { teamMembers } = useSelector((state) => state.members)
  const { calendar } = useSelector((state) => state.analytics)
  const { currentRole } = useSelector((state) => state.role)
  const [selectedDate, setSelectedDate] = useState(new Date(calendar.selectedDate))
  const [clickedDate, setClickedDate] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    members: [],
    priorities: [],
    categories: [],
    statusFilter: "all",
  })

  // Calendar navigation - simplified for date picker
  const navigateToToday = () => {
    const today = new Date()
    setSelectedDate(today)
    setClickedDate(today)
    dispatch(setCalendarDate(today.toISOString()))
  }

  // Get all tasks for calendar display
  const getAllTasks = () => {
    return teamMembers.flatMap((member) =>
      member.tasks.map((task) => ({
        ...task,
        memberName: member.name,
        memberId: member.id,
        memberAvatar: member.avatar,
      })),
    )
  }

  // Filter tasks based on current filters
  const getFilteredTasks = () => {
    const allTasks = getAllTasks()
    
    return allTasks.filter((task) => {
      // Member filter
      if (filters.members.length > 0 && !filters.members.includes(task.memberId)) {
        return false
      }
      
      // Priority filter
      if (filters.priorities.length > 0 && !filters.priorities.includes(task.priority)) {
        return false
      }
      
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(task.category)) {
        return false
      }
      
      // Status filter
      switch (filters.statusFilter) {
        case "active":
          return task.progress > 0 && task.progress < 100
        case "completed":
          return task.progress === 100
        case "overdue":
          const dueDate = parseISO(task.dueDate)
          return task.progress < 100 && dueDate < new Date()
        default:
          return true
      }
    })
  }

  // Get tasks for a specific date
  const getTasksForDate = (date) => {
    const tasks = getFilteredTasks()
    return tasks.filter((task) => {
      const dueDate = parseISO(task.dueDate)
      return isSameDay(dueDate, date)
    })
  }

  // Get task priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  // Get task status indicator
  const getStatusIndicator = (task) => {
    if (task.progress === 100) return "✅"
    if (task.progress > 0) return "🔄"
    const dueDate = parseISO(task.dueDate)
    if (dueDate < new Date()) return "⚠️"
    return "📋"
  }

  // Handle date click
  const handleDateClick = (date) => {
    setClickedDate(date)
    const tasks = getTasksForDate(date)

    dispatch(
      addNotification({
      type: NOTIFICATION_TYPES.SYSTEM_UPDATE,
        title: "Date Selected",
        message: `${format(date, "MMMM dd, yyyy")} - ${tasks.length} tasks found`,
        priority: "low",
      showAsToast: false,
        autoRead: true,
      }),
    )
  }

  // Get calendar statistics
  const getCalendarStats = () => {
    const monthStart = startOfMonth(selectedDate)
    const monthEnd = endOfMonth(selectedDate)
    const tasks = getFilteredTasks()

    const monthTasks = tasks.filter((task) => {
      const dueDate = parseISO(task.dueDate)
      return isWithinInterval(dueDate, { start: monthStart, end: monthEnd })
    })

    const completedTasks = monthTasks.filter((t) => t.progress === 100)
    const overdueTasks = monthTasks.filter((t) => {
      const dueDate = parseISO(t.dueDate)
      return t.progress < 100 && dueDate < new Date()
    })

    return {
      totalTasks: monthTasks.length,
      completedTasks: completedTasks.length,
      overdueTasks: overdueTasks.length,
      completionRate: monthTasks.length > 0 ? Math.round((completedTasks.length / monthTasks.length) * 100) : 0,
    }
  }

  const stats = getCalendarStats()
  const selectedDateTasks = clickedDate ? getTasksForDate(clickedDate) : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            {/* <div className="flex items-center space-x-2 text-sm text-slate-600">
          <button
            onClick={onBack}
                className="flex items-center space-x-1 hover:text-blue-600 transition-colors duration-200 group"
              >
                <svg
                  className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Dashboard</span>
          </button>
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-slate-900 font-semibold">Calendar & Scheduling</span>
            </div> */}
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                showFilters
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                  : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                />
              </svg>
            <span>Filters</span>
          </button>
          <button
            onClick={onBack}
              className="px-6 py-3 bg-white text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-200 font-medium border border-slate-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
              Back to Dashboard
          </button>
        </div>
      </div>

        {/* Enhanced Calendar Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group relative overflow-hidden bg-white rounded-2xl shadow-xl border border-slate-200 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10"></div>
            <div className="relative flex items-center justify-between">
            <div>
                <p className="text-sm font-semibold text-slate-600 mb-1">Tasks This Month</p>
                <p className="text-3xl font-bold text-blue-600 mb-2">{stats.totalTasks}</p>
                <div className="flex items-center text-xs text-slate-500">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                  <span>Total scheduled</span>
                </div>
            </div>
              <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl shadow-inner">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
            </div>
          </div>
        </div>

          <div className="group relative overflow-hidden bg-white rounded-2xl shadow-xl border border-slate-200 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-emerald-600/10"></div>
            <div className="relative flex items-center justify-between">
            <div>
                <p className="text-sm font-semibold text-slate-600 mb-1">Completed</p>
                <p className="text-3xl font-bold text-emerald-600 mb-2">{stats.completedTasks}</p>
                <div className="flex items-center text-xs text-slate-500">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Successfully done</span>
                </div>
            </div>
              <div className="p-4 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl shadow-inner">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
            </div>
          </div>
        </div>

          <div className="group relative overflow-hidden bg-white rounded-2xl shadow-xl border border-slate-200 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-red-600/10"></div>
            <div className="relative flex items-center justify-between">
            <div>
                <p className="text-sm font-semibold text-slate-600 mb-1">Overdue</p>
                <p className="text-3xl font-bold text-red-600 mb-2">{stats.overdueTasks}</p>
                <div className="flex items-center text-xs text-slate-500">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Needs attention</span>
                </div>
            </div>
              <div className="p-4 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl shadow-inner">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
            </div>
          </div>
        </div>

          <div className="group relative overflow-hidden bg-white rounded-2xl shadow-xl border border-slate-200 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10"></div>
            <div className="relative flex items-center justify-between">
            <div>
                <p className="text-sm font-semibold text-slate-600 mb-1">Completion Rate</p>
                <p className="text-3xl font-bold text-purple-600 mb-2">{stats.completionRate}%</p>
                <div className="flex items-center text-xs text-slate-500">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Overall progress</span>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl shadow-inner">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
            </div>
            </div>
          </div>
        </div>

        {/* Enhanced Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 transform transition-all duration-300 animate-in slide-in-from-top-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Calendar Filters</h3>
              </div>
              <button
                onClick={() => setFilters({ members: [], priorities: [], categories: [], statusFilter: "all" })}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors duration-200"
              >
                Clear All
              </button>
      </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Member Filter */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700">Team Members</label>
              <select
                multiple
                value={filters.members}
                  onChange={(e) =>
                    setFilters({
                  ...filters,
                      members: Array.from(e.target.selectedOptions, (option) => Number.parseInt(option.value)),
                    })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
              >
                {teamMembers.map((member) => (
                    <option key={member.id} value={member.id} className="py-2">
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700">Priority</label>
              <select
                multiple
                value={filters.priorities}
                  onChange={(e) =>
                    setFilters({
                  ...filters,
                      priorities: Array.from(e.target.selectedOptions, (option) => option.value),
                    })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                >
                  {["urgent", "high", "medium", "low"].map((priority) => (
                    <option key={priority} value={priority} className="py-2">
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700">Category</label>
              <select
                multiple
                value={filters.categories}
                  onChange={(e) =>
                    setFilters({
                  ...filters,
                      categories: Array.from(e.target.selectedOptions, (option) => option.value),
                    })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                >
                  {["development", "design", "testing", "presentation", "research", "documentation", "meeting"].map(
                    (category) => (
                      <option key={category} value={category} className="py-2">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                    ),
                  )}
              </select>
            </div>

            {/* Status Filter */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700">Status</label>
              <select
                value={filters.statusFilter}
                  onChange={(e) =>
                    setFilters({
                  ...filters,
                      statusFilter: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
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

        {/* Enhanced Main Calendar Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Enhanced Date Picker Section */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
              {/* Enhanced Date Picker Header */}
              <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white p-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold mb-2">Select Date</h2>
                  <p className="text-blue-100 text-sm">Choose a date to view scheduled tasks</p>
                </div>
              </div>

              {/* Enhanced Date Picker Body */}
              <div className="p-6 space-y-6">
                {/* Date Input */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700">Pick a Date</label>
                  <input
                    type="date"
                    value={clickedDate ? format(clickedDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")}
                    onChange={(e) => {
                      const selectedDate = new Date(e.target.value)
                      handleDateClick(selectedDate)
                    }}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  />
                </div>

                {/* Enhanced Quick Date Selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700">Quick Select</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleDateClick(new Date())}
                      className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Today
                    </button>
            <button
                      onClick={() => {
                        const tomorrow = new Date()
                        tomorrow.setDate(tomorrow.getDate() + 1)
                        handleDateClick(tomorrow)
                      }}
                      className="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all duration-200 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Tomorrow
            </button>
            <button
                      onClick={() => {
                        const nextWeek = new Date()
                        nextWeek.setDate(nextWeek.getDate() + 7)
                        handleDateClick(nextWeek)
                      }}
                      className="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all duration-200 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Next Week
            </button>
          <button
                      onClick={() => {
                        const nextMonth = new Date()
                        nextMonth.setMonth(nextMonth.getMonth() + 1)
                        handleDateClick(nextMonth)
                      }}
                      className="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all duration-200 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Next Month
          </button>
        </div>
                </div>

                {/* Enhanced Selected Date Display */}
                {clickedDate && (
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 shadow-inner">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-4 mb-4">
                        <div className="text-3xl font-bold text-blue-900 bg-white rounded-2xl p-4 shadow-lg">
                          {format(clickedDate, "dd")}
                        </div>
                        <div>
                          <div className="text-lg font-bold text-blue-800">{format(clickedDate, "EEE")}</div>
                          <div className="text-sm text-blue-600 font-medium">{format(clickedDate, "MMM yyyy")}</div>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-blue-200">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="p-2 bg-blue-200 rounded-lg">
                            <svg
                              className="w-4 h-4 text-blue-700"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              />
                            </svg>
                          </div>
                          <span className="text-sm font-bold text-blue-800">
                            {selectedDateTasks.length} {selectedDateTasks.length === 1 ? "Task" : "Tasks"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced Task Priority Legend */}
                <div className="pt-4 border-t border-slate-200">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-slate-700 mb-3">Task Priority Legend</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center space-x-2 p-2 bg-red-50 rounded-lg">
                        <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
                        <span className="text-red-700 font-medium">Urgent</span>
                      </div>
                      <div className="flex items-center space-x-2 p-2 bg-orange-50 rounded-lg">
                        <div className="w-3 h-3 bg-orange-500 rounded-full shadow-sm"></div>
                        <span className="text-orange-700 font-medium">High</span>
                      </div>
                      <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded-lg">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm"></div>
                        <span className="text-yellow-700 font-medium">Medium</span>
                      </div>
                      <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                        <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                        <span className="text-green-700 font-medium">Low</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Selected Date Tasks */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
              {clickedDate ? (
                <div>
                  {/* Enhanced Task Header */}
                  <div className="bg-gradient-to-r from-slate-50 via-slate-100 to-slate-50 px-8 py-6 border-b border-slate-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-1">{format(clickedDate, "EEEE")}</h3>
                        <p className="text-lg text-slate-600 font-medium mb-3">
                          {format(clickedDate, "MMMM dd, yyyy")}
                        </p>
          <div className="flex items-center space-x-4">
                          <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 text-sm font-bold rounded-full shadow-sm">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              />
                            </svg>
                            {selectedDateTasks.length} {selectedDateTasks.length === 1 ? "Task" : "Tasks"}
                          </span>
                          {selectedDateTasks.length > 0 && (
                            <span className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                              {selectedDateTasks.filter((t) => t.progress === 100).length} completed
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Enhanced Status Legend */}
                      <div className="hidden lg:flex items-center space-x-6 text-xs text-slate-600">
                        <div className="flex items-center space-x-2 p-2 bg-slate-100 rounded-lg">
                          <span className="text-lg">📋</span>
                          <span className="font-medium">Not Started</span>
                        </div>
                        <div className="flex items-center space-x-2 p-2 bg-blue-100 rounded-lg">
                          <span className="text-lg">🔄</span>
                          <span className="font-medium">In Progress</span>
                        </div>
                        <div className="flex items-center space-x-2 p-2 bg-emerald-100 rounded-lg">
                          <span className="text-lg">✅</span>
                          <span className="font-medium">Completed</span>
                        </div>
                        <div className="flex items-center space-x-2 p-2 bg-red-100 rounded-lg">
                          <span className="text-lg">⚠️</span>
                          <span className="font-medium">Overdue</span>
                        </div>
          </div>
        </div>
      </div>

                  {/* Enhanced Task Content */}
                  <div className="p-8">
                    {selectedDateTasks.length === 0 ? (
                      <div className="text-center py-20">
                        <div className="mx-auto w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
                          <svg
                            className="w-16 h-16 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 mb-3">No tasks scheduled</h4>
                        <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                          This date is free! You can add new tasks or enjoy some well-deserved rest.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {selectedDateTasks.map((task, index) => (
                          <div
                            key={`${task.memberId}-${task.id}`}
                            className="group relative bg-gradient-to-r from-slate-50 to-slate-100 hover:from-blue-50 hover:to-indigo-50 border border-slate-200 hover:border-blue-300 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
                          >
                            {/* Enhanced Task Header */}
                            <div className="flex items-start justify-between mb-5">
                              <div className="flex items-center space-x-4">
                                <div className="relative">
                                  <img
                                    src={task.memberAvatar || "/placeholder.svg"}
                                    alt={task.memberName}
                                    className="w-12 h-12 rounded-full object-cover ring-4 ring-white shadow-lg"
                                  />
                                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                                    <span className="text-sm">{getStatusIndicator(task)}</span>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors text-lg">
                                    {task.title}
                                  </h4>
                                  <p className="text-sm text-slate-600 font-semibold">{task.memberName}</p>
                                </div>
                              </div>

                              <div className="flex items-center space-x-3">
                                <span
                                  className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-bold shadow-sm ${
                                    task.priority === "urgent"
                                      ? "bg-gradient-to-r from-red-100 to-red-200 text-red-800"
                                      : task.priority === "high"
                                        ? "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800"
                                        : task.priority === "medium"
                                          ? "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800"
                                          : "bg-gradient-to-r from-green-100 to-green-200 text-green-800"
                                  }`}
                                >
                                  {task.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>

                            {/* Enhanced Task Description */}
                    {task.description && (
                              <div className="mb-5">
                                <p className="text-sm text-slate-700 bg-white rounded-xl p-4 border border-slate-200 shadow-sm leading-relaxed">
                                  {task.description}
                                </p>
                              </div>
                            )}

                            {/* Enhanced Task Metadata */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex items-center space-x-6 text-sm text-slate-600">
                                <div className="flex items-center space-x-2 p-2 bg-white rounded-lg shadow-sm">
                                  <svg
                                    className="w-4 h-4 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M8 5a2 2 0 012-2h2a2 2 0 012 2v0a2 2 0 01-2 2H10a2 2 0 01-2-2v0z"
                                    />
                                  </svg>
                                  <span className="capitalize font-medium">{task.category}</span>
                                </div>
                                <div className="flex items-center space-x-2 p-2 bg-white rounded-lg shadow-sm">
                                  <svg
                                    className="w-4 h-4 text-purple-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  <span className="font-medium">{task.estimatedHours}h estimated</span>
                                </div>
                      </div>

                              {/* Enhanced Progress Bar */}
                              <div className="flex items-center space-x-4">
                                <span className="text-sm font-bold text-slate-700 min-w-[3rem]">{task.progress}%</span>
                                <div className="w-32 bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
                                  <div
                                    className={`h-full transition-all duration-500 ${
                                      task.progress === 100
                                        ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
                                        : "bg-gradient-to-r from-blue-400 to-blue-600"
                                    } shadow-sm`}
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                            {/* Enhanced Task Number Indicator */}
                            <div className="absolute top-4 left-4 w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                              {index + 1}
                    </div>
                  </div>
                ))}
              </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-8">
                  <div className="text-center py-20">
                    <div className="mx-auto w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
                      <svg className="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-3">Select a date to view tasks</h4>
                    <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                      Click on any date in the calendar to see scheduled tasks and their details.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarView
