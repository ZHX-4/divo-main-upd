import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { format, parseISO, isAfter } from 'date-fns';


const MOCK_APPOINTMENTS = [
  {
    id: '1',
    patientId: '1',
    doctorId: '101',
    doctorName: 'Dr. Bachtouti Fouzi',
    specialty: 'Cardiology',
    dateTime: '2023-09-15T10:30:00Z',
    duration: 30,
    status: 'confirmed',
    type: 'in-person',
    location: 'Main Street Medical Center',
    createdAt: '2023-08-20T14:23:00Z',
    updatedAt: '2023-08-20T14:23:00Z',
  },
  {
    id: '2',
    patientId: '1',
    doctorId: '102',
    doctorName: 'Dr. Labed Mahhfoud',
    specialty: 'Dermatology',
    dateTime: '2023-09-18T14:00:00Z',
    duration: 45,
    status: 'pending',
    type: 'video',
    location: 'Virtual Visit',
    createdAt: '2023-08-21T09:15:00Z',
    updatedAt: '2023-08-21T09:15:00Z',
  },
  {
    id: '3',
    patientId: '1',
    doctorId: '103',
    doctorName: 'Dr. Farid Benkhelifa',
    specialty: 'General Practice',
    dateTime: '2023-08-10T11:15:00Z',
    duration: 30,
    status: 'completed',
    type: 'in-person',
    location: 'City Health Clinic',
    createdAt: '2023-07-25T16:45:00Z',
    updatedAt: '2023-08-10T12:00:00Z',
  },
  {
    id: '4',
    patientId: '1',
    doctorId: '104',
    doctorName: 'Dr.  Farhet Mounir',
    specialty: 'Ophthalmology',
    dateTime: '2023-08-05T09:00:00Z',
    duration: 60,
    status: 'cancelled',
    type: 'in-person',
    location: 'Vision Care Center',
    createdAt: '2023-07-20T10:30:00Z',
    updatedAt: '2023-08-01T15:20:00Z',
  }
];

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    userId: '1',
    title: 'Appointment Reminder',
    message: 'You have an appointment with Dr. Bachtouti Fouzi tomorrow at 10:30 AM.',
    type: 'info',
    isRead: false,
    createdAt: '2023-09-14T10:30:00Z',
    link: '/dashboard/appointments/1',
  },
  {
    id: '2',
    userId: '1',
    title: 'New Message',
    message: 'Dr. Mahfoud Chen sent you a message regarding your upcoming appointment.',
    type: 'info',
    isRead: true,
    createdAt: '2023-09-13T14:45:00Z',
    link: '/dashboard/messages/5',
  },
  {
    id: '3',
    userId: '1',
    title: 'Prescription Refill',
    message: 'Your prescription for Farid has been approved for refill.',
    type: 'success',
    isRead: false,
    createdAt: '2023-09-12T09:20:00Z',
    link: '/dashboard/prescriptions',
  }
];

const MOCK_HEALTH_METRICS = {
  bloodPressure: [
    { date: '2023-09-10', systolic: 120, diastolic: 80 },
    { date: '2023-09-05', systolic: 118, diastolic: 78 },
    { date: '2023-09-01', systolic: 122, diastolic: 82 },
  ],
  weight: [
    { date: '2023-09-10', value: 165 },
    { date: '2023-09-03', value: 166 },
    { date: '2023-08-27', value: 168 },
  ],
  bloodGlucose: [
    { date: '2023-09-12', value: 100 },
    { date: '2023-09-05', value: 98 },
    { date: '2023-08-29', value: 105 },
  ]
};

export default function PatientDashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  

  useEffect(() => {

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    

    const now = new Date();
    const upcoming = MOCK_APPOINTMENTS.filter(
      app => isAfter(parseISO(app.dateTime), now) && app.status !== 'cancelled'
    );
    const past = MOCK_APPOINTMENTS.filter(
      app => !isAfter(parseISO(app.dateTime), now) || app.status === 'cancelled'
    );
    
    setUpcomingAppointments(upcoming);
    setPastAppointments(past);
    

    setNotifications(MOCK_NOTIFICATIONS);
  }, [isAuthenticated, router]);
  
  const formatAppointmentDate = (dateTimeString) => {
    const date = parseISO(dateTimeString);
    return format(date, 'MMM dd, yyyy \'at\' h:mm a');
  };
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'cancelled':
        return 'badge-error';
      case 'completed':
        return 'badge-info';
      default:
        return 'badge-info';
    }
  };
  
  const getTypeIcon = (type) => {
    if (type === 'video') {
      return (
        <svg className="h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
        </svg>
      );
    } else {
      return (
        <svg className="h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1.581.814l-4.419-2.95-4.419 2.95A1 1 0 014 16V4zm5 0h2v5a1 1 0 01-1 1H9a1 1 0 01-1-1V4h1z" clipRule="evenodd" />
        </svg>
      );
    }
  };

  return (
    <>
      <Head>
        <title>Patient Dashboard | Divo</title>
        <meta name="description" content="View your appointments, medical records, and more." />
      </Head>

      <div className="min-h-screen bg-gray-100">
        {/* Navigation */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link href="/" className="flex items-center">
                    <svg className="h-8 w-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-3-3v6m-6 0V8a3 3 0 013-3h6a3 3 0 013 3v6a3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                    <span className="ml-2 text-xl font-bold text-primary-600">Divo</span>
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link href="/dashboard/patient" className="border-primary-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    Dashboard
                  </Link>
                  <Link href="/dashboard/appointments" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    Appointments
                  </Link>
                  <Link href="/dashboard/doctors" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    Find Doctors
                  </Link>
                  <Link href="/dashboard/records" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    Medical Records
                  </Link>
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {/* Notification dropdown */}
                <div className="ml-3 relative">
                  <div>
                    <button
                      type="button"
                      className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <span className="sr-only">View notifications</span>
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      {notifications.filter(n => !n.isRead).length > 0 && (
                        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Profile dropdown */}
                <div className="ml-3 relative">
                  <div>
                    <button
                      type="button"
                      className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user?.avatar || '/images/default-avatar.png'}
                        alt=""
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Upcoming Appointments */}
          <div className="px-4 py-6 sm:px-0">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Appointments</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {upcomingAppointments.map((appointment) => (
                  <li key={appointment.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {getTypeIcon(appointment.type)}
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {appointment.doctorName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {appointment.specialty}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(appointment.status)}`}>
                            {appointment.status}
                          </span>
                          <p className="ml-4 text-sm text-gray-500">
                            {formatAppointmentDate(appointment.dateTime)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Past Appointments */}
          <div className="px-4 py-6 sm:px-0">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Past Appointments</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {pastAppointments.map((appointment) => (
                  <li key={appointment.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {getTypeIcon(appointment.type)}
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {appointment.doctorName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {appointment.specialty}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(appointment.status)}`}>
                            {appointment.status}
                          </span>
                          <p className="ml-4 text-sm text-gray-500">
                            {formatAppointmentDate(appointment.dateTime)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Health Metrics */}
          <div className="px-4 py-6 sm:px-0">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Health Metrics</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* Blood Pressure */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Blood Pressure</h3>
                  <div className="mt-4">
                    {MOCK_HEALTH_METRICS.bloodPressure.map((reading, index) => (
                      <div key={index} className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-500">{reading.date}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {reading.systolic}/{reading.diastolic}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Weight */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Weight</h3>
                  <div className="mt-4">
                    {MOCK_HEALTH_METRICS.weight.map((reading, index) => (
                      <div key={index} className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-500">{reading.date}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {reading.value} lbs
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Blood Glucose */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Blood Glucose</h3>
                  <div className="mt-4">
                    {MOCK_HEALTH_METRICS.bloodGlucose.map((reading, index) => (
                      <div key={index} className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-500">{reading.date}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {reading.value} mg/dL
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
} 