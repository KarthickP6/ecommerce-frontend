import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/app/store';
import { registerUser } from '@/features/auth/authSlice';
import { toast } from 'react-toastify';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading } = useSelector((state: RootState) => state.auth);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordStrength < 2) {
      toast.error('Password is too weak');
      return;
    }

    try {
      const result = await dispatch(
        registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        })
      );
      if (result.payload) {
        toast.success('Registration successful! Please login to continue.');
        navigate('/login');
      }
    } catch (err) {
      toast.error('Registration failed');
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-yellow-500';
    if (passwordStrength === 3) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return 'Very Weak';
    if (passwordStrength === 1) return 'Weak';
    if (passwordStrength === 2) return 'Fair';
    if (passwordStrength === 3) return 'Good';
    return 'Strong';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Main card with better background */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-10">
          {/* Header section */}
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold text-white mb-3">Create Account</h1>
            <p className="text-gray-300 text-lg">Join ShopHub today</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-200">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-6 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white/30 transition-all duration-200 backdrop-blur-sm"
              />
            </div>

            {/* Email field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-200">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-6 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white/30 transition-all duration-200 backdrop-blur-sm"
              />
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-200">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-6 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white/30 transition-all duration-200 backdrop-blur-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  {showPassword ? '🔓' : '🔒'}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-3 pt-3 border-t border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-300">Password Strength</span>
                    <span className={`text-xs font-bold ${passwordStrength <= 1 ? 'text-red-400' : passwordStrength === 2 ? 'text-yellow-400' : 'text-green-400'}`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${getPasswordStrengthColor()}`}
                      style={{ width: `${(passwordStrength / 4) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-200">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-6 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white/30 transition-all duration-200 backdrop-blur-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  {showConfirm ? '🔓' : '🔒'}
                </button>
              </div>
              {formData.confirmPassword && (
                <div className="text-xs mt-2">
                  {formData.password === formData.confirmPassword ? (
                    <span className="text-green-400 font-medium">✓ Passwords match</span>
                  ) : (
                    <span className="text-red-400 font-medium">✗ Passwords do not match</span>
                  )}
                </div>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start pt-2">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 mt-0.5 rounded bg-white/20 border border-white/30 text-purple-400 cursor-pointer"
              />
              <label htmlFor="terms" className="ml-3 text-sm text-gray-300 cursor-pointer">
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>

            {/* Create Account button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 mt-8 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-white/20"></div>
            <span className="text-gray-400 text-sm font-medium">or</span>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>

          {/* Social buttons - text only */}
          <div className="space-y-3">
            <button type="button" className="w-full py-2.5 px-4 border border-white/30 rounded-xl text-gray-200 font-medium hover:bg-white/10 transition-all duration-200">
              Sign up with Google
            </button>
            <button type="button" className="w-full py-2.5 px-4 border border-white/30 rounded-xl text-gray-200 font-medium hover:bg-white/10 transition-all duration-200">
              Sign up with GitHub
            </button>
          </div>

          {/* Sign in link */}
          <p className="mt-8 text-center text-gray-300">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-400 font-semibold hover:text-purple-300 transition">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

