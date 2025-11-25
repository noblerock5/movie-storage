import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  Tabs, 
  message,
  Divider
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  MailOutlined,
  PlayCircleOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const { Text } = Typography;
const { TabPane } = Tabs;

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #a8dadc 0%, #457b9d 100%);
  padding: 20px;
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: none;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  
  .ant-card-body {
    padding: 40px;
  }
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 30px;
  
  .logo-icon {
    font-size: 48px;
    color: #667eea;
    margin-bottom: 10px;
  }
  
  .logo-text {
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }
  
  .logo-subtitle {
    color: #666;
    font-size: 14px;
    margin-top: 5px;
  }
`;

const StyledTabs = styled(Tabs)`
  .ant-tabs-tab {
    font-size: 16px;
    font-weight: 500;
  }
  
  .ant-tabs-tab-active {
    .ant-tabs-tab-btn {
      color: #667eea;
    }
  }
  
  .ant-tabs-ink-bar {
    background: #667eea;
  }
`;

const Login = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  const handleLogin = async (values) => {
    setLoading(true);
    const success = await login(values.email, values.password);
    setLoading(false);
    
    if (success) {
      navigate('/');
    }
  };

  const handleRegister = async (values) => {
    if (values.password !== values.confirmPassword) {
      message.error('两次输入的密码不一致');
      return;
    }
    
    setLoading(true);
    const success = await register({
      username: values.username,
      email: values.email,
      password: values.password
    });
    setLoading(false);
    
    if (success) {
      navigate('/');
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Logo>
          <div className="logo-icon">
            <PlayCircleOutlined />
          </div>
          <div className="logo-text">电影网站</div>
          <div className="logo-subtitle">高清影视，随心观看</div>
        </Logo>

        <StyledTabs
          activeKey={activeTab}
          onChange={setActiveTab}
          centered
        >
          <TabPane tab="登录" key="login">
            <Form
              name="login"
              onFinish={handleLogin}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: '请输入邮箱!' },
                  { type: 'email', message: '请输入有效的邮箱地址!' }
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="邮箱"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码!' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="密码"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  style={{ height: '45px', fontSize: '16px' }}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane tab="注册" key="register">
            <Form
              name="register"
              onFinish={handleRegister}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: '请输入用户名!' },
                  { min: 3, message: '用户名至少3个字符!' }
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="用户名"
                />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  { required: true, message: '请输入邮箱!' },
                  { type: 'email', message: '请输入有效的邮箱地址!' }
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="邮箱"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: '请输入密码!' },
                  { min: 6, message: '密码至少6个字符!' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="密码"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                rules={[{ required: true, message: '请确认密码!' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="确认密码"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  style={{ height: '45px', fontSize: '16px' }}
                >
                  注册
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </StyledTabs>

        <Divider style={{ margin: '20px 0' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            其他登录方式
          </Text>
        </Divider>

        <div style={{ textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            登录即表示同意用户协议和隐私政策
          </Text>
        </div>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;