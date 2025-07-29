import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import MemberCard from '../components/MemberCard';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import StatusSelector from '../components/StatusSelector';
import StatusChart from '../components/StatusChart';
import MemberDetailPage from '../components/MemberDetailPage';
import TeamMembersView from '../components/TeamMembersView';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import CalendarView from '../components/CalendarView';
import { setStatusFilter, setSortBy } from '../redux/slices/membersSlice';
import { invalidateCache } from '../redux/slices/analyticsSlice';

const Dashboard = () => {
  const { currentRole } = useSelector(state => state.role);
  const { teamMembers, statusFilter, sortBy } = useSelector(state => state.members);
  const dispatch = useDispatch();
  
  // Navigation state
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'team-members', 'member-detail', 'analytics', 'calendar'
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  // Navigation handlers
  const handleViewMemberDetails = (memberId) => {
    setSelectedMemberId(memberId);
    setCurrentView('member-detail');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedMemberId(null);
  };

  const handleSidebarNavigate = (view, memberId = null) => {
    if (view === 'dashboard') {
      handleBackToDashboard();
    } else if (view === 'team-members') {
      setCurrentView('team-members');
      setSelectedMemberId(null);
    } else if (view === 'member-detail' && memberId) {
      handleViewMemberDetails(memberId);
    } else if (view === 'analytics') {
      setCurrentView('analytics');
      setSelectedMemberId(null);
      // Invalidate analytics cache to ensure fresh data
      dispatch(invalidateCache());
    } else if (view === 'calendar') {
      setCurrentView('calendar');
      setSelectedMemberId(null);
    }
  };

  // Filter and sort team members
  const getFilteredAndSortedMembers = () => {
    let filtered = teamMembers;
    
    // Apply status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(member => member.status === statusFilter);
    }
    
    // Apply sorting
    if (sortBy === 'activeTasks') {
      filtered = [...filtered].sort((a, b) => {
        const aActiveTasks = a.tasks.filter(task => task.progress < 100).length;
        const bActiveTasks = b.tasks.filter(task => task.progress < 100).length;
        return bActiveTasks - aActiveTasks; // Descending order
      });
    } else {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return filtered;
  };

  // Get status summary for Team Lead view
  const getStatusSummary = () => {
    const summary = teamMembers.reduce((acc, member) => {
      acc[member.status] = (acc[member.status] || 0) + 1;
      return acc;
    }, {});
    
    return summary;
  };

  const statusSummary = getStatusSummary();
  const filteredMembers = getFilteredAndSortedMembers();

  // Team Lead View
  const TeamLeadView = () => (
    <div className="space-y-8">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Team</p>
              <p className="text-3xl font-bold text-gray-900">{teamMembers.length}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Active members</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Working Now</p>
              <p className="text-3xl font-bold text-green-600">{statusSummary.Working || 0}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">💻</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Currently active</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-3xl font-bold text-blue-600">
                {teamMembers.reduce((sum, member) => sum + member.tasks.length, 0)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">📋</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Assigned tasks</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Productivity</p>
              <p className="text-3xl font-bold text-purple-600">
                {teamMembers.length > 0 ? Math.round(((statusSummary.Working || 0) / teamMembers.length) * 100) : 0}%
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-2xl">📈</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Team efficiency</p>
        </div>
      </div>

      {/* Charts and Task Form Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Status Chart */}
        <div className="lg:col-span-1">
          <StatusChart />
        </div>

        {/* Task Assignment Form */}
        <div className="lg:col-span-2">
          <TaskForm />
        </div>
      </div>

      {/* Team Members Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
              <p className="text-sm text-gray-500 mt-1">Monitor team status and task progress</p>
            </div>
            <div className="flex items-center space-x-3">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => dispatch(setStatusFilter(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="All">All Status</option>
                <option value="Working">💻 Working</option>
                <option value="Meeting">🎯 Meeting</option>
                <option value="Break">☕ Break</option>
                <option value="Offline">😴 Offline</option>
              </select>

              {/* Sort Options */}
              <select
                value={sortBy}
                onChange={(e) => dispatch(setSortBy(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="activeTasks">Sort by Active Tasks</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6">
          {filteredMembers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">👥</div>
              <p className="text-gray-500 text-lg">No team members match the selected filters</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredMembers.map((member) => (
                <MemberCard 
                  key={member.id} 
                  member={member} 
                  onViewDetails={handleViewMemberDetails}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Team Member View
  const TeamMemberView = () => {
    const { currentUser } = useSelector(state => state.role);
    const currentMember = teamMembers.find(member => member.name === currentUser);
    const myActiveTasks = currentMember?.tasks.filter(task => task.progress < 100).length || 0;
    const myCompletedTasks = currentMember?.tasks.filter(task => task.progress === 100).length || 0;

    return (
      <div className="space-y-8">
        {/* Personal Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">My Status</p>
                <p className="text-2xl font-bold text-indigo-600">{currentMember?.status || 'Unknown'}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <span className="text-2xl">
                  {currentMember?.status === 'Working' && '💻'}
                  {currentMember?.status === 'Meeting' && '🎯'}
                  {currentMember?.status === 'Break' && '☕'}
                  {currentMember?.status === 'Offline' && '😴'}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Current activity</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Tasks</p>
                <p className="text-2xl font-bold text-orange-600">{myActiveTasks}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <span className="text-2xl">📋</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">In progress</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{myCompletedTasks}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Tasks done</p>
          </div>
        </div>

        {/* Main Content Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Status Selector */}
          <div>
            <StatusSelector />
          </div>

          {/* Task List */}
          <div>
            <TaskList />
          </div>
        </div>

        {/* Team Overview and Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Status Chart */}
          <div>
            <StatusChart />
          </div>

          {/* Team Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Team Overview</h3>
              <span className="text-sm text-gray-500">{teamMembers.length} members</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{statusSummary.Working || 0}</div>
                <div className="text-sm text-green-800">💻 Working</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{statusSummary.Meeting || 0}</div>
                <div className="text-sm text-blue-800">🎯 Meeting</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{statusSummary.Break || 0}</div>
                <div className="text-sm text-yellow-800">☕ Break</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">{statusSummary.Offline || 0}</div>
                <div className="text-sm text-gray-800">😴 Offline</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Team Members</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-6 h-6 rounded-full object-cover max-w-full max-h-full"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                        <div className="text-xs text-gray-500">{member.tasks.length} tasks</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">
                        {member.status === 'Working' && '💻'}
                        {member.status === 'Meeting' && '🎯'}
                        {member.status === 'Break' && '☕'}
                        {member.status === 'Offline' && '😴'}
                      </span>
                      <span className="text-xs text-gray-500">{member.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

    // Render based on current view
  if (currentView === 'member-detail' && selectedMemberId) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <Sidebar
          currentView={currentView}
          onNavigate={handleSidebarNavigate}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            currentView={currentView}
            selectedMemberId={selectedMemberId}
          />
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <MemberDetailPage
                memberId={selectedMemberId}
                onBack={handleBackToDashboard}
              />
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Team Members View
  if (currentView === 'team-members') {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <Sidebar
          currentView={currentView}
          onNavigate={handleSidebarNavigate}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            currentView={currentView}
            selectedMemberId={null}
          />
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <TeamMembersView
                onViewMemberDetails={handleViewMemberDetails}
                onBack={handleBackToDashboard}
              />
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Analytics View
  if (currentView === 'analytics') {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <Sidebar
          currentView={currentView}
          onNavigate={handleSidebarNavigate}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            currentView={currentView}
            selectedMemberId={null}
          />
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <AnalyticsDashboard
                onBack={handleBackToDashboard}
              />
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Calendar View
  if (currentView === 'calendar') {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <Sidebar
          currentView={currentView}
          onNavigate={handleSidebarNavigate}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            currentView={currentView}
            selectedMemberId={null}
          />
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <CalendarView
                onBack={handleBackToDashboard}
              />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar 
        currentView={currentView}
        onNavigate={handleSidebarNavigate}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          currentView={currentView}
          selectedMemberId={selectedMemberId}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {currentRole === 'lead' ? <TeamLeadView /> : <TeamMemberView />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard; 