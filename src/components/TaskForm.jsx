import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { assignTaskWithNotification, clearError } from '../redux/slices/membersSlice';

const TaskForm = () => {
  const { teamMembers, taskCategories, taskPriorities, error } = useSelector(state => state.members);
  const { currentUser } = useSelector(state => state.role);
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    memberId: '',
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    category: 'development',
    tags: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Clear Redux errors on component mount
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const validateForm = () => {
    const errors = {};

    if (!formData.memberId) {
      errors.memberId = 'Please select a team member';
    }

    if (!formData.title.trim()) {
      errors.title = 'Task title is required';
    } else if (formData.title.trim().length < 3) {
      errors.title = 'Task title must be at least 3 characters';
    } else if (formData.title.trim().length > 100) {
      errors.title = 'Task title must be less than 100 characters';
    }

    if (formData.description.trim().length > 500) {
      errors.description = 'Description must be less than 500 characters';
    }

    if (!formData.dueDate) {
      errors.dueDate = 'Due date is required';
    } else {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.dueDate = 'Due date cannot be in the past';
      }
    }

    if (!formData.priority || !taskPriorities.includes(formData.priority)) {
      errors.priority = 'Please select a valid priority';
    }

    if (!formData.category || !taskCategories.includes(formData.category)) {
      errors.category = 'Please select a valid category';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    dispatch(clearError());

    try {
      const taskPayload = {
        memberId: parseInt(formData.memberId),
        title: formData.title.trim(),
        description: formData.description.trim(),
        dueDate: formData.dueDate,
        priority: formData.priority,
        category: formData.category,
        assignedBy: currentUser
      };

      dispatch(assignTaskWithNotification(taskPayload));
      
      // Reset form
      setFormData({
        memberId: '',
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        category: 'development',
        estimatedHours: 1,
        tags: ''
      });
      
      setFormErrors({});
      setSuccessMessage('Task assigned successfully! 🎉');
      
    } catch (err) {
      console.error('Error assigning task:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Get today's date as minimum date
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'low': return '🟢';
      case 'medium': return '🟡';
      case 'high': return '🟠';
      case 'urgent': return '🔴';
      default: return '⚪';
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      development: '',
      design: '',
      testing: '',
      presentation: '',
      research: '',
      documentation: '',
      meeting: ''
    };
    return icons[category] || '';
  };

  const selectedMember = teamMembers.find(m => m.id === parseInt(formData.memberId));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Assign New Task</h3>
          <p className="text-sm text-gray-500 mt-1">Create and assign tasks with detailed specifications</p>
        </div>
        <div className="p-2 bg-indigo-100 rounded-lg">
          <span className="text-lg">📝</span>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <span className="text-green-600 mr-2">✅</span>
            <span className="text-green-800 font-medium">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Redux Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
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
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Team Member Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label htmlFor="memberId" className="block text-sm font-medium text-gray-700 mb-2">
              Assign To <span className="text-red-500">*</span>
            </label>
            <select
              id="memberId"
              name="memberId"
              value={formData.memberId}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                formErrors.memberId ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              required
            >
              <option value="">Choose a team member...</option>
              {teamMembers
                .filter(member => member.name !== currentUser) // Filter out current user (team lead)
                .map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.status})
                </option>
              ))}
            </select>
            {formErrors.memberId && (
              <p className="mt-1 text-sm text-red-600">{formErrors.memberId}</p>
            )}
            {selectedMember && (
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <img 
                  src={selectedMember.avatar} 
                  alt={selectedMember.name}
                  className="w-8 h-8 rounded-full mr-3 object-cover ring-2 ring-gray-200"
                />
                <div>
                  <div className="font-medium text-gray-900">{selectedMember.name}</div>
                  <div className="text-xs text-gray-500">{selectedMember.tasks.length} active tasks</div>
                </div>
              </div>
            )}
          </div>

          {/* Priority & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Priority <span className="text-red-500">*</span>
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={`w-full px-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                  formErrors.priority ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                required
              >
                {taskPriorities.map((priority) => (
                  <option key={priority} value={priority}>
                    {getPriorityIcon(priority)} {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </option>
                ))}
              </select>
              {formErrors.priority && (
                <p className="mt-1 text-sm text-red-600">{formErrors.priority}</p>
              )}
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                  formErrors.category ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                required
              >
                {taskCategories.map((category) => (
                  <option key={category} value={category}>
                    {getCategoryIcon(category)} {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
              {formErrors.category && (
                <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>
              )}
            </div>
          </div>
        </div>

        {/* Task Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Task Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter a clear and concise task title..."
            className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
              formErrors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            maxLength="100"
            required
          />
          <div className="mt-1 flex justify-between text-sm text-gray-500">
            {formErrors.title ? (
              <span className="text-red-600">{formErrors.title}</span>
            ) : (
              <span>Clear title helps team members understand the task quickly</span>
            )}
            <span>{formData.title.length}/100</span>
          </div>
        </div>

        {/* Task Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide detailed instructions, requirements, or context for this task..."
            rows="4"
            className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none ${
              formErrors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            maxLength="500"
          />
          <div className="mt-1 flex justify-between text-sm text-gray-500">
            {formErrors.description ? (
              <span className="text-red-600">{formErrors.description}</span>
            ) : (
              <span>Add context, requirements, or links that will help complete the task</span>
            )}
            <span>{formData.description.length}/500</span>
          </div>
        </div>

        {/* Due Date */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
              Due Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              min={getTodayDate()}
              className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                formErrors.dueDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              required
            />
            {formErrors.dueDate && (
              <p className="mt-1 text-sm text-red-600">{formErrors.dueDate}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors font-medium ${
            isSubmitting 
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <span className="animate-spin mr-2">⏳</span>
              Assigning Task...
            </div>
          ) : (
            <>
              ➕ Assign Task
            </>
          )}
        </button>
      </form>

      {/* Enhanced Quick Stats */}
      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
          📊 Team Overview
        </h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{teamMembers.length}</div>
            <div className="text-xs text-gray-600">Members</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {teamMembers.filter(m => m.status === 'Working').length}
            </div>
            <div className="text-xs text-gray-600">Working</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {teamMembers.reduce((sum, m) => sum + m.tasks.filter(t => t.progress < 100).length, 0)}
            </div>
            <div className="text-xs text-gray-600">Active Tasks</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskForm; 