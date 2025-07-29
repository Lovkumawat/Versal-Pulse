# Team Pulse Dashboard

A comprehensive productivity monitoring tool for internal teams built with React and Redux Toolkit. This dashboard provides role-based views for Team Leads and Team Members to manage status updates, assign tasks, and track progress.

## 🚀 Features

### 🔄 Role Switching
- Toggle between **Team Lead** and **Team Member** views
- Role state persisted in Redux store
- Dynamic UI based on current role

### 👨‍💼 Team Lead View
- **Team Status Monitor**: Real-time view of all team members with status badges
- **Summary Dashboard**: Overview of team status distribution (Working, Break, Meeting, Offline)
- **Task Assignment**: Assign tasks to team members with due dates
- **Filtering & Sorting**: Filter by status and sort by active tasks count
- **Team Overview**: Visual cards showing member information and recent tasks

### 👤 Team Member View
- **Status Updates**: Quick status selection (Working, Break, Meeting, Offline)
- **Task Management**: View assigned tasks with progress tracking
- **Progress Control**: Increment/decrement progress in 10% steps
- **Auto-completion**: Tasks automatically marked complete at 100%
- **Team Visibility**: See current team status overview

## 🛠️ Tech Stack

- **Frontend**: React 18 with Hooks
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Icons & Images**: Unsplash for avatars, Emoji for status icons
- **Build Tool**: React Scripts

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.jsx          # Navigation with role toggle
│   ├── MemberCard.jsx      # Team member display card
│   ├── StatusSelector.jsx  # Status update buttons
│   ├── TaskForm.jsx        # Task assignment form
│   └── TaskList.jsx        # Task management interface
├── redux/
│   ├── store.js            # Redux store configuration
│   └── slices/
│       ├── roleSlice.js    # Role and user state
│       └── membersSlice.js # Team members and tasks
├── pages/
│   └── Dashboard.jsx       # Main dashboard page
├── App.jsx                 # Root component
├── index.js               # App entry point
└── index.css              # Global styles with Tailwind
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd versal-pulse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## 🎯 How to Use

### As a Team Lead
1. Use the toggle in the top-right to switch to "Team Lead" mode
2. View team status overview in the summary cards
3. Assign tasks using the task form on the left
4. Filter team members by status or sort by active tasks
5. Monitor individual member progress through member cards

### As a Team Member
1. Switch to "Team Member" mode using the toggle
2. Update your status using the status selector buttons
3. View and manage your assigned tasks
4. Update task progress using +10%/-10% buttons
5. Mark tasks complete when reaching 90%+ progress

## 📊 Redux State Structure

### Role Slice
```javascript
{
  currentRole: 'member' | 'lead',
  currentUser: 'string'
}
```

### Members Slice
```javascript
{
  teamMembers: [{
    id: number,
    name: string,
    status: 'Working' | 'Break' | 'Meeting' | 'Offline',
    avatar: string,
    tasks: [...]
  }],
  statusFilter: 'All' | 'Working' | 'Break' | 'Meeting' | 'Offline',
  sortBy: 'name' | 'activeTasks',
  nextTaskId: number
}
```

## 🎨 Design Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, professional interface with Tailwind CSS
- **Smooth Animations**: Transitions and hover effects
- **Accessibility**: Proper focus states and keyboard navigation
- **Visual Feedback**: Status colors, progress bars, and icons

## 🔧 Customization

### Adding New Status Types
1. Update the `statuses` array in `StatusSelector.jsx`
2. Add corresponding colors in `getStatusColor` functions
3. Update status icons in `getStatusIcon` functions

### Modifying Task Properties
1. Extend the task object structure in `membersSlice.js`
2. Update `TaskForm.jsx` to include new fields
3. Modify `TaskList.jsx` to display new properties

## 🚀 Deployment

### Vercel
1. Connect your GitHub repository to Vercel
2. Deploy automatically on push to main branch

### Netlify
1. Build the project: `npm run build`
2. Upload the `build` folder to Netlify

### Manual Deployment
1. Run `npm run build`
2. Serve the `build` folder with any static file server

## 🔮 Future Enhancements

### Planned Features
- [ ] **Auto-reset**: Reset status to Offline after 10 minutes of inactivity
- [ ] **Charts**: Pie chart visualization of status distribution
- [ ] **Dark Mode**: Toggle between light and dark themes
- [ ] **Notifications**: Task deadline reminders
- [ ] **Real-time Updates**: WebSocket integration for live updates
- [ ] **Team Analytics**: Productivity metrics and reports

### Bonus Features (Optional)
- **Drag & Drop**: Reorder tasks by priority
- **Time Tracking**: Log time spent on tasks
- **Calendar Integration**: Due date calendar view
- **Export Data**: Download reports in CSV/PDF format

## 🐛 Known Issues

- Images from Unsplash may take time to load on slow connections
- Task progress updates are immediate (consider adding optimistic updates)
- No data persistence (refreshing page resets to initial state)

## 📝 Requirements Fulfilled

✅ **Role Switching**: Toggle between Team Lead and Team Member views  
✅ **Status Updates**: Team members can update their working status  
✅ **Task Management**: Leaders assign tasks, members update progress  
✅ **Redux Toolkit**: All state managed with Redux Toolkit  
✅ **Filtering & Sorting**: Filter by status, sort by active tasks  
✅ **Progress Tracking**: 0-100% progress bars with 10% increments  
✅ **Responsive Design**: Works on all device sizes  
✅ **Modern UI**: Clean interface with Tailwind CSS  

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for productive teams**