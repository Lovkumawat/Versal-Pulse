import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateMemberStatusWithNotification } from '../redux/slices/membersSlice';

const StatusSelector = () => {
  const { currentUser } = useSelector(state => state.role);
  const { teamMembers } = useSelector(state => state.members);
  const dispatch = useDispatch();

  const currentMember = teamMembers.find(member => member.name === currentUser);
  const statuses = ['Working', 'Break', 'Meeting', 'Offline'];

  const handleStatusChange = (status) => {
    if (currentMember) {
      dispatch(updateMemberStatusWithNotification({ memberId: currentMember.id, status }));
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

  const getStatusColor = (status, isSelected) => {
    const baseClasses = 'flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md';
    const colorClasses = {
      'Working': isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300',
      'Break': isSelected ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 hover:border-yellow-300',
      'Meeting': isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300',
      'Offline': isSelected ? 'border-gray-500 bg-gray-50' : 'border-gray-200 hover:border-gray-300'
    };
    return `${baseClasses} ${colorClasses[status]}`;
  };

  if (!currentMember) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Update Your Status</h3>
        <div className="p-2 bg-green-100 rounded-lg">
          <span className="text-lg">⚡</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => handleStatusChange(status)}
            className={getStatusColor(status, currentMember.status === status)}
          >
            <span className="text-2xl mr-3">{getStatusIcon(status)}</span>
            <div className="text-left">
              <div className="font-medium text-gray-900">{status}</div>
              <div className="text-sm text-gray-500">
                {status === 'Working' && 'Active and focused'}
                {status === 'Break' && 'Taking a break'}
                {status === 'Meeting' && 'In a meeting'}
                {status === 'Offline' && 'Not available'}
              </div>
            </div>
            {currentMember.status === status && (
              <div className="ml-auto">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
            )}
          </button>
        ))}
      </div>
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="text-sm text-blue-800">
          <strong>Current Status:</strong> {currentMember.status}
        </div>
      </div>
    </div>
  );
};

export default StatusSelector; 