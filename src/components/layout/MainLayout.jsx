import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import useAuth from '../../hooks/useAuth';
import useNotifications from '../../hooks/useNotifications';
import { getRelativeTime } from '../../utils/formatters';


const MainLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, signOut } = useAuth();
  const { notifications, unreadCount, getRecentNotifications, markAsRead } = useNotifications();


  const recentNotifications = getRecentNotifications(5);

  const isActive = (path) => {
    return router.pathname === path || router.pathname.startsWith(`${path}/`);
  };


  const dropdownVariants = {
    hidden: { opacity: 0, y: -5, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      } 
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.3 } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.3 } }
  };


  useEffect(() => {
    const handleClickOutside = () => {
      setIsNotificationsOpen(false);
      setIsProfileMenuOpen(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  

  useEffect(() => {
    const handleRouteChange = () => {
      setIsMobileMenuOpen(false);
      setIsNotificationsOpen(false);
      setIsProfileMenuOpen(false);
    };
    
    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);
  

  const handleNotificationClick = (id) => {
    markAsRead(id);

  };
  

  const handleLogout = () => {
    signOut();
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <header className={`sticky top-0 z-50 ${theme === 'dark' ? 'bg-gray-800 shadow-md' : 'bg-white shadow'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-2xl font-bold text-primary-600">
                  Divo
                </Link>
              </div>
              <nav className="hidden md:ml-6 md:flex md:space-x-8">
                <Link 
                  href="/" 
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive('/') 
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                      : `border-transparent ${theme === 'dark' ? 'text-gray-200 hover:text-white' : 'text-gray-500 hover:text-gray-700'} hover:border-gray-300`
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/appointments" 
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive('/appointments') 
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                      : `border-transparent ${theme === 'dark' ? 'text-gray-200 hover:text-white' : 'text-gray-500 hover:text-gray-700'} hover:border-gray-300`
                  }`}
                >
                  Appointments
                </Link>
                <Link 
                  href="/find-doctors" 
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive('/find-doctors') 
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                      : `border-transparent ${theme === 'dark' ? 'text-gray-200 hover:text-white' : 'text-gray-500 hover:text-gray-700'} hover:border-gray-300`
                  }`}
                >
                  Find Doctors
                </Link>
                <Link 
                  href="/health-records" 
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive('/health-records') 
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                      : `border-transparent ${theme === 'dark' ? 'text-gray-200 hover:text-white' : 'text-gray-500 hover:text-gray-700'} hover:border-gray-300'}`
                  }`}
                >
                  Health Records
                </Link>
                <Link 
                  href="/about" 
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive('/about') 
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                      : `border-transparent ${theme === 'dark' ? 'text-gray-200 hover:text-white' : 'text-gray-500 hover:text-gray-700'} hover:border-gray-300`
                  }`}
                >
                  About Us
                </Link>
                <Link 
                  href="/features" 
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive('/features') 
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                      : `border-transparent ${theme === 'dark' ? 'text-gray-200 hover:text-white' : 'text-gray-500 hover:text-gray-700'} hover:border-gray-300`
                  }`}
                >
                  Features
                </Link>
              </nav>
            </div>
            <div className="hidden md:flex items-center">
              {/* Theme toggle button */}
              <motion.button
                onClick={toggleTheme}
                className={`p-2.5 rounded-full mr-3 flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </motion.button>

              {/* Show Sign in/Sign up only when not authenticated */}
              {!isAuthenticated ? (
                <>
                  <Link 
                    href="/login" 
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ease-in-out
                      ${theme === 'dark' 
                        ? 'text-white hover:text-primary-300 hover:bg-gray-700' 
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                  >
                    Sign in
                  </Link>
                  <Link 
                    href="/register"
                    className="ml-4 relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-primary-600 to-primary-500 shadow-sm transition-all duration-300 ease-in-out hover:from-primary-700 hover:to-primary-600 hover:shadow-primary-500/25 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transform hover:-translate-y-0.5"
                  >
                    Sign up
                  </Link>
                </>
              ) : null}

              {/* Notifications and Profile dropdowns */}
              {isAuthenticated && (
                <>
                  {/* Notifications dropdown */}
                  <div className="ml-4 relative flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsNotificationsOpen(!isNotificationsOpen);
                        if (isProfileMenuOpen) setIsProfileMenuOpen(false);
                      }}
                      className={`${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'} p-1 rounded-full flex items-center justify-center relative`}
                    >
                      {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800" />
                      )}
                      <svg
                        className={`h-6 w-6 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-500'}`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </button>

                    <AnimatePresence>
                      {isNotificationsOpen && (
                        <motion.div
                          className={`origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white ring-1 ring-black ring-opacity-5'}`}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={dropdownVariants}
                        >
                          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">Notifications</h3>
                            </div>
                            <div className="max-h-60 overflow-y-auto">
                              {notifications?.length > 0 ? (
                                notifications.map((notification) => (
                                  <div
                                    key={notification.id}
                                    className={`px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 ${notification.read ? '' : 'bg-primary-50 dark:bg-gray-700'} border-b border-gray-200 dark:border-gray-700`}
                                  >
                                    <div className="flex justify-between">
                                      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{notification.title}</p>
                                      <span className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</span>
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{notification.message}</p>
                                  </div>
                                ))
                              ) : (
                                <div className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                  No notifications
                                </div>
                              )}
                            </div>
                            <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                              <a href="#" className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300">
                                View all notifications
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {/* Profile dropdown */}
                  <div className="ml-4 relative flex-shrink-0">
                    <div>
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(!isProfileMenuOpen);
                          if (isNotificationsOpen) setIsNotificationsOpen(false);
                        }}
                        className="bg-white dark:bg-gray-700 rounded-full flex text-sm focus:outline-none"
                      >
                        <span className="sr-only">Open user menu</span>
                        {/* Use user's avatar_url or a default */}
                        <img
                          className="h-8 w-8 rounded-full object-cover"
                          src={user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || user?.email || 'User')}&background=random`}
                          alt={user?.full_name || 'User profile'}
                        />
                      </button>
                    </div>

                    <AnimatePresence>
                      {isProfileMenuOpen && (
                        <motion.div
                          className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white ring-1 ring-black ring-opacity-5'}`}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={dropdownVariants}
                        >
                          {/* Link to Profile Page */}
                          <Link
                            href="/profile"
                            className={`block px-4 py-2 text-sm ${theme === 'dark' ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                            role="menuitem"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            Your Profile
                          </Link>
                          {/* Link to Settings Page */}
                          <Link
                            href="/settings"
                            className={`block px-4 py-2 text-sm ${theme === 'dark' ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                            role="menuitem"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            Settings
                          </Link>
                          {/* Sign Out Button */}
                          <button
                            onClick={handleLogout}
                            className={`block w-full text-left px-4 py-2 text-sm ${theme === 'dark' ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                            role="menuitem"
                          >
                            Sign out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              {/* Theme toggle button for mobile */}
              <motion.button
                onClick={toggleTheme}
                className={`p-2 rounded-full mr-2 flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </motion.button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`inline-flex items-center justify-center p-2 rounded-md ${theme === 'dark' ? 'text-gray-200 hover:text-white hover:bg-gray-700' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className={`md:hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={mobileMenuVariants}
            >
              <div className="pt-2 pb-3 space-y-1">
                {/* Mobile Nav Links */}
                <Link
                  href="/"
                  className={`block pl-3 pr-4 py-2 text-base font-medium ${
                    isActive('/')
                      ? 'bg-primary-50 dark:bg-primary-900 border-l-4 border-primary-500 text-primary-700 dark:text-primary-400'
                      : `border-l-4 border-transparent ${theme === 'dark' ? 'text-gray-200 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'}`
                  }`} onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/appointments"
                  className={`block pl-3 pr-4 py-2 text-base font-medium ${
                    isActive('/appointments')
                      ? 'bg-primary-50 dark:bg-primary-900 border-l-4 border-primary-500 text-primary-700 dark:text-primary-400'
                      : `border-l-4 border-transparent ${theme === 'dark' ? 'text-gray-200 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'}`
                  }`} onClick={() => setIsMobileMenuOpen(false)}
                >
                  Appointments
                </Link>
                <Link
                  href="/find-doctors"
                  className={`block pl-3 pr-4 py-2 text-base font-medium ${
                    isActive('/find-doctors')
                      ? 'bg-primary-50 dark:bg-primary-900 border-l-4 border-primary-500 text-primary-700 dark:text-primary-400'
                      : `border-l-4 border-transparent ${theme === 'dark' ? 'text-gray-200 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'}`
                  }`} onClick={() => setIsMobileMenuOpen(false)}
                >
                  Find Doctors
                </Link>
                <Link
                  href="/health-records"
                  className={`block pl-3 pr-4 py-2 text-base font-medium ${
                    isActive('/health-records')
                      ? 'bg-primary-50 dark:bg-primary-900 border-l-4 border-primary-500 text-primary-700 dark:text-primary-400'
                      : `border-l-4 border-transparent ${theme === 'dark' ? 'text-gray-200 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'}`
                  }`} onClick={() => setIsMobileMenuOpen(false)}
                >
                  Health Records
                </Link>
                <Link
                  href="/about"
                  className={`block pl-3 pr-4 py-2 text-base font-medium ${
                    isActive('/about')
                      ? 'bg-primary-50 dark:bg-primary-900 border-l-4 border-primary-500 text-primary-700 dark:text-primary-400'
                      : `border-l-4 border-transparent ${theme === 'dark' ? 'text-gray-200 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'}`
                  }`} onClick={() => setIsMobileMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  href="/features"
                  className={`block pl-3 pr-4 py-2 text-base font-medium ${
                    isActive('/features')
                      ? 'bg-primary-50 dark:bg-primary-900 border-l-4 border-primary-500 text-primary-700 dark:text-primary-400'
                      : `border-l-4 border-transparent ${theme === 'dark' ? 'text-gray-200 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'}`
                  }`} onClick={() => setIsMobileMenuOpen(false)}
                >
                  Features
                </Link>
              </div>
              {/* Mobile Profile/Auth Section */}
              <div className={`pt-4 pb-3 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                {!isAuthenticated ? (
                  <div className="mt-3 space-y-1">
                    <Link
                      href="/login"
                      className={`block px-4 py-2 text-base font-medium ${theme === 'dark' ? 'text-white hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/register"
                      className={`block px-4 py-2 text-base font-medium ${theme === 'dark' ? 'text-white hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign up
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center px-4">
                      <div className="flex-shrink-0">
                        {/* Use user's avatar_url or a default */}
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || user?.email || 'User')}&background=random`}
                          alt={user?.full_name || 'User profile'}
                        />
                      </div>
                      <div className="ml-3">
                        {/* Use user's full_name */}
                        <div className={`text-base font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{user?.full_name || 'User'}</div>
                        {/* Use user's email */}
                        <div className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{user?.email}</div>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1">
                      <Link
                        href="/profile"
                        className={`block px-4 py-2 text-base font-medium ${theme === 'dark' ? 'text-gray-200 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Your Profile
                      </Link>
                      <Link
                        href="/settings"
                        className={`block px-4 py-2 text-base font-medium ${theme === 'dark' ? 'text-gray-200 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                        className={`block w-full text-left px-4 py-2 text-base font-medium ${theme === 'dark' ? 'text-gray-200 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'}`}
                      >
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className={`${theme === 'dark' ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-gray-50 to-gray-100'} pt-16 pb-12 relative overflow-hidden`}>
        {/* Background decoration */}
        <div className="absolute inset-0 z-0">
          <div className={`absolute inset-0 opacity-5 ${theme === 'dark' ? 'bg-grid-white' : 'bg-grid-black'}`}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Footer Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="flex items-center mb-6">
                <span className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">Divo</span>
              </Link>
              <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-6 max-w-md`}>
                Connecting patients with healthcare professionals through innovative digital solutions. Your health is our priority.
              </p>
              <div className="flex space-x-5">
                <a href="#" className={`${theme === 'dark' ? 'text-gray-400 hover:text-primary-400' : 'text-gray-500 hover:text-primary-600'} transition-colors duration-200`}>
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className={`${theme === 'dark' ? 'text-gray-400 hover:text-primary-400' : 'text-gray-500 hover:text-primary-600'} transition-colors duration-200`}>
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className={`${theme === 'dark' ? 'text-gray-400 hover:text-primary-400' : 'text-gray-500 hover:text-primary-600'} transition-colors duration-200`}>
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.418-4.814a2.507 2.507 0 0 1 1.768-1.768C5.746 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className={`text-sm font-bold tracking-wider uppercase mb-6 ${theme === 'dark' ? 'text-primary-400' : 'text-primary-600'}`}>
                Quick Links
              </h3>
              <ul className="space-y-4">
                {[
                  { href: '/about', label: 'About Us' },
                  { href: '/find-doctors', label: 'Find Doctors' },
                  { href: '/appointments', label: 'Appointments' },
                  { href: '/features', label: 'Features' },
                  { href: '/contact', label: 'Contact Us' }
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link 
                      href={href} 
                      className={`group text-sm ${theme === 'dark' ? 'text-gray-300 hover:text-primary-400' : 'text-gray-600 hover:text-primary-600'} transition-colors duration-200 flex items-center`}
                    >
                      <span className="mr-2 transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h3 className={`text-sm font-bold tracking-wider uppercase mb-6 ${theme === 'dark' ? 'text-primary-400' : 'text-primary-600'}`}>
                Legal
              </h3>
              <ul className="space-y-4">
                {[
                  { href: '/privacy', label: 'Privacy Policy' },
                  { href: '/terms', label: 'Terms of Service' },
                  { href: '/cookie-policy', label: 'Cookie Policy' },
                  { href: '/disclaimer', label: 'Disclaimer' }
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link 
                      href={href} 
                      className={`group text-sm ${theme === 'dark' ? 'text-gray-300 hover:text-primary-400' : 'text-gray-600 hover:text-primary-600'} transition-colors duration-200 flex items-center`}
                    >
                      <span className="mr-2 transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className={`pt-8 mt-8 border-t ${theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200'}`}>
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                © {new Date().getFullYear()} Divo, Inc. All rights reserved.
              </p>
              <div className="mt-4 md:mt-0">
                <Link 
                  href="/sitemap" 
                  className={`text-sm ${theme === 'dark' ? 'text-gray-400 hover:text-primary-400' : 'text-gray-500 hover:text-primary-600'} transition-colors duration-200`}
                >
                  Sitemap
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
