export const initialNotifications = [
  {
    id: 'notification-1',
    title: 'Appointment Confirmed',
    message: 'Your appointment with Dr. Smith has been confirmed for tomorrow at 10:00 AM.',
    type: 'appointment',
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'notification-2',
    title: 'Reminder',
    message: 'Don\'t forget your appointment tomorrow.',
    type: 'reminder',
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: 'notification-3',
    title: 'Medical Results Available',
    message: 'Your recent test results are now available in your patient portal.',
    type: 'medical',
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  }
];
