import React from 'react';
import { motion } from 'framer-motion';

const RecentVisits = ({ visits, itemVariant }) => {
  return (
    <div className="space-y-6">
      {visits.map((visit) => (
        <motion.div
          key={visit.id}
          variants={itemVariant}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {visit.diagnosis}
              </h3>
              <p className="text-sm text-gray-500">{visit.doctor}</p>
              <p className="text-sm text-gray-500">{visit.specialty}</p>
            </div>
            <span className="text-sm text-gray-500">{visit.date}</span>
          </div>
          <p className="mt-4 text-gray-600">{visit.notes}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default RecentVisits;