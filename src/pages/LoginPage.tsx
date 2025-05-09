import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Get the redirect path from location state or default to home
  const from = location.state?.from || '/';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center justify-center">
            <div className="bg-primary-600 text-white p-1.5 rounded mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 16h2m4 0h10M4 12h18M4 8h2m4 0h10M8 4h12"></path>
              </svg>
            </div>
            <span className="text-2xl font-bold text-gray-900">TurfBook</span>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
              create a new account
            </Link>
          </p>
        </div>
        
        <Card>
          <CardContent className="p-6">
            {error && (
              <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                leftIcon={<Mail className="h-5 w-5" />}
                required
              />
              
              <div>
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  leftIcon={<Lock className="h-5 w-5" />}
                  required
                />
                <div className="text-right mt-1">
                  <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                    Forgot password?
                  </Link>
                </div>
              </div>
              
              <div>
                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  isLoading={loading}
                >
                  Sign In
                </Button>
              </div>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Demo Accounts
                  </span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 gap-3">
                <button
                  type="button"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  onClick={() => {
                    setEmail('john@example.com');
                    setPassword('password');
                  }}
                >
                  Regular User (john@example.com)
                </button>
                <button
                  type="button"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  onClick={() => {
                    setEmail('admin@example.com');
                    setPassword('password');
                  }}
                >
                  Admin User (admin@example.com)
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};