import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Loader2, Sparkles, Shield, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, password, 'user');
            navigate('/home');
        } catch (err) {
            console.error(err);
            if (err.includes && err.includes('Unexpected token')) {
                setError("Server connection failed. Please check backend.");
            } else {
                setError(typeof err === 'string' ? err : 'Invalid credentials');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-6 relative overflow-hidden text-gray-900 font-sans">

            {/* Background Decorations */}
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm z-10"
            >
                {/* Brand Header */}
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center font-bold text-3xl tracking-tighter shadow-xl shadow-black/20 mx-auto mb-6 rotate-3">
                        J.
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back.</h1>
                    <p className="text-gray-500 font-medium text-sm">Sign in to access your print history.</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[32px] shadow-2xl shadow-gray-200/50 border border-white/50">

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">Email Address</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="student@jiit.ac.in"
                                    className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-11 py-4 text-sm font-bold placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">Password</label>
                            <div className="relative group">
                                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-11 py-4 text-sm font-bold placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs font-medium pt-1">
                            <label className="flex items-center gap-2 cursor-pointer select-none text-gray-600">
                                <div className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center bg-white group-hover:border-black transition-colors">
                                    {/* Mock Checkbox */}
                                </div>
                                Remember me
                            </label>
                            <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">Forgot Password?</a>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-red-50 text-red-600 text-xs font-bold p-4 rounded-xl flex items-start gap-2 leading-relaxed"
                            >
                                <span className="mt-0.5 select-none">⚠️</span>
                                <div>{error}</div>
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-black text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <span className="flex items-center gap-2">Sign In <ArrowRight size={16} /></span>}
                        </button>
                    </form>

                </div>

                <div className="text-center mt-8">
                    <p className="text-gray-500 text-sm font-medium">
                        New around here?{' '}
                        <Link to="/register" className="text-black font-bold hover:underline">
                            Create Account
                        </Link>
                    </p>
                    <div className="mt-4">
                        <Link to="/vendor-login" className="inline-block text-[10px] text-gray-400 font-bold uppercase tracking-wider hover:text-gray-600 transition-colors px-3 py-1 rounded-full border border-transparent hover:border-gray-200">
                            Vendor Access
                        </Link>
                    </div>
                </div>

            </motion.div>
        </div>
    );
}
