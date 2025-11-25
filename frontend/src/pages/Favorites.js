import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Button, 
  Spin, 
  Empty, 
  message,
  Popconfirm
} from 'antd';
import { 
  HeartOutlined, 
  HeartFilled, 
  PlayCircleOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const { Title } = Typography;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const MovieCard = styled(Card)`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    border-color: #667eea;
  }
  
  .ant-card-cover img {
    height: 300px;
    object-fit: cover;
  }
  
  .ant-card-body {
    background: white;
    color: #333;
  }
  
  .ant-card-meta-title {
    color: #333 !important;
    font-size: 16px;
    font-weight: 600;
  }
  
  .ant-card-meta-description {
    color: rgba(0, 0, 0, 0.6) !important;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  
  .title {
    color: #333;
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

const Favorites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/api/favorites');
      setFavorites(response.data.movies || []);
    } catch (error) {
      console.error('获取收藏列表失败:', error);
      message.error('获取收藏列表失败');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (movieId) => {
    try {
      await api.delete(`/api/favorites/${movieId}`);
      message.success('已取消收藏');
      setFavorites(favorites.filter(movie => movie.id !== movieId));
    } catch (error) {
      message.error('取消收藏失败');
    }
  };

  const getStreamingUrl = (movie) => {
    if (movie.stream_url) return movie.stream_url;
    if (movie.file_path) return `http://localhost:8000/${movie.file_path}`;
    return null;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Container>
      <Header>
        <Title level={2} className="title">
          <HeartFilled style={{ color: '#ff4d4f' }} />
          我的收藏
        </Title>
        
        <Button type="primary" onClick={() => navigate('/search')}>
          发现更多电影
        </Button>
      </Header>

      {favorites.length > 0 ? (
        <Row gutter={[24, 24]}>
          {favorites.map((movie) => (
            <Col xs={24} sm={12} md={8} lg={6} xl={4} key={movie.id}>
              <MovieCard
                hoverable
                cover={
                  movie.poster_url ? (
                    <img alt={movie.title} src={movie.poster_url} />
                  ) : (
                    <div style={{ 
                      height: '300px', 
                      background: 'linear-gradient(45deg, #e0e0e0, #f0f0f0)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#666',
                      fontSize: '18px'
                    }}>
                      暂无海报
                    </div>
                  )
                }
                actions={[
                  getStreamingUrl(movie) && (
                    <Button
                      type="text"
                      icon={<PlayCircleOutlined />}
                      onClick={() => window.open(getStreamingUrl(movie), '_blank')}
                      style={{ color: '#333' }}
                    >
                      播放
                    </Button>
                  ),
                  <Link to={`/movie/${movie.id}`}>
                    <Button
                      type="text"
                      style={{ color: '#333' }}
                    >
                      详情
                    </Button>
                  </Link>,
                  <Popconfirm
                    title="确定要取消收藏吗？"
                    onConfirm={() => removeFavorite(movie.id)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      style={{ color: '#ff4d4f' }}
                    >
                      取消收藏
                    </Button>
                  </Popconfirm>
                ].filter(Boolean)}
              >
                <Card.Meta
                  title={movie.title}
                  description={
                    <div>
                      {movie.year && <div>年份: {movie.year}</div>}
                      {movie.genre && <div>类型: {movie.genre}</div>}
                      {movie.rating && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          评分: {movie.rating}
                        </div>
                      )}
                      {movie.is_local && (
                        <div style={{ color: '#52c41a', fontSize: '12px', marginTop: '5px' }}>
                          本地上传
                        </div>
                      )}
                    </div>
                  }
                />
              </MovieCard>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty
          description="还没有收藏任何电影"
          style={{ 
            color: 'rgba(0, 0, 0, 0.5)',
            padding: '60px 0'
          }}
        >
          <Button 
            type="primary" 
            size="large"
            onClick={() => navigate('/search')}
            icon={<HeartOutlined />}
          >
            去收藏电影
          </Button>
        </Empty>
      )}
    </Container>
  );
};

export default Favorites;