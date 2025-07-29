import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { switchToTeamLead, setSelectedMember } from '../redux/slices/roleSlice';

const RoleSwitcher = () => {
  const { currentRole, currentUser } = useSelector(state => state.role);
  const { teamMembers } = useSelector(state => state.members);
  const dispatch = useDispatch();
  const [showMemberSelect, setShowMemberSelect] = useState(false);

  // Get team members excluding Priya Sharma
  const availableMembers = teamMembers.filter(member => member.name !== 'Priya Sharma');

  const handleSwitchToTeamLead = () => {
    dispatch(switchToTeamLead());
    setShowMemberSelect(false);
  };

  const handleSwitchToMember = (member) => {
    dispatch(setSelectedMember(member));
    setShowMemberSelect(false);
  };

  return (
    <div className="relative">
      {/* Current Role Display */}
      <div className="flex items-center space-x-3">
        <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
          currentRole === 'lead' 
            ? 'bg-blue-100 text-blue-700 border border-blue-200' 
            : 'bg-green-100 text-green-700 border border-green-200'
        }`}>
          {currentRole === 'lead' ? '👨‍💼 Team Lead' : '👤 Team Member'}
        </div>
        
        {/* Switch Button */}
        <button
          onClick={() => setShowMemberSelect(!showMemberSelect)}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
        >
          Switch Role
        </button>
      </div>

      {/* Member Selection Dropdown */}
      {showMemberSelect && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-3 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Switch to:</h3>
          </div>
          
          {/* Team Lead Option */}
          <button
            onClick={handleSwitchToTeamLead}
            className="w-full p-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm">👨‍💼</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">Team Lead</div>
                <div className="text-xs text-gray-500">Priya Sharma</div>
              </div>
            </div>
          </button>

          {/* Team Members */}
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 mb-2 px-2">Team Members:</div>
            {availableMembers.map((member) => (
              <button
                key={member.id}
                onClick={() => handleSwitchToMember(member)}
                className="w-full p-3 text-left hover:bg-green-50 transition-colors rounded-lg mb-1"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{member.name}</div>
                    <div className="text-xs text-gray-500">{member.status}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {showMemberSelect && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowMemberSelect(false)}
        />
      )}
    </div>
  );
};

export default RoleSwitcher; 