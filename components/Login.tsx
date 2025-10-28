
import React, { useState } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import Spinner from './common/Spinner';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [storeCode, setStoreCode] = useState('');
  const [storeName, setStoreName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const toggleForm = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsRegisterMode(!isRegisterMode);
    setMessage(null);
  };
  
  const handleLogin = async () => {
    if (!storeCode || !password) {
        setMessage({ type: 'error', text: 'Store Code and Password are required.' });
        return;
    }
    setIsLoading(true);
    setMessage(null);
    try {
        const response = await api.login(storeCode, password);
        if (response.status === 'success') {
            onLoginSuccess(response);
        } else {
            setMessage({ type: 'error', text: response.message });
        }
    } catch (error) {
        setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
        setIsLoading(false);
    }
  };

  const handleRegister = async () => {
     if (!storeCode || !storeName || !password || !email) {
        setMessage({ type: 'error', text: 'All fields are required for registration.' });
        return;
    }
    setIsLoading(true);
    setMessage(null);
    try {
        const response = await api.register(storeCode, storeName, password, email);
        alert(response.message); // Using alert as in original script
        if (response.message.includes("success")) {
            setIsRegisterMode(false);
        }
    } catch (error) {
         setMessage({ type: 'error', text: 'An unexpected error occurred during registration.' });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="card p-8 rounded-2xl shadow-2xl w-full max-w-md mx-auto">
      <div className="logo-container">
        <div className="logo-text float">🐂 OCTOBULL</div>
        <div className="logo-subtitle">Special Request System</div>
      </div>

      <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        <i className="fas fa-sign-in-alt mr-2"></i>
        {isRegisterMode ? 'Register' : 'Login'}
      </h2>

      {message && (
        <div className={`notification ${message.type === 'error' ? 'notification-error' : 'notification-success'}`}>
            <i className={`fas ${message.type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'} mr-2`}></i>
            {message.text}
        </div>
      )}

      <div className="space-y-3">
        <div className="relative">
          <i className="fas fa-store absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input value={storeCode} onChange={(e) => setStoreCode(e.target.value)} type="text" placeholder="Store Code" className="input-enhanced border rounded-lg w-full pl-10 pr-4 py-3" />
        </div>

        {isRegisterMode && (
          <>
            <div className="relative">
              <i className="fas fa-building absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input value={storeName} onChange={(e) => setStoreName(e.target.value)} type="text" placeholder="Store Name" className="input-enhanced border rounded-lg w-full pl-10 pr-4 py-3" />
            </div>
            <div className="relative">
              <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="input-enhanced border rounded-lg w-full pl-10 pr-4 py-3" />
            </div>
          </>
        )}

        <div className="relative">
          <i className="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="input-enhanced border rounded-lg w-full pl-10 pr-4 py-3" />
        </div>
      </div>
      
      {isRegisterMode ? (
        <button onClick={handleRegister} disabled={isLoading} className="btn-success text-white px-6 py-3 w-full rounded-lg mt-6 font-semibold shadow-lg flex items-center justify-center">
            <i className="fas fa-user-plus mr-2"></i>Daftar {isLoading && <Spinner />}
        </button>
      ) : (
        <button onClick={handleLogin} disabled={isLoading} className="btn-primary text-white px-6 py-3 w-full rounded-lg mt-6 font-semibold shadow-lg flex items-center justify-center">
            <i className="fas fa-sign-in-alt mr-2"></i>Login {isLoading && <Spinner />}
        </button>
      )}

      <p className="text-center mt-4 text-sm text-gray-600">
        {isRegisterMode ? 'Sudah punya akun?' : 'Belum punya akun?'}
        <a href="#" onClick={toggleForm} className="text-purple-600 font-semibold hover:underline ml-1">
          {isRegisterMode ? 'Login' : 'Daftar'}
        </a>
      </p>
    </div>
  );
};

export default Login;
