import React from 'react';
import Head from 'next/head';
import MainLayout from '../components/layout/MainLayout';
import { useNotifications } from '../hooks/useNotifications';
import NotificationItem from '../components/notifications/NotificationItem';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';
import { useAuth } from '../hooks/useAuth';

export default function NotificationsPage() {
  const { user } = useAuth();
  const { notifications, loading, error } = useNotifications(user?.id);

  return (
    <MainLayout>
      <Head>
        <title>All Notifications | Divo</title>
        <meta name="description" content="View all your notifications" />
      </Head>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          All Notifications
        </h1>

        {loading && (
          <div className="flex justify-center items-center py-10">
            <LoadingSpinner />
          </div>
        )}

        {error && (
          <Alert type="error" message={`Error loading notifications: ${error}`} />
        )}

        {!loading && !error && (
          <div className="space-y-4">
            {notifications && notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center py-5">
                You have no notifications.
              </p>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
