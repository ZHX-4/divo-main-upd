import React from 'react';
import { motion } from 'framer-motion';

const Medications = ({ medications, itemVariant }) => {
  return (
    <div className="space-y-6">
      {medications.map((medication) => (
        <motion.div
          key={medication.id}
          variants={itemVariant}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {medication.name}
              </h3>
              <p className="text-sm text-gray-500">
                {medication.dosage} - {medication.frequency}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">
                Start: {medication.startDate}
              </p>
              <p className="text-sm text-gray-500">
                End: {medication.endDate}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Medications;