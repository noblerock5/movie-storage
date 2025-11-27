import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Button, Spin, Empty } from 'antd';
import { PlayCircleOutlined, StarOutlined, FireOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import api from '../services/api';

const { Title, Paragraph } = Typography;

const HeroSection = styled.div`
  background: linear-gradient(135deg, #a8dadc 0%, #457b9d 100%);
  padding: 80px 20px;
  text-align: center;
  color: white;
  margin-bottom: 60px;
  border-radius: 0 0 30px 30px;
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

const SectionTitle = styled(Title)`
  color: #333 !important;
  margin-bottom: 30px !important;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [recentMovies, setRecentMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      // 获取热门电影
      const trendingResponse = await api.get('/api/v1/movies/search?q=2023&page=1');
      setTrendingMovies(trendingResponse.data.movies?.slice(0, 6) || []);
      
      // 获取最新上传的电影
      const recentResponse = await api.get('/api/v1/movies?page=1&limit=6');
      setRecentMovies(recentResponse.data.movies || []);
    } catch (error) {
      console.error('获取电影列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <HeroSection>
        <Title level={1} style={{ color: 'white', marginBottom: '20px' }}>
          高清电影世界
        </Title>
        <Paragraph style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.9)', maxWidth: '600px', margin: '0 auto' }}>
          搜索海量高清影视资源，支持在线播放、投屏观看，打造您的私人影院体验
        </Paragraph>
        <Button
          type="primary"
          size="large"
          icon={<PlayCircleOutlined />}
          style={{ marginTop: '30px', height: '50px', padding: '0 30px', fontSize: '16px' }}
          onClick={() => window.location.href = '/search'}
        >
          开始探索
        </Button>
      </HeroSection>

      <div style={{ padding: '0 20px 60px' }}>
        {/* 热门电影 */}
        <section style={{ marginBottom: '60px' }}>
          <SectionTitle level={2}>
            <FireOutlined />
            热门电影
          </SectionTitle>
          <Row gutter={[24, 24]}>
            {trendingMovies.map((movie, index) => (
              <Col xs={24} sm={12} md={8} lg={6} xl={4} key={index}>
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
                >
                  <Card.Meta
                    title={movie.title}
                    description={
                      <div>
                        {movie.year && <div>年份: {movie.year}</div>}
                        {movie.rating && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <StarOutlined style={{ color: '#faad14' }} />
                            {movie.rating}
                          </div>
                        )}
                        {movie.genre && <div>类型: {movie.genre}</div>}
                      </div>
                    }
                  />
                </MovieCard>
              </Col>
            ))}
          </Row>
        </section>

        {/* 最新上传 */}
        <section>
          <SectionTitle level={2}>
            <PlayCircleOutlined />
            最新上传
          </SectionTitle>
          <Row gutter={[24, 24]}>
            {recentMovies.length > 0 ? (
              recentMovies.map((movie) => (
                <Col xs={24} sm={12} md={8} lg={6} xl={4} key={movie.id}>
                  <Link to={`/movie/${movie.id}`}>
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
                            color: 'white',
                            fontSize: '18px'
                          }}>
                            暂无海报
                          </div>
                        )
                      }
                    >
                      <Card.Meta
                        title={movie.title}
                        description={
                          <div>
                            {movie.description && (
                              <div style={{ 
                                overflow: 'hidden', 
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                {movie.description}
                              </div>
                            )}
                            <div style={{ color: '#faad14', fontSize: '12px', marginTop: '5px' }}>
                              本地上传
                            </div>
                          </div>
                        }
                      />
                    </MovieCard>
                  </Link>
                </Col>
              ))
            ) : (
              <Col span={24}>
                <Empty 
                  description="暂无上传的电影"
                  style={{ color: 'rgba(0, 0, 0, 0.5)' }}
                />
              </Col>
            )}
          </Row>
        </section>
      </div>
    </div>
  );
};

export default Home;