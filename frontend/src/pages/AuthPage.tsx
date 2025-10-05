import React, { useState } from 'react';
import { LoginForm, RegisterForm } from '../components/features/auth';

type AuthMode = 'login' | 'register';

export const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>('login');

  const switchToLogin = () => setMode('login');
  const switchToRegister = () => setMode('register');

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          {mode === 'login' ? (
            <LoginForm onSwitchToRegister={switchToRegister} />
          ) : (
            <RegisterForm onSwitchToLogin={switchToLogin} />
          )}
        </div>
      </div>
    </div>
  );
};