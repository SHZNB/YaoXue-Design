import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { RoleSwitcher } from '../components/RoleSwitcher';
import { LogOut, User } from 'lucide-react';

export const MainLayout: React.FC = () => {
  const { profile, signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  S
                </div>
                <span className="font-bold text-xl text-slate-800 tracking-tight">科学探索实验室</span>
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              {profile ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full">
                    <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center text-blue-700">
                      {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt={profile.full_name || 'User'} className="w-8 h-8 rounded-full" />
                      ) : (
                        <User size={18} />
                      )}
                    </div>
                    <span className="font-medium text-sm text-blue-900">
                      {profile.full_name || '同学'}
                    </span>
                  </div>
                  <RoleSwitcher />
                  <button 
                    onClick={handleSignOut}
                    className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title="退出登录"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <Link to="/auth" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  登录 / 注册
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};
