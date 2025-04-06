import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  fetchNotificationsSuccess,
  addNotification
} from '../store/slices/notificationSlice';


import { initialNotifications } from '../data/sampleNotifications';

const useNotifications = () => {
  const dispatch = useDispatch();
  const { notifications, loading, error, unreadCount } = useSelector(state => state.notifications);
  const [isOpen, setIsOpen] = useState(false);
  

  useEffect(() => {
    if (notifications.length === 0 && !loading && !error) {
      try {

        const fetchData = async () => {
          dispatch(fetchNotificationsSuccess(initialNotifications));
        };
        fetchData();
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    }
  }, [dispatch, notifications.length, loading, error]);
  
  const toggleNotifications = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);
  
  const markNotificationAsRead = useCallback((id) => {
    if (!id) return;
    dispatch(markAsRead(id));
  }, [dispatch]);
  
  const markAllNotificationsAsRead = useCallback(() => {
    dispatch(markAllAsRead());
  }, [dispatch]);
  
  const deleteNotificationById = useCallback((id) => {
    if (!id) return;
    dispatch(deleteNotification(id));
  }, [dispatch]);
  
  const clearNotifications = useCallback(() => {
    dispatch(clearAllNotifications());
  }, [dispatch]);
  
  const createNotification = useCallback((notification) => {
    if (!notification?.title || !notification?.message) {
      console.error('Invalid notification data');
      return null;
    }

    const newNotification = {
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      read: false,
      date: new Date().toISOString(),
      type: 'info',
      ...notification
    };
    
    dispatch(addNotification(newNotification));
    return newNotification;
  }, [dispatch]);
  
  const getNotificationsByType = useCallback((type) => {
    if (!type) return [];
    return notifications.filter(notification => notification.type === type);
  }, [notifications]);
  
  const getUnreadNotifications = useCallback(() => {
    return notifications.filter(notification => !notification.read);
  }, [notifications]);
  
  const getRecentNotifications = useCallback(() => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    return notifications.filter(notification => {
      const notificationDate = new Date(notification.date);
      return notificationDate >= oneDayAgo;
    });
  }, [notifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    isOpen,
    toggleNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotificationById,
    clearNotifications,
    createNotification,
    getNotificationsByType,
    getUnreadNotifications,
    getRecentNotifications
  };
};

export default useNotifications;
