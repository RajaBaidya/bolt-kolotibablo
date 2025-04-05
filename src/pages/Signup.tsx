import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert } from '@mui/material';
import { supabase } from '../lib/supabase';

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Check if username already exists
      const { data: existingUsername, error: usernameError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', formData.username)
        .maybeSingle();

      if (usernameError) throw usernameError;
      if (existingUsername) {
        throw new Error('Username already taken');
      }

      // Create auth user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        // Create profile with username
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              username: formData.username,
              email: formData.email,
            },
          ]);

        if (profileError) throw profileError;
        navigate('/dashboard');
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page min-h-screen flex items-center justify-center bg-black">
      <div className="auth-card w-full max-w-md bg-[#1a1a1a] rounded-lg shadow-xl p-8">
        <h2 className="auth-title text-2xl font-bold text-center text-white mb-8">
          Create an Account
        </h2>
        
        {error && (
          <div className="auth-error mb-4 bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form space-y-6">
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="auth-input w-full bg-[#2a2a2a] text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-[#00ffff] transition-colors"
            />
          </div>
          
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="auth-input w-full bg-[#2a2a2a] text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-[#00ffff] transition-colors"
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="auth-input w-full bg-[#2a2a2a] text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-[#00ffff] transition-colors"
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="auth-input w-full bg-[#2a2a2a] text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-[#00ffff] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth-submit"
          >
            {loading ? 'Loading...' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-switch mt-6 text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-[#00ffff] hover:text-[#00cccc] transition-colors">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}