import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert } from '@mui/material';
import { supabase } from '../lib/supabase';
import '../styles/auth.css'; // Importing the global CSS file

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    identifier: '', // can be email or username
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let email = formData.identifier;

      // Only query for username if the identifier doesn't look like an email
      if (!formData.identifier.includes('@')) {
        const { data: userByUsername, error: usernameError } = await supabase
          .from('profiles')
          .select('email')
          .eq('username', formData.identifier)
          .maybeSingle();

        if (usernameError) throw usernameError;
        
        // If we found a user by username, use their email
        if (userByUsername) {
          email = userByUsername.email;
        } else {
          throw new Error('Invalid username or password');
        }
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: formData.password,
      });

      if (signInError) throw signInError;
      
      if (data.user) {
        // Check if user is banned
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_banned')
          .eq('id', data.user.id)
          .single();

        if (profileError) throw profileError;

        if (profile?.is_banned) {
          await supabase.auth.signOut();
          throw new Error('Your account has been banned. Please contact support.');
        }

        navigate('/dashboard');
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page min-h-screen flex items-center justify-center bg-black">
      <div className="auth-card w-full max-w-md bg-[#1a1a1a] rounded-lg shadow-xl p-8">
        <h2 className="auth-title text-2xl font-bold text-center text-white mb-8">
          Login to Your Account
        </h2>
        
        {error && (
          <div className="auth-error mb-4 bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form space-y-6">
          <div className="form-group">
            <input
              type="text"
              name="identifier"
              placeholder="Email or Username"
              value={formData.identifier}
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

          <button
            type="submit"
            disabled={loading}
            className="auth-submit"
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>

        <p className="auth-switch mt-6 text-center text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#00ffff] hover:text-[#00cccc] transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}