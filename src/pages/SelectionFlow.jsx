import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, User, Store, ArrowRight, Sparkles, MapPin } from 'lucide-react';

export default function SelectionFlow() {
    const [step, setStep] = useState('campus'); // 'campus' | 'role'
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();

    const handleCampusSelect = (campus) => {
        if (campus === '62') {
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000);
        } else {
            setStep('role');
        }
    };

    const handleRoleSelect = (role) => {
        if (role === 'vendor') {
            navigate('/vendor-login');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans text-gray-900">
            {/* Background Decorations */}
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-sky-400/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-orange-400/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-sm z-10 text-center">
                {/* Brand Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center font-bold text-3xl tracking-tighter shadow-xl shadow-black/20 mx-auto mb-6 rotate-3">
                        J.
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">JPRINT<span className="text-orange-500">.</span></h1>
                    <p className="text-gray-500 font-medium text-sm">Select your location to continue</p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {step === 'campus' ? (
                        <motion.div
                            key="campus-step"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <SelectionCard
                                icon={<Building2 className="text-blue-500" />}
                                title="Campus 128"
                                desc="Full service available"
                                onClick={() => handleCampusSelect('128')}
                            />
                            <SelectionCard
                                icon={<MapPin className="text-gray-400" />}
                                title="Campus 62"
                                desc="Coming soon to your locality"
                                onClick={() => handleCampusSelect('62')}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="role-step"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Choose your portal</h2>
                            <SelectionCard
                                icon={<User className="text-green-500" />}
                                title="Continue as User"
                                desc="Print and manage your orders"
                                onClick={() => handleRoleSelect('user')}
                            />
                            <SelectionCard
                                icon={<Store className="text-purple-500" />}
                                title="Continue as Vendor"
                                desc="Access dashboard and fulfill orders"
                                onClick={() => handleRoleSelect('vendor')}
                            />
                            <button
                                onClick={() => setStep('campus')}
                                className="text-xs font-bold text-gray-400 hover:text-black transition-colors mt-4"
                            >
                                ← Back to Campus Selection
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Coming Soon Popup */}
                <AnimatePresence>
                    {showPopup && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.9 }}
                            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-3 z-50 whitespace-nowrap border border-white/10"
                        >
                            <Sparkles className="text-yellow-400" size={20} />
                            <span className="font-bold">Campus 62 is Coming Soon!</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function SelectionCard({ icon, title, desc, onClick }) {
    return (
        <motion.button
            whileHover={{ scale: 1.02, translateY: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="w-full bg-white/80 backdrop-blur-xl p-5 rounded-[24px] shadow-xl shadow-gray-200/50 border border-white/50 flex items-center gap-4 text-left group transition-all hover:bg-white"
        >
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-white transition-colors shadow-inner">
                {icon}
            </div>
            <div className="flex-1">
                <h3 className="font-bold text-gray-900 group-hover:text-black">{title}</h3>
                <p className="text-xs text-gray-500 font-medium">{desc}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight size={16} className="text-gray-400" />
            </div>
        </motion.button>
    );
}
