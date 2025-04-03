import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { FaUserShield, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

export default function AdminRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const { register, isLoading, error } = useAuth();
  const router = useRouter();

  const validateForm = () => {
    let isValid = true;
    const errors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    };

    if (!name) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      errors.email = 'Invalid email format';
      isValid = false;
    }

    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      await register({ name, email, password });
    }
  };

  return (
    <>
      <Head>
        <title>Admin Registration | BizLocate</title>
        <meta name="description" content="Register as a BizLocate admin" />
      </Head>

      <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-full bg-primary text-white mb-4">
            <FaUserShield size={32} />
          </div>
          <h1 className="text-2xl font-bold">Admin Registration</h1>
          <p className="text-gray-600">Create an admin account</p>
        </div>

        {error && (
          <div className="alert alert-error mb-4">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaUser className="text-gray-400" />
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className={`input input-bordered w-full pl-10 ${
                  formErrors.name ? 'input-error' : ''
                }`}
              />
            </div>
            {formErrors.name && (
              <label className="label">
                <span className="label-text-alt text-error">{formErrors.name}</span>
              </label>
            )}
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaEnvelope className="text-gray-400" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`input input-bordered w-full pl-10 ${
                  formErrors.email ? 'input-error' : ''
                }`}
              />
            </div>
            {formErrors.email && (
              <label className="label">
                <span className="label-text-alt text-error">{formErrors.email}</span>
              </label>
            )}
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaLock className="text-gray-400" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className={`input input-bordered w-full pl-10 ${
                  formErrors.password ? 'input-error' : ''
                }`}
              />
            </div>
            {formErrors.password && (
              <label className="label">
                <span className="label-text-alt text-error">{formErrors.password}</span>
              </label>
            )}
          </div>

          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text">Confirm Password</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaLock className="text-gray-400" />
              </span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className={`input input-bordered w-full pl-10 ${
                  formErrors.confirmPassword ? 'input-error' : ''
                }`}
              />
            </div>
            {formErrors.confirmPassword && (
              <label className="label">
                <span className="label-text-alt text-error">{formErrors.confirmPassword}</span>
              </label>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Creating Account...
              </>
            ) : (
              'Register'
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <p>
            Already have an account?{' '}
            <Link href="/admin/login" className="text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </>
  );
} 