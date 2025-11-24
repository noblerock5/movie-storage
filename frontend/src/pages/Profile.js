import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Typography, 
  Row, 
  Col, 
  Statistic, 
  Button, 
  Avatar,
  List,
  Tag,
  message
} from 'antd';
import { 
  UserOutlined, 
  FilmOutlined, 
  HeartOutlined, 
  UploadOutlined,
  LogoutOutlined,
  EditOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const { Title, Text } = Typography;

const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const ProfileHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 40px;
  margin-bottom: 40px;
  color: white;
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 30px;
    
    @media (max-width: 768px) {
      flex-direction: column;
      text-align: center;
    }
  }
  
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
  }
  
  .details h2 {
    margin: 0 0 10px 0;
    font-size: 28px;
  }
  
  .details p {
    margin: 5px 0;
    opacity: 0.9;
  }
  
  .actions {
    margin-top: 20px;
    display: flex;
    gap: 15px;
  }
`;

const StatCard = styled(Card)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  
  .ant-card-body {
    background: transparent;
    color: white;
  }
  
  .ant-statistic-title {
    color: rgba(255, 255, 255, 0.7) !important;
  }
  
  .ant-statistic-content {
    color: white !important;
  }
`;

const ActivityCard = styled(Card)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 20px;
  
  .ant-card-head {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .ant-card-head-title {
    color: white;
  }
  
  .ant-card-body {
    background: transparent;
  }
  
  .ant-list-item {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
  }
  
  .ant-list-item-meta-title {
    color: white !important;
  }
  
  .ant-list-item-meta-description {
    color: rgba(255, 255, 255, 0.6) !important;
  }
`;

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    uploadedMovies: 0,
    favoriteMovies: 0,
    totalViews: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      // 获取用户统计信息
      const [favoritesResponse, moviesResponse] = await Promise.all([
        api.get('/api/favorites'),
        api.get('/api/movies?page=1&limit=100')
      ]);

      const favoriteCount = favoritesResponse.data.movies?.length || 0;
      const uploadedCount = moviesResponse.data.movies?.filter(m => m.user_id === user.id).length || 0;

      setStats({
        uploadedMovies: uploadedCount,
        favoriteMovies: favoriteCount,
        totalViews: uploadedCount * 10 // 模拟观看次数
      });

      // 模拟最近活动
      setRecentActivity([
        {
          title: '上传了电影',
          description: '《复仇者联盟》',
          time: '2小时前',
          type: 'upload'
        },
        {
          title: '收藏了电影',
          description: '《泰坦尼克号》',
          time: '1天前',
          type: 'favorite'
        },
        {
          title: '观看了电影',
          description: '《星际穿越》',
          time: '3天前',
          type: 'watch'
        }
      ]);

    } catch (error) {
      console.error('获取用户数据失败:', error);
      message.error('获取用户数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'upload':
        return <UploadOutlined style={{ color: '#52c41a' }} />;
      case 'favorite':
        return <HeartOutlined style={{ color: '#ff4d4f' }} />;
      case 'watch':
        return <FilmOutlined style={{ color: '#1890ff' }} />;
      default:
        return <UserOutlined />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'upload':
        return 'green';
      case 'favorite':
        return 'red';
      case 'watch':
        return 'blue';
      default:
        return 'default';
    }
  };

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '100px', color: 'white' }}>
        <Title level={3}>请先登录</Title>
        <Button type="primary" onClick={() => navigate('/login')}>
          去登录
        </Button>
      </div>
    );
  }

  return (
    <ProfileContainer>
      <ProfileHeader>
        <div className="user-info">
          <div className="avatar">
            <UserOutlined />
          </div>
          <div className="details">
            <h2>{user.username}</h2>
            <p>{user.email}</p>
            <p>加入时间：{new Date().toLocaleDateString()}</p>
            <div className="actions">
              <Button icon={<EditOutlined />} size="large">
                编辑资料
              </Button>
              <Button 
                icon={<LogoutOutlined />} 
                size="large" 
                onClick={handleLogout}
                danger
              >
                退出登录
              </Button>
            </div>
          </div>
        </div>
      </ProfileHeader>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={8}>
          <StatCard>
            <Statistic
              title="上传的电影"
              value={stats.uploadedMovies}
              prefix={<UploadOutlined />}
            />
          </StatCard>
        </Col>
        <Col xs={24} sm={8}>
          <StatCard>
            <Statistic
              title="收藏的电影"
              value={stats.favoriteMovies}
              prefix={<HeartOutlined />}
            />
          </StatCard>
        </Col>
        <Col xs={24} sm={8}>
          <StatCard>
            <Statistic
              title="总观看次数"
              value={stats.totalViews}
              prefix={<FilmOutlined />}
            />
          </StatCard>
        </Col>
      </Row>

      <ActivityCard
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FilmOutlined />
            最近活动
          </div>
        }
      >
        <List
          itemLayout="horizontal"
          dataSource={recentActivity}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={getActivityIcon(item.type)}
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {item.title}
                    <Tag color={getActivityColor(item.type)}>
                      {item.type === 'upload' ? '上传' : 
                       item.type === 'favorite' ? '收藏' : '观看'}
                    </Tag>
                  </div>
                }
                description={
                  <div>
                    {item.description}
                    <Text style={{ marginLeft: '10px', opacity: 0.6 }}>
                      {item.time}
                    </Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </ActivityCard>
    </ProfileContainer>
  );
};

export default Profile;