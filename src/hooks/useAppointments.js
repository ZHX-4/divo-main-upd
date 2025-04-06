import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth';
import {
  fetchAppointmentsStart,
  fetchAppointmentsSuccess,
  fetchAppointmentsFailure,
  addAppointment,
  updateAppointment,

} from '../store/slices/appointmentSlice';



export const useAppointments = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { appointments, loading, error } = useSelector(
    (state) => state.appointments
  );
  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [doctorsError, setDoctorsError] = useState(null);


  const fetchAppointments = useCallback(
    async () => {
      if (!user?.id) {

        dispatch(fetchAppointmentsSuccess([]));
        return { success: true, appointments: [] };
      }

      try {
        dispatch(fetchAppointmentsStart());

        const { data, error: fetchError } = await supabase
          .from('appointments')
          .select(`
            *,
            patient:patient_id ( id, full_name, avatar_url ),
            doctor:doctor_id ( id, full_name, avatar_url, specialty )
          `)
          .or(`patient_id.eq.${user.id},doctor_id.eq.${user.id}`)
          .order('appointment_time', { ascending: false });

        if (fetchError) {
          throw fetchError;
        }


        const formattedAppointments = data.map(app => ({
            ...app,
            date: app.appointment_time ? new Date(app.appointment_time).toISOString().split('T')[0] : null,
            time: app.appointment_time ? new Date(app.appointment_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : null,
        }));


        dispatch(fetchAppointmentsSuccess(formattedAppointments));
        return { success: true, appointments: formattedAppointments };

      } catch (err) {
        console.error("Error fetching appointments:", err);
        const message = err.message || 'Failed to fetch appointments';
        dispatch(fetchAppointmentsFailure(message));
        return { success: false, error: message };
      }
    },
    [dispatch, user?.id]
  );

  const createAppointment = useCallback(
    async (appointmentData) => {
       if (!user?.id) return { success: false, error: 'User not authenticated' };

      let appointmentTimestamp;
      if (appointmentData.date && appointmentData.time) {
          try {
              appointmentTimestamp = new Date(`${appointmentData.date}T${appointmentData.time}:00`).toISOString();
          } catch (e) {
              console.error("Invalid date/time format:", e);
              return { success: false, error: 'Invalid date or time format provided.' };
          }
      } else {
          return { success: false, error: 'Date and time are required.' };
      }


      const newAppointmentData = {
        patient_id: user.id,
        doctor_id: appointmentData.doctorId,
        appointment_time: appointmentTimestamp,
        status: 'scheduled',
        reason: appointmentData.reason,

      };

      try {
        const { data, error: insertError } = await supabase
          .from('appointments')
          .insert(newAppointmentData)
          .select(`
            *,
            patient:patient_id ( id, full_name, avatar_url ),
            doctor:doctor_id ( id, full_name, avatar_url, specialty )
          `)
          .single();

        if (insertError) {
          throw insertError;
        }


         const formattedAppointment = {
            ...data,
            date: data.appointment_time ? new Date(data.appointment_time).toISOString().split('T')[0] : null,
            time: data.appointment_time ? new Date(data.appointment_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : null,
        };

        dispatch(addAppointment(formattedAppointment));
        return { success: true, appointment: formattedAppointment };

      } catch (err) {
        console.error("Error creating appointment:", err);
        return { success: false, error: err.message || 'Failed to create appointment' };
      }
    },
    [dispatch, user?.id]
  );


  const updateAppointmentById = useCallback(
    async (id, updateData) => {
       if (!user?.id) return { success: false, error: 'User not authenticated' };


       let appointmentTimestamp;
       if (updateData.date && updateData.time) {
           try {
               appointmentTimestamp = new Date(`${updateData.date}T${updateData.time}:00`).toISOString();
               updateData.appointment_time = appointmentTimestamp;
               delete updateData.date;
               delete updateData.time;
           } catch (e) {
               console.error("Invalid date/time format for update:", e);
               return { success: false, error: 'Invalid date or time format provided for update.' };
           }
       } else {

           delete updateData.date;
           delete updateData.time;
       }


      try {
        const { data, error: updateError } = await supabase
          .from('appointments')
          .update(updateData)
          .eq('id', id)


          .select(`
            *,
            patient:patient_id ( id, full_name, avatar_url ),
            doctor:doctor_id ( id, full_name, avatar_url, specialty )
          `)
          .single();

        if (updateError) {
          throw updateError;
        }

         const formattedAppointment = {
            ...data,
            date: data.appointment_time ? new Date(data.appointment_time).toISOString().split('T')[0] : null,
            time: data.appointment_time ? new Date(data.appointment_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : null,
        };

        dispatch(updateAppointment(formattedAppointment));
        return { success: true, appointment: formattedAppointment };

      } catch (err) {
        console.error("Error updating appointment:", err);
        return { success: false, error: err.message || 'Failed to update appointment' };
      }
    },
    [dispatch, user?.id]
  );


  const cancelAppointmentById = useCallback(
    async (id) => {
      return updateAppointmentById(id, { status: 'cancelled' });
    },
    [updateAppointmentById]
  );


  const getUpcomingAppointments = useCallback(() => {
    const now = new Date();
    return appointments.filter(
      (appointment) =>
        appointment.appointment_time && new Date(appointment.appointment_time) >= now && appointment.status === 'scheduled'
    ).sort((a, b) => new Date(a.appointment_time) - new Date(b.appointment_time));
  }, [appointments]);

  const getPastAppointments = useCallback(() => {
     const now = new Date();
    return appointments.filter(
      (appointment) =>
        !appointment.appointment_time || new Date(appointment.appointment_time) < now || appointment.status !== 'scheduled'
    ).sort((a, b) => new Date(b.appointment_time) - new Date(a.appointment_time));
  }, [appointments]);



  const getDoctors = useCallback(async () => {
    setDoctorsLoading(true);
    setDoctorsError(null);
    try {
      const { data, error: doctorError } = await supabase
        .from('profiles')
        .select('id, full_name, specialty, avatar_url, bio')
        .eq('role', 'doctor');

      if (doctorError) {
        throw doctorError;
      }
      setDoctors(data || []);
      return { success: true, doctors: data || [] };
    } catch (err) {
      console.error("Error fetching doctors:", err);
      const message = err.message || 'Failed to fetch doctors';
      setDoctorsError(message);
      return { success: false, error: message };
    } finally {
      setDoctorsLoading(false);
    }
  }, []);


  return {
    appointments,
    loading,
    error,
    fetchAppointments,
    createAppointment,
    updateAppointmentById,
    cancelAppointmentById,
    getUpcomingAppointments,
    getPastAppointments,
    getDoctors,
    doctors,
    doctorsLoading,
    doctorsError
  };
};
