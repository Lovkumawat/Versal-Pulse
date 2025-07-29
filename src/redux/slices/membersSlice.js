import { createSlice } from '@reduxjs/toolkit';

// Sample team members data
const initialMembers = [
  {
    id: 1,
    name: 'John Doe',
    status: 'Working',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    tasks: [
      { id: 1, title: 'Complete dashboard design', dueDate: '2024-02-15', progress: 60 },
      { id: 2, title: 'Review code changes', dueDate: '2024-02-10', progress: 100 }
    ]
  },
  {
    id: 2,
    name: 'Jane Smith',
    status: 'Meeting',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b830?w=150&h=150&fit=crop&crop=face',
    tasks: [
      { id: 3, title: 'Client presentation prep', dueDate: '2024-02-12', progress: 30 }
    ]
  },
  {
    id: 3,
    name: 'Mike Johnson',
    status: 'Break',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    tasks: [
      { id: 4, title: 'API integration', dueDate: '2024-02-20', progress: 0 },
      { id: 5, title: 'Testing fixes', dueDate: '2024-02-14', progress: 80 }
    ]
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    status: 'Offline',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    tasks: []
  }
];

const membersSlice = createSlice({
  name: 'members',
  initialState: {
    teamMembers: initialMembers,
    statusFilter: 'All',
    sortBy: 'name', // 'name' or 'activeTasks'
    nextTaskId: 6
  },
  reducers: {
    updateMemberStatus: (state, action) => {
      const { memberId, status } = action.payload;
      const member = state.teamMembers.find(m => m.id === memberId);
      if (member) {
        member.status = status;
      }
    },
    
    assignTask: (state, action) => {
      const { memberId, title, dueDate } = action.payload;
      const member = state.teamMembers.find(m => m.id === memberId);
      if (member) {
        member.tasks.push({
          id: state.nextTaskId,
          title,
          dueDate,
          progress: 0
        });
        state.nextTaskId += 1;
      }
    },
    
    updateTaskProgress: (state, action) => {
      const { memberId, taskId, progress } = action.payload;
      const member = state.teamMembers.find(m => m.id === memberId);
      if (member) {
        const task = member.tasks.find(t => t.id === taskId);
        if (task) {
          task.progress = Math.max(0, Math.min(100, progress));
        }
      }
    },
    
    completeTask: (state, action) => {
      const { memberId, taskId } = action.payload;
      const member = state.teamMembers.find(m => m.id === memberId);
      if (member) {
        const task = member.tasks.find(t => t.id === taskId);
        if (task) {
          task.progress = 100;
        }
      }
    },
    
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
    
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    
    // Auto-reset status after inactivity (bonus feature)
    autoResetStatus: (state, action) => {
      const { memberId } = action.payload;
      const member = state.teamMembers.find(m => m.id === memberId);
      if (member && member.status !== 'Offline') {
        member.status = 'Offline';
      }
    }
  }
});

export const { 
  updateMemberStatus, 
  assignTask, 
  updateTaskProgress, 
  completeTask,
  setStatusFilter,
  setSortBy,
  autoResetStatus
} = membersSlice.actions;

export default membersSlice.reducer; 