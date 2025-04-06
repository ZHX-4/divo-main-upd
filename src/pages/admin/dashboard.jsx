import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '../../components/layout/MainLayout';
import  useAuth  from '../../hooks/useAuth';

const mockDoctors = [ 
  {
    id: 1,
    name: 'Dr. Labed Mahfoud',
    specialty: 'Cardiologist',
    hospital: 'Central Hospital',
    email: 'labed.mahfoud@example.com',
    phone: '+213 678 901 234',
    status: 'Active',
    registrationDate: '2023-02-15',
    rating: 4.8,
  },
  {
    id: 2,
    name: 'Dr. Farid Benkhelifa',
    specialty: 'Pediatrician',
    hospital: 'Children\'s Medical Center',
    email: 'farid.benkhelifa@example.com',
    phone: '+213 678 901 234',
    status: 'Active',
    registrationDate: '2023-03-10',
    rating: 4.6,
  },
  {
    id: 3,
    name: 'Dr. Douaa Bouden',
    specialty: 'Neurologist',
    hospital: 'Neuroscience Institute',
    email: 'douaa.bouden@example.com',
    phone: '+213 678 901 234',
    status: 'Pending',
    registrationDate: '2023-04-22',
    rating: 4.9,
  },
  {
    id: 4,
    name: 'Dr. Farhet Mounir',
    specialty: 'Dermatologist',
    hospital: 'Skin & Wellness Clinic',
    email: 'farhet.mounir@example.com',
    phone: '+213 678 901 234',
    status: 'Active',
    registrationDate: '2023-01-05',
    rating: 4.7,
  },
  {
    id: 5,
    name: 'Dr. Abdellah Djadour',
    specialty: 'Orthopedic Surgeon',
    hospital: 'Orthopedic Specialty Hospital',
    email: 'abdellah.djadour@example.com',
    phone: '+213 678 901 234',
    status: 'Inactive',
    registrationDate: '2023-02-28',
    rating: 4.5,
  }
];

const mockUsers = [
  {
    id: 1,
    name: 'Mounim Benkhaled',
    email: 'mounim.benkhaled@example.com',
    phone: '+213 555 111 222',
    registrationDate: '2023-01-10',
    status: 'Active',
    lastLogin: '2023-05-10 14:30:45',
    appointmentsCount: 7,
  },
  {
    id: 2,
    name: 'Hameed Chouar',
    email: 'hameed.chaour@example.com',
    phone: '+213 555 333 444',
    registrationDate: '2023-02-05',
    status: 'Active',
    lastLogin: '2023-05-09 10:15:20',
    appointmentsCount: 3,
  },
  {
    id: 3,
    name: 'Mohamed Benkhelifa',
    email: 'mohemed.benkhelifa@example.com',
    phone: '+213 555 555 666',
    registrationDate: '2023-03-15',
    status: 'Inactive',
    lastLogin: '2023-04-15 09:45:10',
    appointmentsCount: 0,
  },
  {
    id: 4,
    name: 'Fatima Benkhelifa',
    email: 'fatima.benkhelifa@example.com',
    phone: '+213 555 777 888',
    registrationDate: '2023-01-25',
    status: 'Active',
    lastLogin: '2023-05-10 16:20:30',
    appointmentsCount: 12,
  },
  {
    id: 5,
    name: 'samira haddad',
    email: 'samira.haddad@example.com',
    phone: '+213 555 999 000',
    registrationDate: '2023-04-02',
    status: 'Active',
    lastLogin: '2023-05-08 11:05:55',
    appointmentsCount: 2,
  }
];

const AdminDashboard = () => {
  const router = useRouter();
  const { user, isAdmin, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('doctors');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } }
  };
  
  const slideUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };


  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (!isAdmin) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isAdmin, router]);


  useEffect(() => {
    let data = activeTab === 'doctors' ? mockDoctors : mockUsers;
    

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter(item => 
        item.name.toLowerCase().includes(term) || 
        item.email.toLowerCase().includes(term) ||
        (activeTab === 'doctors' && item.specialty.toLowerCase().includes(term))
      );
    }
    

    if (statusFilter !== 'all') {
      data = data.filter(item => item.status.toLowerCase() === statusFilter.toLowerCase());
    }
    
    setFilteredData(data);
  }, [searchTerm, statusFilter, activeTab]);

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id) => {

    const newData = filteredData.filter(item => item.id !== id);
    setFilteredData(newData);
  };

  const handleAddNew = () => {
    setIsAddModalOpen(true);
  };

  const renderDoctorsTable = () => (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredData.map((doctor) => (
            <tr key={doctor.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{doctor.specialty}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{doctor.hospital}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{doctor.email}</div>
                <div className="text-sm text-gray-500">{doctor.phone}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  doctor.status === 'Active' ? 'bg-green-100 text-green-800' :
                  doctor.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {doctor.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{doctor.rating}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => handleEdit(doctor)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(doctor.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderUsersTable = () => (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointments</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredData.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{user.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{user.email}</div>
                <div className="text-sm text-gray-500">{user.phone}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{user.lastLogin}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{user.appointmentsCount}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => handleEdit(user)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <MainLayout>
      <Head>
        <title>Admin Dashboard - Divo</title>
        <meta name="description" content="Admin dashboard for managing doctors and users" />
      </Head>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="py-6"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <motion.h1
              variants={slideUp}
              className="text-2xl font-semibold text-gray-900"
            >
              Admin Dashboard
            </motion.h1>
            
            <motion.div variants={slideUp} className="mt-4 md:mt-0">
              <button
                onClick={handleAddNew}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Add New {activeTab === 'doctors' ? 'Doctor' : 'User'}
              </button>
            </motion.div>
          </div>

          <div className="mt-4">
            <div className="sm:hidden">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="doctors">Doctors</option>
                <option value="users">Users</option>
              </select>
            </div>

            <div className="hidden sm:block">
              <nav className="flex space-x-4" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('doctors')}
                  className={`px-3 py-2 font-medium text-sm rounded-md ${
                    activeTab === 'doctors'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Doctors
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`px-3 py-2 font-medium text-sm rounded-md ${
                    activeTab === 'users'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Users
                </button>
              </nav>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 min-w-0">
              <div className="max-w-xs">
                <label htmlFor="search" className="sr-only">
                  Search
                </label>
                <input
                  type="search"
                  name="search"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder={`Search ${activeTab}...`}
                />
              </div>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                {activeTab === 'doctors' && <option value="pending">Pending</option>}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium">{filteredData.length}</span> results
            </p>
          </div>

          <div className="mt-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'doctors' ? renderDoctorsTable() : renderUsersTable()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default AdminDashboard; 
