import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Button, Input } from '../../ui';
import { LoginRequest, ApiError } from '../../../types';

interface LoginFormProps {
  onSwitchToRegister?: () => void;
}

export const LoginForm = ({ onSwitchToRegister }: LoginFormProps) => {
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<LoginRequest>>({});
  const [submitError, setSubmitError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof LoginRequest]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginRequest> = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      await login(formData);
    } catch (error) {
      const apiError = error as ApiError;
      setSubmitError(apiError.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="auth-form">
      <div className="auth-form-header">
        <h2>Sign In</h2>
        <p>Welcome back! Please sign in to your account.</p>
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
          placeholder="Enter your username"
          autoComplete="username"
        />
        
        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password}
          placeholder="Enter your password"
          autoComplete="current-password"
        />
        
        <Button
          type="submit"
          loading={isLoading}
          className="auth-submit-btn"
        >
          Sign In
        </Button>
      </form>
      
      {onSwitchToRegister && (
        <div className="auth-form-footer">
          <p>
            Don't have an account?{' '}
            <button
              type="button"
              className="link-button"
              onClick={onSwitchToRegister}
            >
              Sign up
            </button>
          </p>
        </div>
      )}
    </div>
  );
}