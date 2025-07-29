import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  removeToastNotification
} from '../redux/slices/notificationsSlice';

const ToastNotifications = () => {
  const toastNotifications = useSelector(state => state.notifications.toastNotifications);
  const settings = useSelector(state => state.notifications.notificationSettings);
  const dispatch = useDispatch();
  const audioRef = useRef(null);

  // Auto-dismiss toasts based on settings
  useEffect(() => {
    toastNotifications.forEach(toast => {
      const timeElapsed = Date.now() - toast.createdAt;
      const remainingTime = settings.toastDuration - timeElapsed;

      if (remainingTime > 0) {
        const timer = setTimeout(() => {
          dispatch(removeToastNotification({ toastId: toast.id }));
        }, remainingTime);

        return () => clearTimeout(timer);
      } else {
        // Toast is already expired, remove immediately
        dispatch(removeToastNotification({ toastId: toast.id }));
      }
    });
  }, [toastNotifications, settings.toastDuration, dispatch]);

  // Play notification sound
  useEffect(() => {
    if (toastNotifications.length > 0 && settings.enableSounds) {
      // Create a simple notification sound using Web Audio API
      playNotificationSound();
    }
  }, [toastNotifications.length, settings.enableSounds]);

  const playNotificationSound = () => {
    try {
      // Create a simple beep sound
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.log('Audio notification not supported:', error);
    }
  };

  const handleCloseToast = (toastId) => {
    dispatch(removeToastNotification({ toastId }));
  };

  const getToastColorClasses = (color, priority) => {
    const baseClasses = "border-l-4 shadow-lg rounded-r-lg";
    
    switch (color) {
      case 'red':
        return `${baseClasses} bg-red-50 border-red-400 text-red-800`;
      case 'orange':
        return `${baseClasses} bg-orange-50 border-orange-400 text-orange-800`;
      case 'yellow':
        return `${baseClasses} bg-yellow-50 border-yellow-400 text-yellow-800`;
      case 'green':
        return `${baseClasses} bg-green-50 border-green-400 text-green-800`;
      case 'blue':
        return `${baseClasses} bg-blue-50 border-blue-400 text-blue-800`;
      case 'indigo':
        return `${baseClasses} bg-indigo-50 border-indigo-400 text-indigo-800`;
      case 'purple':
        return `${baseClasses} bg-purple-50 border-purple-400 text-purple-800`;
      case 'gray':
        return `${baseClasses} bg-gray-50 border-gray-400 text-gray-800`;
      default:
        return `${baseClasses} bg-blue-50 border-blue-400 text-blue-800`;
    }
  };

  const getPriorityPulse = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'animate-pulse';
      case 'high':
        return 'animate-pulse';
      default:
        return '';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = Date.now();
    const diff = now - new Date(timestamp).getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  if (!settings.enableToasts || toastNotifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
      {toastNotifications.map((toast, index) => (
        <div
          key={toast.id}
          className={`
            ${getToastColorClasses(toast.color, toast.priority)}
            ${getPriorityPulse(toast.priority)}
            pointer-events-auto
            transform transition-all duration-300 ease-in-out
            animate-fade-in
            max-w-sm w-full
            p-4
            relative
            backdrop-blur-sm
          `}
          style={{
            animationDelay: `${index * 100}ms`,
            zIndex: 1000 - index
          }}
        >
          {/* Progress bar for auto-dismiss */}
          <div className="absolute top-0 left-0 h-1 bg-current opacity-20 rounded-t transition-all duration-linear"
               style={{
                 width: `${Math.max(0, 100 - ((Date.now() - toast.createdAt) / settings.toastDuration) * 100)}%`,
                 transitionDuration: `${settings.toastDuration}ms`
               }}
          />

          <div className="flex items-start">
            {/* Icon */}
            <div className="flex-shrink-0 mr-3">
              <div className={`text-2xl ${toast.priority === 'urgent' ? 'animate-bounce' : ''}`}>
                {toast.icon}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-semibold truncate">{toast.title}</h4>
                <div className="flex items-center space-x-2 ml-2">
                  {toast.priority === 'urgent' && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      URGENT
                    </span>
                  )}
                  <button
                    onClick={() => handleCloseToast(toast.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close notification"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-current opacity-90 leading-relaxed">
                {toast.message}
              </p>

              <div className="flex items-center justify-between mt-2">
                <span className="text-xs opacity-70">
                  {formatTimeAgo(toast.timestamp)}
                </span>
                
                {toast.relatedUser && (
                  <span className="text-xs opacity-70">
                    by {toast.relatedUser}
                  </span>
                )}
              </div>

              {/* Action button for navigation */}
              {toast.actionUrl && (
                <div className="mt-3">
                  <button
                    onClick={() => {
                      // In a real app, this would handle navigation
                      console.log('Navigate to:', toast.actionUrl);
                      handleCloseToast(toast.id);
                    }}
                    className="text-xs font-medium underline hover:no-underline opacity-80 hover:opacity-100 transition-opacity"
                  >
                    View Details →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Hidden audio element for fallback sound */}
      <audio
        ref={audioRef}
        preload="auto"
        style={{ display: 'none' }}
      >
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUdBDuF7O" type="audio/wav" />
      </audio>
    </div>
  );
};

export default ToastNotifications; 