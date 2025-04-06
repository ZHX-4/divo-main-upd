import React, { useState, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../hooks/useAuth';
import RadioGroup from '../components/common/RadioGroup';
import { supabase } from '../lib/supabaseClient';

const Register = () => {
  const router = useRouter();
  const { signUp, loading: authLoading, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [role, setRole] = useState('patient');
  const [proofFile, setProofFile] = useState(null);
  const [errors, setErrors] = useState({}); 
  const [formError, setFormError] = useState('');
  const [registrationMessage, setRegistrationMessage] = useState(''); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });


    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }

    if (errors.form) {
      setErrors({ ...errors, form: null });
    }
    if (registrationMessage) setRegistrationMessage('');
  };

  const handleRoleChange = useCallback((newRole) => {
    setRole(newRole);
    setProofFile(null);
    if (errors.role) setErrors(prev => ({ ...prev, role: null }));
    if (errors.proofFile) setErrors(prev => ({ ...prev, proofFile: null }));
    if (formError) setFormError('');
    if (registrationMessage) setRegistrationMessage('');
  }, [errors.role, errors.proofFile, formError, registrationMessage]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProofFile(file || null);
    if (errors.proofFile) setErrors(prev => ({ ...prev, proofFile: null }));
    if (formError) setFormError('');
    if (registrationMessage) setRegistrationMessage('');
  };


  const validate = () => {
    const newErrors = {};
    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required.';
    }
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required.';
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email address is invalid.';
    }
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    if (role === 'doctor' && !proofFile) {
      newErrors.proofFile = 'Proof of qualification is required for doctors.';
    } else if (role === 'doctor' && proofFile && proofFile.size > 5 * 1024 * 1024) {
       newErrors.proofFile = 'File size must be less than 5MB.';
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setRegistrationMessage('');

    if (!validate()) {
      return;
    }

    try {
      const { firstName, lastName, email, password } = formData;
      let proofUrl = null;


      if (role === 'doctor' && proofFile) {
        const fileExt = proofFile.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `doctor_proofs/${fileName}`;


        const { error: uploadError } = await supabase.storage
          .from('qualifications') 
          .upload(filePath, proofFile);

        if (uploadError) {
          console.error("Supabase upload error:", uploadError);
          throw new Error(`Failed to upload proof: ${uploadError.message}`);
        }


        const { data: urlData } = supabase.storage.from('qualifications').getPublicUrl(filePath);
        proofUrl = urlData?.publicUrl; 
        if (!proofUrl) {
            console.warn("Could not get public URL for uploaded proof file. Proceeding without it.");

        }
      }

      const result = await signUp({
        email,
        password,
        options: {
          data: {
            full_name: `${firstName} ${lastName}`,
            role: role,

          }
        }
      });


      if (result.error || !result.data?.user) {

         const errorMessage = authError || result.error?.message || 'Registration failed during user creation.';
         throw new Error(errorMessage);
      }



      const user = result.data.user; 
      const profileData = {
          id: user.id,
          full_name: `${firstName} ${lastName}`,
          role: role,
          updated_at: new Date().toISOString(),

          ...(role === 'doctor' && proofUrl && { proof_url: proofUrl }),
      };


      const { error: profileError } = await supabase
          .from('profiles')
          .upsert(profileData, { onConflict: 'id' });

      if (profileError) {
          console.error("Error upserting profile:", profileError);
      }


      setRegistrationMessage('Registration successful! Please check your email to confirm your account.');
      setFormData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
      setRole('patient');
      setProofFile(null);

    } catch (error) {
      console.error("Registration Error:", error);
      setFormError(error.message || 'An unexpected error occurred during registration.' );
    }
  };

  return (
    <MainLayout>
      <Head>
        <title>Sign Up | Divo</title>
        <meta name="description" content="Create your Divo account to schedule and manage your medical appointments" />
      </Head>

      <div className="px-4 py-8 sm:px-0 min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md mx-auto">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Your Account</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Join Divo to manage your healthcare journey</p>
          </motion.div>

          {/* Removed Progress Steps UI */}

          <form onSubmit={handleSubmit}>
            <motion.div
              key="registration-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6"
            >
              <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Account Information</h2>
              
              {/* Role Selection */}
              <div className="mb-4">
                <RadioGroup
                  label="Register as:"
                  name="role"
                  options={[
                    { label: 'Patient', value: 'patient' },
                    { label: 'Doctor', value: 'doctor' },
                  ]}
                  selectedValue={role}
                  onChange={handleRoleChange}
                  disabled={authLoading}
                />
                 {errors.role && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.role}</p>
                  )}
              </div>

              <div className="space-y-4">
                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={authLoading}
                    className={`mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:focus:ring-primary-400 sm:text-sm ${
                      errors.firstName ? 'border-red-300 dark:border-red-500' : ''
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={authLoading}
                    className={`mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:focus:ring-primary-400 sm:text-sm ${
                      errors.lastName ? 'border-red-300 dark:border-red-500' : ''
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.lastName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={authLoading}
                    className={`mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:focus:ring-primary-400 sm:text-sm ${
                      errors.email ? 'border-red-300 dark:border-red-500' : ''
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Password (min. 8 characters)
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={authLoading}
                    className={`mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:focus:ring-primary-400 sm:text-sm ${
                      errors.password ? 'border-red-300 dark:border-red-500' : ''
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50`}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    disabled={authLoading}
                    className={`mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:focus:ring-primary-400 sm:text-sm ${
                      errors.confirmPassword ? 'border-red-300 dark:border-red-500' : ''
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50`}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Conditional Doctor Proof Upload */}
                {role === 'doctor' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="pt-4 border-t border-gray-200 dark:border-gray-700"
                  >
                    <label htmlFor="proofFile" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Proof of Qualification (PDF, JPG, PNG - Max 5MB)
                    </label>
                    <input
                      type="file"
                      id="proofFile"
                      name="proofFile"
                      onChange={handleFileChange}
                      disabled={authLoading}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className={`mt-1 block w-full text-sm text-gray-500 dark:text-gray-400
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-primary-50 dark:file:bg-primary-900/30 file:text-primary-700 dark:file:text-primary-300
                        hover:file:bg-primary-100 dark:hover:file:bg-primary-900/50
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800
                        ${errors.proofFile ? 'border-red-300 dark:border-red-500 border rounded-md' : 'border-gray-300 dark:border-gray-600 border rounded-md'} 
                        disabled:opacity-50`}
                    />
                    {errors.proofFile && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.proofFile}</p>
                    )}
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Please upload a document verifying your medical license or qualification. We will review this information and respond as soon as possible.
                    </p>
                  </motion.div>
                )}

                {/* Display Form Error or Success Message */}
                 {(formError || authError || registrationMessage) && (
                    <div className={`rounded-md p-3 mt-4 ${
                        registrationMessage
                            ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800'
                            : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800'
                    }`}>
                      <p className={`text-sm ${
                          registrationMessage
                            ? 'text-green-700 dark:text-green-300'
                            : 'text-red-600 dark:text-red-400'
                      }`}>
                        {registrationMessage || formError || authError} {/* Display formError */}
                      </p>
                    </div>
                  )}
              </div>

              {/* Submit Button */}
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={authLoading || !!registrationMessage}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {authLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </motion.div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Register;
