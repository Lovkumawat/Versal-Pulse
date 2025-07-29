import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { assignTask } from '../redux/slices/membersSlice';

const TaskForm = () => {
  const { teamMembers } = useSelector(state => state.members);
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    memberId: '',
    title: '',
    dueDate: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.memberId && formData.title && formData.dueDate) {
      dispatch(assignTask({
        memberId: parseInt(formData.memberId),
        title: formData.title,
        dueDate: formData.dueDate
      }));
      
      // Reset form
      setFormData({
        memberId: '',
        title: '',
        dueDate: ''
      });
      
      // Show success message (optional)
      alert('Task assigned successfully!');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Get tomorrow's date as minimum date
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Assign New Task</h3>
        <div className="p-2 bg-indigo-100 rounded-lg">
          <span className="text-lg">📝</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="memberId" className="block text-sm font-medium text-gray-700 mb-2">
            Select Team Member
          </label>
          <select
            id="memberId"
            name="memberId"
            value={formData.memberId}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            required
          >
            <option value="">Choose a team member...</option>
            {teamMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.status === 'Working' && '💻'} 
                {member.status === 'Meeting' && '🎯'} 
                {member.status === 'Break' && '☕'} 
                {member.status === 'Offline' && '😴'} 
                {member.name} ({member.status})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Task Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task description..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            required
          />
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            min={getTomorrowDate()}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors font-medium"
        >
          ➕ Assign Task
        </button>
      </form>

      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
          📊 Quick Stats
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{teamMembers.length}</div>
            <div className="text-xs text-gray-600">Total Members</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {teamMembers.filter(m => m.status !== 'Offline').length}
            </div>
            <div className="text-xs text-gray-600">Active Now</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskForm; 