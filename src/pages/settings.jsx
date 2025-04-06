import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import MainLayout from '../components/layout/MainLayout';

const Settings = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('account');


  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const tabs = [
    { id: 'account', name: 'Account Settings' },
    { id: 'privacy', name: 'Privacy & Security' },
    { id: 'notifications', name: 'Notifications' },
    { id: 'billing', name: 'Payment & Billing' },
    { id: 'help', name: 'Help & Support' }
  ];

  return (
    <MainLayout>
      <Head>
        <title>Settings | Divo</title>
        <meta name="description" content="Manage your Divo account settings" />
      </Head>

      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your account preferences and settings
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    ${activeTab === tab.id
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  `}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'account' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Account Information</h2>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      defaultValue={user.name}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      defaultValue={user.email}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      defaultValue={user.phone || ''}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      defaultValue={user.address || ''}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm"
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Preferred Language
                    </label>
                    <select
                      id="language"
                      name="language"
                      className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100 sm:text-sm"
                    >
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                      <option>Chinese</option>
                    </select>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-md font-medium text-gray-900 mb-3">Profile Picture</h3>
                  <div className="flex items-center">
                    <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      {user.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
                      ) : (
                        <svg className="h-12 w-12 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      )}
                    </div>
                    <button
                      type="button"
                      className="ml-5 bg-white dark:bg-gray-700 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
                    >
                      Change
                    </button>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    className="bg-white dark:bg-gray-700 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 mr-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Privacy & Security</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-3">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                          Current Password
                        </label>
                        <input
                          type="password"
                          name="current-password"
                          id="current-password"
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                          New Password
                        </label>
                        <input
                          type="password"
                          name="new-password"
                          id="new-password"
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          name="confirm-password"
                          id="confirm-password"
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm"
                        />
                      </div>
                      <div>
                        <button
                          type="button"
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
                        >
                          Update Password
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-md font-medium text-gray-900 mb-3">Two-Factor Authentication</h3>
                    <div className="mt-2 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Add an extra layer of security to your account by enabling two-factor authentication.
                        </p>
                      </div>
                      <div className="flex items-center">
                        <button
                          type="button"
                          className="ml-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
                        >
                          Enable
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-md font-medium text-gray-900 mb-3">Session Management</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Manage your active sessions and sign out from other devices.
                    </p>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-200">Current Session</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Windows 10 • Chrome • Last active now</p>
                        </div>
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-3">Email Notifications</h3>
                    
                    <div className="mt-4 space-y-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="appointment-reminders"
                            name="appointment-reminders"
                            type="checkbox"
                            defaultChecked
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:checked:bg-primary-600"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="appointment-reminders" className="font-medium text-gray-700 dark:text-gray-200">
                            Appointment Reminders
                          </label>
                          <p className="text-gray-500 dark:text-gray-400">Get notified about upcoming appointments.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="test-results"
                            name="test-results"
                            type="checkbox"
                            defaultChecked
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:checked:bg-primary-600"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="test-results" className="font-medium text-gray-700 dark:text-gray-200">
                            Test Results
                          </label>
                          <p className="text-gray-500 dark:text-gray-400">Receive notifications when new test results are available.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="prescription-updates"
                            name="prescription-updates"
                            type="checkbox"
                            defaultChecked
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:checked:bg-primary-600"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="prescription-updates" className="font-medium text-gray-700 dark:text-gray-200">
                            Prescription Updates
                          </label>
                          <p className="text-gray-500 dark:text-gray-400">Get notified about prescription refills and changes.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="newsletter"
                            name="newsletter"
                            type="checkbox"
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:checked:bg-primary-600"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="newsletter" className="font-medium text-gray-700 dark:text-gray-200">
                            Newsletter
                          </label>
                          <p className="text-gray-500 dark:text-gray-400">Receive our monthly newsletter with health tips and updates.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-md font-medium text-gray-900 mb-3">SMS Notifications</h3>
                    
                    <div className="mt-4 space-y-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="sms-appointment-reminders"
                            name="sms-appointment-reminders"
                            type="checkbox"
                            defaultChecked
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:checked:bg-primary-600"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="sms-appointment-reminders" className="font-medium text-gray-700 dark:text-gray-200">
                            Appointment Reminders
                          </label>
                          <p className="text-gray-500 dark:text-gray-400">Get SMS reminders 24 hours before your appointment.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="sms-prescription-reminders"
                            name="sms-prescription-reminders"
                            type="checkbox"
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:checked:bg-primary-600"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="sms-prescription-reminders" className="font-medium text-gray-700 dark:text-gray-200">
                            Prescription Reminders
                          </label>
                          <p className="text-gray-500 dark:text-gray-400">Get SMS alerts when it's time to refill your prescription.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
                    >
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Payment & Billing</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-3">Payment Methods</h3>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <svg className="h-8 w-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                          </svg>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-200">Visa ending in 4242</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Expires 12/2025</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
                      >
                        <svg className="-ml-0.5 mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                        </svg>
                        Add Payment Method
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-md font-medium text-gray-900 mb-3">Billing History</h3>
                    <div className="flex flex-col">
                      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                          <div className="shadow overflow-hidden border-b border-gray-200 dark:border-gray-700 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                              <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                  >
                                    Date
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                  >
                                    Description
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                  >
                                    Amount
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                  >
                                    Status
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                  >
                                    Invoice
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                <tr>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    May 12, 2023
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                    Cardiology Consultation
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    $150.00
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">
                                      Paid
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <a href="#" className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                                      Download
                                    </a>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    Apr 28, 2023
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                    Blood Test
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    $75.00
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">
                                      Paid
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <a href="#" className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                                      Download
                                    </a>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'help' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Help & Support</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-3">Frequently Asked Questions</h3>
                    
                    <div className="mt-4 space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">How do I book an appointment?</h4>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          You can book an appointment by going to the Doctors page, selecting a doctor, and clicking the "Book Appointment" button. Follow the prompts to select a date and time that works for you.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">How do I view my medical records?</h4>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Your medical records can be accessed from the Health page. There you can view your vitals, medications, and test results. For full medical history, you may need to contact your healthcare provider.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">How do I update my insurance information?</h4>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          You can update your insurance information in the Account Settings section of your profile. Make sure to keep this information up to date to ensure smooth processing of your claims.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-md font-medium text-gray-900 mb-3">Contact Support</h3>
                    
                    <form className="space-y-4">
                      <div>
                        <label htmlFor="support-topic" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                          Topic
                        </label>
                        <select
                          id="support-topic"
                          name="support-topic"
                          className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100 sm:text-sm"
                        >
                          <option>Technical Issue</option>
                          <option>Billing Question</option>
                          <option>Appointment Problem</option>
                          <option>Account Access</option>
                          <option>Other</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="support-message" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                          Message
                        </label>
                        <textarea
                          id="support-message"
                          name="support-message"
                          rows={4}
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm"
                          placeholder="Describe your issue in detail..."
                        />
                      </div>
                      
                      <div>
                        <button
                          type="submit"
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
                        >
                          Submit Ticket
                        </button>
                      </div>
                    </form>
                    
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Or contact us directly:</h4>
                      <div className="mt-2 flex items-center">
                        <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z" />
                        </svg>
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">support@divo.com</span>
                      </div>
                      <div className="mt-2 flex items-center">
                        <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1.02 1.02 0 00-1.02.24l-2.2 2.2a15.045 15.045 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1A11.36 11.36 0 018.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1zM19 12h2a9 9 0 00-9-9v2c3.87 0 7 3.13 7 7z" />
                        </svg>
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">1-800-MEDI-HELP (1-800-633-4435)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;