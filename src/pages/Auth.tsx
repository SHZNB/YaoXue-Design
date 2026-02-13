import React, { useState } from 'react';
import { supabase, hasSupabaseEnv } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, Loader2, Eye, EyeOff } from 'lucide-react';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cooldown, setCooldown] = useState<number>(0);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'student' | 'teacher' | 'parent'>('student');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Password Strength Calculator
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[@$!%*?&]/.test(pwd)) score += 1;
    return score;
  };

  const strength = getPasswordStrength(password);
  
  const getStrengthText = (score: number) => {
    switch (score) {
      case 0: return '';
      case 1: case 2: return '弱';
      case 3: case 4: return '中';
      case 5: return '强';
      default: return '';
    }
  };

  const getStrengthColor = (score: number) => {
    switch (score) {
      case 0: return 'bg-gray-200';
      case 1: case 2: return 'bg-red-500';
      case 3: case 4: return 'bg-yellow-500';
      case 5: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasSupabaseEnv) {
      setError('服务未配置，请联系管理员');
      return;
    }
    if (!isLogin && cooldown > 0) {
      setError('操作过于频繁，请稍后再试');
      return;
    }
    setLoading(true);
    setError(null);

    // Password strength validation for Signup
    if (!isLogin) {
      const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!strongPasswordRegex.test(password)) {
        setError('密码必须至少包含8个字符，且包含大小写字母、数字和特殊字符(@$!%*?&)');
        setLoading(false);
        return;
      }
      
      if (password !== confirmPassword) {
        setError('两次输入的密码不一致');
        setLoading(false);
        return;
      }
    }

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/');
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              full_name: fullName,
              role: role,
            },
          },
        });
        if (signUpError) throw signUpError;
        
        alert('注册成功！请前往您的邮箱确认验证邮件，验证后即可登录。');
        setIsLogin(true);
        // start cooldown 60s to avoid email rate limit
        setCooldown(60);
        const timer = setInterval(() => {
          setCooldown((s) => {
            if (s <= 1) {
              clearInterval(timer);
              return 0;
            }
            return s - 1;
          });
          return;
        }, 1000);
      }
    } catch (err) {
      let message = (err as Error).message || 'An unknown error occurred';
      if (message === 'Invalid login credentials') {
        message = '登录失败：邮箱或密码错误，或者您尚未验证邮箱。';
      } else if (message.toLowerCase().includes('rate limit exceeded')) {
        message = '操作过于频繁，请稍后再试（建议等待 1-2 分钟）。';
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              {isLogin ? '欢迎回来' : '加入科学探索'}
            </h1>
            <p className="text-slate-500">
              {isLogin ? '登录你的账号开始探索' : '创建一个新账号开启旅程'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm flex items-center gap-2 animate-pulse">
              <span>⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">姓名</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="你的名字"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">角色</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['student', 'teacher', 'parent'] as const).map((r) => (
                      <button
                        type="button"
                        key={r}
                        onClick={() => setRole(r)}
                        className={`py-2 text-sm font-medium rounded-lg border transition-all ${
                          role === r
                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {r === 'student' ? '学生' : r === 'teacher' ? '老师' : '家长'}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">邮箱</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="请输入您的邮箱地址"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">密码</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder={isLogin ? "••••••••" : "8位以上大小写+数字+特殊字符"}
                  minLength={8}
                  onPaste={(e) => e.preventDefault()}
                  onCopy={(e) => e.preventDefault()}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {!isLogin && password && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">密码强度: {getStrengthText(strength)}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${getStrengthColor(strength)}`} 
                      style={{ width: `${(strength / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">确认密码</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${
                      confirmPassword && password !== confirmPassword 
                        ? 'border-red-300 focus:ring-red-200 focus:border-red-500' 
                        : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="请再次输入密码"
                    onPaste={(e) => e.preventDefault()}
                  />
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">两次输入的密码不一致</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={
                loading ||
                (!isLogin && (password !== confirmPassword || strength < 5 || cooldown > 0))
              }
              className={`w-full font-bold py-2.5 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 ${
                loading ||
                (!isLogin && (password !== confirmPassword || strength < 5 || cooldown > 0))
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl text-white'
              }`}
            >
              {loading && <Loader2 className="animate-spin" size={20} />}
              {isLogin ? '登录' : '注册'}
            </button>
            {!isLogin && cooldown > 0 && (
              <p className="text-xs text-slate-500 text-center mt-2">
                请稍后再试（{cooldown}s）
              </p>
            )}
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setPassword('');
                setConfirmPassword('');
              }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {isLogin ? '没有账号？去注册' : '已有账号？去登录'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
