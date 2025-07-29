import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateTaskProgress, completeTask } from '../redux/slices/membersSlice';

const TaskList = () => {
  const { currentUser } = useSelector(state => state.role);
  const { teamMembers } = useSelector(state => state.members);
  const dispatch = useDispatch();

  const currentMember = teamMembers.find(member => member.name === currentUser);

  const handleProgressChange = (taskId, change) => {
    if (currentMember) {
      const task = currentMember.tasks.find(t => t.id === taskId);
      if (task) {
        const newProgress = task.progress + change;
        dispatch(updateTaskProgress({
          memberId: currentMember.id,
          taskId,
          progress: newProgress
        }));
        
        // Auto-complete if progress reaches 100%
        if (newProgress >= 100) {
          dispatch(completeTask({
            memberId: currentMember.id,
            taskId
          }));
        }
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDateColor = (dueDate, progress) => {
    if (progress === 100) return 'text-green-600';
    
    const daysLeft = getDaysUntilDue(dueDate);
    if (daysLeft < 0) return 'text-red-600'; // Overdue
    if (daysLeft <= 2) return 'text-orange-600'; // Due soon
    return 'text-gray-600'; // Normal
  };

  if (!currentMember) return null;

  const activeTasks = currentMember.tasks.filter(task => task.progress < 100);
  const completedTasks = currentMember.tasks.filter(task => task.progress === 100);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Your Tasks</h3>
        <div className="p-2 bg-blue-100 rounded-lg">
          <span className="text-lg">📋</span>
        </div>
      </div>
      
      {currentMember.tasks.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <p className="text-gray-500">No tasks assigned yet</p>
        </div>
      ) : (
        <>
          {/* Active Tasks */}
          {activeTasks.length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-700 mb-3">
                Active Tasks ({activeTasks.length})
              </h4>
              <div className="space-y-4">
                {activeTasks.map((task) => (
                  <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-gray-900">{task.title}</h5>
                      <span className={`text-sm font-medium ${getDateColor(task.dueDate, task.progress)}`}>
                        Due: {formatDate(task.dueDate)}
                        {getDaysUntilDue(task.dueDate) < 0 && ' (Overdue)'}
                        {getDaysUntilDue(task.dueDate) === 0 && ' (Today)'}
                        {getDaysUntilDue(task.dueDate) === 1 && ' (Tomorrow)'}
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-medium text-gray-900">{task.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleProgressChange(task.id, -10)}
                          disabled={task.progress <= 0}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          -10%
                        </button>
                        <button
                          onClick={() => handleProgressChange(task.id, 10)}
                          disabled={task.progress >= 100}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          +10%
                        </button>
                      </div>
                      
                      {task.progress >= 90 && task.progress < 100 && (
                        <button
                          onClick={() => handleProgressChange(task.id, 100 - task.progress)}
                          className="px-4 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-3">
                Completed Tasks ({completedTasks.length})
              </h4>
              <div className="space-y-2">
                {completedTasks.map((task) => (
                  <div key={task.id} className="border border-green-200 bg-green-50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-green-600 mr-2">✅</span>
                        <span className="text-gray-900 line-through">{task.title}</span>
                      </div>
                      <span className="text-sm text-green-600">
                        Completed • Due: {formatDate(task.dueDate)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TaskList; 