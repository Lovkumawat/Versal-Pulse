import { createSlice } from '@reduxjs/toolkit';

const roleSlice = createSlice({
  name: 'role',
  initialState: {
    currentRole: 'lead', // Default to Team Lead (Priya Sharma)
    currentUser: 'Priya Sharma',
    selectedMember: null // For team member mode
  },
  reducers: {
    switchRole: (state, action) => {
      state.currentRole = action.payload;
      // Update user based on role
      if (action.payload === 'lead') {
        state.currentUser = 'Priya Sharma';
        state.selectedMember = null;
      }
    },
    setUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setSelectedMember: (state, action) => {
      state.selectedMember = action.payload;
      if (action.payload) {
        state.currentUser = action.payload.name;
        state.currentRole = 'member';
      }
    },
    switchToTeamLead: (state) => {
      state.currentRole = 'lead';
      state.currentUser = 'Priya Sharma';
      state.selectedMember = null;
    }
  }
});

export const { switchRole, setUser, setSelectedMember, switchToTeamLead } = roleSlice.actions;
export default roleSlice.reducer; 