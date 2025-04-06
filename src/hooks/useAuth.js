import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { login, logout, updateUser } from '../store/slices/authSlice';
import { supabase } from '../lib/supabaseClient';

const validateEmail = (email) => {
  return email && email.includes('@') && email.includes('.');
};

export function useAuth() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const { user, isAuthenticated } = useSelector(state => state.auth);


  useEffect(() => {
    setLoading(true);
    setError(null);


    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile on initial load:', profileError);
          setError('Failed to load user profile.');
          dispatch(logout());
        } else if (profile) {
          dispatch(login({ ...session.user, ...profile }));
        } else {

           console.error('Profile not found for authenticated user:', session.user.id);
           setError('User profile missing.');
           await supabase.auth.signOut();
           dispatch(logout());
        }
      } else {

        if (isAuthenticated) {
          dispatch(logout());
        }
      }
      setLoading(false);
    }).catch(err => {
        console.error("Error getting initial session:", err);
        setError("Failed to check authentication status.");
        setLoading(false);
    });



    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setError(null);
        if (session?.user) {

          setLoading(true);
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Error fetching profile on auth change:', profileError);
            setError('Failed to load user profile.');
          } else if (profile) {
            dispatch(login({ ...session.user, ...profile }));
          } else {
             console.error('Profile not found for authenticated user on auth change:', session.user.id);
             setError('User profile missing.');
             await supabase.auth.signOut();
             dispatch(logout());
          }
          setLoading(false);
        } else {

          dispatch(logout());
          setLoading(false);
        }
      }
    );


    return () => {
      subscription?.unsubscribe();
    };
  }, [dispatch, isAuthenticated]);


  const signIn = useCallback(async (email, password) => {
    if (!email || !password) {
      return { success: false, error: 'Email and password are required' };
    }

    try {
      setLoading(true);
      setError(null);
      

      const cleanEmail = String(email).trim().toLowerCase();

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (signInError) throw signInError;

      if (data?.user) {
        return { success: true, user: data.user };
      }
      
      throw new Error('Login failed');
    } catch (err) {
      console.error('Sign in error:', err);
      return {
        success: false,
        error: err.message || 'Failed to sign in'
      };
    } finally {
      setLoading(false);
    }
  }, []);


  const signUp = useCallback(async (formData) => {
    try {
      setLoading(true);
      setError(null);

      const { email, password, firstName, lastName } = formData;
      const cleanEmail = String(email).trim().toLowerCase();

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: `${firstName} ${lastName}`,
            avatar_url: null,
            role: 'patient'
          }
        }
      });

      if (signUpError) {
        throw signUpError;
      }

      if (data?.user) {
        return { success: true, data };
      } else {
        throw new Error('Failed to create user account');
      }

    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);


  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        throw signOutError;
      }

      router.push('/login');
    } catch (err) {
       console.error('Sign out error:', err);
       setError(err.message || 'Failed to sign out.');

       dispatch(logout());
       router.push('/login');
    } finally {

    }
  }, [router, dispatch]);


  const updateProfile = useCallback(async (profileData) => {
    if (!user?.id) {
      setError("Not authenticated.");
      return { success: false, error: "Not authenticated." };
    }
    setLoading(true);
    setError(null);

    try {

      const updateData = {
        full_name: profileData.name,
        username: profileData.username,
        avatar_url: profileData.profilePicture,
        specialty: profileData.specialty,
        bio: profileData.bio,
        updated_at: new Date(),

      };


      Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);


      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      if (updatedProfile) {

        const updatedUser = { ...user, ...updatedProfile };
        dispatch(updateUser(updatedUser));
        return { success: true, user: updatedUser };
      } else {
        throw new Error("Profile update succeeded but failed to retrieve updated data.");
      }

    } catch (err) {
      console.error('Update profile error:', err);
      setError(err.message || 'Failed to update profile.');
      return { success: false, error: err.message || 'Failed to update profile.' };
    } finally {
      setLoading(false);
    }
  }, [dispatch, user]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    updateProfile
  };
}

export default useAuth;
