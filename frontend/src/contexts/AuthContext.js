import React, { createContext, useContext, useState, useEffect } from 'react';
import { message } from 'antd';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // 验证token有效性
      api.get('/auth/me').then(response => {
        setUser(response.data);
      }).catch(() => {
        localStorage.removeItem('token');
      }).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      
      // 获取用户信息
      const userResponse = await api.get('/auth/me');
      setUser(userResponse.data);
      
      message.success('登录成功');
      return true;
    } catch (error) {
      message.error('登录失败: ' + (error.response?.data?.detail || '未知错误'));
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      
      // 获取用户信息
      const userResponse = await api.get('/auth/me');
      setUser(userResponse.data);
      
      message.success('注册成功');
      return true;
    } catch (error) {
      message.error('注册失败: ' + (error.response?.data?.detail || '未知错误'));
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    message.success('已退出登录');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};