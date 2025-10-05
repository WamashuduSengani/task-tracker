import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Button, Input } from '../../ui';
import { RegisterRequest, ApiError } from '../../../types';

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

interface RegisterFormData extends RegisterRequest {
  confirmPassword: string;
}

export const RegisterForm = ({ onSwitchToLogin }: RegisterFormProps) => {
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const [submitError, setSubmitError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof RegisterFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterFormData> = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const registerData: RegisterRequest = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };
      await register(registerData);
    } catch (error) {
      const apiError = error as ApiError;
      setSubmitError(apiError.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-form">
      <div className="auth-form-header">
        <h2>Create Account</h2>
        <p>Join us today! Create your account to get started.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="auth-form-body">
        {submitError && (
          <div className="error-banner">
            {submitError}
          </div>
        )}
        
        <Input
          id="username"
          name="username"
          type="text"
          label="Username"
          value={formData.username}
          onChange={handleInputChange}
          error={errors.username}
          placeholder="Choose a username"
          autoComplete="username"
        />
        
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
          placeholder="Enter your email"
          autoComplete="email"
        />
        
        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password}
          placeholder="Create a password"
          autoComplete="new-password"
        />
        
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          error={errors.confirmPassword}
          placeholder="Confirm your password"
          autoComplete="new-password"
        />
        
        <Button
          type="submit"
          loading={isLoading}
          className="auth-submit-btn"
        >
          Create Account
        </Button>
      </form>
      
      {onSwitchToLogin && (
        <div className="auth-form-footer">
          <p>
            Already have an account?{' '}
            <button
              type="button"
              className="link-button"
              onClick={onSwitchToLogin}
            >
              Sign in
            </button>
          </p>
        </div>
      )}
    </div>
  );
}