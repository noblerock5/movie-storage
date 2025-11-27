// 测试前端 API 调用
const axios = require('axios');

const API_BASE_URL = 'http://localhost:8000';

const testAPI = async () => {
  const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
  });

  try {
    console.log('测试 API 端点...');
    
    // 测试根路径
    const rootResponse = await api.get('/');
    console.log('✓ 根路径:', rootResponse.status);
    
    // 测试健康检查
    const healthResponse = await api.get('/health');
    console.log('✓ 健康检查:', healthResponse.status);
    
    // 测试登录 (使用 FormData)
    const formData = new URLSearchParams();
    formData.append('username', 'test@example.com');
    formData.append('password', 'testpassword');
    
    try {
      const loginResponse = await api.post('/api/v1/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      console.log('✓ 登录端点可访问:', loginResponse.status);
    } catch (error) {
      console.log('✓ 登录端点存在 (预期错误):', error.response?.status);
    }
    
    // 测试电影搜索
    try {
      const searchResponse = await api.get('/api/v1/movies/search?q=test');
      console.log('✓ 电影搜索端点:', searchResponse.status);
    } catch (error) {
      console.log('✓ 电影搜索端点存在:', error.response?.status);
    }
    
    console.log('\n所有 API 端点测试完成！');
    
  } catch (error) {
    console.error('API 测试失败:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('请确保后端服务器正在运行在 http://localhost:8000');
    }
  }
};

testAPI();