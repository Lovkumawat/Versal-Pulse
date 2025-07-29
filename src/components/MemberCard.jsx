import React from 'react';

const MemberCard = ({ member }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Working': return 'bg-green-100 text-green-800 border-green-200';
      case 'Break': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Meeting': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Offline': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActiveTasks = () => {
    return member.tasks.filter(task => task.progress < 100).length;
  };

  const getProgressStats = () => {
    const totalTasks = member.tasks.length;
    const completedTasks = member.tasks.filter(task => task.progress === 100).length;
    return { totalTasks, completedTasks };
  };

  const { totalTasks, completedTasks } = getProgressStats();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-start space-x-4">
        <div className="relative flex-shrink-0">
          <img
            src={member.avatar}
            alt={member.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 max-w-full max-h-full"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
            <div className="flex items-center space-x-2">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(member.status)}`}
              >
                <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center mr-1.5">
                  <span className="text-xs font-medium text-gray-600">{member.status.charAt(0)}</span>
                </div>
                {member.status}
              </span>
            </div>
          </div>
          
          <div className="mt-3 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-indigo-600">{getActiveTasks()}</div>
              <div className="text-xs text-gray-500">Active</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{completedTasks}</div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-700">{totalTasks}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
          </div>
        </div>
      </div>
      
      {member.tasks.length > 0 && (
        <div className="mt-5 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Recent Tasks</span>
            <span className="text-xs text-gray-500">{member.tasks.length} total</span>
          </div>
          <div className="space-y-2">
            {member.tasks.slice(0, 2).map((task) => (
              <div key={task.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700 truncate flex-1">{task.title}</span>
                <div className="flex items-center space-x-2 ml-3">
                  <div className="w-12 bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${task.progress === 100 ? 'bg-green-500' : 'bg-indigo-500'}`}
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    task.progress === 100 ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'
                  }`}>
                    {task.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberCard; 