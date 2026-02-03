import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

export default function Navbar() {
    const { isLoggedIn, user, logout } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('login');
    const [showDropdown, setShowDropdown] = useState(false);

    const openModal = (mode) => {
        setModalMode(mode);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <>
            <nav className="w-full fixed top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30">
                            C
                        </div>
                        <span className="text-xl font-bold text-slate-800 tracking-tight">
                            Career<span className="text-blue-600">DNA</span>
                        </span>
                    </Link>

                    {/* Nav Actions */}
                    <div id="nav-actions">
                        {!isLoggedIn ? (
                            // Guest UI
                            <div className="flex gap-4">
                                <button
                                    onClick={() => openModal('login')}
                                    className="text-slate-500 hover:text-blue-600 font-medium transition"
                                >
                                    登入
                                </button>
                                <button
                                    onClick={() => openModal('register')}
                                    className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition shadow-md shadow-blue-500/20"
                                >
                                    免費註冊
                                </button>
                            </div>
                        ) : (
                            // User UI
                            <div className="flex items-center gap-4">
                                <div className="text-right hidden md:block">
                                    <div className="text-xs text-slate-400">Welcome back</div>
                                    <div className="text-sm font-bold text-slate-800">{user?.name || 'User'}</div>
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center text-blue-600 font-bold overflow-hidden"
                                    >
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </button>
                                    {showDropdown && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 transform origin-top-right">
                                            <div className="py-2">
                                                <Link to="#" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                                                    個人檔案設定
                                                </Link>
                                                <Link to="#" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                                                    歷史測評紀錄
                                                </Link>
                                                <div className="border-t border-slate-100 my-1"></div>
                                                <button
                                                    onClick={() => { logout(); setShowDropdown(false); }}
                                                    className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                                                >
                                                    登出系統
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Auth Modal */}
            <AuthModal
                isOpen={showModal}
                onClose={closeModal}
                mode={modalMode}
                setMode={setModalMode}
            />
        </>
    );
}
