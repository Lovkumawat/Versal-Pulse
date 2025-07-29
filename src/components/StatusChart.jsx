import React from 'react';
import { useSelector } from 'react-redux';

const StatusChart = () => {
  const { teamMembers } = useSelector(state => state.members);
  
  // Calculate status distribution
  const statusCounts = teamMembers.reduce((acc, member) => {
    acc[member.status] = (acc[member.status] || 0) + 1;
    return acc;
  }, {});

  const total = teamMembers.length;
  
  const statusData = [
    { status: 'Working', count: statusCounts.Working || 0, color: '#10b981', emoji: '💻' },
    { status: 'Meeting', count: statusCounts.Meeting || 0, color: '#3b82f6', emoji: '🎯' },
    { status: 'Break', count: statusCounts.Break || 0, color: '#f59e0b', emoji: '☕' },
    { status: 'Offline', count: statusCounts.Offline || 0, color: '#6b7280', emoji: '😴' }
  ];

  // Calculate percentages and create visual representation
  let cumulativePercentage = 0;
  const chartData = statusData.map(item => {
    const percentage = total > 0 ? (item.count / total) * 100 : 0;
    const startAngle = cumulativePercentage * 3.6; // Convert to degrees
    cumulativePercentage += percentage;
    return {
      ...item,
      percentage: Math.round(percentage),
      startAngle,
      endAngle: cumulativePercentage * 3.6
    };
  });

  // Simple visual pie chart using CSS
  const PieSlice = ({ data, index }) => {
    if (data.percentage === 0) return null;
    
    return (
      <div className="relative">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(${data.color} 0deg ${data.endAngle}deg, transparent ${data.endAngle}deg 360deg)`,
            transform: `rotate(${data.startAngle}deg)`
          }}
        />
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Team Status Distribution</h3>
        <span className="text-sm text-gray-500">Live Overview</span>
      </div>
      
      <div className="flex items-center justify-center">
        {/* Simple Chart Representation */}
        <div className="relative w-32 h-32 mr-8">
          {/* Background circle */}
          <div className="w-full h-full rounded-full bg-gray-100"></div>
          
          {/* Pie segments using simple approach */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full border-8 border-gray-100 relative overflow-hidden">
              {chartData.map((data, index) => {
                if (data.count === 0) return null;
                const circumference = 2 * Math.PI * 40; // radius of 40
                const strokeDasharray = `${(data.percentage / 100) * circumference} ${circumference}`;
                const rotation = chartData.slice(0, index).reduce((sum, item) => sum + item.percentage, 0) * 3.6;
                
                return (
                  <svg
                    key={index}
                    className="absolute inset-0"
                    width="96"
                    height="96"
                    style={{ transform: `rotate(${rotation - 90}deg)` }}
                  >
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      fill="none"
                      stroke={data.color}
                      strokeWidth="8"
                      strokeDasharray={strokeDasharray}
                      strokeLinecap="round"
                    />
                  </svg>
                );
              })}
            </div>
            
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">{total}</span>
              <span className="text-xs text-gray-500">Total</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-3">
          {statusData.map((item, index) => (
            <div key={item.status} className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-3"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm font-medium text-gray-700">
                  {item.emoji} {item.status}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                <span className="text-xs text-gray-500 ml-1">
                  ({total > 0 ? Math.round((item.count / total) * 100) : 0}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {statusCounts.Working || 0}
            </div>
            <div className="text-xs text-gray-500">Active Now</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-indigo-600">
              {((statusCounts.Working || 0) / total * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-gray-500">Productivity</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusChart; 