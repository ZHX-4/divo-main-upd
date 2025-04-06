import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { BellIcon } from '@heroicons/react/24/outline';
import NotificationDropdown from '../notifications/NotificationDropdown';

const Navbar = () => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'appointment',
      title: 'Upcoming Appointment',
      message: 'You have an appointment tomorrow at 2:00 PM',
      time: '1 hour ago',
      isNew: true
    },
    {
      id: 2,
      type: 'system',
      title: 'Profile Updated',
      message: 'Your profile has been successfully updated',
      time: '2 hours ago',
      isNew: false
    }
  ]);
  const notificationRef = useRef(null);

  const hasNewNotifications = notifications.some(notif => notif.isNew);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="...">
      {/* ...existing code... */}
      <div className="relative ml-4" ref={notificationRef}>
        <button
          onClick={() => {
            console.log("Notification button clicked");
            setIsNotificationsOpen(!isNotificationsOpen);
          }}
          className="relative p-2 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none"
          aria-label="Notifications"
        >
          <BellIcon className="h-6 w-6 text-gray-700" />
          {hasNewNotifications && (
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
          )}
        </button>
        <NotificationDropdown
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          notifications={notifications}
          onNotificationClick={(id) => {
            setNotifications(notifications.map(notif => 
              notif.id === id ? { ...notif, isNew: false } : notif
            ));
          }}
        />
      </div>

      {/* Profile Avatar/Icon Link */}
      {/* Assuming there's an element like this for the profile */}
      <div className="ml-4"> 
        <Link href="/profile" legacyBehavior>
          <a className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500" aria-label="User profile">
            {/* Placeholder for Avatar - Replace with actual component/element */}
            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary-500">
              <span className="text-sm font-medium leading-none text-white">UU</span> {/* Example Initials */}
            </span>
            {/* Or if using an Avatar component: <Avatar user={currentUser} size="sm" /> */}
          </a>
        </Link>
      </div>
      {/* ...rest of the navbar code... */}
    </nav>
  );
};

export default Navbar;
