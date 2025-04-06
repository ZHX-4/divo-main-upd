import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import MainLayout from '../components/layout/MainLayout';

const Sitemap = () => {
  const siteStructure = [
    {
      title: 'Main Pages',
      links: [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
        { name: 'Find Doctors', path: '/find-doctors' },
      ]
    },
    {
      title: 'User Account',
      links: [
        { name: 'Login', path: '/login' },
        { name: 'Register', path: '/register' },
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Settings', path: '/settings' },
      ]
    },
    {
      title: 'Appointments',
      links: [
        { name: 'Book Appointment', path: '/book-appointment' },
        { name: 'My Appointments', path: '/appointments' },
        { name: 'Medical Records', path: '/medical-records' },
      ]
    },
    {
      title: 'Legal & Support',
      links: [
        { name: 'Terms of Service', path: '/terms' },
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Cookie Policy', path: '/cookie-policy' },
        { name: 'Disclaimer', path: '/disclaimer' },
        { name: 'Help Center', path: '/help' },
      ]
    },
  ];

  return (
    <MainLayout>
      <Head>
        <title>Sitemap | Divo</title>
        <meta name="description" content="Navigation map of all pages on the Divo healthcare platform" />
      </Head>

      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Sitemap</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Complete overview of our website structure
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {siteStructure.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {section.title}
              </h2>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      href={link.path}
                      className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Sitemap;
