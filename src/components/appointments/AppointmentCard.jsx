import React from 'react';
import { formatDateTime, getStatusBadgeClass, getAppointmentTypeIcon } from '../../utils/formatters';
import Badge from '../common/Badge';
import Card from '../common/Card';
import Avatar from '../common/Avatar';

const AppointmentCard = ({
  appointment,
  onCancel,
  onReschedule,
  onViewDetails,
  className = '',
}) => {
  const { id, doctor, date, time, status, type, symptoms } = appointment;
  

  const getTypeIcon = () => {
    const iconName = getAppointmentTypeIcon(type);
    
    switch (iconName) {
      case 'chat-bubble-left-right':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
          </svg>
        );
      case 'arrow-path':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        );
      case 'clipboard-document-check':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'exclamation-triangle':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
        );
    }
  };
  

  const formattedDateTime = formatDateTime(date, time);
  

  const statusBadgeClass = getStatusBadgeClass(status);
  

  const canCancel = status === 'scheduled' && onCancel;
  

  const canReschedule = status === 'scheduled' && onReschedule;
  
  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-start">
        <Avatar
          src={doctor.profileImage}
          alt={doctor.name}
          size="lg"
          className="flex-shrink-0"
        />
        
        <div className="ml-4 flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium text-gray-900">{doctor.name}</h4>
            <Badge variant={
              status === 'scheduled' ? 'info' :
              status === 'completed' ? 'success' :
              status === 'cancelled' ? 'danger' :
              'warning'
            }>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
          
          <p className="text-sm text-gray-500">{doctor.specialty}</p>
          
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <svg className="mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            {formattedDateTime}
          </div>
          
          <div className="mt-2 flex items-center">
            <Badge
              variant="default"
              icon={getTypeIcon()}
              className="mr-2"
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Badge>
            
            {symptoms && symptoms.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {symptoms.map((symptom, index) => (
                  <Badge key={index} variant="info" size="sm">
                    {symptom}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {(canCancel || canReschedule || onViewDetails) && (
        <div className="mt-4 flex justify-end space-x-2 border-t border-gray-100 pt-4">
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(id)}
              className="text-primary-600 hover:text-primary-800 text-sm font-medium"
            >
              View Details
            </button>
          )}
          
          {canReschedule && (
            <button
              onClick={() => onReschedule(id)}
              className="text-primary-600 hover:text-primary-800 text-sm font-medium"
            >
              Reschedule
            </button>
          )}
          
          {canCancel && (
            <button
              onClick={() => onCancel(id)}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Cancel
            </button>
          )}
        </div>
      )}
    </Card>
  );
};

export default AppointmentCard; 