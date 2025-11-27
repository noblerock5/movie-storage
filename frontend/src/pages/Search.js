import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Input, 
  Card, 
  Typography, 
  Button, 
  Spin, 
  Empty, 
  Pagination,
  Tag
} from 'antd';
import { SearchOutlined, PlayCircleOutlined, StarOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import api from '../services/api';

const { Title, Text } = Typography;
const { Search } = Input;

const SearchContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const MovieCard = styled(Card)`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  margin-bottom: 20px;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: #667eea;
  }
  
  .ant-card-body {
    background: white;
    color: #333;
  }
`;

const MoviePoster = styled.div`
  width: 120px;
  height: 180px;
  border-radius: 8px;
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
    font-size: 14px;
  }
`;

const MovieInfo = styled.div`
  flex: 1;
  padding-left: 20px;
  color: #333;
  
  .title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .meta {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.6);
    font-size: 14px;
  }
  
  .description {
    color: rgba(0, 0, 0, 0.5);
    line-height: 1.5;
    margin-bottom: 15px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .actions {
    display: flex;
    gap: 10px;
  }
`;

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    const initialQuery = searchParams.get('q');
    if (initialQuery) {
      setQuery(initialQuery);
      performSearch(initialQuery, 1);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery, page = 1) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await api.get('/api/v1/movies/search', {
        params: { q: searchQuery, page }
      });
      
      setSearchResults(response.data.movies || []);
      setTotalResults(response.data.total || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error('搜索失败:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    if (value.trim()) {
      setQuery(value);
      setSearchParams({ q: value });
      performSearch(value, 1);
    }
  };

  const handlePageChange = (page) => {
    performSearch(query, page);
  };

  const getStreamingUrl = (movie) => {
    if (movie.stream_url) return movie.stream_url;
    if (movie.file_path) return `http://localhost:8000/${movie.file_path}`;
    return null;
  };

  return (
    <div>
      <SearchContainer>
        <Title level={2} style={{ color: '#333', textAlign: 'center', marginBottom: '30px' }}>
          搜索电影
        </Title>
        
        <Search
          placeholder="输入电影名称、演员或导演..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onSearch={handleSearch}
          style={{ marginBottom: '40px' }}
        />
      </SearchContainer>

      <div style={{ padding: '0 20px 60px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
          </div>
        ) : searchResults.length > 0 ? (
          <>
            <div style={{ marginBottom: '20px', color: 'rgba(0, 0, 0, 0.6)' }}>
              找到 {totalResults} 个结果
            </div>
            
            {searchResults.map((movie, index) => (
              <MovieCard key={index}>
                <div style={{ display: 'flex' }}>
                  <MoviePoster>
                    {movie.poster_url ? (
                      <img alt={movie.title} src={movie.poster_url} />
                    ) : (
                      <div className="placeholder">暂无海报</div>
                    )}
                  </MoviePoster>
                  
                  <MovieInfo>
                    <div className="title">
                      {movie.title}
                      {movie.source && (
                        <Tag color="blue" style={{ fontSize: '12px' }}>
                          {movie.source === 'douban' ? '豆瓣' : 
                           movie.source === 'online_movie' ? '在线' : 'YouTube'}
                        </Tag>
                      )}
                    </div>
                    
                    <div className="meta">
                      {movie.year && <span>{movie.year}</span>}
                      {movie.genre && <span>{movie.genre}</span>}
                      {movie.duration && <span>{movie.duration}分钟</span>}
                      {movie.rating && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <StarOutlined style={{ color: '#faad14' }} />
                          {movie.rating}
                        </span>
                      )}
                    </div>
                    
                    {movie.description && (
                      <div className="description">
                        {movie.description}
                      </div>
                    )}
                    
                    <div className="actions">
                      {getStreamingUrl(movie) && (
                        <Button
                          type="primary"
                          icon={<PlayCircleOutlined />}
                          onClick={() => window.open(getStreamingUrl(movie), '_blank')}
                        >
                          在线播放
                        </Button>
                      )}
                      
                      <Button>
                        查看详情
                      </Button>
                    </div>
                  </MovieInfo>
                </div>
              </MovieCard>
            ))}
            
            {totalResults > 20 && (
              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <Pagination
                  current={currentPage}
                  total={totalResults}
                  pageSize={20}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  showQuickJumper
                  showTotal={(total, range) => 
                    `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
                  }
                />
              </div>
            )}
          </>
        ) : query ? (
          <Empty
            description="没有找到相关电影"
            style={{ color: 'rgba(0, 0, 0, 0.5)' }}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '50px', color: 'rgba(0, 0, 0, 0.5)' }}>
            <Title level={4} style={{ color: 'inherit' }}>
              开始搜索您喜欢的电影
            </Title>
            <Text style={{ color: 'inherit' }}>
              输入电影名称、演员或导演进行搜索
            </Text>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;