import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
      performSearch(searchQuery, 1);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery, page = 1) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await api.get(`/api/v1/movies/search`, {
        params: { q: searchQuery, page, limit: 20 }
      });
      setMovies(response.data.movies || []);
      setTotalResults(response.data.total || 0);
      setCurrentPage(page);
      setHasSearched(true);
    } catch (error) {
      console.error('搜索失败:', error);
      setMovies([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
      performSearch(query.trim(), 1);
    }
  };

  const handlePageChange = (page) => {
    performSearch(query, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const MovieCard = ({ movie, index }) => (
    <Link 
      to={`/movie/${movie.id}`}
      className="modern-card fade-in-up"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="relative overflow-hidden">
        {movie.poster_url ? (
          <img 
            src={movie.poster_url} 
            alt={movie.title}
            className="movie-poster w-full h-64 object-cover"
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
            <div className="text-white text-center">

              <div className="text-sm">暂无海报</div>
            </div>
          </div>
        )}
        
        {/* 悬浮播放按钮 */}
        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 transform hover:scale-110 transition-transform duration-300">
            <div className="text-2xl">▶️</div>
          </div>
        </div>

        {/* 评分标签 */}
        {movie.rating && (
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-lg flex items-center space-x-1">
            <span className="text-yellow-400">★</span>
            <span className="text-sm font-semibold">{movie.rating}</span>
          </div>
        )}

        {/* 年份标签 */}
        {movie.year && (
          <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-lg">
            <span className="text-sm">{movie.year}</span>
          </div>
        )}

        {/* 来源标签 */}
        <div className="absolute bottom-2 left-2">
          {movie.is_local ? (
            <span className="bg-green-500/80 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs">
              本地文件
            </span>
          ) : (
            <span className="bg-blue-500/80 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs">
              🌐 在线
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-1">
          {movie.title}
        </h3>
        
        {movie.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {movie.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          {movie.genre && (
            <span className="genre-tag text-xs">
              {movie.genre}
            </span>
          )}
          
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            {movie.duration && (
              <span>⏱️ {movie.duration}分钟</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="page-container min-h-screen">
      <div className="pt-24 pb-12">
        <div className="content-wrapper">
          {/* 搜索标题 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              搜索电影
            </h1>
            <p className="text-white/70 text-lg">
              发现您喜爱的精彩影片
            </p>
          </div>

          {/* 搜索框 */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索电影名称、演员、导演..."
                className="w-full px-6 py-4 pr-14 text-gray-700 bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white text-lg transition-all duration-200"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-xl hover:shadow-lg transition-all duration-200"
              >
                搜索
              </button>
            </div>
          </form>

          {/* 加载状态 */}
          {loading && (
            <div className="text-center py-12">
              <div className="loading-spinner mx-auto mb-4"></div>
              <p className="text-white text-lg">搜索中...</p>
            </div>
          )}

          {/* 搜索结果 */}
          {!loading && hasSearched && (
            <>
              {/* 结果统计 */}
              <div className="mb-8 text-center">
                {totalResults > 0 ? (
                  <div>
                    <p className="text-white text-lg">
                      找到 <span className="font-bold text-2xl">{totalResults}</span> 个相关结果
                    </p>
                    {query && (
                      <p className="text-white/70 mt-2">
                        关键词: <span className="font-semibold">"{query}"</span>
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="text-white text-lg mb-4">😔 没有找到相关结果</p>
                    <p className="text-white/70">
                      试试其他关键词或<span className="text-white/90 font-semibold">浏览全部电影</span>
                    </p>
                  </div>
                )}
              </div>

              {/* 电影网格 */}
              {movies.length > 0 && (
                <div className="movie-grid mb-12">
                  {movies.map((movie, index) => (
                    <MovieCard key={movie.id || index} movie={movie} index={index} />
                  ))}
                </div>
              )}

              {/* 分页 */}
              {totalResults > 20 && (
                <div className="flex justify-center items-center space-x-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    ← 上一页
                  </button>
                  
                  <span className="text-white">
                    第 {currentPage} 页
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage * 20 >= totalResults}
                    className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    下一页 →
                  </button>
                </div>
              )}
            </>
          )}

          {/* 热门搜索推荐 */}
          {!hasSearched && (
            <div className="text-center">
              <div className="glass-card p-8 max-w-2xl mx-auto">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  🔥 热门搜索
                </h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {['动作', '喜剧', '爱情', '科幻', '悬疑', '恐怖', '动画', '纪录片'].map((genre) => (
                    <button
                      key={genre}
                      onClick={() => {
                        setQuery(genre);
                        setSearchParams({ q: genre });
                        performSearch(genre, 1);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm hover:shadow-lg transition-all duration-200"
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      `}</style>
    </div>
  );
};

export default Search;