import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Button, 
  Tag, 
  Rate, 
  Spin, 
  message,
  Modal,
  List,
  Avatar
} from 'antd';
import { 
  PlayCircleOutlined, 
  HeartOutlined, 
  ShareAltOutlined,
  VideoCameraOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import ReactPlayer from 'react-player';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const { Title, Paragraph, Text } = Typography;

const DetailContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const MovieHeader = styled.div`
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const MoviePoster = styled.div`
  width: 300px;
  height: 450px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #e0e0e0, #f0f0f0);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    font-size: 18px;
  }
`;

const MovieInfo = styled.div`
  flex: 1;
  color: #333;
  
  .title {
    font-size: 32px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
  }
  
  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 20px;
    
    .meta-item {
      display: flex;
      align-items: center;
      gap: 5px;
      color: rgba(0, 0, 0, 0.7);
    }
  }
  
  .description {
    color: rgba(0, 0, 0, 0.6);
    line-height: 1.8;
    margin-bottom: 30px;
    font-size: 16px;
  }
  
  .actions {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
  }
`;

const VideoContainer = styled.div`
  margin-top: 40px;
  
  .video-wrapper {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
    overflow: hidden;
    background: #000;
    border-radius: 12px;
  }
  
  .react-player {
    position: absolute;
    top: 0;
    left: 0;
  }
`;

const CastModal = styled(Modal)`
  .ant-modal-content {
    background: white;
    color: #333;
  }
  
  .ant-modal-header {
    background: white;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .ant-modal-title {
    color: #333;
  }
`;

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [castModalVisible, setCastModalVisible] = useState(false);
  const [castDevices, setCastDevices] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  const checkFavoriteStatus = useCallback(async () => {
    try {
      const response = await api.get('/api/v1/favorites');
      const favorites = response.data || [];
      setIsFavorite(favorites.some(m => m.id === parseInt(id)));
    } catch (error) {
      console.error('检查收藏状态失败:', error);
    }
  }, [id]);

  const fetchMovieDetail = useCallback(async () => {
    try {
      const response = await api.get(`/api/v1/movies/${id}`);
      setMovie(response.data);
      
      // 检查是否已收藏
      if (user) {
        checkFavoriteStatus();
      }
    } catch (error) {
      console.error('获取电影详情失败:', error);
      message.error('获取电影详情失败');
    } finally {
      setLoading(false);
    }
  }, [id, user, checkFavoriteStatus]);

  useEffect(() => {
    fetchMovieDetail();
  }, [fetchMovieDetail]);

  const handlePlay = () => {
    setPlaying(true);
  };

  const handleFavorite = async () => {
    if (!user) {
      message.warning('请先登录');
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        await api.delete(`/api/v1/favorites/${id}`);
        message.success('已取消收藏');
      } else {
        await api.post(`/api/v1/favorites/${id}`);
        message.success('收藏成功');
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    message.success('链接已复制到剪贴板');
  };

  const handleCast = async () => {
    try {
      const response = await api.get(`/api/v1/cast/${id}`);
      setCastDevices(response.data.available_devices || []);
      setCastModalVisible(true);
    } catch (error) {
      message.error('获取投屏设备失败');
    }
  };

  const startCast = async (device) => {
    try {
      const response = await api.post('/api/v1/cast/start', {
        movie_id: parseInt(id),
        device_ip: device.ip
      });
      
      if (response.data.success) {
        message.success(`已开始投屏到 ${device.name}`);
        setCastModalVisible(false);
      } else {
        message.error(response.data.message || '投屏失败');
      }
    } catch (error) {
      message.error('投屏失败');
    }
  };

  const getStreamingUrl = () => {
    if (!movie) return null;
    
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

  if (!movie) {
    return (
      <div style={{ textAlign: 'center', padding: '100px', color: 'white' }}>
        <Title level={3}>电影不存在</Title>
        <Button type="primary" onClick={() => navigate('/')}>
          返回首页
        </Button>
      </div>
    );
  }

  return (
    <DetailContainer>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: '20px' }}
      >
        返回
      </Button>

      <MovieHeader>
        <MoviePoster>
          {movie.poster_url ? (
            <img alt={movie.title} src={movie.poster_url} />
          ) : (
            <div className="placeholder">暂无海报</div>
          )}
        </MoviePoster>

        <MovieInfo>
          <Title className="title">{movie.title}</Title>
          
          <div className="meta">
            {movie.year && (
              <div className="meta-item">
                <span>年份:</span>
                <Text strong>{movie.year}</Text>
              </div>
            )}
            
            {movie.genre && (
              <div className="meta-item">
                <span>类型:</span>
                <Tag color="blue">{movie.genre}</Tag>
              </div>
            )}
            
            {movie.duration && (
              <div className="meta-item">
                <span>时长:</span>
                <Text strong>{movie.duration}分钟</Text>
              </div>
            )}
            
            {movie.rating && (
              <div className="meta-item">
                <Rate disabled value={movie.rating / 2} style={{ fontSize: '16px' }} />
                <Text strong>{movie.rating}</Text>
              </div>
            )}
            
            {movie.is_local && (
              <Tag color="green">本地上传</Tag>
            )}
          </div>

          {movie.description && (
            <Paragraph className="description">
              {movie.description}
            </Paragraph>
          )}

          <div className="actions">
            {getStreamingUrl() && (
              <Button
                type="primary"
                size="large"
                icon={<PlayCircleOutlined />}
                onClick={handlePlay}
              >
                立即播放
              </Button>
            )}
            
            <Button
              icon={<HeartOutlined />}
              onClick={handleFavorite}
              type={isFavorite ? 'primary' : 'default'}
            >
              {isFavorite ? '已收藏' : '收藏'}
            </Button>
            
            <Button
              icon={<ShareAltOutlined />}
              onClick={handleShare}
            >
              分享
            </Button>
            
            <Button
              icon={<VideoCameraOutlined />}
              onClick={handleCast}
            >
              投屏
            </Button>
          </div>
        </MovieInfo>
      </MovieHeader>

      {playing && getStreamingUrl() && (
        <VideoContainer>
          <Title level={3} style={{ color: 'white', marginBottom: '20px' }}>
            在线播放
          </Title>
          <div className="video-wrapper">
            <ReactPlayer
              className="react-player"
              url={getStreamingUrl()}
              width="100%"
              height="100%"
              controls
              playing
            />
          </div>
        </VideoContainer>
      )}

      <CastModal
        title="选择投屏设备"
        open={castModalVisible}
        onCancel={() => setCastModalVisible(false)}
        footer={null}
      >
        <List
          dataSource={castDevices}
          renderItem={(device) => (
            <List.Item
              actions={[
                <Button
                  type="primary"
                  onClick={() => startCast(device)}
                >
                  投屏
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar icon={<VideoCameraOutlined />} />}
                title={device.name}
                description={`${device.type} - ${device.ip}`}
              />
            </List.Item>
          )}
        />
      </CastModal>
    </DetailContainer>
  );
};

export default MovieDetail;