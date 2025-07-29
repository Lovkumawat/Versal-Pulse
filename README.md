# Versal Pulse - Team Productivity Dashboard

A modern, real-time team productivity monitoring and management dashboard built with React, Redux, and Tailwind CSS.

## 🚀 Features

### Core Functionality
- **Real-time Team Monitoring**: Track team member status, task progress, and productivity metrics
- **Role-based Access Control**: Separate interfaces for Team Leads and Team Members
- **Task Management**: Assign, track, and manage tasks with progress monitoring
- **Status Updates**: Real-time status changes (Working, Break, Meeting, Offline)
- **Notification System**: Toast notifications and notification center with sound alerts
- **Analytics Dashboard**: Comprehensive team performance analytics and charts
- **Calendar Integration**: Team scheduling and deadline management
- **Responsive Design**: Modern UI that works on desktop and mobile devices

### User Roles

#### Team Lead Features
- **Team Dashboard**: Overview of all team members and their current status
- **Task Assignment**: Create and assign tasks to team members
- **Analytics**: Detailed performance metrics and productivity charts
- **Team Management**: View individual member details and performance
- **Calendar View**: Team scheduling and deadline tracking
- **Notification Management**: Centralized notification control

#### Team Member Features
- **Personal Dashboard**: Individual task overview and status management
- **Task Tracking**: View assigned tasks and update progress
- **Status Updates**: Change personal status (Working, Break, Meeting, Offline)
- **Progress Monitoring**: Track personal productivity metrics

## 📋 User Flow

### 1. Application Entry
- Users land on the main dashboard
- Role switcher allows switching between Team Lead and Team Member views
- Default view shows Team Lead interface

### 2. Team Lead Workflow

#### Dashboard Overview
1. **Main Dashboard**: View team metrics, member status, and productivity overview
2. **Task Assignment**: Use the task form to create and assign tasks to team members
3. **Status Monitoring**: Real-time view of team member status with filtering options
4. **Quick Actions**: Filter by status, sort by active tasks, view member details

#### Team Management
1. **Team Members View**: Comprehensive list of all team members
2. **Member Details**: Click on any member to view detailed information
3. **Performance Tracking**: Monitor individual and team productivity metrics
4. **Status Filtering**: Filter team members by current status

#### Analytics & Reporting
1. **Analytics Dashboard**: Access detailed performance charts and metrics
2. **Productivity Trends**: View team productivity over time
3. **Task Completion Rates**: Track task completion and efficiency
4. **Team Performance**: Analyze individual and team performance data

#### Calendar & Scheduling
1. **Calendar View**: Access team calendar and scheduling interface
2. **Deadline Management**: Track project deadlines and milestones
3. **Meeting Scheduling**: Plan and manage team meetings
4. **Task Timeline**: Visualize task timelines and dependencies

### 3. Team Member Workflow

#### Personal Dashboard
1. **Welcome Screen**: Personalized greeting with current status
2. **Task Overview**: View all assigned tasks with progress indicators
3. **Status Management**: Update personal status (Working, Break, Meeting, Offline)
4. **Progress Tracking**: Monitor personal task completion and productivity

#### Task Management
1. **Task List**: View all assigned tasks with priority and deadline information
2. **Progress Updates**: Update task progress and completion status
3. **Status Changes**: Modify task status and add comments
4. **Priority Management**: Handle high-priority and urgent tasks

### 4. Notification System

#### Real-time Notifications
1. **Toast Notifications**: Appear at top-right corner for immediate alerts
2. **Notification Center**: Accessible via bell icon in header
3. **Sound Alerts**: Audio notifications for important updates
4. **Priority Levels**: Different notification types (urgent, high, medium, low)

#### Notification Types
- **Task Assigned**: New task assignments
- **Task Completed**: Task completion notifications
- **Status Changes**: Team member status updates
- **Deadline Reminders**: Approaching deadlines
- **Comments**: New comments on tasks
- **System Updates**: Important system notifications

### 5. Navigation Structure

#### Sidebar Navigation
- **Dashboard**: Main overview page
- **Team Members**: Team management (Team Lead only)
- **Analytics**: Performance analytics (Team Lead only)
- **Calendar**: Scheduling interface (Team Lead only)
- **Settings**: Application preferences

#### Header Features
- **Search Bar**: Search team members and tasks
- **Notification Bell**: Access notification center
- **Role Switcher**: Switch between Team Lead and Team Member views
- **User Profile**: Current user information and settings

## 🛠️ Technical Stack

### Frontend
- **React 19.1.1**: Modern React with hooks and functional components
- **Redux Toolkit**: State management with RTK Query
- **Tailwind CSS**: Utility-first CSS framework
- **Chart.js**: Data visualization and analytics charts
- **React Chart.js 2**: React wrapper for Chart.js

### Key Dependencies
- **@reduxjs/toolkit**: Redux state management
- **react-redux**: React Redux bindings
- **date-fns**: Date manipulation utilities
- **react-scripts**: Create React App build tools

### Development Tools
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing
- **Tailwind CSS**: Utility-first CSS framework

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Versal-Pulse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```
   or
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:3000` or `http://localhost:3001`

### Available Scripts

- `npm start`: Start development server on port 3000
- `npm run dev`: Start development server on port 3001
- `npm run build`: Build for production
- `npm test`: Run test suite
- `npm run eject`: Eject from Create React App

## 📱 User Interface

### Design Principles
- **Modern & Clean**: Minimalist design with focus on usability
- **Responsive**: Works seamlessly on desktop, tablet, and mobile
- **Accessible**: WCAG compliant with proper contrast and navigation
- **Intuitive**: User-friendly interface with clear navigation

### Color Scheme
- **Primary**: Indigo blue (#4F46E5)
- **Success**: Green (#10B981)
- **Warning**: Orange (#F59E0B)
- **Error**: Red (#EF4444)
- **Neutral**: Gray scale for text and backgrounds

### Components
- **Sidebar**: Fixed navigation with role-based menu items
- **Header**: Search, notifications, and user profile
- **Dashboard Cards**: Metric overview with visual indicators
- **Task Forms**: Interactive task creation and assignment
- **Status Selector**: Real-time status updates
- **Notification Center**: Comprehensive notification management

## 🔧 Configuration

### Environment Variables
- `PORT`: Development server port (default: 3000)
- `REACT_APP_API_URL`: Backend API endpoint (if applicable)

### Redux Store Structure
- **roleSlice**: User role and authentication state
- **membersSlice**: Team member data and status
- **notificationsSlice**: Notification management
- **analyticsSlice**: Analytics and reporting data

## 📊 Data Flow

### State Management
1. **User Actions**: Triggered by user interactions
2. **Redux Actions**: Dispatched to update state
3. **Component Updates**: UI reflects state changes
4. **Side Effects**: Notifications, analytics updates, etc.

### Real-time Updates
- **Status Changes**: Immediate UI updates
- **Task Progress**: Real-time progress tracking
- **Notifications**: Instant notification delivery
- **Analytics**: Live data updates

## 🎯 Key Features

### Productivity Monitoring
- Real-time team status tracking
- Task progress monitoring
- Performance analytics
- Productivity metrics

### Team Collaboration
- Task assignment and management
- Status updates and communication
- Team member profiles
- Progress tracking

### Notification System
- Toast notifications (top-right)
- Notification center
- Sound alerts
- Priority-based notifications

### Analytics & Reporting
- Team performance metrics
- Individual productivity tracking
- Task completion rates
- Time tracking and analysis

## 🔮 Future Enhancements

### Planned Features
- **Real-time Chat**: Team communication
- **File Sharing**: Document collaboration
- **Time Tracking**: Detailed time logging
- **Mobile App**: Native mobile application
- **API Integration**: Backend service integration
- **Advanced Analytics**: Machine learning insights

### Technical Improvements
- **Performance Optimization**: Code splitting and lazy loading
- **Testing**: Comprehensive test coverage
- **Accessibility**: Enhanced accessibility features
- **Internationalization**: Multi-language support

## 🤝 Contributing

### Development Guidelines
1. Follow React best practices
2. Use functional components with hooks
3. Maintain consistent code style
4. Write meaningful commit messages
5. Test changes thoroughly

### Code Structure
- **Components**: Reusable UI components
- **Pages**: Main application views
- **Redux**: State management slices
- **Hooks**: Custom React hooks
- **Utils**: Helper functions and utilities

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions

---

## 📸 Screenshots

### Dashboard Overview
<img width="1903" height="951" alt="Team Dashboard" src="https://github.com/user-attachments/assets/37d51da7-4cfd-49f8-adc3-d61c8471ca28" />

### Team Management
<img width="1343" height="811" alt="Team Members View" src="https://github.com/user-attachments/assets/0ced03c2-88ef-482e-b09f-bf2ea67e36ea" />

### Task Management
<img width="1262" height="916" alt="Task Assignment Interface" src="https://github.com/user-attachments/assets/d9f8d64b-a6c9-4061-ad29-5fa35853b4af" />

### Analytics Dashboard
<img width="1901" height="958" alt="Analytics and Performance Metrics" src="https://github.com/user-attachments/assets/443be85f-dda0-4cb7-8c25-3f7f38ebd191" />

### Notification System
<img width="1301" height="956" alt="Notification Center and Toast Notifications" src="https://github.com/user-attachments/assets/ed06cfaa-4dbe-4cd8-aff9-765db375d5e2" />

### Calendar Integration
<img width="1718" height="947" alt="Calendar View and Scheduling" src="https://github.com/user-attachments/assets/210268b1-7c2f-4439-9b58-68c134c4991d" />

### Member Details
<img width="1901" height="951" alt="Individual Member Profile and Performance" src="https://github.com/user-attachments/assets/52d2b3d9-4703-4fb0-9807-64db7efb6c2c" />

### Status Management
<img width="1269" height="822" alt="Real-time Status Updates" src="https://github.com/user-attachments/assets/6a96f183-e6c8-48ed-89c8-fc51929665bd" />

### Task Progress Tracking
<img width="1350" height="931" alt="Task Progress and Time Tracking" src="https://github.com/user-attachments/assets/ba25fcb7-3bdf-44e4-850f-d0754289511e" />

### User Interface
<img width="1307" height="918" alt="Modern UI Design" src="https://github.com/user-attachments/assets/1cb72e15-cda9-40e9-81da-eac13c56b496" />

---

**Versal Pulse** - Empowering teams with real-time productivity insights and seamless collaboration.
