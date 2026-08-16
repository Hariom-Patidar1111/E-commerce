import React, { useState } from 'react';
import { login, register } from '../services/api';  // ✅ API import
import { useNavigate } from 'react-router-dom';      // ✅ Redirect ke liye

const LoginPage = () => {
  const navigate = useNavigate();  // ✅ Page redirect ke liye
  
  const [activeForm, setActiveForm] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // --- Loading State ---
  const [loading, setLoading] = useState(false);

  // --- Error State ---
  const [error, setError] = useState('');

  // --- form state ---
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const [forgotEmail, setForgotEmail] = useState('');

  // ============================================================
  // ===== LOGIN HANDLER (API CALL) =====
  // ============================================================
  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!loginEmail || !loginPassword) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // ✅ API Call - Login
      const response = await login(loginEmail, loginPassword);
      
      console.log('Login Success:', response);
      
      // ✅ Token automatically save ho jayega (api.js mein interceptors handle kar rahe hain)
      
      // ✅ Role ke hisaab se redirect
      const role = localStorage.getItem('role');
      if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
      
      // ✅ Success message (optional)
      alert('✅ Login successful! Welcome back!');
      
    } catch (err) {
      console.error('Login Error:', err);
      
      // ❌ Error message show karo
      if (err.response) {
        // Backend se error aaya
        setError(err.response.data?.message || 'Invalid email or password');
      } else if (err.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // ===== SIGNUP HANDLER (API CALL) =====
  // ============================================================
  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!signupName || !signupEmail || !signupPassword) {
        setError('Please fill in all fields');
        return;
    }

    if (signupPassword.length < 6) {
        setError('Password must be at least 6 characters');
        return;
    }

    setLoading(true);
    setError('');

    try {
        // ✅ FIXED
        const userData = {
            name: signupName,      // ✅ "name" - Backend ke hisaab se
            email: signupEmail,    // ✅ "email"
            password: signupPassword
        };
        
        console.log('Sending:', userData);  // Debug
        
        const response = await register(userData);
        console.log('Success:', response);
        
        alert('✅ Account created successfully! Please login.');
        setActiveForm('login');
        setSignupName('');
        setSignupEmail('');
        setSignupPassword('');
        
    } catch (err) {
        console.error('Error:', err);
        if (err.response) {
            setError(err.response.data?.message || 'Registration failed');
        } else if (err.request) {
            setError('Network error. Please check your connection.');
        } else {
            setError('Something went wrong. Please try again.');
        }
    } finally {
        setLoading(false);
    }
};

  // ============================================================
  // ===== GOOGLE LOGIN HANDLER =====
  // ============================================================
  const handleGoogle = () => {
    alert('🔜 Google OAuth coming soon!');
    // TODO: Implement Google OAuth
  };

  // ============================================================
  // ===== RENDER =====
  // ============================================================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 px-4 py-8">
      <div className="w-full max-w-sm bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl shadow-purple-200/50 p-6 md:p-8 transition-all duration-300 border border-white/50">
        
        {/* App Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 tracking-tight">
            🏠 BuyNest
          </h1>
          <p className="text-xs text-purple-500/80 mt-1 font-medium">Your Trusted Shopping Partner</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            ❌ {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-1 bg-gradient-to-r from-purple-50 to-pink-50 rounded-full p-1 mb-6 border border-purple-100/50">
          <button
            className={`flex-1 py-2 px-3 rounded-full text-sm font-medium transition-all duration-200 ${
              activeForm === 'login'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-400/30'
                : 'text-purple-700 hover:text-purple-900 hover:bg-purple-100/50'
            }`}
            onClick={() => setActiveForm('login')}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-2 px-3 rounded-full text-sm font-medium transition-all duration-200 ${
              activeForm === 'signup'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-400/30'
                : 'text-purple-700 hover:text-purple-900 hover:bg-purple-100/50'
            }`}
            onClick={() => setActiveForm('signup')}
          >
            Sign Up
          </button>
          <button
            className={`flex-1 py-2 px-3 rounded-full text-sm font-medium transition-all duration-200 ${
              activeForm === 'forgot'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-400/30'
                : 'text-purple-700 hover:text-purple-900 hover:bg-purple-100/50'
            }`}
            onClick={() => setActiveForm('forgot')}
          >
            Forgot
          </button>
        </div>

        {/* --- LOGIN FORM --- */}
        {activeForm === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Login to Your Account</h2>
            <p className="text-xs text-purple-500/70 -mt-1">Enter your credentials to continue</p>
            
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 text-sm rounded-lg border-2 border-purple-200/50 bg-white/50 focus:bg-white focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 outline-none transition-all duration-200"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 text-sm rounded-lg border-2 border-purple-200/50 bg-white/50 focus:bg-white focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 outline-none transition-all duration-200 pr-10"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 active:scale-[0.98] text-white font-semibold text-sm rounded-lg shadow-lg shadow-purple-400/30 transition-all duration-200 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? '⏳ Signing In...' : 'Sign In'}
            </button>

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
              <span className="text-[10px] font-medium text-purple-400 uppercase tracking-wider">or continue with</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white border-2 border-purple-200/50 hover:border-purple-400 hover:bg-purple-50/50 rounded-lg font-medium text-sm text-gray-700 transition-all duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <p className="text-center text-xs text-gray-600 mt-2">
              Don't have an account?{' '}
              <span
                className="font-semibold text-purple-600 hover:text-purple-700 hover:underline cursor-pointer"
                onClick={() => setActiveForm('signup')}
              >
                Create Account
              </span>
            </p>
          </form>
        )}

        {/* --- SIGNUP FORM --- */}
        {activeForm === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Create Account</h2>
            <p className="text-xs text-purple-500/70 -mt-1">Join BuyNest and start shopping!</p>
            
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full px-3 py-2 text-sm rounded-lg border-2 border-purple-200/50 bg-white/50 focus:bg-white focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 outline-none transition-all duration-200"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 text-sm rounded-lg border-2 border-purple-200/50 bg-white/50 focus:bg-white focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 outline-none transition-all duration-200"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showSignupPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="w-full px-3 py-2 text-sm rounded-lg border-2 border-purple-200/50 bg-white/50 focus:bg-white focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 outline-none transition-all duration-200 pr-10"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600 transition-colors"
                >
                  {showSignupPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 active:scale-[0.98] text-white font-semibold text-sm rounded-lg shadow-lg shadow-purple-400/30 transition-all duration-200 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? '⏳ Creating Account...' : 'Create Account'}
            </button>

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
              <span className="text-[10px] font-medium text-purple-400 uppercase tracking-wider">or continue with</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white border-2 border-purple-200/50 hover:border-purple-400 hover:bg-purple-50/50 rounded-lg font-medium text-sm text-gray-700 transition-all duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <p className="text-center text-xs text-gray-600 mt-2">
              Already have an account?{' '}
              <span
                className="font-semibold text-purple-600 hover:text-purple-700 hover:underline cursor-pointer"
                onClick={() => setActiveForm('login')}
              >
                Sign In
              </span>
            </p>
          </form>
        )}

        {/* --- FORGOT PASSWORD FORM --- */}
        {activeForm === 'forgot' && (
          <form onSubmit={handleForgot} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Reset Password</h2>
            <p className="text-xs text-purple-500/70 -mt-1 leading-relaxed">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 text-sm rounded-lg border-2 border-purple-200/50 bg-white/50 focus:bg-white focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 outline-none transition-all duration-200"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 active:scale-[0.98] text-white font-semibold text-sm rounded-lg shadow-lg shadow-purple-400/30 transition-all duration-200"
            >
              Send Reset Link
            </button>

            <p className="text-center text-xs text-gray-600 mt-2">
              Remember your password?{' '}
              <span
                className="font-semibold text-purple-600 hover:text-purple-700 hover:underline cursor-pointer"
                onClick={() => setActiveForm('login')}
              >
                Sign In
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;