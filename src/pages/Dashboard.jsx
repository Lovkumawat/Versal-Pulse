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
      // Only Team Lead can access team members view
      if (currentRole === 'lead') {
        setCurrentView('team-members');
        setSelectedMemberId(null);
      }
    } else if (view === 'member-detail' && memberId) {
      // Only Team Lead can view member details
      if (currentRole === 'lead') {
        handleViewMemberDetails(memberId);
      }
    } else if (view === 'analytics') {
      // Only Team Lead can access analytics
      if (currentRole === 'lead') {
        setCurrentView('analytics');
        setSelectedMemberId(null);
        // Invalidate analytics cache to ensure fresh data
        dispatch(invalidateCache());
      }
    } else if (view === 'calendar') {
      // Only Team Lead can access calendar
      if (currentRole === 'lead') {
        setCurrentView('calendar');
        setSelectedMemberId(null);
      }
    }
  };

  // Filter and sort team members
  const getFilteredAndSortedMembers = () => {
    let filtered = teamMembers;
    
    // Filter out Priya Sharma when in Team Lead mode (she's the lead, not a regular member)
    if (currentRole === 'lead') {
      filtered = filtered.filter(member => member.name !== 'Priya Sharma');
    }
    
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
    let membersToCount = teamMembers;
    
    // Exclude Priya Sharma from team member counts when in Team Lead mode
    if (currentRole === 'lead') {
      membersToCount = teamMembers.filter(member => member.name !== 'Priya Sharma');
    }
    
    const summary = membersToCount.reduce((acc, member) => {
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
               <p className="text-sm font-medium text-gray-600">Team Members</p>
               <p className="text-3xl font-bold text-gray-900">{filteredMembers.length}</p>
             </div>
             <div className="p-3 bg-indigo-100 rounded-lg">
               <span className="text-2xl">👥</span>
             </div>
           </div>
           <p className="text-xs text-gray-500 mt-2">Under your management</p>
         </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Working Now</p>
              <p className="text-3xl font-bold text-green-600">{statusSummary.Working || 0}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">🖥️</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Currently active</p>
        </div>

                 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
           <div className="flex items-center justify-between">
             <div>
               <p className="text-sm font-medium text-gray-600">Total Tasks</p>
               <p className="text-3xl font-bold text-blue-600">
                 {filteredMembers.reduce((sum, member) => sum + member.tasks.length, 0)}
               </p>
             </div>
             <div className="p-3 bg-blue-100 rounded-lg">
               <span className="text-2xl">📋</span>
             </div>
           </div>
           <p className="text-xs text-gray-500 mt-2">Assigned to team</p>
         </div>

                 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
           <div className="flex items-center justify-between">
             <div>
               <p className="text-sm font-medium text-gray-600">Productivity</p>
               <p className="text-3xl font-bold text-purple-600">
                 {filteredMembers.length > 0 ? Math.round(((statusSummary.Working || 0) / filteredMembers.length) * 100) : 0}%
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
                <option value="Working">Working</option>
                <option value="Meeting">Meeting</option>
                <option value="Break">Break</option>
                <option value="Offline">Offline</option>
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
    const { currentUser, selectedMember } = useSelector(state => state.role);
    const { teamMembers } = useSelector(state => state.members);
    
    // Find the current member with explicit dependency on teamMembers
    const currentMember = selectedMember || teamMembers.find(member => member.name === currentUser);
    

    
    // Force re-render by using the status directly in the component
    const currentStatus = currentMember?.status || 'Unknown';
    
    const myActiveTasks = currentMember?.tasks.filter(task => task.progress < 100).length || 0;
    const myCompletedTasks = currentMember?.tasks.filter(task => task.progress === 100).length || 0;
    const myTotalTasks = currentMember?.tasks.length || 0;

    return (
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
          <div className="flex items-center space-x-4">
                         <img
               src={currentMember?.avatar || '/Images/PriyaSharm.jpeg'}
               alt={currentMember?.name || 'Team Member'}
               className="w-12 h-12 rounded-full object-cover ring-4 ring-white/20"
             />
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {currentMember?.name || 'Team Member'}!</h1>
              <p className="text-blue-100">Here's your personal dashboard overview</p>
            </div>
          </div>
        </div>

        {/* Personal Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">My Status</p>
                <p className="text-2xl font-bold text-indigo-600">{currentStatus}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center">
                  <span className="text-sm font-medium text-indigo-600">{currentStatus.charAt(0)}</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Current activity</p>
          </div> */}

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-blue-600">{myTotalTasks}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">📋</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Assigned to me</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Tasks</p>
                <p className="text-2xl font-bold text-orange-600">{myActiveTasks}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <span className="text-2xl">🔄</span>
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

        {/* Personal Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Status Chart */}
          <div>
            <StatusChart />
          </div>

          {/* My Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">My Recent Activity</h3>
              <span className="text-sm text-gray-500">This week</span>
            </div>
            
            <div className="space-y-4">
              {currentMember?.tasks.slice(0, 3).map((task, index) => (
                <div key={task.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${
                    task.priority === 'urgent' ? 'bg-red-500' :
                    task.priority === 'high' ? 'bg-orange-500' :
                    task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                    <p className="text-xs text-gray-500">{task.category} • {task.progress}% complete</p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {task.progress === 100 ? '✅' : '🔄'}
                  </div>
                </div>
              ))}
              {(!currentMember?.tasks || currentMember.tasks.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <p>No tasks assigned yet</p>
                  <p className="text-sm">Tasks will appear here when assigned</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

    // Render based on current view
  if (currentView === 'member-detail' && selectedMemberId && currentRole === 'lead') {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        {/* Fixed Sidebar */}
        <div className="fixed left-0 top-0 h-full z-10">
          <Sidebar
            currentView={currentView}
            onNavigate={handleSidebarNavigate}
          />
        </div>

        {/* Main Content - with left margin to account for fixed sidebar */}
        <div className="flex-1 flex flex-col overflow-hidden ml-64">
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

  // Team Members View - Only for Team Lead
  if (currentView === 'team-members' && currentRole === 'lead') {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        {/* Fixed Sidebar */}
        <div className="fixed left-0 top-0 h-full z-10">
          <Sidebar
            currentView={currentView}
            onNavigate={handleSidebarNavigate}
          />
        </div>

        {/* Main Content - with left margin to account for fixed sidebar */}
        <div className="flex-1 flex flex-col overflow-hidden ml-64">
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

  // Analytics View - Only for Team Lead
  if (currentView === 'analytics' && currentRole === 'lead') {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        {/* Fixed Sidebar */}
        <div className="fixed left-0 top-0 h-full z-10">
          <Sidebar
            currentView={currentView}
            onNavigate={handleSidebarNavigate}
          />
        </div>

        {/* Main Content - with left margin to account for fixed sidebar */}
        <div className="flex-1 flex flex-col overflow-hidden ml-64">
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

  // Calendar View - Only for Team Lead
  if (currentView === 'calendar' && currentRole === 'lead') {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        {/* Fixed Sidebar */}
        <div className="fixed left-0 top-0 h-full z-10">
          <Sidebar
            currentView={currentView}
            onNavigate={handleSidebarNavigate}
          />
        </div>

        {/* Main Content - with left margin to account for fixed sidebar */}
        <div className="flex-1 flex flex-col overflow-hidden ml-64">
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
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 h-full z-10">
        <Sidebar 
          currentView={currentView}
          onNavigate={handleSidebarNavigate}
        />
      </div>
      
      {/* Main Content - with left margin to account for fixed sidebar */}
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
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