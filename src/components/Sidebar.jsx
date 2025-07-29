import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { switchToTeamLead, setSelectedMember } from '../redux/slices/roleSlice';

const Sidebar = ({ currentView, onNavigate }) => {
  const { currentRole, currentUser, selectedMember } = useSelector(state => state.role);
  const { teamMembers } = useSelector(state => state.members);
  const dispatch = useDispatch();

  // Get team members for sidebar based on role
  const getSidebarMembers = () => {
    if (currentRole === 'lead') {
      // Team Lead mode: only show Priya Sharma
      return teamMembers.filter(member => member.name === 'Priya Sharma');
    } else {
      // Team Member mode: show all members except Priya Sharma
      return teamMembers.filter(member => member.name !== 'Priya Sharma');
    }
  };

  // Role-based menu items
  const getMenuItems = () => {
    if (currentRole === 'lead') {
      // Team Lead menu - full access
      return [
        {
          id: 'dashboard',
          label: 'Team Dashboard',
          icon: '📊',
          active: currentView === 'dashboard'
        },
        {
          id: 'team',
          label: 'Team Members',
          icon: '👥',
          active: currentView === 'team-members' || currentView === 'member-detail'
        },
        {
          id: 'analytics',
          label: 'Analytics',
          icon: '📈',
          active: currentView === 'analytics'
        },
        {
          id: 'calendar',
          label: 'Calendar',
          icon: '📅',
          active: currentView === 'calendar'
        },
        {
          id: 'tasks',
          label: 'Task Management',
          icon: '📋',
          active: false
        },
        {
          id: 'reports',
          label: 'Reports',
          icon: '📊',
          active: false
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: '⚙️',
          active: false
        }
      ];
    } else {
      // Team Member menu - limited access (no analytics, no calendar)
      return [
        {
          id: 'dashboard',
          label: 'My Dashboard',
          icon: '📊',
          active: currentView === 'dashboard'
        },
        {
          id: 'tasks',
          label: 'My Tasks',
          icon: '📋',
          active: false
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: '⚙️',
          active: false
        }
      ];
    }
  };

  const handleMemberClick = (member) => {
    if (currentRole === 'lead') {
      // Team Lead can view member details but not edit
      onNavigate && onNavigate('member-detail', member.id);
    } else {
      // Team Member can switch to that member's view
      dispatch(setSelectedMember(member));
    }
  };

  const menuItems = getMenuItems();
  const sidebarMembers = getSidebarMembers();

  const handleMenuClick = (itemId) => {
    if (onNavigate) {
      switch (itemId) {
        case 'dashboard':
          onNavigate('dashboard');
          break;
        case 'team':
          onNavigate('team-members');
          break;
        case 'analytics':
          onNavigate('analytics');
          break;
        case 'calendar':
          onNavigate('calendar');
          break;
        default:
          // Handle other menu items or show coming soon
          console.log(`${itemId} navigation coming soon...`);
      }
    }
  };

  return (
    <div className="bg-indigo-900 text-white w-64 min-h-screen flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-indigo-800">
        <div className="flex items-center">
          <div className="bg-indigo-600 p-2 rounded-lg mr-3">
            <span className="text-xl">⚡</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">Team Pulse</h1>
            <p className="text-indigo-300 text-sm">Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                item.active
                  ? 'bg-indigo-700 text-white'
                  : 'text-indigo-300 hover:bg-indigo-800 hover:text-white'
              }`}
            >
              <span className="text-lg mr-3">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
              {item.active && (
                <div className="ml-auto w-2 h-2 bg-indigo-400 rounded-full"></div>
              )}
            </button>
          ))}
        </div>

        {/* Team Members Section */}
        {sidebarMembers.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-medium text-indigo-300 mb-3 px-4">
              {currentRole === 'lead' ? 'Team Lead' : 'Team Members'}
            </h3>
            <div className="space-y-2">
              {sidebarMembers.map((member) => (
                <button
                  key={member.id}
                  onClick={() => handleMemberClick(member)}
                  className="w-full hover:bg-indigo-800 hover:text-white rounded-lg transition-colors p-3"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-white text-sm font-medium truncate">{member.name}</p>
                      <p className="text-indigo-300 text-xs">
                        {member.status === 'Working' && 'Working'}
                        {member.status === 'Break' && 'On Break'}
                        {member.status === 'Meeting' && 'In Meeting'}
                        {member.status === 'Offline' && 'Offline'}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Current User Info */}
        <div className="mt-8 p-4 bg-indigo-800 rounded-lg">
          <h3 className="text-sm font-medium text-indigo-300 mb-3">Current User</h3>
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">
              {currentRole === 'lead' ? '👨‍💼 Team Lead' : '👤 Team Member'}
            </span>
          </div>
          <div className="text-indigo-300 text-sm mt-2">
            {currentUser}
          </div>
          <button
            onClick={() => {
              if (currentRole === 'lead') {
                // Switch to first available team member
                const availableMembers = teamMembers.filter(member => member.name !== 'Priya Sharma');
                if (availableMembers.length > 0) {
                  dispatch(setSelectedMember(availableMembers[0]));
                }
              } else {
                // Switch back to Team Lead
                dispatch(switchToTeamLead());
              }
            }}
            className="w-full mt-3 bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-md transition-colors text-sm font-medium"
          >
            Switch to {currentRole === 'lead' ? 'Team Member' : 'Team Lead'}
          </button>
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-indigo-800">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center mr-3">
            <span className="text-sm">👤</span>
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium">Settings</p>
            <p className="text-indigo-300 text-xs">Preferences</p>
          </div>
          <button className="text-indigo-300 hover:text-white">
            <span>⚙️</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 