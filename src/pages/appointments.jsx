import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '../components/layout/MainLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';
import { format } from 'date-fns';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';

export default function Appointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(null);


  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState(''); 
  const [activeTab, setActiveTab] = useState('upcoming'); 


  useEffect(() => {
    setAppointments([]);
    setError(null);
    setLoading(true); 

    if (!user) {
      if (user === null) { 
        setLoading(false);
        setError("Please log in to view appointments.");
      }
      return; 
    }

    if (!user.id || !user.role) {
       console.warn("User object loaded, but ID or Role is missing:", user);
       setLoading(false);
       setError("User information is incomplete. Cannot fetch appointments.");
       return;
    }

    console.log(`useEffect triggered. Fetching appointments for user ${user.id} with role ${user.role}`);

    const loadAppointments = async (userId, userRole) => {
      console.log(`loadAppointments called for user ${userId} with role ${userRole}`);
      setError(null); 
      
      try {
        let filterColumn;
        if (userRole === 'patient') {
          filterColumn = 'patient_id';
        } else if (userRole === 'doctor') {
          filterColumn = 'doctor_id';
        } else {
          console.error(`Invalid user role detected: ${userRole}. Cannot fetch appointments.`);
          throw new Error("Invalid user role.");
        }

        console.log(`Attempting to query 'appointments' filtering by ${filterColumn} = ${userId}`);

        const { data, error: queryError } = await supabase
          .from('appointments')
          .select(`
            *, 
            patient:profiles!appointments_patient_id_fkey(id, full_name, avatar_url), 
            doctor:profiles!appointments_doctor_id_fkey(id, full_name, avatar_url, specialty)
          `)
          .eq(filterColumn, userId) 
          .order('appointment_time', { ascending: true });

        if (queryError) {
          console.error(`Supabase query error when filtering by ${filterColumn}:`, queryError);
          throw queryError; 
        }
        
        console.log(`Appointments data fetched successfully using filter ${filterColumn}:`, data);
        setAppointments(data || []);
        setError(null); 

      } catch (err) {
        console.error('Caught error during loadAppointments execution:', err); 
        setError(err.message || "An unexpected error occurred while fetching appointments."); 
        setAppointments([]); 
      } finally {
        setLoading(false); 
      }
    };

    loadAppointments(user.id, user.role);
    
  }, [user?.id, user?.role]); 


  const getFilteredAppointments = () => {
    if (!appointments) return [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    return appointments.filter(appointment => {
      if (!appointment.appointment_time) return false; 
      const appointmentDate = new Date(appointment.appointment_time);


      if (activeTab === 'upcoming' && appointmentDate < today) return false;
      if (activeTab === 'past' && appointmentDate >= today) return false;
      

      if (selectedTypeFilter && appointment.type !== selectedTypeFilter) return false;
      

      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const doctorName = appointment.doctor?.full_name?.toLowerCase() || '';
        const patientName = appointment.patient?.full_name?.toLowerCase() || '';
        const reason = appointment.reason?.toLowerCase() || '';
        const notes = appointment.notes?.toLowerCase() || ''; 

        return (
          doctorName.includes(searchLower) ||
          patientName.includes(searchLower) ||
          reason.includes(searchLower) ||
          notes.includes(searchLower)
        );
      }
      
      return true; 
    });
  };

  const filteredAppointments = getFilteredAppointments();


  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } } };
  const cardHoverVariants = { hover: { y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)", transition: { type: "spring", stiffness: 400, damping: 17 } } };


  const getStatusColor = (status) => { 
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'Completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    }
  };
  const getTypeIcon = (type) => { 
    switch (type) {
      case 'video': return ( <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></div> );
      case 'phone': return ( <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg></div> );
      default: return ( <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></div> );
    }
  };


  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </MainLayout>
    );
  }

  if (error && !loading) { 
    return (
      <MainLayout>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
           <Alert type="error" message={`Error loading appointments: ${error}`} />
         </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <Head>
        <title>Appointments | Divo</title>
        <meta name="description" content="Manage your medical appointments" />
      </Head>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Section */}
        <motion.div 
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        >
          <div>
            <motion.h1 
              className="text-3xl font-bold text-gray-900 dark:text-white"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}
            >
              My Appointments
            </motion.h1>
            <motion.p 
              className="mt-2 text-lg text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
            >
              View and manage all your scheduled appointments
            </motion.p>
          </div>
          <motion.div 
            className="mt-4 md:mt-0"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href="/find-doctors" legacyBehavior>
              <a className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
                Schedule New Appointment
              </a>
            </Link>
          </motion.div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div 
          className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, reason, notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            <div className="mt-4 md:mt-0">
              <select
                value={selectedTypeFilter}
                onChange={(e) => setSelectedTypeFilter(e.target.value)}
                className="w-full md:w-48 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">All Types</option>
                <option value="in-person">In-Person</option>
                <option value="video">Video Call</option>
                <option value="phone">Phone Call</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`${activeTab === 'upcoming' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`${activeTab === 'past' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Past
            </button>
          </nav>
        </div>

        {/* Appointments List */}
        <motion.div
          variants={containerVariants} initial="hidden" animate="visible"
          className="space-y-6 min-h-[200px]" 
        >
          <AnimatePresence>
            {/* Empty State Logic */}
            {filteredAppointments.length === 0 && !loading && !error && ( 
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-center py-10 px-4"
              >
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No appointments found</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {activeTab === 'upcoming' ? "It looks like you don't have any upcoming appointments." : "It looks like you don't have any past appointments."}
                </p>
                {activeTab === 'upcoming' && (
                   <div className="mt-6">
                     <Link href="/find-doctors" legacyBehavior>
                       <a className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                         Find a Doctor
                       </a>
                     </Link>
                   </div>
                )}
              </motion.div>
            )}

            {/* Render appointments if they exist */}
            {filteredAppointments.length > 0 && filteredAppointments.map((appointment) => (
              <motion.div
                key={appointment.id}
                variants={itemVariants} 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                 <motion.div variants={cardHoverVariants} whileHover="hover" className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          src={user.role === 'patient' ? appointment.doctor?.avatar_url : appointment.patient?.avatar_url || '/images/default-avatar.png'} 
                          alt={user.role === 'patient' ? `Dr. ${appointment.doctor?.full_name}` : appointment.patient?.full_name}
                          className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                          onError={(e) => { e.target.onerror = null; e.target.src='/images/default-avatar.png'; }}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              {user.role === 'patient' ? `Dr. ${appointment.doctor?.full_name || 'N/A'}` : appointment.patient?.full_name || 'N/A'}
                            </h3>
                            {user.role === 'patient' && appointment.doctor?.specialty && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">{appointment.doctor.specialty}</p>
                            )}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date & Time</p>
                            <p className="text-sm text-gray-900 dark:text-white">
                              {appointment.appointment_time ? format(new Date(appointment.appointment_time), 'PPP p') : 'Date not set'}
                            </p>
                          </div>
                          {appointment.type && (
                            <div>
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</p>
                              <div className="flex items-center space-x-2">
                                {getTypeIcon(appointment.type)}
                                <span className="text-sm text-gray-900 dark:text-white">
                                  {appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)}
                                </span>
                              </div>
                            </div>
                          )}
                           {appointment.reason && (
                            <div className="sm:col-span-2">
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Reason for Visit</p>
                              <p className="text-sm text-gray-900 dark:text-white">{appointment.reason}</p>
                            </div>
                           )}
                           {appointment.notes && activeTab === 'upcoming' && (
                             <div className="sm:col-span-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                               <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</p>
                               <p className="text-sm text-gray-900 dark:text-white">{appointment.notes}</p>
                             </div>
                           )}
                           {/* Assuming 'summary' field exists */}
                           {appointment.summary && activeTab === 'past' && (
                             <div className="sm:col-span-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                               <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Visit Summary</p>
                               <p className="text-sm text-gray-900 dark:text-white">{appointment.summary}</p>
                             </div>
                           )}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="mt-4 flex items-center justify-end">
                          {appointment.status === 'scheduled' && activeTab === 'upcoming' && (
                            <div className="flex space-x-3">
                               {appointment.type === 'video' && (
                                 <Link href={`/appointments/${appointment.id}/video-call`} legacyBehavior>
                                    <a className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                      Join Call
                                    </a>
                                 </Link>
                               )}
                               <button
                                type="button"

                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
                               >
                                Cancel
                               </button>
                            </div>
                          )}
                           {(appointment.status === 'completed' || activeTab === 'past') && (
                             <Link href={`/appointments/${appointment.id}`} legacyBehavior>
                               <a className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800">
                                 View Details
                               </a>
                             </Link>
                           )}
                        </div>
                      </div>
                    </div>
                 </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </MainLayout>
  );
}
