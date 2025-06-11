import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

interface PasswordRequirement {
  id: string;
  text: string;
  validator: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  {
    id: 'length',
    text: 'Password must be at least 8 characters long',
    validator: (password) => password.length >= 8
  },
  {
    id: 'uppercase',
    text: 'Password must contain at least one uppercase letter',
    validator: (password) => /[A-Z]/.test(password)
  },
  {
    id: 'lowercase',
    text: 'Password must contain at least one lowercase letter',
    validator: (password) => /[a-z]/.test(password)
  },
  {
    id: 'number',
    text: 'Password must contain at least one number',
    validator: (password) => /[0-9]/.test(password)
  },
  {
    id: 'special',
    text: 'Password must contain at least one special character (@$!%*?&)',
    validator: (password) => /[@$!%*?&]/.test(password)
  }
];

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    if (password.length > 0) {
      const failedRequirement = passwordRequirements.find(req => !req.validator(password));
      setPasswordError(failedRequirement ? failedRequirement.text : undefined);
    } else {
      setPasswordError(undefined);
    }
  }, [password]);

  const isPasswordValid = () => {
    return passwordRequirements.every(req => req.validator(password));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!isPasswordValid()) {
      setError('Please ensure your password meets all requirements');
      return;
    }
    
    setLoading(true);
    
    try {
      await register(name, email, password);
      navigate('/');
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
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create a new account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              sign in to your existing account
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
                label="Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                leftIcon={<User className="h-5 w-5" />}
                required
                minLength={2}
                maxLength={50}
              />
              
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                leftIcon={<Mail className="h-5 w-5" />}
                required
              />
              
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                leftIcon={<Lock className="h-5 w-5" />}
                required
                error={passwordError}
              />
              
              <Input
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                leftIcon={<Lock className="h-5 w-5" />}
                required
                error={password !== confirmPassword && confirmPassword.length > 0 ? 'Passwords do not match' : undefined}
              />
              
              <div>
                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  isLoading={loading}
                  disabled={!isPasswordValid()}
                >
                  Create Account
                </Button>
              </div>
            </form>
            
            <p className="mt-4 text-xs text-center text-gray-500">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-primary-600 hover:text-primary-500">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary-600 hover:text-primary-500">
                Privacy Policy
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};