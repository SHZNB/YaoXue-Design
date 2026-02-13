import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Auth } from '../Auth';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Ensure JSDOM environment
// @vitest-environment jsdom

// Mock Supabase
const mockSignIn = vi.fn();
const mockSignUp = vi.fn();

vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: (...args: unknown[]) => mockSignIn(...args),
      signUp: (...args: unknown[]) => mockSignUp(...args),
    },
  },
  hasSupabaseEnv: true, // 模拟环境变量已配置
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Auth Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderAuth = () => {
    render(
      <BrowserRouter>
        <Auth />
      </BrowserRouter>
    );
  };

  it('renders login form by default', () => {
    renderAuth();
    expect(screen.getByText('欢迎回来')).toBeDefined();
    expect(screen.getByText('登录')).toBeDefined();
    expect(screen.queryByText('确认密码')).toBeNull();
  });

  it('switches to signup form', () => {
    renderAuth();
    fireEvent.click(screen.getByText('没有账号？去注册'));
    expect(screen.getByText('加入科学探索')).toBeDefined();
    expect(screen.getByText('注册')).toBeDefined();
    expect(screen.getByText('确认密码')).toBeDefined();
  });

  it('validates password match on signup', () => {
    renderAuth();
    // Switch to signup
    fireEvent.click(screen.getByText('没有账号？去注册'));

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('请输入您的邮箱地址'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('8位以上大小写+数字+特殊字符'), { target: { value: 'Test@1234' } });
    fireEvent.change(screen.getByPlaceholderText('请再次输入密码'), { target: { value: 'Test@123' } }); // Mismatch

    expect(screen.getByText('两次输入的密码不一致')).toBeDefined();
    
    // Submit button should be disabled (or handle submit logic prevents it)
    const submitBtn = screen.getByText('注册');
    expect(submitBtn.hasAttribute('disabled')).toBe(true);
  });

  it('allows submission when passwords match and strong', async () => {
    renderAuth();
    fireEvent.click(screen.getByText('没有账号？去注册'));

    mockSignUp.mockResolvedValue({ error: null, data: {} });

    fireEvent.change(screen.getByPlaceholderText('你的名字'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('请输入您的邮箱地址'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('8位以上大小写+数字+特殊字符'), { target: { value: 'Test@1234' } });
    fireEvent.change(screen.getByPlaceholderText('请再次输入密码'), { target: { value: 'Test@1234' } });

    const submitBtn = screen.getByText('注册');
    expect(submitBtn.hasAttribute('disabled')).toBe(false);

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Test@1234',
        options: expect.objectContaining({
          data: expect.objectContaining({
            full_name: 'Test User'
          })
        })
      });
    });
  });

  it('handles rate limit error gracefully', async () => {
    renderAuth();
    mockSignIn.mockResolvedValue({ error: { message: 'email rate limit exceeded' } });

    fireEvent.change(screen.getByPlaceholderText('请输入您的邮箱地址'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password' } });
    
    fireEvent.click(screen.getByText('登录'));

    // 4. 验证错误提示
    await waitFor(() => {
      // 使用更灵活的匹配方式，因为 "操作过于频繁" 可能是错误消息的一部分
      expect(screen.getByText((content) => content.includes('操作过于频繁'))).toBeDefined();
    });
  });
});
