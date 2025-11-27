import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const response = await api.get(`/api/v1/movies/${id}`);
        setMovie(response.data);
      } catch (error) {
        console.error('获取电影详情失败:', error);
      } finally {
        setLoading(false);
      }
    };

    const checkFavoriteStatus = async () => {
      try {
        const response = await api.get(`/api/v1/favorites/check/${id}`);
        setIsFavorite(response.data.is_favorite);
      } catch (error) {
        console.error('检查收藏状态失败:', error);
      }
    };

    fetchMovieDetail();
    if (user) {
      checkFavoriteStatus();
    }
  }, [id, user]);



  const toggleFavorite = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await api.delete(`/api/v1/favorites/${id}`);
        setIsFavorite(false);
      } else {
        await api.post(`/api/v1/favorites/${id}`);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('操作收藏失败:', error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const shareMovie = () => {
    if (navigator.share) {
      navigator.share({
        title: movie.title,
        text: movie.description,
        url: window.location.href
      });
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href);
      alert('链接已复制到剪贴板');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-white text-lg">加载电影详情中...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <p className="text-white text-lg mb-4">电影不存在</p>
          <button 
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container min-h-screen">
      {/* 返回按钮 */}
      <div className="pt-20 px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-200"
        >
          <span>←</span>
          <span>返回</span>
        </button>
      </div>

      {/* 电影详情头部 */}
      <div className="content-wrapper pb-12">
        <div className="glass-card p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 电影海报 */}
            <div className="flex-shrink-0">
              <div className="relative w-72 h-96 lg:w-80 lg:h-120 mx-auto lg:mx-0">
                {movie.poster_url ? (
                  <img 
                    src={movie.poster_url} 
                    alt={movie.title}
                    className="w-full h-full object-cover rounded-2xl shadow-2xl"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-2xl flex items-center justify-center">
                    <div className="text-white text-center">

                      <div className="text-lg">暂无海报</div>
                    </div>
                  </div>
                )}
                
                {/* 播放按钮悬浮层 */}
                <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button
                    onClick={() => setShowPlayer(true)}
                    className="bg-white/90 backdrop-blur-sm rounded-full p-6 transform hover:scale-110 transition-transform duration-300"
                  >
                    <div className="text-3xl">▶️</div>
                  </button>
                </div>
              </div>
            </div>

            {/* 电影信息 */}
            <div className="flex-1 text-white">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                {movie.title}
              </h1>

              {/* 电影元信息 */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {movie.year && (
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                    📅 {movie.year}年
                  </span>
                )}
                {movie.genre && (
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                    🎭 {movie.genre}
                  </span>
                )}
                {movie.duration && (
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                    ⏱️ {movie.duration}分钟
                  </span>
                )}
                {movie.rating && (
                  <span className="bg-yellow-500/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                    <span>★</span>
                    <span>{movie.rating}</span>
                  </span>
                )}
                {movie.is_local && (
                  <span className="bg-green-500/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                    本地文件
                  </span>
                )}
              </div>

              {/* 电影描述 */}
              {movie.description && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-3">剧情简介</h3>
                  <p className="text-white/80 leading-relaxed">
                    {movie.description}
                  </p>
                </div>
              )}

              {/* 操作按钮 */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setShowPlayer(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <span>▶️</span>
                  <span>立即播放</span>
                </button>

                <button
                  onClick={toggleFavorite}
                  disabled={favoriteLoading}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
                    isFavorite
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                  }`}
                >
                  <span>{isFavorite ? '♥' : '♡'}</span>
                  <span>{isFavorite ? '已收藏' : '收藏'}</span>
                </button>

                <button
                  onClick={shareMovie}
                  className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition-all duration-200"
                >
                  分享
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 播放器模态框 */}
        {showPlayer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-4xl">
              <button
                onClick={() => setShowPlayer(false)}
                className="absolute -top-12 right-0 text-white hover:text-white/80 transition-colors duration-200"
              >
                ✕ 关闭
              </button>
              
              {movie.stream_url || movie.file_path ? (
                <div className="relative w-full pt-[56.25%] bg-black rounded-lg overflow-hidden">
                  <video
                    className="absolute inset-0 w-full h-full"
                    controls
                    autoPlay
                    src={movie.stream_url || movie.file_path}
                  >
                    您的浏览器不支持视频播放
                  </video>
                </div>
              ) : (
                <div className="bg-white rounded-lg p-8 text-center">

                  <p className="text-gray-700 text-lg mb-4">暂无播放源</p>
                  <p className="text-gray-500">这部电影暂时无法在线播放</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 相关推荐 */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            相关推荐
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* 这里可以添加相关电影的推荐逻辑 */}
            <div className="text-center text-white/60 py-8 col-span-full">
              暂无相关推荐
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;