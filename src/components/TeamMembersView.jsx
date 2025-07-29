import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setStatusFilter, setSortBy } from '../redux/slices/membersSlice';
import MemberCard from './MemberCard';

const TeamMembersView = ({ onViewMemberDetails, onBack }) => {
  const { teamMembers, statusFilter, sortBy } = useSelector(state => state.members);
  const { currentRole } = useSelector(state => state.role);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort team members
  const getFilteredAndSortedMembers = () => {
    let filtered = teamMembers;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(member => 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role?.toLowerCase().includes(searchTerm.toLowerCase())
      );
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
    } else if (sortBy === 'status') {
      filtered = [...filtered].sort((a, b) => a.status.localeCompare(b.status));
    } else {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return filtered;
  };

  // Get status summary
  const getStatusSummary = () => {
    const summary = teamMembers.reduce((acc, member) => {
      acc[member.status] = (acc[member.status] || 0) + 1;
      return acc;
    }, {});
    
    return summary;
  };

  const statusSummary = getStatusSummary();
  const filteredMembers = getFilteredAndSortedMembers();

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Working': return '🖥️';
      case 'Break': return '☕';
      case 'Meeting': return '🎯';
      case 'Offline': return '⏸️';
      default: return '❓';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Working': return 'bg-green-100 text-green-800';
      case 'Break': return 'bg-yellow-100 text-yellow-800';
      case 'Meeting': return 'bg-blue-100 text-blue-800';
      case 'Offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
          <p className="text-gray-600 mt-1">Manage and monitor your team members</p>
        </div>
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            ← Back to Dashboard
          </button>
        )}
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <span className="text-indigo-600 text-lg">👥</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center">
                <span className="text-xs font-medium text-green-600">W</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Working</p>
              <p className="text-2xl font-bold text-gray-900">{statusSummary.Working || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-yellow-200 flex items-center justify-center">
                <span className="text-xs font-medium text-yellow-600">B</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">On Break</p>
              <p className="text-2xl font-bold text-gray-900">{statusSummary.Break || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center">
                <span className="text-xs font-medium text-blue-600">M</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">In Meeting</p>
              <p className="text-2xl font-bold text-gray-900">{statusSummary.Meeting || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search team members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <span className="text-gray-400">🔍</span>
                </div>
              </div>
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
                <option value="status">Sort by Status</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {showFilters ? 'Hide' : 'Show'} Filters
              </button>
            </div>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="p-6">
          {filteredMembers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">👥</div>
              <p className="text-gray-500 text-lg">
                {searchTerm || statusFilter !== 'All' 
                  ? 'No team members match your search criteria' 
                  : 'No team members found'
                }
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {searchTerm || statusFilter !== 'All' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'Add team members to get started'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredMembers.map((member) => (
                <div key={member.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                          <p className="text-sm text-gray-500">{member.role || 'Team Member'}</p>
                          <div className="flex items-center mt-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                              <div className="w-3 h-3 rounded-full bg-gray-300 flex items-center justify-center mr-1">
                                <span className="text-xs font-medium text-gray-600">{member.status.charAt(0)}</span>
                              </div>
                              {member.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Active Tasks</div>
                        <div className="text-lg font-semibold text-gray-900">
                          {member.tasks.filter(task => task.progress < 100).length}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Tasks Completed</span>
                        <span className="font-medium text-gray-900">
                          {member.tasks.filter(task => task.progress === 100).length} / {member.tasks.length}
                        </span>
                      </div>
                      
                      {member.tasks.length > 0 && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${(member.tasks.filter(task => task.progress === 100).length / member.tasks.length) * 100}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => onViewMemberDetails(member.id)}
                        className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                      >
                        👁️ View Details
                      </button>
                      
                      {currentRole === 'lead' && (
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors">
                          📝 Edit
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamMembersView; 